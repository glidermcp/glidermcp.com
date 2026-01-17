<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import type { Component, Snippet } from 'svelte';
	import TUILayout from '$components/tui/TUILayout.svelte';
	import TUINavigationTree from '$components/tui/TUINavigationTree.svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import {
		focusedPanel,
		setFocusedPanel
	} from '$stores/keyboard';
	import { getContent, type Locale } from '$lib/content';
	import { gameVisible, showGame } from '$stores/game';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	// Track focused panel from store
	const currentFocusedPanel = $derived($focusedPanel);
	const navPath = $derived.by(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/playground/')) return '/playground';
		return path;
	});

	let locale = $state<Locale>('en');
	const content = $derived(getContent(locale));

	let GameComponent = $state<Component | null>(null);
	let gameLoadPromise: Promise<void> | null = null;

	function ensureGameLoaded(): void {
		if (GameComponent || gameLoadPromise) return;

		gameLoadPromise = import('$components/game/FlappyBird.svelte').then((mod) => {
			GameComponent = mod.default;
		});
	}

	$effect(() => {
		// If something else toggles the game on (status bar, etc.), load the chunk on demand.
		if ($gameVisible) {
			ensureGameLoaded();
		}
	});

	// Handle content panel keyboard navigation
	function handleContentKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		// Handle game action globally
		if (action === 'game') {
			showGame();
			return true;
		}

		if ($focusedPanel !== 'right') return false;

		switch (action) {
			case 'back':
				setFocusedPanel('left');
				return true;
			default:
				return false;
		}
	}

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleContentKeyboard);
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<svelte:head>
	<title>{content.meta.title}</title>
	<meta name="description" content={content.meta.description} />
</svelte:head>

<TUILayout title="Glider MCP" leftPanelWidth="max-content">
	{#snippet leftPanel()}
		<TUINavigationTree items={content.navItems} currentPath={navPath} />
	{/snippet}

	{#snippet rightPanel()}
		<div class="content-area" class:focused={currentFocusedPanel === 'right'}>
			{@render children()}
		</div>
	{/snippet}
</TUILayout>

{#if $gameVisible && GameComponent}
	<GameComponent />
{/if}

<style>
	.content-area {
		padding: var(--spacing-md);
		padding-left: var(--spacing-lg);
		height: 100%;
		overflow: auto;
	}

	.content-area.focused {
		outline: 1px solid var(--border);
		outline-offset: -1px;
	}

	/* Generic typography styles */
	.content-area :global(h2) {
		color: var(--text-primary);
		font-size: var(--font-size-lg);
		font-weight: 700;
		margin: 0 0 var(--spacing-md) 0;
		border-bottom: 1px solid var(--border-dim);
		padding-bottom: var(--spacing-sm);
	}

	.content-area :global(h3) {
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		font-weight: 600;
		margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
	}

	.content-area :global(p) {
		color: var(--text-secondary);
		margin: 0 0 var(--spacing-md) 0;
		line-height: 1.6;
	}

	.content-area :global(.muted) {
		color: var(--text-muted);
	}

	.content-area :global(.hint) {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.content-area :global(.feature-list) {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--spacing-lg) 0;
		color: var(--text-secondary);
	}

	.content-area :global(.feature-list li) {
		padding: var(--spacing-xs) 0;
	}

	.content-area :global(.feature-list li::before) {
		content: '- ';
		color: var(--text-muted);
	}

	.content-area :global(.link) {
		color: var(--accent);
		text-decoration: none;
	}

	.content-area :global(.link:hover) {
		text-decoration: underline;
	}

	/* Default link styling for content (including {@html} content) */
	.content-area :global(a) {
		color: var(--accent);
		text-decoration: none;
	}

	.content-area :global(a:hover) {
		text-decoration: underline;
	}

	.content-area :global(a:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
