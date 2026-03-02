import { describe, it, expect } from 'vitest';
import { getToolById, validateToolParams } from '../tool-metadata';

describe('tool-metadata', () => {
	it('exposes the batch tool', () => {
		const tool = getToolById('batch');
		expect(tool).toBeDefined();
		expect(tool?.parameters.some((p) => p.name === 'operations' && p.type === 'json')).toBe(true);
	});

	it('validates required parameters', () => {
		const tool = getToolById('load');
		expect(tool).toBeDefined();
		const validation = validateToolParams(tool!, {});
		expect(validation.valid).toBe(false);
		expect(validation.errors.join('\n')).toMatch(/filePath is required/);
	});

	it('parses json parameters during validation', () => {
		const tool = getToolById('batch');
		expect(tool).toBeDefined();

		const good = validateToolParams(tool!, {
			operations: '[{"tool":"server_status","arguments":{}}]'
		});

		expect(good.valid).toBe(true);
		expect(Array.isArray(good.normalizedParams.operations)).toBe(true);
	});

	it('rejects invalid json parameter values', () => {
		const tool = getToolById('batch');
		expect(tool).toBeDefined();

		const bad = validateToolParams(tool!, {
			operations: '{not json}'
		});

		expect(bad.valid).toBe(false);
		expect(bad.errors.join('\n')).toMatch(/operations must be valid JSON/);
	});
});

