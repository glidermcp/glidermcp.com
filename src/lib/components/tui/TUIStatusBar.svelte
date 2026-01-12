<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { toggleTheme } from '$stores/theme';
	import { focusedPanel, togglePanel } from '$stores/keyboard';
	import { showGame } from '$stores/game';
	import { statusBarKeys } from '$stores/statusbar';
	import type { StatusKey } from '$types/statusbar';

	interface Props {
		keys?: StatusKey[];
		onAction?: (action: KeyboardAction) => void;
	}

	const defaultKeys: StatusKey[] = [
		{ key: 'F9', label: 'Theme', action: 'theme' },
		{ key: 'Tab', label: 'Panel', action: 'tab' },
		{ key: '^G', label: 'Game', action: 'game' }
	];

	let { keys: keysProp, onAction }: Props = $props();

	const effectiveKeys = $derived(keysProp ?? $statusBarKeys ?? defaultKeys);
	const isLeftPanelFocused = $derived($focusedPanel === 'left');

	// Built-in handlers for common actions
	function handleAction(action: KeyboardAction): boolean {
		switch (action) {
			case 'theme':
				toggleTheme();
				return true;
			case 'tab':
				// Tab is used as an in-panel key on some pages (e.g. OS tabs in install guides).
				// Keep panel switching on Tab when left panel is focused.
				if (isLeftPanelFocused) {
					togglePanel();
					return true;
				}
				return false;
			case 'game':
				showGame();
				return true;
			default:
				// Delegate to parent handler
				onAction?.(action);
				return false;
		}
	}

	// Handle keyboard events
	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		// Check if this action is in our keys list
		const keyItem = effectiveKeys.find(k => k.action === action);
		if (keyItem) {
			if (keyItem.handler) {
				keyItem.handler();
				return true;
			}
			return handleAction(action);
		}
		return false;
	}

	// Handle click on status key button
	function handleClick(keyItem: StatusKey): void {
		if (keyItem.handler) {
			keyItem.handler();
		} else {
			handleAction(keyItem.action);
		}
	}

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleKeyboard);
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<footer class="tui-statusbar">
	<div class="statusbar-content">
		{#each effectiveKeys as item}
			<button
				class="status-key"
				onclick={() => handleClick(item)}
				title="{item.key} - {item.label}"
			>
				<span class="key">{item.key}</span>
				<span class="label">{item.label}</span>
			</button>
		{/each}
	</div>
</footer>

<style>
	.tui-statusbar {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-md);
		background-color: var(--status-bg);
		border-top: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		flex-shrink: 0;
		user-select: none;
	}

	.statusbar-content {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.status-key {
		display: flex;
		align-items: center;
		gap: 0;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.status-key:hover .key {
		background-color: var(--accent);
	}

	.status-key:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.key {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-weight: 500;
	}

	.label {
		color: var(--status-fg);
		padding: var(--spacing-xs) var(--spacing-sm);
	}

	@media (max-width: 768px) {
		.tui-statusbar {
			display: none;
		}
	}
</style>
