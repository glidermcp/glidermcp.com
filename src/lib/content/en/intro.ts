import type { IntroContent } from '../types';

export const intro: IntroContent = {
	title: 'Glider MCP',
	tagline: 'Roslyn-powered C# code analysis for AI assistants',
	paragraphs: [
		'Glider is an MCP (Model Context Protocol) server that gives AI assistants deep semantic understanding of C# codebases. Built on Roslyn, it provides 35 tools for code navigation, analysis, refactoring, and diagnostics.'
	],
	featuresTitle: 'Key Features',
	features: [
		'Load and analyze .NET solutions and projects with optional automatic file watching',
		'Get compiler and analyzer diagnostics',
		'Resolve and search symbols and get stable keys for precise follow-up tool calls',
		'Find references, overrides, and implementations by exact symbol key',
		'Semantic symbol queries plus literal/regex text search',
		'Navigate type hierarchies and call graphs, and analyze change impact',
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
