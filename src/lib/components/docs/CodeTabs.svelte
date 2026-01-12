<script lang="ts">
	import CodeBlock from './CodeBlock.svelte';

	interface CodeVariant {
		id?: string;
		label: string;
		code: string;
		language?: string;
	}

	interface Props {
		variants: CodeVariant[];
		activeIndex: number;
		onChange: (nextIndex: number) => void;
		active?: boolean;
	}

	let { variants, activeIndex, onChange, active = false }: Props = $props();

	const current = $derived(variants[activeIndex] ?? variants[0]);

	function select(index: number): void {
		if (index === activeIndex) return;
		onChange(index);
	}
</script>

<div class="code-tabs" class:active>
	<div class="tab-bar" role="tablist" aria-label="OS tabs">
		{#each variants as variant, i}
			<button
				type="button"
				class="tab"
				class:selected={i === activeIndex}
				role="tab"
				aria-selected={i === activeIndex}
				tabindex={i === activeIndex ? 0 : -1}
				onclick={() => select(i)}
			>
				{variant.label}
			</button>
		{/each}
	</div>

	{#if current}
		<CodeBlock code={current.code} language={current.language ?? 'bash'} />
	{/if}
</div>

<style>
	.code-tabs {
		border: 1px solid var(--border-dim);
		background-color: var(--bg-secondary);
		margin: var(--spacing-sm) 0 var(--spacing-md) 0;
	}

	.code-tabs.active {
		border-color: var(--accent);
	}

	.tab-bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs);
		background-color: var(--bg-primary);
		border-bottom: 1px solid var(--border-dim);
	}

	.tab {
		background: transparent;
		border: 1px solid var(--border-dim);
		color: var(--text-muted);
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		cursor: pointer;
	}

	.tab:hover {
		border-color: var(--accent);
		color: var(--text-primary);
	}

	.tab.selected {
		border-color: var(--accent);
		color: var(--text-primary);
		background-color: var(--selection-bg-dim);
	}

	.tab:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Avoid double borders between tab container and CodeBlock */
	.code-tabs :global(.code-block-wrapper) {
		border: none;
		margin: 0;
	}
</style>

