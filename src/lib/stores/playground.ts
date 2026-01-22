/**
 * Playground Store
 * Manages playground state: selected tool, parameters, response, connection
 */

import { atom, computed } from 'nanostores';
import type { ConnectionStatus } from '$lib/types/mcp';
import type { ToolMetadata } from '$lib/utils/tool-metadata';
import { TOOLS, getDefaultParams } from '$lib/utils/tool-metadata';
import { mcpClient } from '$lib/services/mcp-client';

// Default server URL
const DEFAULT_SERVER_URL = 'http://localhost:5001';

/**
 * Execution state
 */
export type ExecutionState = 'idle' | 'executing' | 'success' | 'error';

/**
 * Response data
 */
export interface PlaygroundResponse {
	toolId: string;
	toolName: string;
	success: boolean;
	data?: unknown;
	error?: string;
	duration: number;
	timestamp: number;
}

// Connection status
export const connectionStatus = atom<ConnectionStatus>('disconnected');

// Server URL (configurable)
export const serverUrl = atom<string>(DEFAULT_SERVER_URL);

// Currently selected tool
export const selectedToolId = atom<string>('get_diagnostics');

// Parameters for the selected tool
export const toolParams = atom<Record<string, unknown>>({});

// Cache of parameters per tool (persists across tool switches)
export const paramsByToolId = atom<Record<string, Record<string, unknown>>>({});

// Current execution state
export const executionState = atom<ExecutionState>('idle');

// Tool currently executing (for UI correctness when switching tools mid-execution)
export const executingToolId = atom<string | null>(null);

// Last response
export const lastResponse = atom<PlaygroundResponse | null>(null);

// Most recent response per tool (keyed by tool id)
export const responsesByToolId = atom<Record<string, PlaygroundResponse | undefined>>({});

// Derived: get selected tool metadata
export const selectedTool = computed(selectedToolId, (id: string): ToolMetadata | undefined => {
	return TOOLS.find((t) => t.id === id);
});

// Derived: response for selected tool
export const selectedToolResponse = computed(
	[selectedToolId, responsesByToolId],
	(id: string, byTool: Record<string, PlaygroundResponse | undefined>) => byTool[id] ?? null
);

// Derived: is executing
export const isExecuting = computed(executionState, (state: ExecutionState) => state === 'executing');

// Derived: is connected
export const isConnected = computed(connectionStatus, (status: ConnectionStatus) => status === 'connected');

/**
 * Select a tool and restore cached params (or defaults)
 */
export function selectTool(toolId: string): void {
	const tool = TOOLS.find((t) => t.id === toolId);
	if (!tool) return;

	// Save current params before switching
	const currentId = selectedToolId.get();
	if (currentId) {
		const currentParams = toolParams.get();
		paramsByToolId.set({
			...paramsByToolId.get(),
			[currentId]: currentParams
		});
	}

	selectedToolId.set(toolId);

	// Restore cached params or use defaults
	const cached = paramsByToolId.get()[toolId];
	toolParams.set(cached ?? getDefaultParams(tool));
}

/**
 * Update a single parameter
 */
export function setParam(name: string, value: unknown): void {
	const current = toolParams.get();
	toolParams.set({ ...current, [name]: value });
}

/**
 * Update multiple parameters
 */
export function setParams(params: Record<string, unknown>): void {
	const current = toolParams.get();
	toolParams.set({ ...current, ...params });
}

/**
 * Reset parameters to defaults
 */
export function resetParams(): void {
	const tool = selectedTool.get();
	if (tool) {
		const defaults = getDefaultParams(tool);
		toolParams.set(defaults);
		// Also update cache
		paramsByToolId.set({
			...paramsByToolId.get(),
			[tool.id]: defaults
		});
	}
}

/**
 * Set connection status
 */
export function setConnectionStatus(status: ConnectionStatus): void {
	connectionStatus.set(status);
}

/**
 * Set server URL and update MCP client
 */
export function setServerUrl(url: string): void {
	serverUrl.set(url);
	mcpClient.setBaseUrl(url);
}

/**
 * Get current server URL
 */
export function getServerUrl(): string {
	return serverUrl.get();
}

/**
 * Set execution state
 */
export function setExecutionState(state: ExecutionState): void {
	executionState.set(state);
}

/**
 * Set which tool is currently executing
 */
export function setExecutingTool(toolId: string | null): void {
	executingToolId.set(toolId);
}

/**
 * Set response
 */
export function setResponse(response: PlaygroundResponse): void {
	lastResponse.set(response);

	const current = responsesByToolId.get();
	responsesByToolId.set({ ...current, [response.toolId]: response });
}

/**
 * Clear response
 */
export function clearResponse(): void {
	const toolId = selectedToolId.get();

	const current = { ...responsesByToolId.get() };
	delete current[toolId];
	responsesByToolId.set(current);

	const last = lastResponse.get();
	if (last?.toolId === toolId) {
		lastResponse.set(null);
	}

	executionState.set('idle');
	executingToolId.set(null);
}

/**
 * Load an example into the params
 */
export function loadExample(toolId: string, exampleIndex: number): void {
	const tool = TOOLS.find((t) => t.id === toolId);
	if (!tool || !tool.examples[exampleIndex]) return;

	selectTool(toolId);
	setParams(tool.examples[exampleIndex].params);
}

/**
 * Reset entire playground state
 */
export function resetPlayground(): void {
	selectedToolId.set('get_diagnostics');
	toolParams.set({});
	paramsByToolId.set({});
	executionState.set('idle');
	executingToolId.set(null);
	lastResponse.set(null);
	responsesByToolId.set({});
}
