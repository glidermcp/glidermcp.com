/**
 * Tool Metadata Definitions
 * All 12 Glider MCP tools with their schemas, parameters, and examples
 */

export type ToolCategory = 'diagnostics' | 'solution' | 'search' | 'analysis' | 'refactoring' | 'external';

export interface ToolParameter {
	name: string;
	type: 'string' | 'boolean' | 'number';
	description: string;
	required: boolean;
	default?: string | boolean | number;
	placeholder?: string;
}

export interface ToolExample {
	description: string;
	params: Record<string, unknown>;
}

export interface ToolMetadata {
	id: string;
	name: string;
	displayName: string;
	description: string;
	category: ToolCategory;
	parameters: ToolParameter[];
	examples: ToolExample[];
	responseDescription?: string;
}

/**
 * Tool categories with display info
 */
export const TOOL_CATEGORIES: Record<ToolCategory, { label: string; description: string }> = {
	diagnostics: {
		label: 'Diagnostics',
		description: 'Check server status and health'
	},
	solution: {
		label: 'Solution Management',
		description: 'Load and unload .NET solutions and projects'
	},
	search: {
		label: 'Search',
		description: 'Find types, usages, and implementations'
	},
	analysis: {
		label: 'Analysis',
		description: 'Get detailed type and method information'
	},
	refactoring: {
		label: 'Refactoring',
		description: 'Rename symbols and move types/members'
	},
	external: {
		label: 'External Source',
		description: 'View source code of NuGet/framework types'
	}
};

/**
 * All 12 tool metadata
 */
export const TOOLS: ToolMetadata[] = [
	// Diagnostics
	{
		id: 'server_status',
		name: 'server_status',
		displayName: 'Server Status',
		description: 'Returns server running status and solution loaded state.',
		category: 'diagnostics',
		parameters: [],
		examples: [
			{
				description: 'Check if server is running',
				params: {}
			}
		],
		responseDescription: 'Returns status, version, and loaded solution info'
	},

	// Solution Management
	{
		id: 'load_solution',
		name: 'load_solution',
		displayName: 'Load Solution',
		description: 'Loads a C# solution (.sln file) for analysis. Returns the list of projects in the solution.',
		category: 'solution',
		parameters: [
			{
				name: 'solutionPath',
				type: 'string',
				description: 'The absolute path to the .sln file to load.',
				required: true,
				placeholder: '/path/to/Solution.sln'
			}
		],
		examples: [
			{
				description: 'Load a solution',
				params: { solutionPath: '/Users/dev/MyProject/MyProject.sln' }
			}
		],
		responseDescription: 'Returns list of projects in the solution'
	},
	{
		id: 'load_project',
		name: 'load_project',
		displayName: 'Load Project',
		description: 'Loads a standalone C# project (.csproj file) for analysis when no solution file exists.',
		category: 'solution',
		parameters: [
			{
				name: 'projectPath',
				type: 'string',
				description: 'The absolute path to the .csproj file to load.',
				required: true,
				placeholder: '/path/to/Project.csproj'
			}
		],
		examples: [
			{
				description: 'Load a standalone project',
				params: { projectPath: '/Users/dev/MyProject/MyProject.csproj' }
			}
		],
		responseDescription: 'Returns project information'
	},
	{
		id: 'unload_solution',
		name: 'unload_solution',
		displayName: 'Unload Solution',
		description: 'Unloads the currently loaded solution from memory.',
		category: 'solution',
		parameters: [],
		examples: [
			{
				description: 'Unload current solution',
				params: {}
			}
		]
	},

	// Search
	{
		id: 'find_types',
		name: 'find_types',
		displayName: 'Find Types',
		description: "Finds types by name pattern with wildcard support. Use '*' to match any characters and '?' to match a single character. Returns type names, kinds, file paths, and line numbers.",
		category: 'search',
		parameters: [
			{
				name: 'pattern',
				type: 'string',
				description: "The search pattern. Supports wildcards: '*' matches any characters (e.g., '*Manager'), '?' matches a single character (e.g., 'I?Service').",
				required: true,
				placeholder: '*Service'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			}
		],
		examples: [
			{
				description: 'Find all service types',
				params: { pattern: '*Service' }
			},
			{
				description: 'Find interfaces starting with I',
				params: { pattern: 'I*' }
			},
			{
				description: 'Find types in specific project',
				params: { pattern: '*Repository', projectName: 'DataLayer' }
			}
		],
		responseDescription: 'Returns list of matching types with names, kinds, paths, and line numbers'
	},
	{
		id: 'find_usages',
		name: 'find_usages',
		displayName: 'Find Usages',
		description: 'Finds all usages (references) of a symbol in the loaded solution. Returns file paths, line numbers, and code snippets for each reference.',
		category: 'search',
		parameters: [
			{
				name: 'symbolName',
				type: 'string',
				description: "The name of the symbol to find. Can be a simple name (e.g., 'ISolutionManager') or fully qualified (e.g., 'Glider.Interfaces.ISolutionManager').",
				required: true,
				placeholder: 'IService'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			}
		],
		examples: [
			{
				description: 'Find all usages of an interface',
				params: { symbolName: 'IUserService' }
			},
			{
				description: 'Find usages of a method',
				params: { symbolName: 'GetUserById' }
			}
		],
		responseDescription: 'Returns list of usage locations with file paths, line numbers, and snippets'
	},
	{
		id: 'find_implementation',
		name: 'find_implementation',
		displayName: 'Find Implementations',
		description: 'Finds all concrete implementations of an interface or abstract class in the loaded solution. Returns type names, file paths, and line numbers for each implementation.',
		category: 'search',
		parameters: [
			{
				name: 'typeName',
				type: 'string',
				description: "The name of the interface or abstract class. Can be a simple name (e.g., 'ISolutionManager') or fully qualified (e.g., 'Glider.Interfaces.ISolutionManager').",
				required: true,
				placeholder: 'IRepository'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			}
		],
		examples: [
			{
				description: 'Find implementations of an interface',
				params: { typeName: 'IRepository' }
			},
			{
				description: 'Find implementations in specific project',
				params: { typeName: 'IService', projectName: 'Services' }
			}
		],
		responseDescription: 'Returns list of implementing types with names, paths, and line numbers'
	},

	// Analysis
	{
		id: 'get_type_info',
		name: 'get_type_info',
		displayName: 'Get Type Info',
		description: 'Gets detailed information about a type including its members, base type, interfaces, and documentation.',
		category: 'analysis',
		parameters: [
			{
				name: 'typeName',
				type: 'string',
				description: "The name of the type to analyze. Can be a simple name (e.g., 'ISolutionManager') or fully qualified (e.g., 'Glider.Interfaces.ISolutionManager').",
				required: true,
				placeholder: 'UserService'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			}
		],
		examples: [
			{
				description: 'Get info about a class',
				params: { typeName: 'UserService' }
			},
			{
				description: 'Get info with full namespace',
				params: { typeName: 'MyApp.Services.UserService' }
			}
		],
		responseDescription: 'Returns type details including members, base types, interfaces, and docs'
	},
	{
		id: 'get_method_signature',
		name: 'get_method_signature',
		displayName: 'Get Method Signature',
		description: 'Gets detailed information about a method signature including parameters, return type, and documentation.',
		category: 'analysis',
		parameters: [
			{
				name: 'methodName',
				type: 'string',
				description: 'The name of the method to analyze.',
				required: true,
				placeholder: 'GetUserById'
			},
			{
				name: 'containingTypeName',
				type: 'string',
				description: 'Optional containing type name to limit the search scope.',
				required: false,
				placeholder: 'UserService'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			}
		],
		examples: [
			{
				description: 'Get method signature',
				params: { methodName: 'GetUserById' }
			},
			{
				description: 'Get method from specific type',
				params: { methodName: 'Save', containingTypeName: 'UserRepository' }
			}
		],
		responseDescription: 'Returns method signature with parameters, return type, and documentation'
	},

	// Refactoring
	{
		id: 'rename_symbol',
		name: 'rename_symbol',
		displayName: 'Rename Symbol',
		description: 'Renames a symbol throughout the solution with semantic awareness. Unlike grep-based renaming, this correctly distinguishes between different symbols with the same name.',
		category: 'refactoring',
		parameters: [
			{
				name: 'symbolName',
				type: 'string',
				description: 'Name of the symbol to rename (simple or fully qualified).',
				required: true,
				placeholder: 'OldClassName'
			},
			{
				name: 'newName',
				type: 'string',
				description: 'The new name for the symbol.',
				required: true,
				placeholder: 'NewClassName'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			},
			{
				name: 'applyChanges',
				type: 'boolean',
				description: 'If true (default), applies changes. If false, returns preview only.',
				required: false,
				default: true
			}
		],
		examples: [
			{
				description: 'Rename a class',
				params: { symbolName: 'OldClassName', newName: 'NewClassName' }
			},
			{
				description: 'Preview rename without applying',
				params: { symbolName: 'OldName', newName: 'NewName', applyChanges: false }
			}
		],
		responseDescription: 'Returns files changed, locations modified, and unified diff'
	},
	{
		id: 'move_type',
		name: 'move_type',
		displayName: 'Move Type',
		description: 'Moves a type to a different file and/or namespace. Automatically updates all references and adds required using directives.',
		category: 'refactoring',
		parameters: [
			{
				name: 'typeName',
				type: 'string',
				description: 'Name of the type to move (simple or fully qualified).',
				required: true,
				placeholder: 'MyClass'
			},
			{
				name: 'targetFilePath',
				type: 'string',
				description: 'Target file path. If not specified, creates new file based on type name.',
				required: false,
				placeholder: '/path/to/NewFile.cs'
			},
			{
				name: 'targetNamespace',
				type: 'string',
				description: 'Target namespace. If not specified, keeps original namespace.',
				required: false,
				placeholder: 'MyApp.NewNamespace'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			},
			{
				name: 'applyChanges',
				type: 'boolean',
				description: 'If true (default), applies changes. If false, returns preview only.',
				required: false,
				default: true
			}
		],
		examples: [
			{
				description: 'Move type to new file',
				params: { typeName: 'MyClass', targetFilePath: '/path/to/NewFile.cs' }
			},
			{
				description: 'Move type to new namespace',
				params: { typeName: 'MyClass', targetNamespace: 'MyApp.NewNamespace' }
			}
		],
		responseDescription: 'Returns source and target locations, files changed/created, and diff'
	},
	{
		id: 'move_member',
		name: 'move_member',
		displayName: 'Move Member',
		description: 'Moves a member (method, property, field, etc.) from one type to another. Automatically updates all references.',
		category: 'refactoring',
		parameters: [
			{
				name: 'memberName',
				type: 'string',
				description: 'Name of the member to move.',
				required: true,
				placeholder: 'MyMethod'
			},
			{
				name: 'sourceTypeName',
				type: 'string',
				description: 'Name of the type containing the member.',
				required: true,
				placeholder: 'SourceClass'
			},
			{
				name: 'targetTypeName',
				type: 'string',
				description: 'Name of the type to move the member to.',
				required: true,
				placeholder: 'TargetClass'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			},
			{
				name: 'applyChanges',
				type: 'boolean',
				description: 'If true (default), applies changes. If false, returns preview only.',
				required: false,
				default: true
			}
		],
		examples: [
			{
				description: 'Move method to another class',
				params: { memberName: 'ProcessData', sourceTypeName: 'OldClass', targetTypeName: 'NewClass' }
			}
		],
		responseDescription: 'Returns source and target types, files changed, and diff'
	},

	// External Source
	{
		id: 'view_external_definition',
		name: 'view_external_definition',
		displayName: 'View External Definition',
		description: 'Views the source code of external symbols (types, methods, properties) from NuGet packages or framework assemblies. Attempts SourceLink resolution first, then falls back to ILSpy decompilation.',
		category: 'external',
		parameters: [
			{
				name: 'symbolName',
				type: 'string',
				description: 'Name of the symbol to look up (simple or fully qualified).',
				required: true,
				placeholder: 'JsonSerializer'
			},
			{
				name: 'assemblyHint',
				type: 'string',
				description: 'Assembly name hint to filter results when multiple matches exist.',
				required: false,
				placeholder: 'System.Text.Json'
			},
			{
				name: 'projectName',
				type: 'string',
				description: 'Optional project name to limit the search scope.',
				required: false,
				placeholder: 'MyProject'
			}
		],
		examples: [
			{
				description: 'View JsonSerializer source',
				params: { symbolName: 'JsonSerializer' }
			},
			{
				description: 'View with assembly hint',
				params: { symbolName: 'JsonSerializer', assemblyHint: 'System.Text.Json' }
			}
		],
		responseDescription: 'Returns source code, assembly info, and source origin (SourceLink or decompiled)'
	}
];

/**
 * Get tool by ID
 */
export function getToolById(id: string): ToolMetadata | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolCategory): ToolMetadata[] {
	return TOOLS.filter((tool) => tool.category === category);
}

/**
 * Get all tool categories with their tools
 */
export function getToolsGroupedByCategory(): Map<ToolCategory, ToolMetadata[]> {
	const grouped = new Map<ToolCategory, ToolMetadata[]>();

	for (const category of Object.keys(TOOL_CATEGORIES) as ToolCategory[]) {
		grouped.set(category, getToolsByCategory(category));
	}

	return grouped;
}

/**
 * Validate parameters for a tool
 */
export function validateToolParams(
	tool: ToolMetadata,
	params: Record<string, unknown>
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	for (const param of tool.parameters) {
		const value = params[param.name];

		if (param.required && (value === undefined || value === null || value === '')) {
			errors.push(`${param.name} is required`);
			continue;
		}

		if (value !== undefined && value !== null && value !== '') {
			switch (param.type) {
				case 'string':
					if (typeof value !== 'string') {
						errors.push(`${param.name} must be a string`);
					}
					break;
				case 'boolean':
					if (typeof value !== 'boolean') {
						errors.push(`${param.name} must be a boolean`);
					}
					break;
				case 'number':
					if (typeof value !== 'number') {
						errors.push(`${param.name} must be a number`);
					}
					break;
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Get default params for a tool
 */
export function getDefaultParams(tool: ToolMetadata): Record<string, unknown> {
	const params: Record<string, unknown> = {};

	for (const param of tool.parameters) {
		if (param.default !== undefined) {
			params[param.name] = param.default;
		} else {
			params[param.name] = '';
		}
	}

	return params;
}
