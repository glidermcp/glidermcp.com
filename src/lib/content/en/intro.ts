import type { IntroContent } from '../types';

export const intro: IntroContent = {
	title: 'Glider MCP',
	tagline: 'Roslyn-powered C# code analysis for AI assistants',
	paragraphs: [
		'Glider is an MCP (Model Context Protocol) server that gives AI assistants deep semantic understanding of C# codebases. Built on Roslyn, it provides 28 tools for code navigation, analysis, refactoring, and diagnostics.'
	],
	featuresTitle: 'Key Features',
	features: [
		'Load and analyze .NET solutions and projects',
		'Get compiler diagnostics (errors, warnings, info)',
		'Find types, implementations, and usages (wildcards supported)',		
		'Search symbols and get stable keys for follow-up tool calls',
		'Get detailed type and method information',
		'Semantic rename across entire solutions',
		'Move types and members between files',
		'Apply code fixes and deterministic formatting with preview diffs',
		'Get bounded source for types and methods',
		'View source of NuGet/framework types',
		'Batch multiple tool calls for faster workflows',
		'Works with any MCP-compatible AI client'
	],
	quickInstallTitle: 'Quick Install',
	quickInstall: {
		code: 'dotnet tool install --global glider',
		language: 'bash'
	},
	hint: 'Navigate to <strong>Quick Start</strong> for full setup instructions.'
};
