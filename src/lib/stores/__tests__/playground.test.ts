import { describe, it, expect, beforeEach } from 'vitest';
import {
	connectionStatus,
	selectedToolId,
	toolParams,
	executionState,
	executingToolId,
	lastResponse,
	responsesByToolId,
	selectedTool,
	selectedToolResponse,
	isExecuting,
	isConnected,
	selectTool,
	setParam,
	setParams,
	resetParams,
	setConnectionStatus,
	setExecutingTool,
	setExecutionState,
	setResponse,
	clearResponse,
	resetPlayground
} from '../playground';

describe('playground store', () => {
	beforeEach(() => {
		resetPlayground();
	});

	describe('connectionStatus', () => {
		it('should default to disconnected', () => {
			expect(connectionStatus.get()).toBe('disconnected');
		});

		it('should allow setting connection status', () => {
			setConnectionStatus('connected');
			expect(connectionStatus.get()).toBe('connected');
		});
	});

	describe('isConnected computed', () => {
		it('should return true when connected', () => {
			setConnectionStatus('connected');
			expect(isConnected.get()).toBe(true);
		});

		it('should return false when disconnected', () => {
			setConnectionStatus('disconnected');
			expect(isConnected.get()).toBe(false);
		});
	});

	describe('selectedToolId', () => {
		it('should default to get_diagnostics', () => {
			expect(selectedToolId.get()).toBe('get_diagnostics');
		});
	});

	describe('selectTool', () => {
		it('should update selected tool id', () => {
			selectTool('find_types');
			expect(selectedToolId.get()).toBe('find_types');
		});

		it('should not change tool for invalid id', () => {
			selectTool('invalid_tool');
			expect(selectedToolId.get()).toBe('get_diagnostics');
		});
	});

	describe('selectedTool computed', () => {
		it('should return tool metadata for valid id', () => {
			selectTool('get_diagnostics');
			const tool = selectedTool.get();
			expect(tool).toBeDefined();
			expect(tool?.id).toBe('get_diagnostics');
		});
	});

	describe('toolParams', () => {
		it('should default to empty object', () => {
			expect(toolParams.get()).toEqual({});
		});

		it('should update single param with setParam', () => {
			setParam('pattern', 'test');
			expect(toolParams.get()).toEqual({ pattern: 'test' });
		});

		it('should merge params with setParams', () => {
			setParam('a', 1);
			setParams({ b: 2, c: 3 });
			expect(toolParams.get()).toEqual({ a: 1, b: 2, c: 3 });
		});
	});

	describe('executionState', () => {
		it('should default to idle', () => {
			expect(executionState.get()).toBe('idle');
		});

		it('should allow setting execution state', () => {
			setExecutionState('executing');
			expect(executionState.get()).toBe('executing');
		});
	});

	describe('executingToolId', () => {
		it('should default to null', () => {
			expect(executingToolId.get()).toBeNull();
		});

		it('should allow setting executing tool id', () => {
			setExecutingTool('find_types');
			expect(executingToolId.get()).toBe('find_types');
		});
	});

	describe('isExecuting computed', () => {
		it('should return true when executing', () => {
			setExecutionState('executing');
			expect(isExecuting.get()).toBe(true);
		});

		it('should return false when idle', () => {
			setExecutionState('idle');
			expect(isExecuting.get()).toBe(false);
		});
	});

	describe('lastResponse', () => {
		it('should default to null', () => {
			expect(lastResponse.get()).toBeNull();
		});

		it('should allow setting response', () => {
			const response = {
				toolId: 'get_diagnostics',
				toolName: 'get_diagnostics',
				success: true,
				data: { foo: 'bar' },
				duration: 100,
				timestamp: Date.now()
			};
			setResponse(response);
			expect(lastResponse.get()).toEqual(response);
		});
	});

	describe('responsesByToolId / selectedToolResponse', () => {
		it('should track responses per tool and select by current tool', () => {
			selectTool('find_types');
			const findTypesResponse = {
				toolId: 'find_types',
				toolName: 'find_types',
				success: true,
				data: { ok: true },
				duration: 12,
				timestamp: Date.now()
			};
			setResponse(findTypesResponse);

			expect(responsesByToolId.get().find_types).toEqual(findTypesResponse);
			expect(selectedToolResponse.get()).toEqual(findTypesResponse);

			selectTool('get_diagnostics');
			expect(selectedToolResponse.get()).toBeNull();
		});
	});

	describe('clearResponse', () => {
		it('should clear response and reset execution state', () => {
			setResponse({
				toolId: 'get_diagnostics',
				toolName: 'get_diagnostics',
				success: true,
				data: {},
				duration: 100,
				timestamp: Date.now()
			});
			setExecutionState('success');
			setExecutingTool('get_diagnostics');

			clearResponse();

			expect(lastResponse.get()).toBeNull();
			expect(responsesByToolId.get().get_diagnostics).toBeUndefined();
			expect(executionState.get()).toBe('idle');
			expect(executingToolId.get()).toBeNull();
		});
	});

	describe('resetPlayground', () => {
		it('should reset all state to defaults', () => {
			selectTool('find_types');
			setParam('pattern', 'test');
			setExecutionState('success');
			setExecutingTool('find_types');
			setResponse({
				toolId: 'find_types',
				toolName: 'find_types',
				success: true,
				data: {},
				duration: 100,
				timestamp: Date.now()
			});

			resetPlayground();

			expect(selectedToolId.get()).toBe('get_diagnostics');
			expect(toolParams.get()).toEqual({});
			expect(executionState.get()).toBe('idle');
			expect(executingToolId.get()).toBeNull();
			expect(lastResponse.get()).toBeNull();
			expect(responsesByToolId.get()).toEqual({});
		});
	});
});
