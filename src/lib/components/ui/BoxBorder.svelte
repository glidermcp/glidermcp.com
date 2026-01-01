<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		focused?: boolean;
		variant?: 'single' | 'double';
		children?: Snippet;
	}

	let {
		title = '',
		focused = false,
		variant = 'single',
		children
	}: Props = $props();

	const chars = $derived(
		variant === 'double'
			? { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' }
			: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' }
	);

	const hLine = $derived(chars.h.repeat(200));
</script>

<div class="box-border-wrapper" class:focused class:double={variant === 'double'}>
	<!-- Top border -->
	<div class="box-row box-top">
		<span class="corner">{chars.tl}</span>
		{#if title}
			<span class="h-line short"></span>
			<span class="title">{title}</span>
		{/if}
		<span class="h-line flex"></span>
		<span class="corner">{chars.tr}</span>
	</div>

	<!-- Content with side borders -->
	<div class="box-middle">
		<span class="v-line">{chars.v}</span>
		<div class="box-content">
			{#if children}
				{@render children()}
			{/if}
		</div>
		<span class="v-line">{chars.v}</span>
	</div>

	<!-- Bottom border -->
	<div class="box-row box-bottom">
		<span class="corner">{chars.bl}</span>
		<span class="h-line flex"></span>
		<span class="corner">{chars.br}</span>
	</div>
</div>

<style>
	.box-border-wrapper {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		color: var(--border-dim);
		height: 100%;
		line-height: 1;
	}

	.box-border-wrapper.focused {
		color: var(--border);
	}

	.box-row {
		display: flex;
		flex-shrink: 0;
	}

	.corner {
		flex-shrink: 0;
	}

	.h-line {
		overflow: hidden;
		position: relative;
	}

	.h-line::before {
		content: '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
		position: absolute;
		white-space: nowrap;
	}

	.box-border-wrapper.double .h-line::before {
		content: '════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════';
	}

	.h-line.flex {
		flex: 1;
	}

	.h-line.short {
		width: 1ch;
	}

	.title {
		flex-shrink: 0;
		padding: 0 var(--spacing-xs);
		color: var(--text-primary);
	}

	.box-middle {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.v-line {
		flex-shrink: 0;
	}

	.box-content {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
		color: var(--text-primary);
	}
</style>
