import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { MCPClient } from '../mcp-client';

describe('MCPClient', () => {
	let client: MCPClient;
	let mockFetch: Mock;

	beforeEach(() => {
		client = new MCPClient({ baseUrl: 'http://localhost:5001' });
		mockFetch = vi.fn();
		globalThis.fetch = mockFetch;
	});

	describe('constructor', () => {
		it('should use default base URL when not provided', () => {
			const defaultClient = new MCPClient();
			expect(defaultClient.getBaseUrl()).toBe('http://localhost:5001');
		});

		it('should use provided base URL', () => {
			const customClient = new MCPClient({ baseUrl: 'http://custom:8080' });
			expect(customClient.getBaseUrl()).toBe('http://custom:8080');
		});
	});

	describe('getStatus', () => {
		it('should return disconnected initially', () => {
			expect(client.getStatus()).toBe('disconnected');
		});
	});

	describe('isConnected', () => {
		it('should return false when disconnected', () => {
			expect(client.isConnected()).toBe(false);
		});
	});

	describe('checkHealth', () => {
		it('should return true when health check succeeds', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ status: 'ok' })
			});

			const result = await client.checkHealth();
			expect(result).toBe(true);
			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:5001/health',
				expect.objectContaining({
					method: 'GET',
					headers: { Accept: 'application/json' }
				})
			);
		});

		it('should return false when health check fails', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false
			});

			const result = await client.checkHealth();
			expect(result).toBe(false);
		});

		it('should return false when fetch throws', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network error'));

			const result = await client.checkHealth();
			expect(result).toBe(false);
		});
	});

	describe('connect', () => {
		it('should set status to connected on successful health check', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ status: 'ok' })
			});

			const result = await client.connect();
			expect(result).toBe(true);
			expect(client.getStatus()).toBe('connected');
		});

		it('should set status to disconnected on failed health check', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false
			});

			const result = await client.connect();
			expect(result).toBe(false);
			expect(client.getStatus()).toBe('disconnected');
		});
	});

	describe('disconnect', () => {
		it('should set status to disconnected', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ status: 'ok' })
			});
			await client.connect();

			client.disconnect();
			expect(client.getStatus()).toBe('disconnected');
		});
	});

	describe('callTool', () => {
		it('should return success result on valid response', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					jsonrpc: '2.0',
					id: '123',
					result: {
						content: [{ type: 'text', text: '{"data": "test"}' }]
					}
				})
			});

			const result = await client.callTool('server_status', {});
			expect(result.success).toBe(true);
			expect(result.data).toEqual({ data: 'test' });
			expect(result.duration).toBeGreaterThanOrEqual(0);
		});

		it('should return error result on HTTP error', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				text: async () => 'Server error'
			});

			const result = await client.callTool('server_status', {});
			expect(result.success).toBe(false);
			expect(result.error).toContain('500');
		});

		it('should return error result on JSON-RPC error', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					jsonrpc: '2.0',
					id: '123',
					error: {
						code: -32600,
						message: 'Invalid Request'
					}
				})
			});

			const result = await client.callTool('invalid_tool', {});
			expect(result.success).toBe(false);
			expect(result.error).toContain('Invalid Request');
		});

		it('should clean undefined params', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					jsonrpc: '2.0',
					id: '123',
					result: { content: [{ type: 'text', text: '{}' }] }
				})
			});

			await client.callTool('test', {
				valid: 'value',
				empty: '',
				undef: undefined,
				nullish: null
			});

			const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
			expect(callBody.params.arguments).toEqual({ valid: 'value' });
		});
	});

	describe('onStatusChange', () => {
		it('should call callback when status changes', async () => {
			const callback = vi.fn();
			client.onStatusChange(callback);

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ status: 'ok' })
			});
			await client.connect();

			expect(callback).toHaveBeenCalledWith('connecting');
			expect(callback).toHaveBeenCalledWith('connected');
		});

		it('should return unsubscribe function', async () => {
			const callback = vi.fn();
			const unsubscribe = client.onStatusChange(callback);

			unsubscribe();

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ status: 'ok' })
			});
			await client.connect();

			// Should only be called once (for connecting), not for connected
			// because we unsubscribed after first call - actually no, unsubscribe is sync
			// so the callback won't be called at all after unsubscribe
			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe('setBaseUrl', () => {
		it('should update base URL', () => {
			client.setBaseUrl('http://newhost:9000');
			expect(client.getBaseUrl()).toBe('http://newhost:9000');
		});
	});
});
