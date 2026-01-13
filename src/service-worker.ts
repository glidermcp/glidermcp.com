/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

// Keep immutable build assets across deployments (hashed filenames).
const IMMUTABLE_CACHE = 'glider-immutable-v1';

// Keep HTML / runtime responses versioned so updates replace old pages quickly.
const RUNTIME_CACHE = `glider-runtime-${version}`;

// "files" are static assets from /static.
const STATIC_FILES = new Set(files);

// Precache only lightweight, high-value assets to avoid triggering a large download
// waterfall during the first page load.
const PRECACHE: string[] = [
	'/',
	...files.filter((p) => p === '/manifest.json' || p === '/robots.txt' || p === '/sitemap.xml')
];

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

function isImmutableBuildAsset(pathname: string): boolean {
	// SvelteKit's hashed build assets live under /_app/immutable/.
	return pathname.startsWith('/_app/immutable/');
}

// Install event - cache all static assets
self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		caches
			.open(RUNTIME_CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => {
				// Only delete old runtime caches; keep IMMUTABLE_CACHE around.
				return Promise.all(
					keys
						.filter((key) => key.startsWith('glider-runtime-') && key !== RUNTIME_CACHE)
						.map((key) => caches.delete(key))
				);
			})
			.then(() => self.clients.claim())
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

	// Don't intercept the SW script itself; let the browser handle update checks.
	if (url.origin === self.location.origin && url.pathname === '/service-worker.js') {
		return;
	}

	// Don't cache SvelteKit's version file (it drives update checks/invalidation).
	if (url.origin === self.location.origin && url.pathname === '/_app/version.json') {
		return;
	}

	// For same-origin requests
	if (url.origin === self.location.origin) {
		// Immutable build assets - cache-first, stored in long-lived cache
		if (isImmutableBuildAsset(url.pathname)) {
			event.respondWith(cacheFirst(request, IMMUTABLE_CACHE));
			return;
		}

		// Static /static files - cache-first
		if (STATIC_FILES.has(url.pathname)) {
			event.respondWith(cacheFirst(request, RUNTIME_CACHE));
			return;
		}

		// HTML pages/routes - network-first strategy with cache fallback
		if (request.headers.get('accept')?.includes('text/html')) {
			event.respondWith(networkFirst(request, RUNTIME_CACHE));
			return;
		}
	}

	// Everything else - network-first (no caching by default)
	event.respondWith(fetch(request));
});

// Cache-first strategy: Try cache, fall back to network
async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
	const cachedResponse = await caches.match(request, { cacheName });

	if (cachedResponse) {
		return cachedResponse;
	}

	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch {
		// Return offline fallback if available
		return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
	}
}

// Network-first strategy: Try network, fall back to cache
async function networkFirst(request: Request, cacheName: string): Promise<Response> {
	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch {
		// Try to return cached response
		const cachedResponse = await caches.match(request, { cacheName });

		if (cachedResponse) {
			return cachedResponse;
		}

		// Return offline fallback for HTML requests
		if (request.headers.get('accept')?.includes('text/html')) {
			const offlineResponse = await caches.match('/', { cacheName });
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
