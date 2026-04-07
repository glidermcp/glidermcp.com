import type { PromptsContent } from '../types';

export const prompts: PromptsContent = {
	title: 'Prompt Examples',
	intro: 'Effective prompts for working with Glider MCP.',
	groups: [
		{
			title: 'Loading Solutions',
			description: 'Start by loading your .NET solution or project. Enable file watching for automatic sync.',
			prompts: [
				'Load the solution at /path/to/MySolution.sln',
				'Load the solution at /path/to/MySolution.slnx',
				'Load /path/to/MySolution.sln and watch /path/to/workspace for changes',
				'Load the project at /path/to/MyProject.csproj'
			]
		},
		{
			title: 'File Watching & Sync',
			description: 'Keep your workspace synchronized automatically or manually.',
			prompts: [
				'Load this solution with file watching enabled',
				'The files changed on disk, sync them please',
				'Reload the entire solution from disk'
			]
		},
		{
			title: 'Symbol Discovery',
			description: 'Resolve ambiguous names, search with wildcards, and get stable symbol keys for follow-up calls.',
			prompts: [
				'Use search_symbols with query "*Service" and kinds "Type" to find all service classes',
				'Use search_symbols with query "I*" and kinds "Type" to find interfaces',
				'Resolve "UserController" and show me the top candidates with their symbolKey values'
			]
		},
		{
			title: 'Exploring Code',
			description: 'Navigate and understand your codebase with references, hierarchies, and call graphs.',
			prompts: [
				'Find the symbolKey for UserService, then show me its type hierarchy',
				'What methods does IAuthService define?',
				'Resolve the Login method, then find its callers',
				'Resolve IRepository, then find its implementations'
			]
		},
		{
			title: 'Getting Details',
			description: 'Get detailed information about specific symbols.',
			prompts: [
				'Get detailed info about the UserController class',
				'What is the signature of GetUserById method?',
				'Show me the source of JsonSerializer from System.Text.Json'
			]
		},
		{
			title: 'Refactoring',
			description: 'Perform semantic refactoring operations.',
			prompts: [
				'Rename the OldClassName to NewClassName',
				'Move the Helper class to the Utils namespace',
				'Move the ProcessData method from OldClass to NewClass',
				'Preview renaming UserService to UserManager without applying'
			]
		},
		{
			title: 'Diagnostics & Cleanup',
			description: 'Group problems, find dead code, and plan dependency cleanup before editing.',
			prompts: [
				'Load /path/to/MySolution.sln, run diagnostic_hotspots, and show the worst compiler hotspot grouped by file',
				'Find likely-unused private symbols and unused parameters in this project, then summarize the safest cleanup candidates',
				'Show me the project graph and flag direct project references that can likely be removed',
				'Find package usages for System.Text.Json and summarize the impacted files and symbols'
			]
		},
		{
			title: 'Complex Analysis',
			description: 'Multi-step analysis workflows.',
			prompts: [
				'I need to understand how authentication works. Find the IAuthService interface, list its methods, and show where Login is called.',
				'Resolve IRepository, then find_implementations with its symbolKey and show public methods.',
				'Before renaming IRepository, analyze_change_impact and then get_cascade_impact for the selected symbol.',
				'Show me the dependency chain from UserController to the database layer.',
				'Run a batch: search_symbols for "*UserController*" (Type), then get_type_info for the best match, then summarize.'
			]
		}
	]
};
