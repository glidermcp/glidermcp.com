<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import { mcpClient } from '$lib/services/mcp-client';
	import {
		selectedToolId,
		selectedTool,
		selectTool,
		toolParams,
		setConnectionStatus,
		setExecutingTool,
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
	const currentToolId = $derived($selectedToolId);
	const params = $derived($toolParams);
	const connected = $derived($isConnected);
	const executing = $derived($isExecuting);
	const currentServerUrl = $derived($serverUrl);
	const toolSlug = $derived($page.params.tool);

	let connectionAttempted = $state(false);
	let serverUrlInput = $state('');
	let lastUrlSyncedToolId = $state<string | null>(null);
	let lastProcessedToolSlug = $state<string | undefined>(undefined);

	function toToolId(slug: string): string {
		return slug.replace(/-/g, '_');
	}

	function toToolSlug(toolId: string): string {
		return toolId.replace(/_/g, '-');
	}

	function resolveRequestTimeoutMs(params: Record<string, unknown>): number | null | undefined {
		const timeout = params.timeout_ms;
		if (typeof timeout !== 'number') {
			return undefined;
		}

		if (timeout === 0) {
			return null;
		}

		if (timeout > 0) {
			// Keep client timeout slightly above tool timeout so server-side timeout decides first.
			return Math.max(120000, timeout + 10000);
		}

		return undefined;
	}

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

		const executingTool = tool;
		const executingToolId = executingTool.id;
		const executingToolName = executingTool.name;

		// Validate params
		const validation = validateToolParams(executingTool, params);
		if (!validation.valid) {
			setResponse({
				toolId: executingToolId,
				toolName: executingToolName,
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
				toolId: executingToolId,
				toolName: executingToolName,
				success: false,
				error: `Not connected to MCP server. Start the server at ${currentServerUrl}.`,
				duration: 0,
				timestamp: Date.now()
			});
			setExecutionState('error');
			return;
		}

		setExecutingTool(executingToolId);
		setExecutionState('executing');

		try {
			const requestTimeoutMs = resolveRequestTimeoutMs(validation.normalizedParams);
			const result = await mcpClient.callTool(executingTool.name, validation.normalizedParams, {
				requestTimeoutMs
			});

			if (!result.success) {
				setResponse({
					toolId: executingToolId,
					toolName: executingToolName,
					success: false,
					error: result.error,
					duration: result.duration,
					timestamp: Date.now()
				});
				setExecutionState('error');
				addHistoryEntry({
					toolId: executingToolId,
					toolName: executingToolName,
					params: { ...validation.normalizedParams },
					success: false,
					error: result.error,
					duration: result.duration
				});
				return;
			}

			const envelope = result.data as Record<string, unknown> | null;
			const hasEnvelope = !!envelope && typeof envelope === 'object' && typeof envelope.success === 'boolean';

			const toolSuccess = hasEnvelope ? (envelope.success as boolean) : true;
			const toolData = hasEnvelope ? envelope.data : result.data;
			const toolError = hasEnvelope ? (envelope.error as string | undefined | null) : undefined;

			setResponse({
				toolId: executingToolId,
				toolName: executingToolName,
				success: toolSuccess,
				data: toolData,
				error: toolSuccess ? undefined : toolError ?? 'Unknown error',
				duration: result.duration,
				timestamp: Date.now()
			});

			setExecutionState(toolSuccess ? 'success' : 'error');

			// Add to history
			addHistoryEntry({
				toolId: executingToolId,
				toolName: executingToolName,
				params: { ...validation.normalizedParams },
				success: toolSuccess,
				error: toolSuccess ? undefined : toolError ?? 'Unknown error',
				duration: result.duration
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setResponse({
				toolId: executingToolId,
				toolName: executingToolName,
				success: false,
				error: errorMessage,
				duration: 0,
				timestamp: Date.now()
			});
			setExecutionState('error');
		} finally {
			setExecutingTool(null);
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

	$effect(() => {
		serverUrlInput = untrack(() => currentServerUrl);

		const unsubscribeKeyboard = keyboardManager.addHandler(handleKeyboard);
		const unsubscribeStatus = mcpClient.onStatusChange((status) => {
			setConnectionStatus(status);
		});

		connect();

		return () => {
			unsubscribeKeyboard();
			unsubscribeStatus?.();
		};
	});

	$effect(() => {
		if (!toolSlug) {
			lastProcessedToolSlug = undefined;
			return;
		}

		if (toolSlug === lastProcessedToolSlug) return;
		lastProcessedToolSlug = toolSlug;

		const targetToolId = toToolId(toolSlug);
		if (targetToolId) {
			selectTool(targetToolId);
		}
	});

	$effect(() => {
		if (!currentToolId) return;

		const desiredSlug = toToolSlug(currentToolId);
		if (!desiredSlug) return;

		const toolChanged = lastUrlSyncedToolId !== null && lastUrlSyncedToolId !== currentToolId;
		lastUrlSyncedToolId = currentToolId;

		if (toolSlug === desiredSlug) return;

		// Only push a param route when either:
		// - we're already on a param route, or
		// - the user just changed the tool selection
		if (!toolSlug) {
			if (!toolChanged) return;
			if (currentToolId === 'get_diagnostics') return;
		}

		goto(`/playground/${desiredSlug}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
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
			<div class="params-wrapper">
				<div class="params-section">
					<ParameterForm onSubmit={executeCurrentTool} hideButton={true} />
				</div>
				<div class="execute-section">
					<button type="button" class="execute-btn" onclick={executeCurrentTool} disabled={executing}>
						{#if executing}
							Executing...
						{:else}
							Execute (F5)
						{/if}
					</button>
				</div>
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

	.params-wrapper {
		display: flex;
		flex-direction: column;
		max-height: 50%;
		border: 1px solid var(--border-dim);
	}

	.params-section {
		flex: 1;
		overflow-y: auto;
	}

	.execute-section {
		flex-shrink: 0;
		padding: var(--spacing-sm);
		border-top: 1px solid var(--border-dim);
		background-color: var(--bg-primary);
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
