/**
 * Tool Metadata Definitions
 * Glider MCP tools with their schemas, parameters, and examples.
 */

export type ToolCategory =
	| 'debug'
	| 'solution'
	| 'diagnostics'
	| 'symbols'
	| 'references'
	| 'analysis'
	| 'semantic'
	| 'hierarchy'
	| 'callgraph'
	| 'refactoring'
	| 'codefix'
	| 'external'
	| 'architecture'
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
		label: 'Status',
		description: 'Server status and health checks'
	},
	solution: {
		label: 'Solution & Workspace',
		description: 'Load, sync, reload, and access root-scoped workspace files'
	},
	diagnostics: {
		label: 'Diagnostics',
		description: 'Compiler and analyzer diagnostics, plus grouped hotspot planning'
	},
	symbols: {
		label: 'Symbol Discovery',
		description: 'Resolve and search for symbols with stable keys'
	},
	references: {
		label: 'References & Relationships',
		description: 'References, overrides, implementations, and unused-code discovery'
	},
	analysis: {
		label: 'Code Analysis',
		description: 'Type/method info and bounded source extraction'
	},
	semantic: {
		label: 'Semantic & Text Search',
		description: 'Predicate-based symbol queries and literal/regex text search'
	},
	hierarchy: {
		label: 'Type Hierarchy',
		description: 'Base/derived relationships and member override chains'
	},
	callgraph: {
		label: 'Call Graph & Impact',
		description: 'Callers, outgoing calls, and direct/transitive impact summaries'
	},
	refactoring: {
		label: 'Refactoring',
		description: 'Rename symbols and move types/members'
	},
	codefix: {
		label: 'Code Fixes & Formatting',
		description: 'Code fixes, organize usings, and format documents'
	},
	external: {
		label: 'External Source',
		description: 'View external source and analyze assembly/package usage'
	},
	architecture: {
		label: 'Architecture & Metrics',
		description: 'Project graphs, dependency analysis, cleanup planning, and complexity metrics'
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
		description: 'Returns server running status, loaded-workspace state, cache metadata, file-watcher stats, and cached workspace load diagnostics.',
		category: 'debug',
		parameters: [
			{
				name: 'includeProjects',
				type: 'boolean',
				description: 'Include detailed project information in response. Default is false.',
				required: false,
				default: false
			}
		],
		examples: [{ description: 'Check if the server is running', params: {} }],
		responseDescription: 'Returns server/workspace status, cache metadata, watcher stats, and cached workspace load diagnostics.',
		responseExample: {
			success: true,
			data: {
				serverRunning: true,
				solutionLoaded: true,
				solutionPath: '/path/to/solution.sln',
				workspaceDiagnostics: {
					count: 0,
					messages: []
				},
				cache: {
					cacheStatus: 'valid',
					revision: 3,
					lastRefreshUtc: '2026-01-12T21:06:33.123Z',
					loadedKind: 'solution',
					loadedPath: '/path/to/solution.sln'
				},
				projectCount: 2,
				fileWatcher: {
					enabled: true,
					watchedDirectory: '/path/to/workspace',
					pendingChanges: 0,
					activeOperations: 0
				}
			},
			error: null
		},
		showInDocs: true
	},

	// Solution management
	{
		id: 'load',
		name: 'load',
		displayName: 'Load',
		description: 'Loads a C# solution (.sln/.slnx) or project (.csproj) for analysis. Optionally enables automatic file watching when workingDirectory is provided. Workspace MSBuild load diagnostics are hidden by default; inspect them with server_status or set includeWorkspaceDiagnostics=true to include them inline.',
		category: 'solution',
		parameters: [
			{
				name: 'filePath',
				type: 'string',
				description: 'Absolute path to .sln, .slnx, or .csproj file to load.',
				required: true,
				placeholder: '/path/to/Solution.sln'
			},
			{
				name: 'workingDirectory',
				type: 'string',
				description: 'Optional working directory to watch for file changes. When provided, enables automatic sync of changed files.',
				required: false,
				placeholder: '/path/to/workspace'
			},
			{
				name: 'includeProjects',
				type: 'boolean',
				description: 'Include detailed project information in response. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'includeWorkspaceDiagnostics',
				type: 'boolean',
				description: 'When true, includes cached workspace MSBuild load diagnostics in the response. Default is false.',
				required: false,
				default: false
			}
		],
		examples: [
			{ description: 'Load a solution', params: { filePath: '/Users/dev/MyProject/MyProject.sln' } },
			{ description: 'Load with file watching', params: { filePath: '/Users/dev/MyProject/MyProject.sln', workingDirectory: '/Users/dev/MyProject', includeProjects: true } },
			{ description: 'Load and include workspace diagnostics', params: { filePath: '/Users/dev/MyProject/MyProject.sln', includeWorkspaceDiagnostics: true } },
			{ description: 'Load a standalone project', params: { filePath: '/Users/dev/MyProject/MyProject.csproj' } }
		],
		responseDescription: 'Returns the loaded path, project list, watcher state, and cache metadata. Inline workspace load diagnostics are included only when requested; otherwise load may return next-step hints when diagnostics were suppressed.',
		responseExample: {
			success: true,
			data: {
				loadedPath: '/Users/dev/MyProject/MyProject.sln',
				loadedKind: 'solution',
				projectCount: 2,
				projects: [{ name: 'MyProject', filePath: '/Users/dev/MyProject/MyProject.csproj', documentCount: 42 }],
				fileWatcher: { enabled: true, watchedDirectory: '/Users/dev/MyProject' },
				cache: {
					cacheStatus: 'valid',
					revision: 1,
					lastRefreshUtc: '2026-01-23T21:06:33.123Z',
					loadedKind: 'solution',
					loadedPath: '/Users/dev/MyProject/MyProject.sln'
				},
				hints: {
					nextSteps: [
						'Workspace load diagnostics were suppressed. Use server_status to inspect the cached diagnostics.',
						'The presence of diagnostic messages does not indicate limited functionality of the glider. If you are experiencing issues with missing files or incomplete analysis results, please inspect the workspace diagnostics to determine if there are MSBuild load errors that need to be resolved.'
					]
				}
			},
			meta: { durationMs: 123, cancelled: false, timedOut: false, timeoutMs: 1200000, workspaceDiagnosticsSuppressed: true },
			error: null
		}
	},
	{
		id: 'reload',
		name: 'reload',
		displayName: 'Reload',
		description: 'Reloads the currently loaded solution/project from disk. Cached workspace MSBuild load diagnostics are returned only when includeWorkspaceDiagnostics is true.',
		category: 'solution',
		parameters: [
			{
				name: 'includeProjects',
				type: 'boolean',
				description: 'Include detailed project information in response. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'includeWorkspaceDiagnostics',
				type: 'boolean',
				description: 'When true, includes workspace MSBuild load diagnostics captured during reload. Default is false.',
				required: false,
				default: false
			}
		],
		examples: [
			{ description: 'Reload after manual edits', params: { includeProjects: true } },
			{ description: 'Reload and include workspace load diagnostics', params: { includeWorkspaceDiagnostics: true } }
		],
		responseDescription: 'Returns the reloaded path, project list, and updated cache metadata. Workspace load diagnostics are included only when requested.',
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
			meta: { durationMs: 123, cancelled: false, timedOut: false, timeoutMs: 1200000 },
			error: null
		}
	},
	{
		id: 'sync',
		name: 'sync',
		displayName: 'Sync',
		description:
			'Synchronizes one or more documents from disk into the in-memory workspace (faster than reload for .cs edits). If no paths are provided, sync runs only when pending watcher changes exist unless forceSync is true.',
		category: 'solution',
		parameters: [
			{
				name: 'filePaths',
				type: 'json',
				description:
					'Optional file paths to sync. JSON array of strings. If omitted/empty, sync runs only when pending watcher changes exist unless forceSync is true.',
				required: false,
				placeholder: '["/path/to/File.cs"]'
			},
			{
				name: 'forceSync',
				type: 'boolean',
				description: 'When true, forces sync of all documents even if no pending changes are detected. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'pathStyle',
				type: 'string',
				description: "Path style: 'absolute' (default) or 'relative' (to solution root).",
				required: false,
				default: 'absolute'
			}
		],
		examples: [
			{ description: 'Sync when watcher has pending changes', params: {} },
			{ description: 'Force sync all documents', params: { forceSync: true } },
			{ description: 'Sync a specific file', params: { filePaths: '["/Users/dev/MyProject/Program.cs"]' } }
		],
		responseDescription: 'Returns updated and skipped files plus revision info. Workspace load diagnostics are not returned by sync.',
		responseExample: {
			success: true,
			data: {
				updated: ['/Users/dev/MyProject/Program.cs'],
				skipped: [],
				totalSynced: 1,
				revisionBefore: 3,
				revisionAfter: 4,
				fallbackToReload: false,
				fallbackReason: null
			},
			error: null
		}
	},
	{
		id: 'get_file_contents',
		name: 'get_file_contents',
		displayName: 'Get File Contents',
		description:
			'Gets text content for a file under the loaded root, with optional line-window limits. Supports files outside the Roslyn workspace when they are still inside the loaded root.',
		category: 'solution',
		parameters: [
			{
				name: 'filePath',
				type: 'string',
				description: 'File path to read. Can be absolute or relative to the loaded root.',
				required: true,
				placeholder: '/Users/dev/MyProject/Program.cs'
			},
			{
				name: 'startLine',
				type: 'number',
				description: 'Optional 1-based start line. Defaults to 1.',
				required: false,
				placeholder: '1'
			},
			{
				name: 'endLine',
				type: 'number',
				description: 'Optional 1-based inclusive end line. Defaults to the end of the file.',
				required: false,
				placeholder: '120'
			},
			{
				name: 'maxLines',
				type: 'number',
				description: 'Maximum number of lines to return. Use 0 for unlimited. Default is 400.',
				required: false,
				default: 400
			},
			{
				name: 'maxChars',
				type: 'number',
				description: 'Maximum characters to return. Use 0 for unlimited. Default is 100000.',
				required: false,
				default: 100000
			},
			{
				name: 'pathStyle',
				type: 'string',
				description: "Path style: 'absolute' (default) or 'relative' (to solution root).",
				required: false,
				default: 'absolute'
			}
		],
		examples: [
			{ description: 'Read an entire file', params: { filePath: '/Users/dev/MyProject/Program.cs' } },
			{ description: 'Read a bounded line range', params: { filePath: '/Users/dev/MyProject/Program.cs', startLine: 40, endLine: 90 } },
			{ description: 'Read using relative paths with limits', params: { filePath: 'src/Program.cs', maxLines: 80, maxChars: 12000, pathStyle: 'relative' } }
		],
		responseDescription: 'Returns bounded text content plus file metadata and workspace inclusion state',
		responseExample: {
			success: true,
			data: {
				filePath: '/Users/dev/MyProject/Program.cs',
				totalLines: 180,
				startLine: 40,
				endLine: 90,
				lineCount: 51,
				truncated: false,
				inWorkspace: true,
				fileExtension: '.cs',
				content: 'using System;\n\nnamespace MyProject;\n...'
			},
			meta: { durationMs: 89, cancelled: false, timedOut: false, timeoutMs: 1200000 },
			error: null
		}
	},
	{
		id: 'write_file',
		name: 'write_file',
		displayName: 'Write File',
		description:
			'Writes a .cs file under the loaded root. Uses preview-first behavior by default and explicitly updates or reloads the workspace after applyChanges=true.',
		category: 'solution',
		parameters: [
			{
				name: 'filePath',
				type: 'string',
				description: 'File path to write. Can be absolute or relative to the loaded root.',
				required: true,
				placeholder: '/Users/dev/MyProject/Program.cs'
			},
			{
				name: 'content',
				type: 'string',
				description: 'Full file contents to write.',
				required: true,
				placeholder: 'namespace MyProject;\n\npublic class Program { }'
			},
			{
				name: 'applyChanges',
				type: 'boolean',
				description: 'If true, writes the file to disk. If false, returns a preview only. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'createIfMissing',
				type: 'boolean',
				description: 'If true, creates a new file when it does not already exist. Default is false.',
				required: false,
				default: false
			},
			{
				name: 'includeDiff',
				type: 'boolean',
				description: 'Include unified diff output in the response. Default is true.',
				required: false,
				default: true
			},
			{
				name: 'maxDiffChars',
				type: 'number',
				description: 'Maximum diff characters to return. Use 0 for unlimited. Default is 50000.',
				required: false,
				default: 50000
			},
			{
				name: 'pathStyle',
				type: 'string',
				description: "Path style: 'absolute' (default) or 'relative' (to solution root).",
				required: false,
				default: 'absolute'
			}
		],
		examples: [
			{ description: 'Preview a file edit without writing', params: { filePath: '/Users/dev/MyProject/Program.cs', content: 'namespace MyProject;\n\npublic class Program { }' } },
			{ description: 'Apply a file edit', params: { filePath: '/Users/dev/MyProject/Program.cs', content: 'namespace MyProject;\n\npublic class Program { }', applyChanges: true } },
			{ description: 'Create a new file and apply the change', params: { filePath: 'src/NewType.cs', content: 'namespace MyProject;\n\npublic class NewType { }', applyChanges: true, createIfMissing: true, pathStyle: 'relative' } }
		],
		responseDescription: 'Returns diff output plus workspace update status after preview or apply',
		responseExample: {
			success: true,
			data: {
				filePath: '/Users/dev/MyProject/Program.cs',
				changed: true,
				applied: false,
				created: false,
				filesChanged: 1,
				unifiedDiff: '--- /Users/dev/MyProject/Program.cs\n+++ /Users/dev/MyProject/Program.cs\n@@ ...',
				changedFiles: [
					{
						filePath: '/Users/dev/MyProject/Program.cs',
						changeCount: 1,
						diff: '--- /Users/dev/MyProject/Program.cs\n+++ /Users/dev/MyProject/Program.cs\n@@ ...'
					}
				],
				workspaceUpdate: {
					kind: 'preview',
					updated: false,
					inWorkspaceBefore: true,
					inWorkspaceAfter: true,
					message: null
				}
			},
			meta: { durationMs: 112, cancelled: false, timedOut: false, timeoutMs: 1200000 },
			error: null
		}
	},

	// Diagnostics
	{
		id: 'get_diagnostics',
		name: 'get_diagnostics',
		displayName: 'Get Diagnostics',
		description: 'Gets diagnostics (warnings, errors) for the loaded solution/project. Use includeAnalyzers=true to include analyzer/IDE diagnostics. Workspace load diagnostics are available via server_status, or inline from load/reload when includeWorkspaceDiagnostics is true.',
		category: 'diagnostics',
		parameters: [
			{ name: 'filePath', type: 'string', description: 'Optional file path filter.', required: false, placeholder: '/path/to/File.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'includeAnalyzers', type: 'boolean', description: 'Include analyzer/IDE diagnostics. Default is false.', required: false, default: false },
			{ name: 'summaryOnly', type: 'boolean', description: 'When true, returns summary counts only. Default is false.', required: false, default: false },
			{ name: 'severity', type: 'string', description: "Minimum severity: 'error', 'warning', 'info', or 'hidden'. Default is 'warning'.", required: false, default: 'warning' },
			{ name: 'category', type: 'string', description: "Optional category filter (e.g., 'Compiler', 'Style').", required: false, placeholder: 'Compiler' },
			{ name: 'idPrefix', type: 'string', description: "Optional diagnostic ID prefix filter (e.g., 'CS', 'CA', 'IDE').", required: false, placeholder: 'CS' },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'severity', 'filePath', 'id', 'lineNumber', 'projectName'.", required: false, placeholder: 'severity' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [
			{ description: 'Get warnings and errors (default)', params: {} },
			{ description: 'Get error diagnostics only', params: { severity: 'error' } },
			{ description: 'Summary view by project and severity', params: { summaryOnly: true, severity: 'warning' } }
		],
		responseDescription: 'Returns compiler and analyzer diagnostics, optionally with paging and filtering. Workspace load diagnostics are not included.',
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
			meta: { durationMs: 123, cancelled: false, timedOut: false, timeoutMs: 1200000 },
			error: null
		}
	},
	{
		id: 'diagnostic_hotspots',
		name: 'diagnostic_hotspots',
		displayName: 'Diagnostic Hotspots',
		description: 'Groups diagnostics into hotspots by file, project, category, or ID so you can plan cleanup before drilling into raw diagnostics.',
		category: 'diagnostics',
		parameters: [
			{ name: 'filePath', type: 'string', description: 'Optional file path filter.', required: false, placeholder: '/path/to/File.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'diagnosticSource', type: 'string', description: "Diagnostic source: 'compiler' (default), 'all', or 'analyzer'.", required: false, default: 'compiler' },
			{ name: 'severity', type: 'string', description: "Minimum severity: 'error', 'warning', 'info', or 'hidden'. Default is 'warning'.", required: false, default: 'warning' },
			{ name: 'category', type: 'string', description: "Optional category filter (e.g., 'Compiler', 'Style').", required: false, placeholder: 'Compiler' },
			{ name: 'idPrefix', type: 'string', description: "Optional diagnostic ID prefix filter (e.g., 'CS', 'CA', 'IDE').", required: false, placeholder: 'CS' },
			{ name: 'groupBy', type: 'string', description: "Primary grouping: 'file' (default), 'project', 'category', or 'id'.", required: false, default: 'file' },
			{ name: 'includeExamples', type: 'boolean', description: 'Include example diagnostics inside each hotspot group. Default is false.', required: false, default: false },
			{ name: 'maxExamplesPerGroup', type: 'number', description: 'Maximum example diagnostics to include per group when includeExamples=true. Default is 3. Use 0 for none.', required: false, default: 3 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'count' (default), 'errorCount', 'warningCount', 'infoCount', or 'key'.", required: false, placeholder: 'count' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'desc' (default) or 'asc'.", required: false, default: 'desc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 50.', required: false, default: 50 }
		],
		examples: [
			{ description: 'Group compiler diagnostics by file', params: { groupBy: 'file' } },
			{ description: 'Show analyzer hotspots with examples', params: { diagnosticSource: 'analyzer', groupBy: 'category', includeExamples: true } }
		],
		responseDescription: 'Returns grouped diagnostic hotspots with severity totals and optional example diagnostics',
		responseExample: {
			success: true,
			data: {
				groupBy: 'file',
				groupCount: 1,
				paging: { skip: 0, take: 50, returned: 1, total: 1 },
				groups: [
					{
						key: '/path/to/UserService.cs',
						totalCount: 4,
						errorCount: 1,
						warningCount: 3,
						infoCount: 0,
						examples: [
							{ id: 'CS8602', severity: 'Warning', lineNumber: 42, message: 'Dereference of a possibly null reference.' }
						]
					}
				]
			},
			error: null
		}
	},

	// Symbol discovery
	{
		id: 'resolve_symbol',
		name: 'resolve_symbol',
		displayName: 'Resolve Symbol',
		description:
			'Quick lookup: resolves a name or pattern into candidate symbols with stable symbolKeys. Use when you already know the symbol name. Lightweight alternative to search_symbols.',
		category: 'symbols',
		parameters: [
			{ name: 'query', type: 'string', description: 'Name fragment or fully qualified name.', required: true, placeholder: 'SolutionManager' },
			{ name: 'kinds', type: 'string', description: "Optional kinds filter (comma-separated): 'Type,Method,Property,Field,Event'.", required: false, placeholder: 'Type,Method' },
			{ name: 'projectName', type: 'string', description: 'Optional project name to limit scope.', required: false, placeholder: 'MyProject' },
			{ name: 'maxCandidates', type: 'number', description: 'Max candidates to return. Default is 25.', required: false, default: 25 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [
			{ description: 'Resolve an ambiguous type name', params: { query: 'SolutionManager', kinds: 'Type' } },
			{ description: 'Resolve a method name', params: { query: 'Login', kinds: 'Method' } }
		],
		responseDescription: 'Returns candidate symbols with stable symbol keys',
		responseExample: {
			success: true,
			data: {
				query: 'SolutionManager',
				candidateCount: 2,
				candidates: [
					{
						symbolKey: '...',
						fullName: 'MyApp.Services.SolutionManager',
						kind: 'Type',
						filePath: '/path/to/SolutionManager.cs',
						lineNumber: 12,
						projectName: 'MyProject'
					}
				],
				hints: { nextSteps: ['Use get_symbol_info with a candidate symbolKey for details', 'Use find_references with symbolKey to locate usages'] }
			},
			meta: { durationMs: 123, cancelled: false, timedOut: false, timeoutMs: 1200000 },
			error: null
		}
	},
	{
		id: 'search_symbols',
		name: 'search_symbols',
		displayName: 'Search Symbols',
		description:
			'Searches symbol index by name pattern (* and ? wildcards). Full-featured: namespace/accessibility filters, sorting, paging. Use for exploration or filtered/sorted results. Returns stable symbolKeys.',
		category: 'symbols',
		parameters: [
			{ name: 'query', type: 'string', description: "Search pattern. Supports '*' and '?', or plain text for substring match.", required: true, placeholder: '*Service' },
			{
				name: 'kinds',
				type: 'string',
				description: "Optional kinds filter (comma-separated): 'Type,Method,Property,Field,Event'.",
				required: false,
				placeholder: 'Type,Method'
			},
			{ name: 'namespaceFilter', type: 'string', description: "Optional namespace prefix filter (e.g., 'MyApp.Services').", required: false, placeholder: 'MyApp.Services' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{
				name: 'sourceOnly',
				type: 'boolean',
				description: 'Only search symbols with source in solution (excludes external assemblies/packages). Default is true.',
				required: false,
				default: true
			},
			{
				name: 'accessibility',
				type: 'string',
				description: "Filter by accessibility: 'Public', 'Internal', 'Private', 'Protected', 'ProtectedOrInternal', 'ProtectedAndInternal'.",
				required: false,
				placeholder: 'Public'
			},
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'name', 'kind', 'filePath', 'projectName', 'namespace'.", required: false, placeholder: 'name' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [
			{ description: 'Search for service types', params: { query: '*Service', kinds: 'Type' } },
			{ description: 'Search methods containing "Login"', params: { query: '*Login*', kinds: 'Method' } },
			{ description: 'Search public types only', params: { query: '*Manager', kinds: 'Type', accessibility: 'Public' } },
			{ description: 'Include external assemblies', params: { query: 'Task', kinds: 'Type', sourceOnly: false } }
		],
		responseDescription: 'Returns matching symbols (with paging) including stable symbol keys',
		responseExample: {
			success: true,
			data: {
				query: '*Service',
				matchCount: 2,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				matches: [
					{
						name: 'UserService',
						fullName: 'MyApp.Services.UserService',
						kind: 'Type',
						containingType: null,
						namespace: 'MyApp.Services',
						filePath: '/path/to/UserService.cs',
						lineNumber: 12,
						symbolKey: '...',
						projectName: 'MyApp',
						accessibility: 'Public'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'get_symbol_at_position',
		name: 'get_symbol_at_position',
		displayName: 'Get Symbol at Position',
		description: 'Resolves the symbol at a file position and returns a stable symbol key.',
		category: 'symbols',
		parameters: [
			{ name: 'filePath', type: 'string', description: 'Absolute file path.', required: true, placeholder: '/path/to/File.cs' },
			{ name: 'line', type: 'number', description: '1-based line number.', required: true, default: 1 },
			{ name: 'column', type: 'number', description: '1-based column number.', required: true, default: 1 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get symbol key under cursor', params: { filePath: '/Users/dev/MyProject/Program.cs', line: 10, column: 15 } }],
		responseDescription: 'Returns a symbol key and basic symbol details',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				displayName: 'MyApp.Services.UserService',
				kind: 'Type',
				containingType: null,
				filePath: '/path/to/UserService.cs',
				lineNumber: 12
			},
			error: null
		}
	},
	{
		id: 'get_symbol_info',
		name: 'get_symbol_info',
		displayName: 'Get Symbol Info',
		description: 'Gets detailed information about a symbol by its stable key (signature, docs, locations).',
		category: 'symbols',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'includeLocations', type: 'boolean', description: 'Include all definition locations. Default is true.', required: false, default: true },
			{ name: 'includeDocumentation', type: 'boolean', description: 'Include XML documentation. Default is true.', required: false, default: true },
			{
				name: 'maxDocumentationChars',
				type: 'number',
				description: 'Maximum documentation characters. Use 0 for unlimited. Default is 2000.',
				required: false,
				default: 2000
			},
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get symbol info from a symbol key', params: { symbolKey: '...' } }],
		responseDescription: 'Returns rich symbol information including signature and locations',
		responseExample: {
			success: true,
			data: {
				name: 'UserService',
				fullName: 'MyApp.Services.UserService',
				kind: 'Type',
				namespace: 'MyApp.Services',
				filePath: '/path/to/UserService.cs',
				lineNumber: 12,
				projectName: 'MyProject',
				accessibility: 'Public',
				signature: 'public class UserService',
				documentation: '...',
				locations: [{ filePath: '/path/to/UserService.cs', lineNumber: 12, column: 1, lineText: 'public class UserService', projectName: 'MyProject' }]
			},
			error: null
		}
	},
	// References & relationships
	{
		id: 'find_unused_symbols',
		name: 'find_unused_symbols',
		displayName: 'Find Unused Symbols',
		description: 'Finds likely-unused source symbols with zero non-self references. Skips generated code, overrides/interface implementations, and reflection-sensitive symbols by default.',
		category: 'references',
		parameters: [
			{ name: 'kinds', type: 'string', description: "Optional kinds filter (comma-separated): 'Type,Method,Property,Field,Event'.", required: false, placeholder: 'Method,Property' },
			{ name: 'scope', type: 'json', description: 'Optional scope used to select symbol definitions to analyze.', required: false, placeholder: '{ "mode": "solution" }' },
			{ name: 'accessibility', type: 'string', description: "Accessibility filter. Default is 'Private,Internal'.", required: false, default: 'Private,Internal' },
			{ name: 'excludeReflectionSensitive', type: 'boolean', description: 'Skip reflection- or activation-sensitive symbols. Default is true.', required: false, default: true },
			{ name: 'summaryOnly', type: 'boolean', description: 'Return grouped summaries without the paged symbol list. Default is false.', required: false, default: false },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [
			{ description: 'Find likely-unused private members', params: { accessibility: 'Private,Internal' } },
			{ description: 'Summarize unused methods in one project', params: { kinds: 'Method', scope: { mode: 'project', projectName: 'MyProject' }, summaryOnly: true } }
		],
		responseDescription: 'Returns likely-unused source symbols, optionally summarized by kind and project',
		responseExample: {
			success: true,
			data: {
				totalCount: 2,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				items: [
					{
						name: 'BuildCache',
						kind: 'Field',
						containingType: 'SolutionManager',
						symbolKey: '...',
						filePath: '/path/to/SolutionManager.cs',
						lineNumber: 18,
						accessibility: 'Private'
					}
				],
				summary: {
					byKind: [
						{ key: 'Field', count: 1 },
						{ key: 'Method', count: 1 }
					]
				}
			},
			error: null
		}
	},
	{
		id: 'find_unused_parameters',
		name: 'find_unused_parameters',
		displayName: 'Find Unused Parameters',
		description: 'Finds likely-unused parameters with zero references inside their declaring method or constructor. Skips generated code and reflection-sensitive members by default.',
		category: 'references',
		parameters: [
			{ name: 'scope', type: 'json', description: 'Optional scope used to select methods and constructors to analyze.', required: false, placeholder: '{ "mode": "solution" }' },
			{ name: 'accessibility', type: 'string', description: "Accessibility filter for the containing member. Default is 'Private,Internal'.", required: false, default: 'Private,Internal' },
			{ name: 'excludeReflectionSensitive', type: 'boolean', description: 'Skip parameters on reflection- or activation-sensitive members. Default is true.', required: false, default: true },
			{ name: 'summaryOnly', type: 'boolean', description: 'Return grouped summaries without the paged parameter list. Default is false.', required: false, default: false },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [
			{ description: 'Find likely-unused private method parameters', params: { accessibility: 'Private,Internal' } },
			{ description: 'Summarize unused parameters in one project', params: { scope: { mode: 'project', projectName: 'MyProject' }, summaryOnly: true } }
		],
		responseDescription: 'Returns likely-unused parameters, optionally summarized by containing project and member kind',
		responseExample: {
			success: true,
			data: {
				totalCount: 1,
				paging: { skip: 0, take: 200, returned: 1, total: 1 },
				items: [
					{
						parameterName: 'cancellationToken',
						containingSymbol: 'RefreshCacheAsync',
						containingType: 'CacheService',
						filePath: '/path/to/CacheService.cs',
						lineNumber: 54,
						projectName: 'MyProject'
					}
				],
				summary: {
					byProject: [{ key: 'MyProject', count: 1 }]
				}
			},
			error: null
		}
	},
	{
		id: 'find_references',
		name: 'find_references',
		displayName: 'Find References',
		description: 'Finds all references to a symbol. Requires a symbolKey (use resolve_symbol or search_symbols to get one). Supports scope/filtering/grouping/paging.',
		category: 'references',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{
				name: 'scope',
				type: 'json',
				description: 'Optional scope. Example: { "kind": "solution" } or { "kind": "project", "projectName": "MyProject" }. Set includeExternal=true where supported.',
				required: false,
				placeholder: '{ "kind": "solution" }'
			},
			{
				name: 'referenceKinds',
				type: 'string',
				description: "Optional filter (comma-separated): 'Read,Write,Invocation,TypeArgument,NameOf,Attribute'.",
				required: false,
				placeholder: 'Read,Write,Invocation'
			},
			{ name: 'includeLineText', type: 'boolean', description: 'Include lineText for each reference. Default is true.', required: false, default: true },
			{ name: 'maxLineTextChars', type: 'number', description: 'Max characters for lineText. Use 0 for unlimited. Default is 200.', required: false, default: 200 },
			{ name: 'groupBy', type: 'string', description: "Grouping: 'file', 'project', 'containingSymbol', or 'none' (default).", required: false, default: 'none' },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [{ description: 'Find references for a symbolKey', params: { symbolKey: '...' } }],
		responseDescription: 'Returns reference locations (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				referenceCount: 15,
				paging: { skip: 0, take: 200, returned: 15, total: 15 },
				references: [
					{
						filePath: '/path/to/Program.cs',
						lineNumber: 9,
						column: 35,
						lineText: 'builder.Services.AddSingleton<ISolutionManager, SolutionManager>();',
						projectName: 'MyProject',
						referenceKind: 'TypeArgument'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'find_overrides',
		name: 'find_overrides',
		displayName: 'Find Overrides',
		description: 'Finds overrides of a virtual/abstract member. Requires a symbolKey.',
		category: 'references',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'scope', type: 'json', description: 'Optional scope for overrides search.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [{ description: 'Find overrides for a member', params: { symbolKey: '...' } }],
		responseDescription: 'Returns overriding members (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				overrideCount: 2,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				overrides: [
					{
						name: 'ToString',
						fullName: 'MyApp.Models.User.ToString()',
						kind: 'Method',
						symbolKey: '...',
						filePath: '/path/to/User.cs',
						lineNumber: 42,
						projectName: 'MyProject'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'find_implementations',
		name: 'find_implementations',
		displayName: 'Find Implementations',
		description: 'Finds implementations of an interface/abstract type or member. Requires a symbolKey.',
		category: 'references',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'scope', type: 'json', description: 'Optional scope for implementation search.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 }
		],
		examples: [{ description: 'Find implementations for an interface', params: { symbolKey: '...' } }],
		responseDescription: 'Returns implementing symbols (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				implementationCount: 2,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				implementations: [
					{
						name: 'SqlRepository',
						fullName: 'MyApp.Data.SqlRepository',
						kind: 'Type',
						symbolKey: '...',
						filePath: '/path/to/SqlRepository.cs',
						lineNumber: 10,
						projectName: 'MyProject'
					}
				]
			},
			error: null
		}
	},

	// Semantic & text search
	{
		id: 'semantic_query',
		name: 'semantic_query',
		displayName: 'Semantic Query',
		description:
			'Finds symbols by semantic predicates (kinds, name patterns, modifiers, parameter/return types, and attributes). Useful for queries like “async methods without CancellationToken”.',
		category: 'semantic',
		parameters: [
			{ name: 'kinds', type: 'string', description: "Optional kinds (comma-separated): 'Type,Method,Property,Field,Event,Namespace'.", required: false, placeholder: 'Method' },
			{ name: 'namePattern', type: 'string', description: "Optional name pattern (wildcards '*' and '?' supported).", required: false, placeholder: '*Async' },
			{ name: 'modifiers', type: 'string', description: "Optional modifiers (comma-separated): 'async,static,virtual,abstract'.", required: false, placeholder: 'async' },
			{ name: 'mustHaveParameterType', type: 'string', description: 'Optional required parameter types (comma-separated). Methods only.', required: false, placeholder: 'CancellationToken' },
			{ name: 'mustNotHaveParameterType', type: 'string', description: 'Optional excluded parameter types (comma-separated). Methods only.', required: false, placeholder: 'CancellationToken' },
			{ name: 'mustHaveAttribute', type: 'string', description: 'Optional required attributes (comma-separated).', required: false, placeholder: 'Authorize' },
			{ name: 'mustNotHaveAttribute', type: 'string', description: 'Optional excluded attributes (comma-separated).', required: false, placeholder: 'Authorize' },
			{ name: 'returnType', type: 'string', description: 'Optional return type patterns (comma-separated). Methods only.', required: false, placeholder: 'Task*' },
			{ name: 'scope', type: 'json', description: 'Optional search scope.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [
			{ description: 'Find async methods missing CancellationToken', params: { kinds: 'Method', modifiers: 'async', mustNotHaveParameterType: 'CancellationToken' } }
		],
		responseDescription: 'Returns matching symbols (with paging) including symbol keys',
		responseExample: {
			success: true,
			data: {
				matchCount: 1,
				paging: { skip: 0, take: 200, returned: 1, total: 1 },
				matches: [
					{
						name: 'SaveAsync',
						fullName: 'MyApp.Data.UserRepository.SaveAsync(User user)',
						kind: 'Method',
						symbolKey: '...',
						filePath: '/path/to/UserRepository.cs',
						lineNumber: 88,
						projectName: 'MyProject'
					}
				]
			},
			error: null
		}
	},
	{
		id: 'search_text',
		name: 'search_text',
		displayName: 'Search Text',
		description: 'Searches for a literal string or regex pattern across solution documents (non-semantic).',
		category: 'semantic',
		parameters: [
			{ name: 'query', type: 'string', description: 'Search query (literal string by default). Preferred argument name.', required: false, placeholder: 'TODO' },
			{ name: 'pattern', type: 'string', description: 'Backward-compatible alias for query.', required: false, placeholder: 'TODO' },
			{ name: 'useRegex', type: 'boolean', description: 'Treat pattern as a .NET regex. Default is false.', required: false, default: false },
			{ name: 'caseSensitive', type: 'boolean', description: 'Case-sensitive match. Default is false.', required: false, default: false },
			{ name: 'scope', type: 'json', description: 'Optional search scope.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'maxLineTextChars', type: 'number', description: 'Max characters for lineText. Use 0 for unlimited. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Find TODO comments', params: { query: 'TODO' } }],
		responseDescription: 'Returns matching text occurrences (with paging)',
		responseExample: {
			success: true,
			data: {
				pattern: 'TODO',
				useRegex: false,
				caseSensitive: false,
				scopeUsed: { mode: 'solution' },
				matchCount: 2,
				projectsSearched: 2,
				totalProjectsInWorkspace: 2,
				documentsMatchedScope: 120,
				documentsSearched: 120,
				documentsWithMatches: 1,
				documentsUnreadable: 0,
				totalDocumentsInWorkspace: 120,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				matches: [
					{
						filePath: '/path/to/Program.cs',
						lineNumber: 12,
						column: 1,
						lineText: '// TODO: refactor this',
						projectName: 'MyProject'
					}
				],
				hints: {
					nextSteps: ['Use get_symbol_at_position if the match is an identifier and you want a symbolKey', 'Use search_symbols for semantic discovery once you know a symbol name'],
					scopeNote: null,
					noMatchNote: null,
					unreadableNote: null
				}
			},
			meta: { durationMs: 123, cancelled: false, timedOut: false, timeoutMs: 1200000 },
			error: null
		}
	},

	// Type hierarchy
	{
		id: 'get_type_hierarchy',
		name: 'get_type_hierarchy',
		displayName: 'Get Type Hierarchy',
		description: 'Gets base types, interfaces, and derived types for a type. Requires a symbolKey.',
		category: 'hierarchy',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'includeBaseTypes', type: 'boolean', description: 'Include base types. Default is true.', required: false, default: true },
			{ name: 'includeInterfaces', type: 'boolean', description: 'Include interfaces. Default is true.', required: false, default: true },
			{ name: 'includeDerivedTypes', type: 'boolean', description: 'Include derived types. Default is true.', required: false, default: true },
			{ name: 'scope', type: 'json', description: 'Optional scope applied to derived type search.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'derivedSkip', type: 'number', description: 'Derived type paging offset. Default is 0.', required: false, default: 0 },
			{ name: 'derivedTake', type: 'number', description: 'Derived type paging size. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get type hierarchy for a type symbolKey', params: { symbolKey: '...' } }],
		responseDescription: 'Returns base types, interfaces, and derived types (derived types support paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				baseTypes: [{ name: 'ControllerBase', fullName: 'Microsoft.AspNetCore.Mvc.ControllerBase', symbolKey: '...' }],
				interfaces: [],
				derivedPaging: { skip: 0, take: 200, returned: 1, total: 1 },
				derivedTypes: [{ name: 'UsersController', fullName: 'MyApp.Controllers.UsersController', symbolKey: '...', filePath: '/path/to/UsersController.cs', lineNumber: 5 }]
			},
			error: null
		}
	},
	{
		id: 'get_derived_types',
		name: 'get_derived_types',
		displayName: 'Get Derived Types',
		description: 'Finds derived types of a base type. Requires a symbolKey.',
		category: 'hierarchy',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'scope', type: 'json', description: 'Optional scope for derived type search.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get derived types', params: { symbolKey: '...' } }],
		responseDescription: 'Returns derived types (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				derivedCount: 1,
				paging: { skip: 0, take: 200, returned: 1, total: 1 },
				derivedTypes: [{ name: 'UsersController', fullName: 'MyApp.Controllers.UsersController', symbolKey: '...', filePath: '/path/to/UsersController.cs', lineNumber: 5 }]
			},
			error: null
		}
	},
	{
		id: 'find_member_in_hierarchy',
		name: 'find_member_in_hierarchy',
		displayName: 'Find Member in Hierarchy',
		description: "Walks a member's override chain to find the original declaration. Requires a symbolKey.",
		category: 'hierarchy',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Find original declaration for an override', params: { symbolKey: '...' } }],
		responseDescription: 'Returns the override chain and original declaration',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				chain: [
					{ name: 'ToString', fullName: 'MyApp.Models.User.ToString()', symbolKey: '...', filePath: '/path/to/User.cs', lineNumber: 42 },
					{ name: 'ToString', fullName: 'System.Object.ToString()', symbolKey: '...', filePath: null, lineNumber: null }
				],
				original: { name: 'ToString', fullName: 'System.Object.ToString()', symbolKey: '...' }
			},
			error: null
		}
	},

	// Call graph & impact
	{
		id: 'find_callers',
		name: 'find_callers',
		displayName: 'Find Callers',
		description: 'Finds methods that call a given method. Requires a symbolKey.',
		category: 'callgraph',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'scope', type: 'json', description: 'Optional scope for call site search.', required: false, placeholder: '{ "kind": "solution" }' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Find callers for a method', params: { symbolKey: '...' } }],
		responseDescription: 'Returns call sites grouped by caller (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				callerCount: 1,
				paging: { skip: 0, take: 200, returned: 1, total: 1 },
				callers: [
					{
						caller: { name: 'Login', fullName: 'MyApp.Controllers.AuthController.Login()', symbolKey: '...' },
						callSites: [{ filePath: '/path/to/AuthController.cs', lineNumber: 58, column: 12, lineText: 'await _service.LoginAsync(...);' }]
					}
				]
			},
			error: null
		}
	},
	{
		id: 'get_outgoing_calls',
		name: 'get_outgoing_calls',
		displayName: 'Get Outgoing Calls',
		description: "Finds methods called by a given method's body. Requires a symbolKey. Supports depth-limited expansion and paging.",
		category: 'callgraph',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'depth', type: 'number', description: 'Depth of expansion. Default is 1 (direct calls).', required: false, default: 1 },
			{ name: 'scope', type: 'json', description: 'Optional scope for outgoing call analysis.', required: false, placeholder: '{ "mode": "solution" }' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get outgoing calls for a method', params: { symbolKey: '...', depth: 1 } }],
		responseDescription: 'Returns outgoing calls (with paging)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				callCount: 2,
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				calls: [
					{ callee: { name: 'SaveAsync', fullName: 'MyApp.Data.UserRepository.SaveAsync(User)', symbolKey: '...' }, isExternal: false, depth: 1 }
				]
			},
			error: null
		}
	},
	{
		id: 'analyze_change_impact',
		name: 'analyze_change_impact',
		displayName: 'Analyze Change Impact',
		description: 'Summarizes impact of changing a symbol (references, callers, implementations, overrides). Requires a symbolKey.',
		category: 'callgraph',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'scope', type: 'json', description: 'Optional scope for impact search.', required: false, placeholder: '{ "mode": "solution" }' },
			{ name: 'includeCallers', type: 'boolean', description: 'Include a caller summary (methods invoking the symbol). Default is true.', required: false, default: true },
			{ name: 'includeImplementations', type: 'boolean', description: 'Include an implementation summary (for interfaces/abstract members/types). Default is true.', required: false, default: true },
			{ name: 'includeOverrides', type: 'boolean', description: 'Include an override summary (for virtual/abstract members). Default is true.', required: false, default: true },
			{ name: 'callersSkip', type: 'number', description: 'Pagination offset for callers summary. Default is 0.', required: false, default: 0 },
			{ name: 'callersTake', type: 'number', description: 'Pagination size for callers summary. Default is 50.', required: false, default: 50 },
			{ name: 'implementationsSkip', type: 'number', description: 'Pagination offset for implementations summary. Default is 0.', required: false, default: 0 },
			{ name: 'implementationsTake', type: 'number', description: 'Pagination size for implementations summary. Default is 50.', required: false, default: 50 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Summarize impact of changing a method/type', params: { symbolKey: '...', includeCallers: true } }],
		responseDescription: 'Returns an impact summary (and optionally detailed lists)',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				summary: { referenceCount: 15, callerCount: 2, implementationCount: 0, overrideCount: 0 }
			},
			error: null
		}
	},
	{
		id: 'get_cascade_impact',
		name: 'get_cascade_impact',
		displayName: 'Get Cascade Impact',
		description: 'Expands analyze_change_impact transitively to show callers, implementations, and overrides up to a requested depth. Use it for bounded refactor planning before changing a symbol.',
		category: 'callgraph',
		parameters: [
			{
				name: 'symbolKey',
				type: 'string',
				description: 'Opaque symbolKey from search_symbols, resolve_symbol, get_symbol_at_position, or any tool that returns symbolKey. Not a name.',
				required: true,
				placeholder: '...'
			},
			{ name: 'depth', type: 'number', description: 'Depth of transitive expansion. Depth 1 returns only direct impact items. Default is 2.', required: false, default: 2 },
			{ name: 'scope', type: 'json', description: 'Optional scope for transitive impact analysis.', required: false, placeholder: '{ "mode": "solution" }' },
			{ name: 'includeCallers', type: 'boolean', description: 'Include callers while building the cascade. Default is true.', required: false, default: true },
			{ name: 'includeImplementations', type: 'boolean', description: 'Include implementations while building the cascade. Default is true.', required: false, default: true },
			{ name: 'includeOverrides', type: 'boolean', description: 'Include overrides while building the cascade. Default is true.', required: false, default: true },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'skip', type: 'number', description: 'Pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'maxExpansionSymbols', type: 'number', description: 'Maximum impacted symbols to expand before returning partial results. Default is 250.', required: false, default: 250 }
		],
		examples: [
			{ description: 'Expand direct and transitive impact', params: { symbolKey: '...', depth: 2 } },
			{ description: 'Focus on callers only', params: { symbolKey: '...', depth: 3, includeImplementations: false, includeOverrides: false } }
		],
		responseDescription: 'Returns depth-based impact summaries plus a paged impacted-symbol list',
		responseExample: {
			success: true,
			data: {
				symbolKey: '...',
				depth: 2,
				summaryByDepth: [
					{ depth: 1, impactedSymbols: 5 },
					{ depth: 2, impactedSymbols: 11 }
				],
				paging: { skip: 0, take: 200, returned: 2, total: 2 },
				impactedSymbols: [
					{
						name: 'Login',
						kind: 'Method',
						fullName: 'MyApp.Controllers.AuthController.Login()',
						symbolKey: '...',
						depth: 1,
						projectName: 'MyApp'
					}
				],
				partial: false
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
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' }
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
		id: 'get_type_source',
		name: 'get_type_source',
		displayName: 'Get Type Source',
		description: 'Gets source code for a type (bounded by max lines).',
		category: 'analysis',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Type name (simple or fully qualified).', required: true, placeholder: 'UserService' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'maxLines', type: 'number', description: 'Max lines to return. Use 0 for unlimited. Default is 200.', required: false, default: 200 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get type source', params: { typeName: 'UserService' } }],
		responseDescription: 'Returns type source (possibly truncated)',
		responseExample: {
			success: true,
			data: {
				typeName: 'UserService',
				fullName: 'MyApp.Services.UserService',
				kind: 'Class',
				filePath: '/path/to/UserService.cs',
				startLine: 1,
				endLine: 120,
				lineCount: 120,
				truncated: true,
				source: '...'
			},
			error: null
		}
	},
	{
		id: 'get_method_signature',
		name: 'get_method_signature',
		displayName: 'Get Method Signature',
		description:
			'Gets detailed information about a method signature (parameters, return type, docs, and location). Supports fully qualified method names when containingTypeName is omitted.',
		category: 'analysis',
		parameters: [
			{
				name: 'methodName',
				type: 'string',
				description: "Method name to analyze. If containingTypeName is omitted, you can pass a fully qualified name like 'Namespace.Type.Method'.",
				required: true,
				placeholder: 'GetUserById'
			},
			{ name: 'containingTypeName', type: 'string', description: 'Optional containing type name filter.', required: false, placeholder: 'UserService' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' }
		],
		examples: [
			{ description: 'Get method signature', params: { methodName: 'GetUserById' } },
			{ description: 'Get signature with fully qualified name', params: { methodName: 'MyApp.Services.UserService.GetUserById' } }
		],
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
		id: 'get_method_source',
		name: 'get_method_source',
		displayName: 'Get Method Source',
		description: 'Gets source code for a method (bounded by max lines).',
		category: 'analysis',
		parameters: [
			{ name: 'methodName', type: 'string', description: 'Method name.', required: true, placeholder: 'LoadSolutionAsync' },
			{ name: 'containingTypeName', type: 'string', description: 'Optional containing type name filter.', required: false, placeholder: 'SolutionManager' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'maxLines', type: 'number', description: 'Max lines to return. Use 0 for unlimited. Default is 120.', required: false, default: 120 },
			{ name: 'bodyOnly', type: 'boolean', description: 'If true, return only the method body (no signature). Default is false.', required: false, default: false },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Get method source', params: { methodName: 'LoadSolutionAsync', containingTypeName: 'SolutionManager' } }],
		responseDescription: 'Returns method source (possibly truncated)',
		responseExample: {
			success: true,
			data: {
				methodName: 'LoadSolutionAsync',
				containingType: 'SolutionManager',
				filePath: '/path/to/SolutionManager.cs',
				startLine: 50,
				endLine: 80,
				lineCount: 31,
				truncated: false,
				source: '...'
			},
			error: null
		}
	},
	{
		id: 'get_type_dependencies',
		name: 'get_type_dependencies',
		displayName: 'Get Type Dependencies',
		description: 'Analyzes type dependencies (uses / used_by).',
		category: 'architecture',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Type name to analyze.', required: true, placeholder: 'SolutionManager' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'direction', type: 'string', description: "Direction: 'uses', 'used_by', or 'both' (default).", required: false, default: 'both' }
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
		category: 'architecture',
		parameters: [
			{ name: 'typeName', type: 'string', description: 'Optional type name filter.', required: false, placeholder: 'SolutionManager' },
			{ name: 'filePath', type: 'string', description: 'Optional file path filter.', required: false, placeholder: '/path/to/SolutionManager.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'minCyclomaticComplexity', type: 'number', description: 'Only include methods with cyclomatic complexity >= this value. Default is 0.', required: false, default: 0 },
			{ name: 'sortBy', type: 'string', description: "Optional sort: 'complexity', 'averageComplexity', 'linesOfCode', 'methodCount', 'name'.", required: false, placeholder: 'complexity' },
			{ name: 'sortOrder', type: 'string', description: "Sort order: 'asc' (default) or 'desc'.", required: false, default: 'asc' },
			{ name: 'skip', type: 'number', description: 'Pagination offset over returned types. Default is 0.', required: false, default: 0 },
			{ name: 'take', type: 'number', description: 'Pagination size over returned types. Default is 50.', required: false, default: 50 }
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
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns a preview diff.', required: false, default: true }
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
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns a preview diff.', required: false, default: true }
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
			{ name: 'maxReferenceUpdates', type: 'number', description: 'Maximum reference updates when rewriting call sites. Use 0 to disable. Default is 2000.', required: false, default: 2000 }
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
	{
		id: 'organize_usings',
		name: 'organize_usings',
		displayName: 'Organize Usings',
		description: 'Organizes using directives in a C# file (sort + remove unused) and returns diff output.',
		category: 'codefix',
		parameters: [
			{ name: 'filePath', type: 'string', description: 'File path to organize.', required: true, placeholder: '/path/to/File.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns preview only.', required: false, default: true },
			{ name: 'includeDiff', type: 'boolean', description: 'Include unified diff in response. Default is true.', required: false, default: true },
			{ name: 'maxDiffChars', type: 'number', description: 'Max diff characters. Use 0 for unlimited. Default is 50000.', required: false, default: 50000 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Preview organize usings', params: { filePath: '/Users/dev/MyProject/Program.cs', applyChanges: false } }],
		responseDescription: 'Returns diff output for the formatting operation',
		responseExample: {
			success: true,
			data: {
				filePath: '/path/to/File.cs',
				changed: true,
				applied: false,
				filesChanged: 1,
				unifiedDiff: '...',
				changedFiles: [{ filePath: '/path/to/File.cs', changeCount: 1, diff: '...' }]
			},
			error: null
		}
	},
	{
		id: 'format_document',
		name: 'format_document',
		displayName: 'Format Document',
		description: "Formats a C# document according to the project's formatting rules and returns diff output.",
		category: 'codefix',
		parameters: [
			{ name: 'filePath', type: 'string', description: 'File path to format.', required: true, placeholder: '/path/to/File.cs' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'applyChanges', type: 'boolean', description: 'If true (default), applies changes to disk. If false, returns preview only.', required: false, default: true },
			{ name: 'includeDiff', type: 'boolean', description: 'Include unified diff in response. Default is true.', required: false, default: true },
			{ name: 'maxDiffChars', type: 'number', description: 'Max diff characters. Use 0 for unlimited. Default is 50000.', required: false, default: 50000 },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [{ description: 'Preview formatting a file', params: { filePath: '/Users/dev/MyProject/Program.cs', applyChanges: false } }],
		responseDescription: 'Returns diff output for the formatting operation',
		responseExample: {
			success: true,
			data: {
				filePath: '/path/to/File.cs',
				changed: true,
				applied: false,
				filesChanged: 1,
				unifiedDiff: '...',
				changedFiles: [{ filePath: '/path/to/File.cs', changeCount: 1, diff: '...' }]
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
			{ name: 'maxLines', type: 'number', description: 'Maximum number of source lines to return. Use 0 for no limit. Default is 400.', required: false, default: 400 }
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
	{
		id: 'find_external_dependency_usages',
		name: 'find_external_dependency_usages',
		displayName: 'Find External Dependency Usages',
		description: 'Finds source usages of symbols that come from a referenced external assembly, keyed by assembly name or full metadata reference identity.',
		category: 'external',
		parameters: [
			{ name: 'assemblyName', type: 'string', description: 'Optional simple assembly name to analyze. Provide this or referenceIdentity.', required: false, placeholder: 'System.Text.Json' },
			{ name: 'referenceIdentity', type: 'string', description: 'Optional full metadata reference identity. Provide this or assemblyName.', required: false, placeholder: 'System.Text.Json, Version=9.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'symbolsSkip', type: 'number', description: 'Symbol-summary pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'symbolsTake', type: 'number', description: 'Symbol-summary pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'filesSkip', type: 'number', description: 'File-summary pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'filesTake', type: 'number', description: 'File-summary pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'maxExampleLocations', type: 'number', description: 'Maximum sample locations or symbols to include per summary item. Default is 5. Use 0 to omit examples.', required: false, default: 5 }
		],
		examples: [
			{ description: 'Analyze usages by assembly name', params: { assemblyName: 'System.Text.Json' } },
			{ description: 'Analyze usages by full metadata identity', params: { referenceIdentity: 'System.Text.Json, Version=9.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' } }
		],
		responseDescription: 'Returns project, file, and symbol summaries for a referenced external assembly',
		responseExample: {
			success: true,
			data: {
				assemblyName: 'System.Text.Json',
				projectSummaryCount: 1,
				fileSummaryCount: 2,
				symbolSummaryCount: 3,
				projects: [{ projectName: 'MyApp', usageCount: 6 }],
				files: [{ filePath: '/path/to/JsonService.cs', usageCount: 4 }],
				symbols: [
					{
						symbolName: 'JsonSerializer.Serialize',
						usageCount: 3,
						exampleLocations: [{ filePath: '/path/to/JsonService.cs', lineNumber: 27 }]
					}
				]
			},
			error: null
		}
	},
	{
		id: 'find_package_usages',
		name: 'find_package_usages',
		displayName: 'Find Package Usages',
		description: 'Maps a NuGet package to compile assemblies and metadata reference identities, then summarizes semantic source usages of that package.',
		category: 'external',
		parameters: [
			{ name: 'packageId', type: 'string', description: 'NuGet package ID to analyze.', required: true, placeholder: 'System.Text.Json' },
			{ name: 'packageVersion', type: 'string', description: 'Optional package version. Useful when multiple versions are restored.', required: false, placeholder: '9.0.0' },
			{ name: 'projectName', type: 'string', description: 'Optional project name filter.', required: false, placeholder: 'MyProject' },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' },
			{ name: 'symbolsSkip', type: 'number', description: 'Symbol-summary pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'symbolsTake', type: 'number', description: 'Symbol-summary pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'filesSkip', type: 'number', description: 'File-summary pagination offset. Default is 0.', required: false, default: 0 },
			{ name: 'filesTake', type: 'number', description: 'File-summary pagination size. Default is 200.', required: false, default: 200 },
			{ name: 'maxExampleLocations', type: 'number', description: 'Maximum sample locations or symbols to include per summary item. Default is 5. Use 0 to omit examples.', required: false, default: 5 }
		],
		examples: [
			{ description: 'Analyze usages for one package', params: { packageId: 'System.Text.Json' } },
			{ description: 'Disambiguate between restored versions', params: { packageId: 'Newtonsoft.Json', packageVersion: '13.0.3' } }
		],
		responseDescription: 'Returns package-to-assembly mapping plus project, file, and symbol usage summaries',
		responseExample: {
			success: true,
			data: {
				packageId: 'System.Text.Json',
				packageVersion: '9.0.0',
				mappedAssemblies: [
					{
						assemblyName: 'System.Text.Json',
						referenceIdentity: 'System.Text.Json, Version=9.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51'
					}
				],
				projectSummaryCount: 1,
				fileSummaryCount: 2,
				symbolSummaryCount: 3,
				files: [{ filePath: '/path/to/JsonService.cs', usageCount: 4 }],
				symbols: [{ symbolName: 'JsonSerializer.Serialize', usageCount: 3 }]
			},
			error: null
		}
	},
	{
		id: 'get_project_graph',
		name: 'get_project_graph',
		displayName: 'Get Project Graph',
		description: 'Analyzes the loaded workspace at the project-reference level. Returns direct edges, roots/leaves, transitive reachability, and cycle groups for architecture review.',
		category: 'architecture',
		parameters: [
			{ name: 'projectName', type: 'string', description: 'Optional project name to focus reachability details.', required: false, placeholder: 'MyProject.Web' },
			{ name: 'includeTransitive', type: 'boolean', description: 'Include transitive dependency/dependent counts and focused reachability lists. Default is true.', required: false, default: true },
			{ name: 'includeCycles', type: 'boolean', description: 'Include detected cycle groups. Default is true.', required: false, default: true },
			{ name: 'includeEdges', type: 'boolean', description: 'Include the explicit direct edge list. Default is true.', required: false, default: true },
			{ name: 'pathStyle', type: 'string', description: "Path style: 'absolute' (default) or 'relative' (to solution root).", required: false, default: 'absolute' }
		],
		examples: [
			{ description: 'Inspect the full project graph', params: {} },
			{ description: 'Focus on one project', params: { projectName: 'MyProject.Web' } }
		],
		responseDescription: 'Returns project nodes, direct edges, roots/leaves, cycles, and optional focused reachability data',
		responseExample: {
			success: true,
			data: {
				projectCount: 3,
				edgeCount: 2,
				roots: ['MyProject.Web'],
				leaves: ['MyProject.Data'],
				edges: [
					{ fromProject: 'MyProject.Web', toProject: 'MyProject.Core' },
					{ fromProject: 'MyProject.Core', toProject: 'MyProject.Data' }
				],
				cycleGroups: [],
				focus: {
					projectName: 'MyProject.Web',
					transitiveDependencies: ['MyProject.Core', 'MyProject.Data'],
					transitiveDependents: []
				}
			},
			error: null
		}
	},
	{
		id: 'find_unused_project_references',
		name: 'find_unused_project_references',
		displayName: 'Find Unused Project References',
		description: 'Tests each direct ProjectReference by removing it in memory and checking whether new compiler errors appear in the referencing project. Use it for compile-backed project cleanup planning.',
		category: 'architecture',
		parameters: [
			{ name: 'projectName', type: 'string', description: 'Optional project name to limit analysis to one referencing project.', required: false, placeholder: 'MyProject.Web' },
			{ name: 'maxEvidenceDiagnostics', type: 'number', description: 'Maximum compiler diagnostics to include as evidence for a used reference. Default is 5. Use 0 to omit samples.', required: false, default: 5 }
		],
		examples: [
			{ description: 'Analyze all direct project references', params: {} },
			{ description: 'Analyze one project with no evidence samples', params: { projectName: 'MyProject.Web', maxEvidenceDiagnostics: 0 } }
		],
		responseDescription: 'Returns direct project references that appear removable, plus evidence when a reference is still required',
		responseExample: {
			success: true,
			data: {
				projectCountAnalyzed: 1,
				totalReferencesAnalyzed: 3,
				unusedReferenceCount: 1,
				items: [
					{
						projectName: 'MyProject.Web',
						referenceProjectName: 'MyProject.Legacy',
						referencePath: '../MyProject.Legacy/MyProject.Legacy.csproj',
						canRemove: true,
						evidenceDiagnostics: []
					}
				]
			},
			error: null
		}
	},

	// Batch
	{
		id: 'batch',
		name: 'batch',
		displayName: 'Batch',
		description: 'Runs multiple tool operations sequentially in one request.',
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
			}
		],
		examples: [
			{
				description: 'Run multiple operations',
				params: {
					operations:
						`[\n  { "tool": "resolve_symbol", "arguments": { "query": "ISolutionManager", "kinds": "Type" } },\n  { "tool": "find_references", "arguments": { "symbolKey": "...", "groupBy": "project" } }\n]`
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
					{ tool: 'search_symbols', result: { success: true, data: { matchCount: 3 }, error: null } }
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

	// Special-case: search_text accepts query or pattern (alias). Require at least one.
	if (tool.id === 'search_text') {
		const query = normalizedParams.query;
		const pattern = normalizedParams.pattern;
		const hasQuery = !(query === undefined || query === null || query === '');
		const hasPattern = !(pattern === undefined || pattern === null || pattern === '');
		if (!hasQuery && !hasPattern) {
			errors.push('query or pattern is required');
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
