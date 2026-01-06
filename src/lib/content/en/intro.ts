import type { IntroContent } from '../types';

export const intro: IntroContent = {
	title: 'Glider MCP',
	tagline: 'Roslyn-powered C# code analysis for AI assistants',
	paragraphs: [
		'Glider is an MCP (Model Context Protocol) server that gives AI assistants deep semantic understanding of C# codebases. Built on Roslyn, it provides 12 powerful tools for code navigation, analysis, and refactoring.'
	],
	featuresTitle: 'Key Features',
	features: [
		'Load and analyze .NET solutions and projects',
		'Find type definitions, implementations, and usages',
		'Get detailed type and method information',
		'Semantic rename across entire solutions',
		'Move types and members between files',
		'View source of NuGet/framework types',
		'Works with any MCP-compatible AI client'
	],
	quickInstallTitle: 'Quick Install',
	quickInstall: {
		code: 'dotnet tool install --global glider',
		language: 'bash'
	},
	hint: 'Navigate to <strong>Quick Start</strong> for full setup instructions.'
};
