/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `glider-cache-${version}`;

// Assets to cache (build outputs and static files)
const ASSETS = [...build, ...files];

// MCP server URL patterns to skip caching
const MCP_PATTERNS = [
	/localhost:\d+/,
	/127\.0\.0\.1:\d+/,
	/mcp/i,
];

// Check if a request should skip the cache (MCP requests)
function shouldSkipCache(url: string): boolean {
	return MCP_PATTERNS.some(pattern => pattern.test(url));
}

// Install event - cache all static assets
self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(ASSETS);
		}).then(() => {
			// Activate immediately
			return self.skipWaiting();
		})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(
				keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
			);
		}).then(() => {
			// Take control of all pages immediately
			return self.clients.claim();
		})
	);
});

// Fetch event - handle requests
self.addEventListener('fetch', (event: FetchEvent) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip MCP/API requests - always go to network
	if (shouldSkipCache(request.url)) {
		return;
	}

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip chrome extension requests and other non-http(s)
	if (!url.protocol.startsWith('http')) {
		return;
	}

	// For same-origin requests
	if (url.origin === self.location.origin) {
		// Static assets (build, files) - cache-first strategy
		if (ASSETS.includes(url.pathname)) {
			event.respondWith(cacheFirst(request));
			return;
		}

		// HTML pages/routes - network-first strategy with cache fallback
		if (request.headers.get('accept')?.includes('text/html')) {
			event.respondWith(networkFirst(request));
			return;
		}
	}

	// Everything else - network-first
	event.respondWith(networkFirst(request));
});

// Cache-first strategy: Try cache, fall back to network
async function cacheFirst(request: Request): Promise<Response> {
	const cachedResponse = await caches.match(request);

	if (cachedResponse) {
		return cachedResponse;
	}

	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch {
		// Return offline fallback if available
		return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
	}
}

// Network-first strategy: Try network, fall back to cache
async function networkFirst(request: Request): Promise<Response> {
	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch {
		// Try to return cached response
		const cachedResponse = await caches.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		// Return offline fallback for HTML requests
		if (request.headers.get('accept')?.includes('text/html')) {
			const offlineResponse = await caches.match('/');
			if (offlineResponse) {
				return offlineResponse;
			}
		}

		return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
	}
}

// Handle messages from the client
self.addEventListener('message', (event: ExtendableMessageEvent) => {
	if (event.data?.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
