<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { mcpClient } from '$lib/services/mcp-client';
	import {
		selectedToolId,
		selectedTool,
		toolParams,
		setConnectionStatus,
		setExecutionState,
		setResponse,
		isConnected,
		isExecuting,
		serverUrl,
		setServerUrl
	} from '$stores/playground';
	import { addHistoryEntry } from '$stores/history';
	import { validateToolParams } from '$lib/utils/tool-metadata';
	import ConnectionIndicator from './ConnectionIndicator.svelte';
	import ToolSelector from './ToolSelector.svelte';
	import ParameterForm from './ParameterForm.svelte';
	import ResponseViewer from './ResponseViewer.svelte';

	const tool = $derived($selectedTool);
	const params = $derived($toolParams);
	const connected = $derived($isConnected);
	const executing = $derived($isExecuting);
	const currentServerUrl = $derived($serverUrl);

	let connectionAttempted = $state(false);
	let serverUrlInput = $state('');

	async function connect(): Promise<void> {
		connectionAttempted = true;
		setConnectionStatus('connecting');
		const success = await mcpClient.connect();
		if (!success) {
			setConnectionStatus('disconnected');
		}
	}

	async function executeCurrentTool(): Promise<void> {
		if (!tool || executing) return;

		// Validate params
		const validation = validateToolParams(tool, params);
		if (!validation.valid) {
			setResponse({
				success: false,
				error: `Validation failed:\n${validation.errors.join('\n')}`,
				duration: 0,
				timestamp: Date.now()
			});
			setExecutionState('error');
			return;
		}

		// Check connection
		if (!connected) {
			setResponse({
				success: false,
				error: `Not connected to MCP server. Start the server at ${currentServerUrl}.`,
				duration: 0,
				timestamp: Date.now()
			});
			setExecutionState('error');
			return;
		}

		setExecutionState('executing');

		try {
			const result = await mcpClient.callTool(tool.name, params);

			setResponse({
				success: result.success,
				data: result.data,
				error: result.error,
				duration: result.duration,
				timestamp: Date.now()
			});

			setExecutionState(result.success ? 'success' : 'error');

			// Add to history
			addHistoryEntry({
				toolId: tool.id,
				toolName: tool.name,
				params: { ...params },
				success: result.success,
				error: result.error,
				duration: result.duration
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setResponse({
				success: false,
				error: errorMessage,
				duration: 0,
				timestamp: Date.now()
			});
			setExecutionState('error');
		}
	}

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		if (action === 'execute') {
			executeCurrentTool();
			return true;
		}
		return false;
	}

	function handleServerUrlChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		serverUrlInput = input.value;
	}

	function applyServerUrl(): void {
		if (serverUrlInput && serverUrlInput !== currentServerUrl) {
			setServerUrl(serverUrlInput);
			// Disconnect and reconnect with new URL
			mcpClient.disconnect();
			connect();
		}
	}

	function handleServerUrlKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			applyServerUrl();
		}
	}

	let unsubscribeKeyboard: (() => void) | null = null;
	let unsubscribeStatus: (() => void) | null = null;

	onMount(() => {
		// Initialize server URL input from store
		serverUrlInput = currentServerUrl;

		unsubscribeKeyboard = keyboardManager.addHandler(handleKeyboard);

		// Subscribe to MCP client status changes
		unsubscribeStatus = mcpClient.onStatusChange((status) => {
			setConnectionStatus(status);
		});

		// Try to connect on mount
		connect();
	});

	onDestroy(() => {
		unsubscribeKeyboard?.();
		unsubscribeStatus?.();
	});
</script>

<div class="playground-view">
	<div class="playground-header">
		<h2>Playground</h2>
		<div class="header-right">
			<div class="server-url-group">
				<label for="server-url" class="server-url-label">Server:</label>
				<input
					id="server-url"
					type="text"
					class="server-url-input"
					value={serverUrlInput}
					oninput={handleServerUrlChange}
					onkeydown={handleServerUrlKeydown}
					onblur={applyServerUrl}
					placeholder="http://localhost:5001"
				/>
			</div>
			<ConnectionIndicator />
			{#if !connected}
				<button type="button" class="connect-btn" onclick={connect}>
					{connectionAttempted ? 'Retry' : 'Connect'}
				</button>
			{/if}
		</div>
	</div>

	<div class="playground-content">
		<div class="left-section">
			<div class="section-header">Tools</div>
			<ToolSelector />
		</div>

		<div class="right-section">
			<div class="params-section">
				<ParameterForm onSubmit={executeCurrentTool} />
			</div>

			<div class="response-section">
				<ResponseViewer />
			</div>
		</div>
	</div>

	<div class="playground-footer">
		<span class="shortcut"><kbd>↑↓</kbd> Navigate</span>
		<span class="shortcut"><kbd>Tab</kbd> Switch panels</span>
		<span class="shortcut"><kbd>F5</kbd> Execute</span>
		<span class="shortcut"><kbd>ESC</kbd> Back</span>
	</div>
</div>

<style>
	.playground-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: var(--spacing-sm);
	}

	.playground-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.playground-header h2 {
		margin: 0;
		font-size: var(--font-size-lg);
		color: var(--text-primary);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.connect-btn {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-secondary);
		background: none;
		border: 1px solid var(--border);
		padding: var(--spacing-xs) var(--spacing-sm);
		cursor: pointer;
	}

	.connect-btn:hover {
		color: var(--text-primary);
		border-color: var(--accent);
	}

	.server-url-group {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.server-url-label {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.server-url-input {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-primary);
		background: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		padding: var(--spacing-xs) var(--spacing-sm);
		width: 200px;
	}

	.server-url-input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.server-url-input::placeholder {
		color: var(--text-muted);
	}

	.playground-content {
		display: flex;
		flex: 1;
		gap: var(--spacing-md);
		overflow: hidden;
		padding-top: var(--spacing-sm);
	}

	.left-section {
		width: 180px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border-dim);
	}

	.section-header {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
		background-color: var(--bg-secondary);
	}

	.right-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		overflow: hidden;
	}

	.params-section {
		border: 1px solid var(--border-dim);
		max-height: 50%;
		overflow-y: auto;
	}

	.response-section {
		flex: 1;
		border: 1px solid var(--border-dim);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.playground-footer {
		display: flex;
		gap: var(--spacing-md);
		padding-top: var(--spacing-sm);
		border-top: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.shortcut {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	kbd {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		padding: 2px var(--spacing-xs);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		margin-right: 2px;
	}
</style>
