<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from '$lib/utils/tool-metadata';
	import { selectedToolId, selectTool } from '$stores/playground';
	import { focusedPanel } from '$stores/keyboard';

	interface Props {
		onSelect?: (toolId: string) => void;
	}

	let { onSelect }: Props = $props();

	// Group tools by category
	const toolsByCategory = $derived.by(() => {
		const grouped: Record<ToolCategory, typeof TOOLS> = {
			diagnostics: [],
			solution: [],
			search: [],
			analysis: [],
			architecture: [],
			refactoring: [],
			external: []
		};

		for (const tool of TOOLS) {
			grouped[tool.category].push(tool);
		}

		return grouped;
	});

	// Flatten for keyboard navigation
	const flatTools = $derived.by(() => {
		const result: { toolId: string; categoryIndex: number }[] = [];
		const categories: ToolCategory[] = [
			'diagnostics',
			'solution',
			'search',
			'analysis',
			'architecture',
			'refactoring',
			'external'
		];

		for (let ci = 0; ci < categories.length; ci++) {
			for (const tool of toolsByCategory[categories[ci]]) {
				result.push({ toolId: tool.id, categoryIndex: ci });
			}
		}

		return result;
	});

	const currentToolId = $derived($selectedToolId);
	const currentIndex = $derived(flatTools.findIndex((t) => t.toolId === currentToolId));
	const isActive = $derived($focusedPanel === 'right');

	function handleSelect(toolId: string): void {
		selectTool(toolId);
		onSelect?.(toolId);
	}

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		// Only handle when focused on tool selector
		if (!isActive) return false;

		switch (action) {
			case 'up': {
				const newIndex = Math.max(0, currentIndex - 1);
				if (newIndex !== currentIndex && flatTools[newIndex]) {
					selectTool(flatTools[newIndex].toolId);
					scrollToSelected();
				}
				return true;
			}
			case 'down': {
				const newIndex = Math.min(flatTools.length - 1, currentIndex + 1);
				if (newIndex !== currentIndex && flatTools[newIndex]) {
					selectTool(flatTools[newIndex].toolId);
					scrollToSelected();
				}
				return true;
			}
			case 'select': {
				if (flatTools[currentIndex]) {
					handleSelect(flatTools[currentIndex].toolId);
				}
				return true;
			}
			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		requestAnimationFrame(() => {
			const selected = document.querySelector('.tool-item.selected');
			selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		});
	}

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleKeyboard);
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="tool-selector" class:active={isActive}>
	{#each Object.entries(TOOL_CATEGORIES) as [category, meta]}
		{@const tools = toolsByCategory[category as ToolCategory]}
		{#if tools.length > 0}
			<div class="category">
				<div class="category-header">{meta.label}</div>
				<div class="category-tools">
					{#each tools as tool}
						<button
							type="button"
							class="tool-item"
							class:selected={tool.id === currentToolId}
							onclick={() => handleSelect(tool.id)}
						>
							<span class="tool-name">{tool.name}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.tool-selector {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-xs);
		overflow-y: auto;
		flex: 1;
		min-height: 0;
	}

	.category {
		display: flex;
		flex-direction: column;
	}

	.category-header {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
	}

	.category-tools {
		display: flex;
		flex-direction: column;
	}

	.tool-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: var(--spacing-xs) var(--spacing-sm);
		padding-left: var(--spacing-md);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tool-item:hover {
		background-color: var(--focus-bg);
		color: var(--text-primary);
	}

	.tool-item.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.tool-selector.active .tool-item.selected {
		background-color: var(--selection-bg);
	}

	.tool-selector:not(.active) .tool-item.selected {
		background-color: var(--selection-bg-dim);
		color: var(--text-primary);
	}

	.tool-item:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: -1px;
	}

	.tool-name {
		font-family: var(--font-mono);
	}
</style>
