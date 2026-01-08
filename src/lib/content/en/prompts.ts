import type { PromptsContent } from '../types';

export const prompts: PromptsContent = {
	title: 'Prompt Examples',
	intro: 'Effective prompts for working with Glider MCP.',
	groups: [
		{
			title: 'Load a Solution',
			description: 'Start by loading your C# solution.',
			prompts: ['Load the C# solution at /path/to/YourProject.sln']
		},
		{
			title: 'Find Symbol References',
			description: 'Locate where a symbol is used across the solution.',
			prompts: ['Find all usages of the ISolutionManager interface']
		},
		{
			title: 'Analyze a Type',
			description: 'Inspect a class or interface in detail.',
			prompts: ['Get detailed information about the SolutionManager class']
		},
		{
			title: 'Find Implementations',
			description: 'List concrete implementations of an interface.',
			prompts: ['Find all implementations of the ISymbolFinderService interface']
		},
		{
			title: 'Search for Types',
			description: 'Search by name pattern with wildcards.',
			prompts: ['Find all types that end with "Manager" in the solution']
		},
		{
			title: 'Get Method Details',
			description: 'Fetch the signature for a specific method.',
			prompts: ['Get the signature for the LoadSolutionAsync method in the ISolutionManager interface']
		},
		{
			title: 'Complex Analysis',
			description: 'Multi-step analysis workflows.',
			prompts: [
				'I need to understand how the solution loading works. Can you:\n1. Find the ISolutionManager interface\n2. Find all its implementations\n3. Show me the LoadSolutionAsync method signature\n4. Find where LoadSolutionAsync is being called'
			]
		},
		{
			title: 'Use Tools Directly',
			description: 'Be explicit about the tool you want to run.',
			prompts: [
				'Use the load_solution tool to load /Users/yourname/projects/MyApp/MyApp.sln',
				'Use the find_types tool with pattern "*Service" to find all service classes',
				'Use the get_type_info tool to analyze the UserController class'
			]
		}
	]
};
