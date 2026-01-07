<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import TUIMenuBar from './TUIMenuBar.svelte';
	import TUIStatusBar from './TUIStatusBar.svelte';
	import { keyboardManager } from '$lib/services/keyboard-manager';
	import {
		focusedPanel as focusedPanelStore,
		mobileNavOpen as mobileNavOpenStore,
		setMobileNavOpen
	} from '$stores/keyboard';

	interface Props {
		title?: string;
		leftPanel?: Snippet;
		rightPanel?: Snippet;
		leftPanelWidth?: string;
		leftPanelTitle?: string;
		rightPanelTitle?: string;
	}

	let {
		title = 'Glider MCP',
		leftPanel,
		rightPanel,
		leftPanelWidth = '220px',
		leftPanelTitle = '',
		rightPanelTitle = ''
	}: Props = $props();

	const focusedPanel = $derived($focusedPanelStore);
	const mobileNavOpen = $derived($mobileNavOpenStore);

	// Initialize keyboard manager on mount
	onMount(() => {
		keyboardManager.init();
	});

	onDestroy(() => {
		keyboardManager.destroy();
	});
</script>

<div class="tui-layout">
	<TUIMenuBar {title} />

	<div class="tui-main" class:mobile-nav-open={mobileNavOpen}>
		<div
			class="tui-panel tui-panel-left"
			class:tui-panel-focused={focusedPanel === 'left'}
			style:width={leftPanelWidth}
			style:min-width={leftPanelWidth}
		>
			<div class="tui-panel-border tui-panel-border-top">
				<span class="box-tl">┌</span>
				<span class="box-h"></span>
				<span class="box-tr">┐</span>
			</div>
			<div class="tui-panel-content">
				{#if leftPanel}
					{@render leftPanel()}
				{/if}
			</div>
			<div class="tui-panel-border tui-panel-border-bottom">
				<span class="box-bl">└</span>
				<span class="box-h"></span>
				<span class="box-br">┘</span>
			</div>
		</div>

		<button
			class="tui-panel-overlay"
			class:visible={mobileNavOpen}
			aria-label="Close navigation"
			onclick={() => setMobileNavOpen(false)}
		></button>

		<div class="tui-panel-divider">
			<span class="box-v">│</span>
		</div>

		<div
			class="tui-panel tui-panel-right"
			class:tui-panel-focused={focusedPanel === 'right'}
		>
			<div class="tui-panel-border tui-panel-border-top">
				<span class="box-tl">┌</span>
				<span class="box-h"></span>
				<span class="box-tr">┐</span>
			</div>
			<div class="tui-panel-content">
				{#if rightPanel}
					{@render rightPanel()}
				{/if}
			</div>
			<div class="tui-panel-border tui-panel-border-bottom">
				<span class="box-bl">└</span>
				<span class="box-h"></span>
				<span class="box-br">┘</span>
			</div>
		</div>
	</div>

	<TUIStatusBar />
</div>

<style>
	.tui-layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		width: 100vw;
		background-color: var(--bg-primary);
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		overflow: hidden;
	}

	.tui-main {
		display: flex;
		flex: 1;
		overflow: hidden;
		padding: var(--spacing-xs);
		gap: 0;
		position: relative;
	}

	.tui-panel {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.tui-panel-left {
		flex-shrink: 0;
	}

	.tui-panel-right {
		flex: 1;
	}

	.tui-panel-border {
		display: flex;
		color: var(--border-dim);
		line-height: 1;
		user-select: none;
	}

	.tui-panel-focused .tui-panel-border {
		color: var(--border);
	}

	.tui-panel-border-top,
	.tui-panel-border-bottom {
		flex-shrink: 0;
	}

	.box-tl, .box-tr, .box-bl, .box-br {
		flex-shrink: 0;
	}

	.box-h {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.box-h::before {
		content: '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
		position: absolute;
		white-space: nowrap;
	}

	.tui-panel-content {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
		position: relative;
	}

	.tui-panel-content::before,
	.tui-panel-content::after {
		content: '│';
		position: absolute;
		top: 0;
		bottom: 0;
		color: var(--border-dim);
		line-height: 1;
		overflow: hidden;
		white-space: pre;
	}

	.tui-panel-focused .tui-panel-content::before,
	.tui-panel-focused .tui-panel-content::after {
		color: var(--border);
	}

	.tui-panel-content::before {
		left: 0;
		content: '│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│';
	}

	.tui-panel-content::after {
		right: 0;
		content: '│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│';
	}

	.tui-panel-divider {
		display: none; /* Hidden since panels have their own borders */
	}

	.box-v {
		display: flex;
		flex-direction: column;
		color: var(--border-dim);
	}

	.tui-panel-overlay {
		display: none;
	}

	@media (max-width: 768px) {
		.tui-main {
			padding: 0;
		}

		.tui-panel-left {
			position: absolute;
			top: var(--spacing-xs);
			bottom: var(--spacing-xs);
			left: var(--spacing-xs);
			width: min(80vw, 280px);
			transform: translateX(-120%);
			transition: transform 0.2s ease;
			z-index: 3;
			background-color: var(--bg-primary);
		}

		.tui-main.mobile-nav-open .tui-panel-left {
			transform: translateX(0);
		}

		.tui-panel-right {
			width: 100%;
		}

		.tui-panel-overlay {
			position: absolute;
			inset: 0;
			display: block;
			background: rgba(0, 0, 0, 0.45);
			border: none;
			cursor: pointer;
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition: opacity 0.2s ease;
			z-index: 2;
		}

		.tui-panel-overlay.visible {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}
	}
</style>
