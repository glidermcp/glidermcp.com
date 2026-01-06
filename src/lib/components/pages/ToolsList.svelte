<script lang="ts">
	import { ToolCard } from '$components/docs';
	import { TOOL_CATEGORIES, getToolsByCategory, type ToolCategory } from '$lib/utils/tool-metadata';
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
	{@const tools = getToolsByCategory(category as ToolCategory)}
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
