/**
 * Tool Metadata Definitions
 * Glider MCP tools with their schemas, parameters, and examples.
 */

export type ToolCategory =
	| 'debug'
	| 'solution'
	| 'diagnostics'
	| 'search'
	| 'analysis'
	| 'refactoring'
	| 'external'
	| 'batch';

export interface ToolParameter {
	name: string;
	type: 'string' | 'boolean' | 'number' | 'json';
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
	responseExample?: Record<string, unknown>;
	showInDocs?: boolean;
}

export const TOOL_CATEGORIES: Record<ToolCategory, { label: string; description: string }> = {
	debug: {
		label: 'Debug',
		description: 'Server status and health checks'
	},
	solution: {
		label: 'Solution Management',
		description: 'Load and reload .NET solutions and projects'
	},
	diagnostics: {
		label: 'Diagnostics',
		description: 'Compiler diagnostics and build health'
	},
	search: {
		label: 'Search',
		description: 'Find types, usages, and implementations'
	},
	analysis: {
		label: 'Analysis',
		description: 'Type information, dependencies, and complexity metrics'
	},
	refactoring: {
		label: 'Refactoring',
		description: 'Rename symbols and move types/members'
	},
	external: {
		label: 'External Source',
		description: 'View source code of NuGet/framework types'
	},
	batch: {
		label: 'Batching',
		description: 'Run multiple tool calls in one request'
	}
};

export const TOOLS: ToolMetadata[] = [
	// Debug
	{
		id: 'server_status',
		name: 'server_status',
		displayName: 'Server Status',
		description: 'Returns server running status and whether a solution/project is loaded.',
		category: 'debug',
		parameters: [],
		examples: [{ description: 'Check if the server is running', params: {} }],
		responseDescription: 'Returns server/solution status and cache metadata',
		responseExample: {
			success: true,
			data: {
				serverRunning: true,
				solutionLoaded: true,
				solutionPath: '/path/to/solution.sln',
				cache: {
					cacheStatus: 'valid',
					revision: 3,
					lastRefreshUtc: '2026-01-12T21:06:33.123Z',
					loadedKind: 'solution',
					loadedPath: '/path/to/solution.sln'
				},
				projectCount: 2,
				projects: [{ name: 'MyProject', filePath: '/path/to/MyProject.csproj' }]
			},
			error: null
		},
		showInDocs: false
	},

	// Solution management
	{
		id: 'load_solution',
		name: 'load_solution',
		displayName: 'Load Solution',
		description: 'Loads a C# solution (.sln) for analysis and returns the list of projects.',
		category: 'solution',
		parameters: [
			{
				name: 'solutionPath',
				type: 'string',
				description: 'Absolute path to the .sln file to load.',
				required: true,
				placeholder: '/path/to/Solution.sln'
			},
			{
				name: 'timeout_ms',
				type: 'number',
				description: 'Timeout in milliseconds. Use 0 to disable. Default is 120000.',
				required: false,
				default: 120000
			}
		],
		examples: [{ description: 'Load a solution', params: { solutionPath: '/Users/dev/MyProject/MyProject.sln' } }],
		responseDescription: 'Returns projects and cache metadata for the loaded solution',
		responseExample: {
			success: true,
			data: {
				solutionPath: '/Users/dev/MyProject/MyProject.sln',
				projectCount: 2,
				projects: [{ name: 'MyProject', filePath: '/Users/dev/MyProject/MyProject.csproj', documentCount: 42 }],
				cache: {
					cacheStatus: 'valid',
					revision: 1,
					lastRefreshUtc: '2026-01-12T21:06:33.123Z',
					loadedKind: 'solution',
					loadedPath: '/Users/dev/MyProject/MyProject.sln'
				}
			},
			error: null
		}
	},
	{
		id: 'load_project',
		name: 'load_project',
		displayName: 'Load Project',
		description: 'Loads a standalone C# project (.csproj) for analysis and returns workspace projects.',
		category: 'solution',
		parameters: [
			{
				name: 'projectPath',
				type: 'string',
				description: 'Absolute path to the .csproj file to load.',
				required: true,
				placeholder: '/path/to/Project.csproj'
			},
			{
				name: 'timeout_ms',
				type: 'number',
				description: 'Timeout in milliseconds. Use 0 to disable. Default is 120000.',
				required: false,
				default: 120000
			}
		],
		examples: [{ description: 'Load a standalone project', params: { projectPath: '/Users/dev/MyProject/MyProject.csproj' } }],
		responseDescription: 'Returns projects and cache metadata for the loaded project',
		responseExample: {
			success: true,
			data: {
				projectPath: '/Users/dev/MyProject/MyProject.csproj',
				projectCount: 1,
				projects: [{ name: 'MyProject', filePath: '/Users/dev/MyProject/MyProject.csproj', documentCount: 42 }],
				cache: {
					cacheStatus: 'valid',
					revision: 1,
					lastRefreshUtc: '2026-01-12T21:06:33.123Z',
					loadedKind: 'project',
					loadedPath: '/Users/dev/MyProject/MyProject.csproj'
				}
			},
			error: null
		}
	},
	{
		id: 'reload_current',
		name: 'reload_current',
		displayName: 'Reload Current',
		description: 'Reloads the currently loaded solution/project from disk.',
		category: 'solution',
		parameters: [
			{
				name: 'timeout_ms',
				type: 'number',
				description: 'Timeout in milliseconds. Use 0 to disable. Default is 60000.',
				required: false,
				default: 60000
			}
		],
		examples: [{ description: 'Reload after manual edits', params: {} }],
		responseDescription: 'Returns the reloaded path, project list, and updated cache metadata',
		responseExample: {
			success: true,
			data: {
				reloadedPath: '/Users/dev/MyProject/MyProject.sln',
				projectCount: 2,
				projects: [{ name: 'MyProject', filePath: '/Users/dev/MyProject/MyProject.csproj', documentCount: 42 }],
				cache: {
					cacheStatus: 'valid',
					revision: 2,
					lastRefreshUtc: '2026-01-12T21:07:10.000Z',
					loadedKind: 'solution',
					loadedPath: '/Users/dev/MyProject/MyProject.sln'
				}
			},
			error: null
		}
	},
	{
		id: 'solution_cache',
		name: 'solution_cache',
		displayName: 'Solution Cache',
		description: 'Returns cache metadata for the loaded solution/project, and can optionally force a refresh from disk.',
		category: 'solution',
		parameters: [
			{
				name: 'forceRefresh',
				type: 'boolean',
				description: 'When true, reloads from disk before returning cache info. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'timeout_ms',
				type: 'number',
				description: 'Timeout in milliseconds. Use 0 to disable. Default is 60000.',
				required: false,
				default: 60000
			}
		],
		examples: [
			{ description: 'Get cache info', params: {} },
			{ description: 'Force refresh from disk', params: { forceRefresh: true } }
		],
		responseDescription: 'Returns cache status, revision, and last refresh time',
		responseExample: {
			success: true,
			data: {
				cacheStatus: 'valid',
				revision: 2,
				lastRefreshUtc: '2026-01-12T21:07:10.000Z',
				loadedKind: 'solution',
				loadedPath: '/Users/dev/MyProject/MyProject.sln',
				forceRefresh: false
			},
			error: null
		}
	},

	// Diagnostics
	{
		id: 'get_diagnostics',
		name: 'get_diagnostics',
		displayName: 'Get Diagnostics',
		description: 'Gets compiler diagnostics for the loaded solution/project.',
		category: 'diagnostics',
		parameters: [
			{ name: 'filePath', type: 'string', description: 'Optional file path filter.', required: false, placeholder: '/path/to/File.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'summaryOnly', type: 'boolean', description: 'When true, returns summary counts only. Default is false.', required: false, default: false },
			{ name: 'severity', type: 'string', description: "Minimum severity: 'error', 'warning', 'info', or 'hidden'. Default is 'warning'.", required: false, default: 'warning' },
			{ name: 'category', type: 'string', description: "Optional category filter (e.g., 'Compiler', 'Style').", required: false, placeholder: 'Compiler' },
			{ name: 'idPrefix', type: 'string', description: "Optional diagnostic ID prefix filter (e.g., 'CS', 'CA', 'IDE').", required: false, placeholder: 'CS' },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'severity', 'filePath', 'id', 'lineNumber', 'projectName'.", required: false, placeholder: 'severity' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [
			{ description: 'Get warnings and errors (default)', params: {} },
			{ description: 'Get error diagnostics only', params: { severity: 'error' } },
			{ description: 'Summary view by project and severity', params: { summaryOnly: true, severity: 'warning' } }
		],
		responseDescription: 'Returns diagnostics, optionally with paging and filtering',
		responseExample: {
			success: true,
			data: {
				diagnosticCount: 3,
				errorCount: 1,
				warningCount: 2,
				infoCount: 0,
				paging: { skip: 0, take: 200, returned: 3, total: 3 },
				diagnostics: [
					{
						id: 'CS1002',
						severity: 'Error',
						message: '; expected',
						filePath: '/path/to/File.cs',
						lineNumber: 42,
						column: 17,
						endLineNumber: 42,
						endColumn: 18,
						category: 'Syntax',
						projectName: 'MyProject'
					}
				]
			},
			error: null
		}
	},

	// Search
	{
		id: 'find_types',
		name: 'find_types',
		displayName: 'Find Types',
		description: "Finds types by name pattern with wildcard support ('*' and '?').",
		category: 'search',
		parameters: [
			{ name: 'pattern', type: 'string', description: "Search pattern (supports '*' and '?').", required: true, placeholder: '*Service' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'summaryOnly', type: 'boolean', description: 'When true, returns summary counts only. Default is false.', required: false, default: false },
			{ name: 'kind', type: 'string', description: "Optional kind filter (e.g., 'Class', 'Interface').", required: false, placeholder: 'Interface' },
			{ name: 'accessibility', type: 'string', description: "Optional accessibility filter (e.g., 'Public', 'Internal').", required: false, placeholder: 'Public' },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'name', 'kind', 'filePath', 'projectName', 'lineNumber'.", required: false, placeholder: 'name' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [
			{ description: 'Find all service types', params: { pattern: '*Service' } },
			{ description: 'Find public interfaces', params: { pattern: 'I*', kind: 'Interface', accessibility: 'Public' } }
		],
		responseDescription: 'Returns matching types (with paging)',
		responseExample: {
			success: true,
			data: {
				pattern: '*Service',
				matchCount: 2,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				matches: [
					{
						typeName: 'UserService',
						fullName: 'MyApp.Services.UserService',
						kind: 'Class',
						accessibility: 'Public',
						filePath: '/path/to/UserService.cs',
						lineNumber: 12,
						projectName: 'MyApp'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'find_usages',
		name: 'find_usages',
		displayName: 'Find Usages',
		description: 'Finds usages (references) of a symbol in the loaded solution/project.',
		category: 'search',
		parameters: [
			{ name: 'symbolName', type: 'string', description: 'Symbol name (simple or fully qualified).', required: true, placeholder: 'IUserService' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'summaryOnly', type: 'boolean', description: 'When true, returns summary counts only. Default is false.', required: false, default: false },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'filePath', 'lineNumber', 'projectName'.", required: false, placeholder: 'filePath' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [
			{ description: 'Find usages of an interface', params: { symbolName: 'IUserService' } },
			{ description: 'Summary view', params: { symbolName: 'IUserService', summaryOnly: true } }
		],
		responseDescription: 'Returns usage locations (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolName: 'ISolutionManager',
				symbolKind: 'Interface',
				usageCount: 15,
				paging: { skip: 0, take: 200, returned: 15, total: 15 },
				usages: [
					{
						filePath: '/path/to/Program.cs',
						lineNumber: 9,
						column: 35,
						lineText: 'builder.Services.AddSingleton<ISolutionManager, SolutionManager>();',
						projectName: 'MyProject'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'find_implementation',
		name: 'find_implementation',
		displayName: 'Find Implementations',
		description: 'Finds concrete implementations of an interface or abstract class.',
		category: 'search',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Interface/abstract class name (simple or fully qualified).', required: true, placeholder: 'IRepository' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [{ description: 'Find implementations of IRepository', params: { typeName: 'IRepository' } }],
		responseDescription: 'Returns implementing types',
		responseExample: {
			success: true,
			data: {
				baseTypeName: 'IRepository',
				baseTypeKind: 'Interface',
				implementationCount: 2,
				implementations: [
					{
						typeName: 'SqlRepository',
						fullName: 'MyApp.Data.SqlRepository',
						kind: 'Class',
						filePath: '/path/to/SqlRepository.cs',
						lineNumber: 10,
						projectName: 'MyApp'
					}
				]
			},
			error: null
		}
	},

	// Analysis
	{
		id: 'get_type_info',
		name: 'get_type_info',
		displayName: 'Get Type Info',
		description: 'Gets detailed information about a type (members, inheritance, interfaces, docs, and location).',
		category: 'analysis',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Type name (simple or fully qualified).', required: true, placeholder: 'UserService' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [{ description: 'Get type info', params: { typeName: 'UserService' } }],
		responseDescription: 'Returns type details including members',
		responseExample: {
			success: true,
			data: {
				name: 'SolutionManager',
				fullName: 'Glider.Services.SolutionManager',
				kind: 'Class',
				accessibility: 'Public',
				baseType: 'Object',
				interfaces: ['ISolutionManager'],
				filePath: '/path/to/SolutionManager.cs',
				lineNumber: 10,
				members: [
					{
						name: 'LoadSolutionAsync',
						kind: 'Method',
						type: 'Task',
						accessibility: 'Public',
						signature: 'Task LoadSolutionAsync(string solutionPath)'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'get_method_signature',
		name: 'get_method_signature',
		displayName: 'Get Method Signature',
		description: 'Gets detailed information about a method signature (parameters, return type, docs, and location).',
		category: 'analysis',
		parameters: [
			{ name: 'methodName', type: 'string', description: 'Method name to analyze.', required: true, placeholder: 'GetUserById' },
			{ name: 'containingTypeName', type: 'string', description: 'Optional containing type name filter.', required: false, placeholder: 'UserService' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [{ description: 'Get method signature', params: { methodName: 'GetUserById' } }],
		responseDescription: 'Returns method signature with parameters',
		responseExample: {
			success: true,
			data: {
				name: 'LoadSolutionAsync',
				returnType: 'Task',
				containingType: 'ISolutionManager',
				filePath: '/path/to/SolutionManager.cs',
				lineNumber: 58,
				parameters: [{ name: 'solutionPath', type: 'string', defaultValue: null, modifiers: [] }]
			},
			error: null
		}
	},
	{
		id: 'get_type_dependencies',
		name: 'get_type_dependencies',
		displayName: 'Get Type Dependencies',
		description: 'Analyzes type dependencies (uses / used_by).',
		category: 'analysis',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Type name to analyze.', required: true, placeholder: 'SolutionManager' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'direction', type: 'string', description: "Direction: 'uses', 'used_by', or 'both' (default).", required: false, default: 'both' },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [{ description: 'Analyze dependencies', params: { typeName: 'SolutionManager' } }],
		responseDescription: 'Returns types used by the target and types that reference it',
		responseExample: {
			success: true,
			data: {
				typeName: 'SolutionManager',
				fullName: 'Glider.Services.SolutionManager',
				filePath: '/path/to/SolutionManager.cs',
				usesCount: 4,
				usedByCount: 2,
				uses: [
					{
						typeName: 'Workspace',
						fullName: 'Microsoft.CodeAnalysis.Workspace',
						namespace: 'Microsoft.CodeAnalysis',
						usageKind: 'Field',
						filePath: null,
						isExternal: true
					}
				],
				usedBy: [
					{
						typeName: 'SolutionTools',
						fullName: 'Glider.Server.SolutionTools',
						namespace: 'Glider.Server',
						usageKind: 'Method',
						filePath: '/path/to/SolutionTools.cs',
						isExternal: false
					}
				]
			},
			error: null
		}
	},
	{
		id: 'analyze_complexity',
		name: 'analyze_complexity',
		displayName: 'Analyze Complexity',
		description: 'Analyzes code complexity metrics (cyclomatic complexity, LOC, method counts).',
		category: 'analysis',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Optional type name filter.', required: false, placeholder: 'SolutionManager' },
			{ name: 'filePath', type: 'string', description: 'Optional file path filter.', required: false, placeholder: '/path/to/SolutionManager.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'minCyclomaticComplexity', type: 'number', description: 'Only include methods with cyclomatic complexity >= this value. Default is 0.', required: false, default: 0 },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'complexity', 'averageComplexity', 'linesOfCode', 'methodCount', 'name'.", required: false, placeholder: 'complexity' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset over returned types. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size over returned types. Default is 50.', required: false, default: 50 },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [
			{ description: 'Analyze overall complexity', params: {} },
			{ description: 'Show only high-complexity methods (>= 10)', params: { minCyclomaticComplexity: 10, sortBy: 'complexity', sortOrder: 'desc' } }
		],
		responseDescription: 'Returns summary metrics and per-type complexity details (with paging)',
		responseExample: {
			success: true,
			data: {
				summary: {
					totalTypes: 12,
					totalMethods: 84,
					totalLinesOfCode: 3200,
					averageComplexity: 3.1,
					maxComplexity: 12,
					highComplexityMethodCount: 4
				},
				paging: { skip: 0, take: 50, returned: 12, total: 12 },
				types: [
					{
						name: 'SolutionManager',
						fullName: 'Glider.Services.SolutionManager',
						kind: 'Class',
						filePath: '/path/to/SolutionManager.cs',
						linesOfCode: 240,
						methodCount: 8,
						averageComplexity: 2.4,
						methods: [
							{
								name: 'LoadSolutionAsync',
								cyclomaticComplexity: 4,
								linesOfCode: 32,
								parameterCount: 1,
								lineNumber: 58
							}
						]
					}
				]
			},
			error: null
		}
	},

	// Refactoring
	{
		id: 'rename_symbol',
		name: 'rename_symbol',
		displayName: 'Rename Symbol',
		description: 'Semantically renames a symbol across the solution/project.',
		category: 'refactoring',
		parameters: [
			{ name: 'symbolName', type: 'string', description: 'Symbol name to rename (simple or fully qualified).', required: true, placeholder: 'OldClassName' },
			{ name: 'newName', type: 'string', description: 'New name for the symbol.', required: true, placeholder: 'NewClassName' },
			{ name: 'projectName', type: 'string', description: 'Optional project name to limit symbol search.', required: false, placeholder: 'MyProject' },
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns a preview diff.', required: false, default: true },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 60000.', required: false, default: 60000 }
		],
		examples: [
			{ description: 'Rename a class', params: { symbolName: 'OldClassName', newName: 'NewClassName' } },
			{ description: 'Preview without applying', params: { symbolName: 'OldName', newName: 'NewName', applyChanges: false } }
		],
		responseDescription: 'Returns a unified diff of the change set',
		responseExample: {
			success: true,
			data: {
				symbolName: 'OldClassName',
				newName: 'NewClassName',
				symbolKind: 'Class',
				filesChanged: 5,
				locationsChanged: 12,
				applied: true,
				unifiedDiff: '...'
			},
			error: null
		}
	},
	{
		id: 'move_type',
		name: 'move_type',
		displayName: 'Move Type',
		description: 'Moves a type to a different file and/or namespace and updates references.',
		category: 'refactoring',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Type name to move (simple or fully qualified).', required: true, placeholder: 'MyClass' },
			{ name: 'targetFilePath', type: 'string', description: 'Optional target file path.', required: false, placeholder: '/path/to/NewFile.cs' },
			{ name: 'targetNamespace', type: 'string', description: 'Optional target namespace.', required: false, placeholder: 'MyApp.Utils' },
			{ name: 'projectName', type: 'string', description: 'Optional project name to limit symbol search.', required: false, placeholder: 'MyProject' },
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns a preview diff.', required: false, default: true },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 60000.', required: false, default: 60000 }
		],
		examples: [{ description: 'Move a type to a new namespace', params: { typeName: 'MyClass', targetNamespace: 'MyApp.Utils' } }],
		responseDescription: 'Returns a unified diff of the change set',
		responseExample: {
			success: true,
			data: {
				symbolName: 'MyClass',
				symbolKind: 'Class',
				sourceLocation: '/path/to/OldFile.cs',
				targetLocation: '/path/to/NewFile.cs',
				filesChanged: 3,
				filesCreated: 1,
				applied: true,
				unifiedDiff: '...'
			},
			error: null
		}
	},
	{
		id: 'move_member',
		name: 'move_member',
		displayName: 'Move Member',
		description: 'Moves a member (method/property/field) from one type to another and updates references.',
		category: 'refactoring',
		parameters: [
			{ name: 'memberName', type: 'string', description: 'Member name to move.', required: true, placeholder: 'MyMethod' },
			{ name: 'sourceTypeName', type: 'string', description: 'Source type name.', required: true, placeholder: 'SourceClass' },
			{ name: 'targetTypeName', type: 'string', description: 'Target type name.', required: true, placeholder: 'TargetClass' },
			{ name: 'projectName', type: 'string', description: 'Optional project name to limit search.', required: false, placeholder: 'MyProject' },
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns a preview diff.', required: false, default: true },
			{ name: 'maxReferenceUpdates', type: 'number', description: 'Maximum reference updates when rewriting call sites. Use 0 to disable. Default is 2000.', required: false, default: 2000 },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 60000.', required: false, default: 60000 }
		],
		examples: [{ description: 'Move a method to another class', params: { memberName: 'ProcessData', sourceTypeName: 'OldClass', targetTypeName: 'NewClass' } }],
		responseDescription: 'Returns a unified diff of the change set',
		responseExample: {
			success: true,
			data: {
				symbolName: 'MyMethod',
				symbolKind: 'Method',
				sourceLocation: 'SourceClass',
				targetLocation: 'TargetClass',
				filesChanged: 2,
				filesCreated: 0,
				applied: true,
				unifiedDiff: '...'
			},
			error: null
		}
	},

	// External source
	{
		id: 'view_external_definition',
		name: 'view_external_definition',
		displayName: 'View External Definition',
		description: 'Views source code for external symbols (NuGet/framework), via SourceLink or decompilation.',
		category: 'external',
		parameters: [
			{ name: 'symbolName', type: 'string', description: 'Symbol name to look up (simple or fully qualified).', required: true, placeholder: 'JsonSerializer' },
			{ name: 'assemblyHint', type: 'string', description: 'Optional assembly name hint to narrow matches.', required: false, placeholder: 'System.Text.Json' },
			{ name: 'projectName', type: 'string', description: 'Optional project name to limit referenced assemblies.', required: false, placeholder: 'MyProject' },
			{ name: 'maxLines', type: 'number', description: 'Maximum number of source lines to return. Use 0 for no limit. Default is 400.', required: false, default: 400 },
			{ name: 'timeout_ms', type: 'number', description: 'Timeout in milliseconds. Use 0 to disable. Default is 30000.', required: false, default: 30000 }
		],
		examples: [
			{ description: 'View JsonSerializer source', params: { symbolName: 'System.Text.Json.JsonSerializer', assemblyHint: 'System.Text.Json' } }
		],
		responseDescription: 'Returns source code and assembly information',
		responseExample: {
			success: true,
			data: {
				symbolName: 'JsonSerializer',
				symbolKind: 'Class',
				assemblyName: 'System.Text.Json',
				assemblyVersion: '9.0.0.0',
				sourceOrigin: 'SourceLink',
				sourceUrl: 'https://raw.githubusercontent.com/...',
				sourceCode: 'public static class JsonSerializer { ... }',
				sourceCodeTotalLines: 1200,
				sourceCodeReturnedLines: 400,
				sourceCodeTruncated: true,
				language: 'C#'
			},
			error: null
		}
	},

	// Batch
	{
		id: 'batch',
		name: 'batch',
		displayName: 'Batch',
		description: 'Runs multiple tool operations in a single request.',
		category: 'batch',
		parameters: [
			{
				name: 'operations',
				type: 'json',
				description: "Operations to run, in order. JSON array of objects like { \"tool\": \"get_type_info\", \"arguments\": { ... } }.",
				required: true,
				default: '[]',
				placeholder: `[\n  { "tool": "server_status", "arguments": {} },\n  { "tool": "get_diagnostics", "arguments": { "summaryOnly": true } }\n]`
			},
			{
				name: 'stopOnError',
				type: 'boolean',
				description: 'When true, stops after the first failure. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'timeout_ms',
				type: 'number',
				description: 'Overall batch timeout in milliseconds. Use 0 to disable. Default is 60000.',
				required: false,
				default: 60000
			}
		],
		examples: [
			{
				description: 'Run multiple operations',
				params: {
					operations:
						`[\n  { "tool": "get_type_info", "arguments": { "typeName": "SolutionManager" } },\n  { "tool": "find_usages", "arguments": { "symbolName": "ISolutionManager", "summaryOnly": true } }\n]`
				}
			}
		],
		responseDescription: 'Returns per-operation results in order',
		responseExample: {
			success: true,
			data: {
				operationCount: 2,
				completedCount: 2,
				failedCount: 0,
				stoppedEarly: false,
				results: [
					{ tool: 'get_type_info', result: { success: true, data: { name: 'SolutionManager' }, error: null } },
					{ tool: 'find_usages', result: { success: true, data: { usageCount: 15 }, error: null } }
				]
			},
			error: null
		}
	}
];

export function getToolById(id: string): ToolMetadata | undefined {
	return TOOLS.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolMetadata[] {
	return TOOLS.filter((tool) => tool.category === category);
}

export function getToolsGroupedByCategory(): Map<ToolCategory, ToolMetadata[]> {
	const grouped = new Map<ToolCategory, ToolMetadata[]>();
	for (const category of Object.keys(TOOL_CATEGORIES) as ToolCategory[]) {
		grouped.set(category, getToolsByCategory(category));
	}
	return grouped;
}

export function validateToolParams(
	tool: ToolMetadata,
	params: Record<string, unknown>
): { valid: boolean; errors: string[]; normalizedParams: Record<string, unknown> } {
	const errors: string[] = [];
	const normalizedParams: Record<string, unknown> = { ...params };

	for (const param of tool.parameters) {
		const value = normalizedParams[param.name];

		if (param.required && (value === undefined || value === null || value === '')) {
			errors.push(`${param.name} is required`);
			continue;
		}

		if (value !== undefined && value !== null && value !== '') {
			switch (param.type) {
				case 'string':
					if (typeof value !== 'string') errors.push(`${param.name} must be a string`);
					break;
				case 'boolean':
					if (typeof value !== 'boolean') errors.push(`${param.name} must be a boolean`);
					break;
				case 'number':
					if (typeof value !== 'number') errors.push(`${param.name} must be a number`);
					break;
				case 'json': {
					if (typeof value === 'string') {
						try {
							normalizedParams[param.name] = JSON.parse(value) as unknown;
						} catch {
							errors.push(`${param.name} must be valid JSON`);
						}
					} else if (typeof value !== 'object') {
						errors.push(`${param.name} must be a JSON value (object or array)`);
					}
					break;
				}
			}
		}
	}

	return { valid: errors.length === 0, errors, normalizedParams };
}

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

