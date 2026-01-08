import { describe, it, expect, beforeEach } from 'vitest';
import {
	connectionStatus,
	selectedToolId,
	toolParams,
	executionState,
	lastResponse,
	selectedTool,
	isExecuting,
	isConnected,
	selectTool,
	setParam,
	setParams,
	resetParams,
	setConnectionStatus,
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
				success: true,
				data: { foo: 'bar' },
				duration: 100,
				timestamp: Date.now()
			};
			setResponse(response);
			expect(lastResponse.get()).toEqual(response);
		});
	});

	describe('clearResponse', () => {
		it('should clear response and reset execution state', () => {
			setResponse({
				success: true,
				data: {},
				duration: 100,
				timestamp: Date.now()
			});
			setExecutionState('success');

			clearResponse();

			expect(lastResponse.get()).toBeNull();
			expect(executionState.get()).toBe('idle');
		});
	});

	describe('resetPlayground', () => {
		it('should reset all state to defaults', () => {
			selectTool('find_types');
			setParam('pattern', 'test');
			setExecutionState('success');
			setResponse({
				success: true,
				data: {},
				duration: 100,
				timestamp: Date.now()
			});

			resetPlayground();

			expect(selectedToolId.get()).toBe('get_diagnostics');
			expect(toolParams.get()).toEqual({});
			expect(executionState.get()).toBe('idle');
			expect(lastResponse.get()).toBeNull();
		});
	});
});
