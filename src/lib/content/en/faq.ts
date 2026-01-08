import type { FaqContent } from '../types';

export const faq: FaqContent = {
	title: 'Frequently Asked Questions',
	items: [
		{
			question: 'What is Glider MCP?',
			answer: [
				"Glider is a Model Context Protocol (MCP) server that uses Microsoft's Roslyn compiler platform to provide semantic understanding of C# codebases to AI assistants. Unlike grep-based search, Glider understands code structure, types, and relationships."
			]
		},
		{
			question: 'Which AI assistants work with Glider?',
			answer: [
				'Any MCP-compatible client: Claude Code, Cursor, GitHub Copilot, Codex CLI, Gemini CLI, and more. If your AI tool supports MCP, it can use Glider.'
			]
		},
		{
			question: 'Does it support .NET Framework?',
			answer: [
				'Yes! Glider works with .NET Framework, .NET Core, .NET 5/6/7/8/9/10+ solutions. Roslyn can analyze any C# code that compiles.'
			]
		},
		{
			question: 'How does it differ from grep/ripgrep?',
			answer: [
				'Glider provides <strong>semantic</strong> understanding. It knows that <code>IService</code> in one file refers to the same interface as in another. It can find implementations, usages, and perform safe renames that grep cannot.'
			]
		},
		{
			question: 'Why do versions expire?',
			answer: [
				'Each version expires 1 month after release to ensure users stay on recent versions with the latest fixes. Simply run <code>dotnet tool update --global glider</code> to get the latest version.'
			]
		},
		{
			question: 'Can I use HTTP transport?',
			answer: [
				'Yes! Run <code>glider --transport http</code> to start an HTTP server on port 5001. This is useful for clients like Codex that require HTTP connections.'
			]
		},
		{
			question: 'How do I view NuGet package source code?',
			answer: [
				'Use the <code>view_external_definition</code> tool. It first tries SourceLink to get original source, then falls back to ILSpy decompilation if SourceLink is unavailable.'
			]
		}
	]
};
