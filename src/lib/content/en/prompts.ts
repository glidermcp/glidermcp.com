import type { PromptsContent } from '../types';

export const prompts: PromptsContent = {
	title: 'Prompt Examples',
	intro: 'Effective prompts for working with Glider MCP.',
	groups: [
		{
			title: 'Loading Solutions',
			description: 'Start by loading your .NET solution or project.',
			prompts: [
				'Load the solution at /path/to/MySolution.sln',
				'Load the project at /path/to/MyProject.csproj'
			]
		},
		{
			title: 'Finding Types',
			description: 'Search for types using patterns and wildcards.',
			prompts: [
				'Find all types matching *Service',
				'Find types that start with I (interfaces)',
				'Find all types in the DataLayer project'
			]
		},
		{
			title: 'Exploring Code',
			description: 'Navigate and understand your codebase.',
			prompts: [
				'Show me the type hierarchy for UserService',
				'What methods does IAuthService define?',
				'Find all usages of the Login method',
				'Find all implementations of IRepository'
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
			title: 'Complex Analysis',
			description: 'Multi-step analysis workflows.',
			prompts: [
				'I need to understand how authentication works. Find the IAuthService interface, list its methods, and show where Login is called.',
				'Find all classes that implement IRepository and show their public methods.',
				'Show me the dependency chain from UserController to the database layer.'
			]
		}
	]
};
