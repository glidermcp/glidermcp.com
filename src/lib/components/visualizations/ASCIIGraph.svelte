<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import type { ReferenceNode, SymbolWithReferences } from '$lib/types/visualizations';

	interface Props {
		data: SymbolWithReferences;
		title?: string;
		interactive?: boolean;
		onReferenceSelect?: (ref: ReferenceNode, index: number) => void;
	}

	let { data, title = '', interactive = true, onReferenceSelect }: Props = $props();

	let selectedIndex = $state(0);

	// Keep selection in bounds
	$effect(() => {
		if (selectedIndex >= data.references.length) {
			selectedIndex = Math.max(0, data.references.length - 1);
		}
	});

	function getTypeIcon(type?: string): string {
		switch (type) {
			case 'class':
				return 'C';
			case 'interface':
				return 'I';
			case 'method':
				return 'M';
			case 'property':
				return 'P';
			case 'variable':
				return 'V';
			case 'namespace':
				return 'N';
			default:
				return '?';
		}
	}

	function getRefTypeIcon(type?: string): string {
		switch (type) {
			case 'definition':
				return 'def';
			case 'implementation':
				return 'impl';
			case 'call':
				return 'call';
			case 'assignment':
				return 'set';
			case 'usage':
			default:
				return 'ref';
		}
	}

	function formatLocation(ref: ReferenceNode): string {
		let loc = ref.location;
		if (ref.line !== undefined) {
			loc += `:${ref.line}`;
			if (ref.column !== undefined) {
				loc += `:${ref.column}`;
			}
		}
		return loc;
	}

	function handleKeyboard(action: KeyboardAction): boolean {
		if (!interactive || data.references.length === 0) return false;

		switch (action) {
			case 'up':
				if (selectedIndex > 0) {
					selectedIndex--;
					scrollToSelected();
				}
				return true;

			case 'down':
				if (selectedIndex < data.references.length - 1) {
					selectedIndex++;
					scrollToSelected();
				}
				return true;

			case 'select': {
				const ref = data.references[selectedIndex];
				if (ref) {
					onReferenceSelect?.(ref, selectedIndex);
				}
				return true;
			}

			case 'home':
				selectedIndex = 0;
				scrollToSelected();
				return true;

			case 'end':
				selectedIndex = data.references.length - 1;
				scrollToSelected();
				return true;

			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		requestAnimationFrame(() => {
			const container = document.querySelector('.ascii-graph');
			const selectedEl = container?.querySelector('.ref-node.selected');
			if (container && selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}

	function handleRefClick(index: number): void {
		if (!interactive) return;
		selectedIndex = index;
		const ref = data.references[index];
		if (ref) {
			onReferenceSelect?.(ref, index);
		}
	}

	// Register keyboard handler
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		if (interactive) {
			unsubscribe = keyboardManager.addHandler(handleKeyboard);
		}
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="ascii-graph-container">
	{#if title}
		<div class="graph-title">{title}</div>
	{/if}
	<div class="ascii-graph" role="list" aria-label={title || 'Symbol references'}>
		<!-- Symbol header -->
		<div class="symbol-header">
			<span class="type-icon">[{getTypeIcon(data.type)}]</span>
			<span class="symbol-name">{data.name}</span>
			<span class="ref-count">({data.references.length} reference{data.references.length !== 1 ? 's' : ''})</span>
		</div>

		<!-- References list -->
		{#if data.references.length > 0}
			<div class="references-list" role="listbox">
				{#each data.references as ref, index}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<div
						class="ref-node"
						class:selected={interactive && index === selectedIndex}
						role="option"
						aria-selected={interactive && index === selectedIndex}
						tabindex={interactive && index === selectedIndex ? 0 : -1}
						onclick={() => handleRefClick(index)}
					>
						<span class="connector">└──</span>
						<span class="ref-type">[{getRefTypeIcon(ref.type)}]</span>
						<span class="ref-location">{formatLocation(ref)}</span>
						{#if ref.snippet}
							<span class="ref-snippet">// {ref.snippet}</span>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				<span class="connector">└──</span>
				<span class="empty-text">(no references found)</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.ascii-graph-container {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		height: 100%;
	}

	.graph-title {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.ascii-graph {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
	}

	.symbol-header {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) 0;
		font-size: var(--font-size-base);
	}

	.type-icon {
		margin-right: var(--spacing-xs);
		font-size: var(--font-size-xs);
		color: var(--accent);
	}

	.symbol-name {
		color: var(--text-primary);
		font-weight: 500;
	}

	.ref-count {
		margin-left: var(--spacing-sm);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.references-list {
		margin-left: var(--spacing-sm);
	}

	.ref-node {
		display: flex;
		align-items: center;
		padding: 2px 0;
		line-height: 1.4;
		white-space: nowrap;
		cursor: pointer;
	}

	.ref-node:hover {
		background-color: var(--focus-bg);
	}

	.ref-node.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.connector {
		color: var(--text-muted);
		flex-shrink: 0;
		margin-right: var(--spacing-xs);
	}

	.ref-node.selected .connector {
		color: var(--selection-fg);
		opacity: 0.7;
	}

	.ref-type {
		margin-right: var(--spacing-xs);
		font-size: var(--font-size-xs);
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.ref-type::before {
		content: '';
	}

	.ref-node.selected .ref-type {
		color: var(--selection-fg);
	}

	.ref-location {
		color: var(--accent);
		flex-shrink: 0;
	}

	.ref-node.selected .ref-location {
		color: var(--selection-fg);
	}

	.ref-snippet {
		margin-left: var(--spacing-sm);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ref-node.selected .ref-snippet {
		color: var(--selection-fg);
		opacity: 0.8;
	}

	.empty-state {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) 0;
		margin-left: var(--spacing-sm);
	}

	.empty-text {
		color: var(--text-muted);
		font-style: italic;
	}
</style>
