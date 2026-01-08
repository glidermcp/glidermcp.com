<script lang="ts">
	import { ToolCard } from '$components/docs';
	import { TOOL_CATEGORIES, getDocsToolsByCategory, type ToolCategory } from '$lib/utils/tool-metadata';
	import type { ToolsListContent } from '$lib/content/types';

	interface Props {
		content: ToolsListContent;
		expandedTools: Set<string>;
		onToggle: (toolId: string) => void;
	}

	let { content, expandedTools, onToggle }: Props = $props();
</script>

<h2>{content.title}</h2>
<p>{content.intro}</p>

{#each Object.entries(TOOL_CATEGORIES) as [category, info]}
	{@const tools = getDocsToolsByCategory(category as ToolCategory)}
	{#if tools.length > 0}
		<div class="tool-category">
			<h3>{info.label}</h3>
			<p class="category-desc">{info.description}</p>
			{#each tools as tool}
				<ToolCard
					{tool}
					expanded={expandedTools.has(tool.id)}
					onToggle={() => onToggle(tool.id)}
				/>
			{/each}
		</div>
	{/if}
{/each}

<style>
	.tool-category {
		margin-bottom: var(--spacing-xl);
	}

	.tool-category :global(h3) {
		color: var(--accent);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: var(--spacing-xs);
	}

	.category-desc {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-md);
	}
</style>
