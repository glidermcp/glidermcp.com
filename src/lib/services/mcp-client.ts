/**
 * MCP Client Service
 * HTTP client for communicating with local Glider MCP server at localhost:5001
 * Uses JSON-RPC 2.0 protocol
 */

import { nanoid } from 'nanoid';
import type {
	JsonRpcRequest,
	JsonRpcResponse,
	MCPToolResponse,
	ConnectionStatus,
	HealthResponse
} from '$lib/types/mcp';

export interface MCPClientOptions {
	baseUrl?: string;
	timeout?: number;
	onStatusChange?: (status: ConnectionStatus) => void;
}

export interface CallToolResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	duration: number;
}

const DEFAULT_BASE_URL = 'http://localhost:5001';
const DEFAULT_TIMEOUT = 120000; // 120 seconds - solution loading can take a while
const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds

class MCPClient {
	private baseUrl: string;
	private timeout: number;
	private status: ConnectionStatus = 'disconnected';
	private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
	private healthCheckInterval: ReturnType<typeof setInterval> | null = null;
	private abortController: AbortController | null = null;

	constructor(options: MCPClientOptions = {}) {
		this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
		this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
		if (options.onStatusChange) {
			this.statusListeners.add(options.onStatusChange);
		}
	}

	/**
	 * Get current connection status
	 */
	getStatus(): ConnectionStatus {
		return this.status;
	}

	/**
	 * Check if connected
	 */
	isConnected(): boolean {
		return this.status === 'connected';
	}

	/**
	 * Subscribe to status changes
	 */
	onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
		this.statusListeners.add(callback);
		return () => this.statusListeners.delete(callback);
	}

	/**
	 * Update status and notify listeners
	 */
	private setStatus(status: ConnectionStatus): void {
		if (this.status !== status) {
			this.status = status;
			this.statusListeners.forEach((cb) => cb(status));
		}
	}

	/**
	 * Start connection and health checking
	 */
	async connect(): Promise<boolean> {
		if (this.status === 'connecting') {
			return false;
		}

		this.setStatus('connecting');

		try {
			const healthy = await this.checkHealth();
			if (healthy) {
				this.setStatus('connected');
				this.startHealthCheck();
				return true;
			} else {
				this.setStatus('disconnected');
				return false;
			}
		} catch {
			this.setStatus('error');
			return false;
		}
	}

	/**
	 * Disconnect and stop health checking
	 */
	disconnect(): void {
		this.stopHealthCheck();
		this.abortController?.abort();
		this.abortController = null;
		this.setStatus('disconnected');
	}

	/**
	 * Check server health
	 */
	async checkHealth(): Promise<boolean> {
		try {
			const response = await this.fetchWithTimeout(`${this.baseUrl}/health`, {
				method: 'GET',
				headers: { 'Accept': 'application/json' }
			}, 5000); // Short timeout for health checks

			if (!response.ok) {
				return false;
			}

			const data = await response.json() as HealthResponse;
			return data.status === 'ok';
		} catch {
			return false;
		}
	}

	/**
	 * Get server status including solution info
	 */
	async getServerStatus(): Promise<HealthResponse | null> {
		try {
			const response = await this.fetchWithTimeout(`${this.baseUrl}/health`, {
				method: 'GET',
				headers: { 'Accept': 'application/json' }
			}, 5000);

			if (!response.ok) {
				return null;
			}

			return await response.json() as HealthResponse;
		} catch {
			return null;
		}
	}

	/**
	 * Start periodic health checking
	 */
	private startHealthCheck(): void {
		this.stopHealthCheck();
		this.healthCheckInterval = setInterval(async () => {
			const healthy = await this.checkHealth();
			if (!healthy && this.status === 'connected') {
				this.setStatus('disconnected');
			} else if (healthy && this.status !== 'connected') {
				this.setStatus('connected');
			}
		}, HEALTH_CHECK_INTERVAL);
	}

	/**
	 * Stop periodic health checking
	 */
	private stopHealthCheck(): void {
		if (this.healthCheckInterval) {
			clearInterval(this.healthCheckInterval);
			this.healthCheckInterval = null;
		}
	}

	/**
	 * Call an MCP tool
	 */
	async callTool<T = unknown>(
		toolName: string,
		params: Record<string, unknown> = {}
	): Promise<CallToolResult<T>> {
		const startTime = performance.now();

		// Clean params: remove undefined and null values
		const cleanParams: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== '') {
				cleanParams[key] = value;
			}
		}

		const request: JsonRpcRequest = {
			jsonrpc: '2.0',
			id: nanoid(),
			method: 'tools/call',
			params: {
				name: toolName,
				arguments: cleanParams
			}
		};

		try {
			const response = await this.fetchWithTimeout(`${this.baseUrl}/mcp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json, text/event-stream'
				},
				body: JSON.stringify(request)
			}, this.timeout);

			const duration = performance.now() - startTime;

			if (!response.ok) {
				const text = await response.text();
				return {
					success: false,
					error: `HTTP ${response.status}: ${text || response.statusText}`,
					duration
				};
			}

			// Handle SSE (Server-Sent Events) response format from MCP Streamable HTTP transport
			const contentType = response.headers.get('content-type') || '';
			let jsonResponse: JsonRpcResponse<MCPToolResponse<T>>;

			if (contentType.includes('text/event-stream')) {
				const text = await response.text();
				// Parse SSE format: extract JSON from "data:{...}" lines
				// SSE spec allows "data:" with or without space after colon
				const dataLines = text
					.split('\n')
					.filter((line) => line.startsWith('data:'))
					.map((line) => {
						const content = line.slice(5); // Remove "data:" prefix
						return content.startsWith(' ') ? content.slice(1) : content; // Trim optional space
					});

				// Find the last complete JSON response (tool result)
				let lastValidJson: JsonRpcResponse<MCPToolResponse<T>> | null = null;
				for (const dataLine of dataLines) {
					try {
						const parsed = JSON.parse(dataLine);
						if (parsed.result || parsed.error) {
							lastValidJson = parsed;
						}
					} catch {
						// Skip non-JSON lines
					}
				}

				if (!lastValidJson) {
					return {
						success: false,
						error: 'No valid JSON response found in SSE stream',
						duration
					};
				}
				jsonResponse = lastValidJson;
			} else {
				jsonResponse = (await response.json()) as JsonRpcResponse<MCPToolResponse<T>>;
			}

			if (jsonResponse.error) {
				return {
					success: false,
					error: `${jsonResponse.error.message} (code: ${jsonResponse.error.code})`,
					duration
				};
			}

			// Extract data from MCP response
			const result = jsonResponse.result;
			if (result?.isError) {
				const errorText = result.content?.[0]?.text ?? 'Unknown error';
				return {
					success: false,
					error: errorText,
					duration
				};
			}

			// Parse the text content as JSON if possible
			const textContent = result?.content?.[0]?.text;
			let data: T | undefined;

			if (textContent) {
				try {
					data = JSON.parse(textContent) as T;
				} catch {
					// If not valid JSON, return as-is
					data = textContent as unknown as T;
				}
			} else {
				data = result?.content?.[0]?.data;
			}

			return {
				success: true,
				data,
				duration
			};
		} catch (error) {
			const duration = performance.now() - startTime;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			// Check if it's a connection error
			if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
				this.setStatus('disconnected');
			}

			return {
				success: false,
				error: errorMessage,
				duration
			};
		}
	}

	/**
	 * Fetch with timeout using AbortController
	 */
	private async fetchWithTimeout(
		url: string,
		options: RequestInit,
		timeout: number
	): Promise<Response> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				...options,
				signal: controller.signal
			});
			return response;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * Update base URL
	 */
	setBaseUrl(url: string): void {
		this.baseUrl = url;
	}

	/**
	 * Get base URL
	 */
	getBaseUrl(): string {
		return this.baseUrl;
	}
}

// Singleton instance
export const mcpClient = new MCPClient();

// Export class for testing
export { MCPClient };
