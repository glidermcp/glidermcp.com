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
			question: 'Why use Glider instead of grep, LSP, or relying on the LLM alone?',
			answer: [
				'<strong>LLM alone:</strong> Without tooling, LLMs hallucinate symbol names, miss cross-file relationships, and cannot verify that code compiles. They work from stale training data and lack visibility into your actual codebase.',
				'<strong>Grep/ripgrep:</strong> Text search cannot distinguish between a class named <code>Foo</code> and a variable named <code>Foo</code>. Glider provides <strong>semantic</strong> understanding — it knows that <code>IService</code> in one file refers to the same interface as in another, and can find implementations, usages, and perform safe renames.',
				'<strong>LSP:</strong> Language servers provide editor features (autocomplete, go-to-definition) but were not designed for AI workflows. Glider offers <strong>stable symbol keys</strong> for precise multi-step operations, <strong>batch operations</strong> to reduce round-trips, <strong>impact analysis</strong> and call graphs, <strong>safe refactoring</strong> with preview diffs, <strong>semantic queries</strong> (e.g., find async methods without CancellationToken), and <strong>external source viewing</strong> for NuGet packages.'
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
				'Yes. Run <code>glider --transport http</code> to start a Streamable HTTP MCP server (default: <code>http://localhost:5001/mcp</code>). This is useful for clients like Codex that connect over HTTP.'
			]
		},
		{
			question: 'How does automatic file watching work?',
			answer: [
				'When you load a solution or project with the <code>workingDirectory</code> parameter, Glider watches that directory for file changes and automatically syncs them into the in-memory workspace. This is faster than reloading the entire solution.',
				'If you prefer manual control, simply use <code>load</code> without <code>workingDirectory</code> and call <code>sync</code> or <code>reload</code> when needed.'
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
