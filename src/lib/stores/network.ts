/**
 * Network Status Store
 * Tracks online/offline status and PWA installation state
 */

import { atom, computed } from 'nanostores';

// Online status
export const isOnline = atom<boolean>(true);

// PWA installation
export const canInstall = atom<boolean>(false);
export const isInstalled = atom<boolean>(false);

// Service worker state
export const swRegistered = atom<boolean>(false);
export const swUpdateAvailable = atom<boolean>(false);

// Toast notifications for network status
export interface Toast {
	id: string;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error';
	duration?: number;
}

export const toasts = atom<Toast[]>([]);

// Derived stores
export const isOffline = computed(isOnline, (online: boolean) => !online);

let toastId = 0;

/**
 * Show a toast notification
 */
export function showToast(message: string, type: Toast['type'] = 'info', duration = 3000): void {
	const id = `toast-${++toastId}`;
	const toast: Toast = { id, message, type, duration };

	toasts.set([...toasts.get(), toast]);

	if (duration > 0) {
		setTimeout(() => {
			dismissToast(id);
		}, duration);
	}
}

/**
 * Dismiss a toast
 */
export function dismissToast(id: string): void {
	toasts.set(toasts.get().filter((t: Toast) => t.id !== id));
}

/**
 * Initialize network status listeners
 */
export function initNetworkStatus(): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	// Set initial status
	isOnline.set(navigator.onLine);

	// Check if already installed as PWA
	if (window.matchMedia('(display-mode: standalone)').matches) {
		isInstalled.set(true);
	}

	// Online event
	const handleOnline = () => {
		isOnline.set(true);
		showToast('Back online', 'success');
	};

	// Offline event
	const handleOffline = () => {
		isOnline.set(false);
		showToast('You are offline. Some features may be unavailable.', 'warning', 5000);
	};

	// Add listeners
	window.addEventListener('online', handleOnline);
	window.addEventListener('offline', handleOffline);

	// Cleanup
	return () => {
		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
	};
}

// Store for beforeinstallprompt event
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Initialize PWA install prompt listener
 */
export function initInstallPrompt(): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const handleBeforeInstallPrompt = (e: Event) => {
		// Prevent Chrome 76+ from showing mini-infobar
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		canInstall.set(true);
	};

	const handleAppInstalled = () => {
		deferredPrompt = null;
		canInstall.set(false);
		isInstalled.set(true);
		showToast('Glider MCP installed!', 'success');
	};

	window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
	window.addEventListener('appinstalled', handleAppInstalled);

	return () => {
		window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.removeEventListener('appinstalled', handleAppInstalled);
	};
}

/**
 * Trigger the PWA install prompt
 */
export async function promptInstall(): Promise<boolean> {
	if (!deferredPrompt) {
		return false;
	}

	await deferredPrompt.prompt();
	const { outcome } = await deferredPrompt.userChoice;

	if (outcome === 'accepted') {
		deferredPrompt = null;
		canInstall.set(false);
		return true;
	}

	return false;
}

/**
 * Register service worker and handle updates
 */
export function initServiceWorker(): () => void {
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
		return () => {};
	}

	// SvelteKit handles service worker registration automatically
	// Just listen for updates
	navigator.serviceWorker.ready.then(() => {
		swRegistered.set(true);
	});

	const handleControllerChange = () => {
		// New service worker activated
		swUpdateAvailable.set(false);
	};

	navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

	return () => {
		navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
	};
}

/**
 * Skip waiting and activate new service worker
 */
export function updateServiceWorker(): void {
	if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
		navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
	}
}
