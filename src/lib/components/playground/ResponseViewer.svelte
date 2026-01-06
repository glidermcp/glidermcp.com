<script lang="ts">
	import { lastResponse, executionState, clearResponse, selectedToolId } from '$stores/playground';
	import { formatDuration } from '$stores/history';
	import ResponseVisualizer from './ResponseVisualizer.svelte';

	const response = $derived($lastResponse);
	const state = $derived($executionState);
	const toolId = $derived($selectedToolId);

	// Toggle between raw and visual view
	let viewMode = $state<'raw' | 'visual'>('visual');

	// Check if current tool supports visualization
	const supportsVisualization = $derived.by(() => {
		const visualizableTools = [
			'get_type_info',
			'get_method_signature',
			'find_usages',
			'find_implementation',
			'load_solution'
		];
		return visualizableTools.includes(toolId);
	});

	function toggleViewMode(): void {
		viewMode = viewMode === 'raw' ? 'visual' : 'raw';
	}

	function formatJson(data: unknown): string {
		try {
			return JSON.stringify(data, null, 2);
		} catch {
			return String(data);
		}
	}

	function copyToClipboard(): void {
		if (!response?.data) return;

		const text = formatJson(response.data);
		navigator.clipboard.writeText(text).catch(() => {
			// Fallback for older browsers
			const textarea = document.createElement('textarea');
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
		});
	}
</script>

<div class="response-viewer">
	<div class="response-header">
		<span class="header-title">Response</span>
		{#if response}
			<div class="header-actions">
				<span class="duration">{formatDuration(response.duration)}</span>
				{#if supportsVisualization && response.success}
					<button
						type="button"
						class="action-btn"
						class:active={viewMode === 'visual'}
						onclick={toggleViewMode}
						title="Toggle visualization"
					>
						{viewMode === 'visual' ? 'Raw' : 'Visual'}
					</button>
				{/if}
				<button type="button" class="action-btn" onclick={copyToClipboard} title="Copy to clipboard">
					Copy
				</button>
				<button type="button" class="action-btn" onclick={clearResponse} title="Clear response">
					Clear
				</button>
			</div>
		{/if}
	</div>

	<div class="response-content">
		{#if state === 'executing'}
			<div class="executing">
				<span class="spinner"></span>
				<span>Executing...</span>
			</div>
		{:else if response}
			{#if response.success}
				<div class="success-indicator">
					<span class="indicator success">✓</span>
					<span>Success</span>
				</div>
				{#if supportsVisualization && viewMode === 'visual'}
					<div class="visualization-wrapper">
						<ResponseVisualizer {toolId} data={response.data} />
					</div>
				{:else}
					<pre class="response-data">{formatJson(response.data)}</pre>
				{/if}
			{:else}
				<div class="error-indicator">
					<span class="indicator error">✗</span>
					<span>Error</span>
				</div>
				<pre class="response-error">{response.error}</pre>
			{/if}
		{:else}
			<div class="empty-state">
				<p>No response yet.</p>
				<p class="hint">Select a tool and press <kbd>F5</kbd> to execute.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.response-viewer {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 150px;
	}

	.response-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.header-title {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		font-weight: 500;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.duration {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.action-btn {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		background: none;
		border: 1px solid var(--border-dim);
		padding: 2px var(--spacing-xs);
		cursor: pointer;
	}

	.action-btn:hover {
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.action-btn.active {
		color: var(--accent);
		border-color: var(--accent);
	}

	.response-content {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
	}

	.executing {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		color: var(--text-muted);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--border-dim);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.success-indicator,
	.error-indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		margin-bottom: var(--spacing-sm);
		font-size: var(--font-size-sm);
	}

	.indicator {
		font-weight: bold;
	}

	.indicator.success {
		color: var(--accent);
	}

	.indicator.error {
		color: var(--error, #ff5555);
	}

	.success-indicator {
		color: var(--accent);
	}

	.error-indicator {
		color: var(--error, #ff5555);
	}

	.response-data,
	.response-error {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		margin: 0;
		padding: var(--spacing-sm);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.response-data {
		color: var(--text-primary);
	}

	.visualization-wrapper {
		flex: 1;
		border: 1px solid var(--border-dim);
		background-color: var(--bg-secondary);
		overflow: hidden;
		min-height: 200px;
	}

	.response-error {
		color: var(--error, #ff5555);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-lg);
		color: var(--text-muted);
		text-align: center;
	}

	.empty-state p {
		margin: 0;
	}

	.empty-state .hint {
		margin-top: var(--spacing-sm);
		font-size: var(--font-size-sm);
	}

	kbd {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		padding: 2px var(--spacing-xs);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
	}
</style>
