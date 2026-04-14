import { describe, it, expect } from 'vitest';
import { navItems } from '../../content/en/nav';
import { TOOLS, getToolById, validateToolParams } from '../tool-metadata';

describe('tool-metadata', () => {
	it('exposes the batch tool', () => {
		const tool = getToolById('batch');
		expect(tool).toBeDefined();
		expect(tool?.parameters.some((p) => p.name === 'operations' && p.type === 'json')).toBe(true);
	});

	it('does not expose timeout_ms as a public tool parameter', () => {
		expect(TOOLS.some((tool) => tool.parameters.some((param) => param.name === 'timeout_ms'))).toBe(false);
	});

	it('validates required parameters', () => {
		const tool = getToolById('load');
		expect(tool).toBeDefined();
		const validation = validateToolParams(tool!, {});
		expect(validation.valid).toBe(false);
		expect(validation.errors.join('\n')).toMatch(/filePath is required/);
	});

	it('documents workspace diagnostics as server_status-only opt-in', () => {
		const load = getToolById('load');
		const serverStatus = getToolById('server_status');
		const reload = getToolById('reload');

		expect(load).toBeDefined();
		expect(load?.parameters.some((param) => param.name === 'includeWorkspaceDiagnostics')).toBe(false);
		expect((load?.responseExample?.data as { workspaceDiagnostics?: unknown }).workspaceDiagnostics).toBeUndefined();
		expect((load?.responseExample?.data as { hints?: unknown }).hints).toBeUndefined();

		expect(reload).toBeDefined();
		expect(reload?.parameters.some((param) => param.name === 'includeWorkspaceDiagnostics')).toBe(false);

		expect(serverStatus).toBeDefined();
		expect(
			serverStatus?.parameters.some((param) => param.name === 'includeWorkspaceDiagnostics' && param.default === false)
		).toBe(true);
		expect((serverStatus?.responseExample?.data as { workspaceDiagnostics?: unknown }).workspaceDiagnostics).toBeUndefined();
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

	it('documents workspace file tools in metadata and navigation', () => {
		const getFileContents = getToolById('get_file_contents');
		const writeFile = getToolById('write_file');
		const toolLinks = navItems.find((item) => item.id === 'tools')?.children ?? [];

		expect(getFileContents).toBeDefined();
		expect(getFileContents?.category).toBe('solution');
		expect(getFileContents?.parameters.some((param) => param.name === 'filePath' && param.required)).toBe(true);
		expect(getFileContents?.parameters.some((param) => param.name === 'maxChars')).toBe(true);

		expect(writeFile).toBeDefined();
		expect(writeFile?.category).toBe('solution');
		expect(writeFile?.parameters.some((param) => param.name === 'content' && param.required)).toBe(true);
		expect(writeFile?.parameters.some((param) => param.name === 'applyChanges' && param.default === false)).toBe(true);

		expect(toolLinks.some((item) => item.href === '/tools/get-file-contents')).toBe(true);
		expect(toolLinks.some((item) => item.href === '/tools/write-file')).toBe(true);
	});

	it('documents the 6.5.0 analysis and cleanup tools in metadata and navigation', () => {
		const newToolIds = [
			'diagnostic_hotspots',
			'find_unused_symbols',
			'find_unused_parameters',
			'get_cascade_impact',
			'get_project_graph',
			'find_unused_project_references',
			'find_external_dependency_usages',
			'find_package_usages'
		];
		const toolLinks = navItems.find((item) => item.id === 'tools')?.children ?? [];

		for (const toolId of newToolIds) {
			expect(getToolById(toolId)).toBeDefined();
			expect(toolLinks.some((item) => item.href === `/tools/${toolId.replace(/_/g, '-')}`)).toBe(true);
		}
	});
});
