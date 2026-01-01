<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		selected?: boolean;
		disabled?: boolean;
		indent?: number;
		prefix?: string;
		onclick?: () => void;
		onkeydown?: (e: KeyboardEvent) => void;
		children?: Snippet;
	}

	let {
		selected = false,
		disabled = false,
		indent = 0,
		prefix = '',
		onclick,
		onkeydown,
		children
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
		onkeydown?.(e);
	}
</script>

<div
	class="list-item"
	class:selected
	class:disabled
	role="option"
	aria-selected={selected}
	aria-disabled={disabled}
	tabindex={disabled ? -1 : 0}
	onclick={() => !disabled && onclick?.()}
	onkeydown={handleKeydown}
	style:padding-left="{indent * 16 + 8}px"
>
	{#if prefix}
		<span class="prefix">{prefix}</span>
	{/if}
	<span class="content">
		{#if children}
			{@render children()}
		{/if}
	</span>
</div>

<style>
	.list-item {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		color: var(--text-primary);
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.list-item:hover:not(.disabled) {
		background-color: var(--focus-bg);
	}

	.list-item.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.list-item.disabled {
		color: var(--text-muted);
		cursor: not-allowed;
	}

	.list-item:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: -1px;
	}

	.prefix {
		flex-shrink: 0;
		margin-right: var(--spacing-sm);
		color: var(--text-secondary);
	}

	.list-item.selected .prefix {
		color: var(--selection-fg);
	}

	.content {
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
