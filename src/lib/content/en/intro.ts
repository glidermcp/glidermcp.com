import type { IntroContent } from '../types';

export const intro: IntroContent = {
	title: 'Glider MCP',
	tagline: 'Roslyn-powered C# code analysis for AI assistants',
	paragraphs: [
		'Tired of watching your coding agent fumble through C# code? Grepping file after file, missing obvious connections, bloating context with irrelevant code, and unable to peek inside third-party libraries to understand how to use them?',
		'Glider is an MCP (Model Context Protocol) server that gives AI assistants deep semantic understanding of C# codebases. Built on Roslyn, it now provides 43 tools for code navigation, diagnostics, dependency cleanup, refactoring, and architecture analysis.'
	],
	featuresTitle: 'Key Features',
	features: [
		'Load and analyze .NET solutions and projects with optional automatic file watching',
		'Get compiler and analyzer diagnostics, plus grouped hotspot summaries',
		'Resolve and search symbols and get stable keys for precise follow-up tool calls',
		'Find references, overrides, implementations, unused symbols, and unused parameters',
		'Semantic symbol queries plus literal/regex text search',
		'Navigate type hierarchies, call graphs, direct impact, and cascade impact',
		'Get detailed type and method information',
		'Inspect external assemblies and NuGet package usage before cleanup work',
		'Review project graphs and identify likely-unused direct project references',
		'Apply semantic rename and move refactorings with preview diffs',
		'Use deterministic formatting and preview-first file writes',
		'Get bounded source for types, methods, and external definitions',
		'Batch multiple tool calls for faster workflows',
		'Works with any MCP-compatible AI client'
	],
	quickInstallTitle: 'Quick Install',
	quickInstallPrerequisite: 'Prerequisite: Glider currently requires .NET 10 SDK to be installed.',
	quickInstall: {
		code: 'dotnet tool install --global glider',
		language: 'bash'
	},
	hint: 'Navigate to <strong>Quick Start</strong> for full setup instructions.'
};
