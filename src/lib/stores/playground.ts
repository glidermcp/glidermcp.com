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
export const selectedToolId = atom<string>('server_status');

// Parameters for the selected tool
export const toolParams = atom<Record<string, unknown>>({});

// Current execution state
export const executionState = atom<ExecutionState>('idle');

// Last response
export const lastResponse = atom<PlaygroundResponse | null>(null);

// Derived: get selected tool metadata
export const selectedTool = computed(selectedToolId, (id: string): ToolMetadata | undefined => {
	return TOOLS.find((t) => t.id === id);
});

// Derived: is executing
export const isExecuting = computed(executionState, (state: ExecutionState) => state === 'executing');

// Derived: is connected
export const isConnected = computed(connectionStatus, (status: ConnectionStatus) => status === 'connected');

/**
 * Select a tool and reset params
 */
export function selectTool(toolId: string): void {
	const tool = TOOLS.find((t) => t.id === toolId);
	if (!tool) return;

	selectedToolId.set(toolId);
	toolParams.set(getDefaultParams(tool));
	// Don't clear response on tool switch - user might want to compare
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
		toolParams.set(getDefaultParams(tool));
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
 * Set response
 */
export function setResponse(response: PlaygroundResponse | null): void {
	lastResponse.set(response);
}

/**
 * Clear response
 */
export function clearResponse(): void {
	lastResponse.set(null);
	executionState.set('idle');
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
	selectedToolId.set('server_status');
	toolParams.set({});
	executionState.set('idle');
	lastResponse.set(null);
}
