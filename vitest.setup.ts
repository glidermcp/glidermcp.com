import { vi } from 'vitest';

// Mock localStorage for nanostores/persistent
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock
});

// Mock fetch for MCP client tests
globalThis.fetch = vi.fn();

// Mock performance.now for duration tests
if (!globalThis.performance) {
	globalThis.performance = {
		now: vi.fn(() => Date.now())
	} as unknown as Performance;
}
