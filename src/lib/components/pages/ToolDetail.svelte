<script lang="ts">
	import { CodeBlock } from '$components/docs';
	import { TOOLS } from '$lib/utils/tool-metadata';
	import type { ToolDetailContent } from '$lib/content/types';

	interface Props {
		selectedId: string;
		content: ToolDetailContent;
	}

	let { selectedId, content }: Props = $props();

	function getToolFromNavId(navId: string) {
		const toolId = navId.replace('tool-', '').replace(/-/g, '_');
		return TOOLS.find(t => t.id === toolId);
	}

	const tool = $derived.by(() => getToolFromNavId(selectedId));
</script>

{#if tool}
	<h2>{tool.name}</h2>
	<p class="tool-category-badge">[{tool.category}]</p>
	<p>{tool.description}</p>

	{#if tool.parameters.length > 0}
		<h3>{content.parametersTitle}</h3>
		<table class="params-table">
			<thead>
				<tr>
					<th>{content.tableHeaders.name}</th>
					<th>{content.tableHeaders.type}</th>
					<th>{content.tableHeaders.required}</th>
					<th>{content.tableHeaders.description}</th>
				</tr>
			</thead>
			<tbody>
				{#each tool.parameters as param}
					<tr>
						<td class="param-name">{param.name}</td>
						<td class="param-type">{param.type}</td>
						<td>{param.required ? content.requiredLabels.yes : content.requiredLabels.no}</td>
						<td>{param.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="muted">{content.noParametersText}</p>
	{/if}

	{#if tool.examples.length > 0}
		<h3>{content.examplesTitle}</h3>
		{#each tool.examples as example}
			<p class="example-desc">{example.description}</p>
			<CodeBlock code={JSON.stringify(example.params, null, 2)} language="json" />
		{/each}
	{/if}

	{#if tool.responseDescription}
		<h3>{content.responseTitle}</h3>
		<p>{tool.responseDescription}</p>
	{/if}

	<p class="hint">{@html content.hint}</p>
{:else}
	<p class="muted">{content.notFoundText}</p>
{/if}

<style>
	.tool-category-badge {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-top: calc(-1 * var(--spacing-sm));
	}

	.params-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--font-size-sm);
		margin: var(--spacing-md) 0;
	}

	.params-table th {
		text-align: left;
		color: var(--text-muted);
		font-weight: 500;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
	}

	.params-table td {
		padding: var(--spacing-xs) var(--spacing-sm);
		color: var(--text-secondary);
		vertical-align: top;
		border-bottom: 1px solid var(--border-dim);
	}

	.param-name {
		color: var(--accent);
		font-family: var(--font-mono);
	}

	.param-type {
		color: var(--text-muted);
		font-family: var(--font-mono);
	}

	.example-desc {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-xs);
	}
</style>
