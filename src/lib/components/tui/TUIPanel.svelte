<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		focused?: boolean;
		children?: Snippet;
	}

	let {
		title = '',
		focused = false,
		children
	}: Props = $props();
</script>

<div class="tui-panel-wrapper" class:focused>
	<!-- Top border with optional title -->
	<div class="panel-top">
		<span class="corner">┌</span>
		{#if title}
			<span class="border-line"></span>
			<span class="title">{title}</span>
		{/if}
		<span class="border-line flex-1"></span>
		<span class="corner">┐</span>
	</div>

	<!-- Content with side borders -->
	<div class="panel-middle">
		<span class="side-border">│</span>
		<div class="panel-content">
			{#if children}
				{@render children()}
			{/if}
		</div>
		<span class="side-border">│</span>
	</div>

	<!-- Bottom border -->
	<div class="panel-bottom">
		<span class="corner">└</span>
		<span class="border-line flex-1"></span>
		<span class="corner">┘</span>
	</div>
</div>

<style>
	.tui-panel-wrapper {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		color: var(--border-dim);
		height: 100%;
	}

	.tui-panel-wrapper.focused {
		color: var(--border);
	}

	.panel-top,
	.panel-bottom {
		display: flex;
		flex-shrink: 0;
		line-height: 1;
	}

	.corner {
		flex-shrink: 0;
	}

	.border-line {
		position: relative;
		overflow: hidden;
	}

	.border-line::before {
		content: '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
		position: absolute;
		white-space: nowrap;
	}

	.border-line.flex-1 {
		flex: 1;
	}

	.title {
		flex-shrink: 0;
		padding: 0 var(--spacing-sm);
		color: var(--text-primary);
	}

	.panel-middle {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.side-border {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		line-height: 1;
		overflow: hidden;
	}

	.side-border::before {
		content: '│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│\A│';
		white-space: pre;
	}

	.panel-content {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
		color: var(--text-primary);
	}
</style>
