<script lang="ts">
	import { selectedTool, toolParams, setParam, resetParams, isExecuting } from '$stores/playground';
	import type { ToolParameter } from '$lib/utils/tool-metadata';

	interface Props {
		onSubmit?: () => void;
	}

	let { onSubmit }: Props = $props();

	const tool = $derived($selectedTool);
	const params = $derived($toolParams);
	const executing = $derived($isExecuting);

	function handleInputChange(param: ToolParameter, event: Event): void {
		const target = event.target as HTMLInputElement;
		let value: unknown;

		switch (param.type) {
			case 'boolean':
				value = target.checked;
				break;
			case 'number':
				value = target.value ? Number(target.value) : '';
				break;
			default:
				value = target.value;
		}

		setParam(param.name, value);
	}

	function handleSubmit(event: Event): void {
		event.preventDefault();
		onSubmit?.();
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			// Allow Enter in textareas
			if ((event.target as HTMLElement).tagName !== 'TEXTAREA') {
				event.preventDefault();
				onSubmit?.();
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<form class="parameter-form" onsubmit={handleSubmit} onkeydown={handleKeydown}>
	{#if tool}
		<div class="form-header">
			<span class="tool-name">{tool.displayName}</span>
			{#if tool.parameters.length > 0}
				<button type="button" class="reset-btn" onclick={resetParams} disabled={executing}>
					Reset
				</button>
			{/if}
		</div>

		<p class="tool-description">{tool.description}</p>

		{#if tool.parameters.length === 0}
			<p class="no-params">This tool has no parameters.</p>
		{:else}
			<div class="params-list">
				{#each tool.parameters as param}
					<div class="param-row">
						<label class="param-label" for={param.name}>
							{param.name}
							{#if param.required}
								<span class="required">*</span>
							{/if}
						</label>

						{#if param.type === 'boolean'}
							<label class="checkbox-wrapper">
								<input
									type="checkbox"
									id={param.name}
									checked={!!params[param.name]}
									onchange={(e) => handleInputChange(param, e)}
									disabled={executing}
								/>
								<span class="checkbox-label">{param.description}</span>
							</label>
						{:else}
							<input
								type={param.type === 'number' ? 'number' : 'text'}
								id={param.name}
								class="param-input"
								value={params[param.name] ?? ''}
								placeholder={param.placeholder}
								oninput={(e) => handleInputChange(param, e)}
								disabled={executing}
							/>
							<p class="param-description">{param.description}</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<div class="form-actions">
			<button type="submit" class="execute-btn" disabled={executing}>
				{#if executing}
					Executing...
				{:else}
					Execute (F5)
				{/if}
			</button>
		</div>
	{:else}
		<p class="no-tool">Select a tool to configure.</p>
	{/if}
</form>

<style>
	.parameter-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm);
	}

	.form-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--spacing-xs);
		border-bottom: 1px solid var(--border-dim);
	}

	.tool-name {
		font-weight: 600;
		color: var(--text-primary);
	}

	.reset-btn {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		background: none;
		border: 1px solid var(--border-dim);
		padding: 2px var(--spacing-xs);
		cursor: pointer;
	}

	.reset-btn:hover:not(:disabled) {
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.reset-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.tool-description {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.no-params,
	.no-tool {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		padding: var(--spacing-md);
		text-align: center;
	}

	.params-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding-top: var(--spacing-sm);
	}

	.param-row {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.param-label {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		font-weight: 500;
	}

	.required {
		color: var(--accent);
	}

	.param-input {
		width: 100%;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--text-primary);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
	}

	.param-input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.param-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.param-input::placeholder {
		color: var(--text-muted);
	}

	.param-description {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		cursor: pointer;
	}

	.checkbox-wrapper input {
		width: 14px;
		height: 14px;
		accent-color: var(--accent);
	}

	.checkbox-label {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
	}

	.form-actions {
		padding-top: var(--spacing-sm);
		border-top: 1px solid var(--border-dim);
	}

	.execute-btn {
		width: 100%;
		padding: var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--bg-primary);
		background-color: var(--accent);
		border: none;
		cursor: pointer;
	}

	.execute-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.execute-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
