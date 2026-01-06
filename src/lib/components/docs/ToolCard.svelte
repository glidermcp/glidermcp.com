<script lang="ts">
	import type { ToolMetadata } from '$lib/utils/tool-metadata';

	interface Props {
		tool: ToolMetadata;
		expanded?: boolean;
		onToggle?: () => void;
	}

	let { tool, expanded = false, onToggle }: Props = $props();
</script>

<div class="tool-card" class:expanded>
	<button class="tool-header" onclick={onToggle}>
		<span class="expand-icon">{expanded ? '▼' : '▶'}</span>
		<span class="tool-name">{tool.name}</span>
		<span class="tool-category">[{tool.category}]</span>
	</button>

	{#if expanded}
		<div class="tool-content">
			<p class="tool-description">{tool.description}</p>

			{#if tool.parameters.length > 0}
				<div class="section">
					<h4>Parameters</h4>
					<table class="params-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Required</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{#each tool.parameters as param}
								<tr>
									<td class="param-name">{param.name}</td>
									<td class="param-type">{param.type}</td>
									<td class="param-required">{param.required ? 'Yes' : 'No'}</td>
									<td class="param-desc">{param.description}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="no-params">No parameters required.</p>
			{/if}

			{#if tool.examples.length > 0}
				<div class="section">
					<h4>Examples</h4>
					{#each tool.examples as example}
						<div class="example">
							<p class="example-desc">{example.description}</p>
							<pre class="example-code">{JSON.stringify(example.params, null, 2)}</pre>
						</div>
					{/each}
				</div>
			{/if}

			{#if tool.responseDescription}
				<div class="section">
					<h4>Response</h4>
					<p class="response-desc">{tool.responseDescription}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.tool-card {
		border: 1px solid var(--border-dim);
		margin-bottom: var(--spacing-sm);
		background-color: var(--bg-secondary);
	}

	.tool-card.expanded {
		border-color: var(--accent);
	}

	.tool-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-family: var(--font-mono);
		color: var(--text-primary);
	}

	.tool-header:hover {
		background-color: var(--selection-bg);
	}

	.expand-icon {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.tool-name {
		color: var(--accent);
		font-weight: 600;
	}

	.tool-category {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.tool-content {
		padding: var(--spacing-md);
		padding-top: 0;
		border-top: 1px solid var(--border-dim);
	}

	.tool-description {
		color: var(--text-secondary);
		margin: var(--spacing-md) 0;
		line-height: 1.5;
	}

	.section {
		margin-top: var(--spacing-lg);
	}

	.section h4 {
		color: var(--text-primary);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin: 0 0 var(--spacing-sm) 0;
		padding-bottom: var(--spacing-xs);
		border-bottom: 1px solid var(--border-dim);
	}

	.params-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--font-size-sm);
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
	}

	.param-name {
		color: var(--accent) !important;
		font-family: var(--font-mono);
	}

	.param-type {
		color: var(--text-muted) !important;
		font-family: var(--font-mono);
	}

	.param-required {
		color: var(--text-muted) !important;
	}

	.no-params {
		color: var(--text-muted);
		font-style: italic;
		margin: var(--spacing-sm) 0;
	}

	.example {
		margin-bottom: var(--spacing-md);
	}

	.example-desc {
		color: var(--text-secondary);
		margin: 0 0 var(--spacing-xs) 0;
		font-size: var(--font-size-sm);
	}

	.example-code {
		background-color: var(--bg-primary);
		padding: var(--spacing-sm);
		border: 1px solid var(--border-dim);
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		overflow-x: auto;
		margin: 0;
	}

	.response-desc {
		color: var(--text-secondary);
		margin: 0;
	}
</style>
