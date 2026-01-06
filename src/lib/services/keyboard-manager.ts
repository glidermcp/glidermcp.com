/**
 * Keyboard Manager Service
 * Handles Commander-style keyboard navigation: F-keys, arrow keys, Tab, Enter, ESC
 */

export type KeyboardAction =
	| 'help'           // F1
	| 'menu'           // F2
	| 'view'           // F3
	| 'execute'        // F5
	| 'theme'          // F9
	| 'quit'           // F10
	| 'game'           // Ctrl+G
	| 'up'             // Arrow Up
	| 'down'           // Arrow Down
	| 'left'           // Arrow Left
	| 'right'          // Arrow Right
	| 'select'         // Enter
	| 'toggle'         // Space (toggle expand/collapse)
	| 'back'           // ESC
	| 'tab'            // Tab (switch panels)
	| 'pageUp'         // Page Up
	| 'pageDown'       // Page Down
	| 'home'           // Home
	| 'end';           // End

export type KeyboardHandler = (action: KeyboardAction, event: KeyboardEvent) => boolean | void;

interface KeyBinding {
	key: string;
	action: KeyboardAction;
	ctrl?: boolean;
	alt?: boolean;
	shift?: boolean;
}

const KEY_BINDINGS: KeyBinding[] = [
	// Function keys
	{ key: 'F1', action: 'help' },
	{ key: 'F2', action: 'menu' },
	{ key: 'F3', action: 'view' },
	{ key: 'F5', action: 'execute' },
	{ key: 'F9', action: 'theme' },
	{ key: 'F10', action: 'quit' },
	{ key: 'g', action: 'game', ctrl: true },

	// Navigation keys
	{ key: 'ArrowUp', action: 'up' },
	{ key: 'ArrowDown', action: 'down' },
	{ key: 'ArrowLeft', action: 'left' },
	{ key: 'ArrowRight', action: 'right' },
	{ key: 'Enter', action: 'select' },
	{ key: ' ', action: 'toggle' },
	{ key: 'Escape', action: 'back' },
	{ key: 'Tab', action: 'tab' },
	{ key: 'PageUp', action: 'pageUp' },
	{ key: 'PageDown', action: 'pageDown' },
	{ key: 'Home', action: 'home' },
	{ key: 'End', action: 'end' },
];

class KeyboardManager {
	private handlers: Set<KeyboardHandler> = new Set();
	private enabled: boolean = true;
	private boundHandleKeydown: (e: KeyboardEvent) => void;

	constructor() {
		this.boundHandleKeydown = this.handleKeydown.bind(this);
	}

	/**
	 * Initialize keyboard manager - attach to window
	 */
	init(): void {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', this.boundHandleKeydown);
		}
	}

	/**
	 * Cleanup - remove event listener
	 */
	destroy(): void {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', this.boundHandleKeydown);
		}
	}

	/**
	 * Enable/disable keyboard handling
	 */
	setEnabled(enabled: boolean): void {
		this.enabled = enabled;
	}

	/**
	 * Register a keyboard handler
	 * Handlers are called in order until one returns true (handled)
	 */
	addHandler(handler: KeyboardHandler): () => void {
		this.handlers.add(handler);
		return () => this.handlers.delete(handler);
	}

	/**
	 * Remove a handler
	 */
	removeHandler(handler: KeyboardHandler): void {
		this.handlers.delete(handler);
	}

	/**
	 * Handle keydown events
	 */
	private handleKeydown(event: KeyboardEvent): void {
		if (!this.enabled) return;

		// Don't intercept when typing in inputs
		const target = event.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
			// Still allow ESC and F-keys in inputs
			if (!event.key.startsWith('F') && event.key !== 'Escape') {
				return;
			}
		}

		const action = this.matchKeyBinding(event);
		if (!action) return;

		// Call handlers until one returns true (handled)
		for (const handler of this.handlers) {
			const handled = handler(action, event);
			if (handled) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
		}
	}

	/**
	 * Match an event to a key binding
	 */
	private matchKeyBinding(event: KeyboardEvent): KeyboardAction | null {
		for (const binding of KEY_BINDINGS) {
			if (binding.key !== event.key) continue;
			if (binding.ctrl && !event.ctrlKey) continue;
			if (binding.alt && !event.altKey) continue;
			if (binding.shift && !event.shiftKey) continue;
			return binding.action;
		}
		return null;
	}

	/**
	 * Get display string for an action (for UI hints)
	 */
	getKeyDisplay(action: KeyboardAction): string {
		const binding = KEY_BINDINGS.find(b => b.action === action);
		if (!binding) return '';

		const parts: string[] = [];
		if (binding.ctrl) parts.push('Ctrl');
		if (binding.alt) parts.push('Alt');
		if (binding.shift) parts.push('Shift');
		parts.push(binding.key);

		return parts.join('+');
	}
}

// Singleton instance
export const keyboardManager = new KeyboardManager();

/**
 * Svelte action for keyboard handling
 * Usage: <div use:keyboard={handler}>
 */
export function keyboard(node: HTMLElement, handler: KeyboardHandler): { destroy: () => void } {
	const unsubscribe = keyboardManager.addHandler(handler);
	return {
		destroy() {
			unsubscribe();
		}
	};
}
