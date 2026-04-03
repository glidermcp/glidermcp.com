import type { QuickStartContent } from '../types';

export const quickStart: QuickStartContent = {
	title: 'Quick Start',
	intro: 'Get Glider MCP running in minutes.',
	sections: [
		{
			title: 'Prerequisites',
			list: ['.NET 10 SDK', 'An MCP-compatible AI client (Claude Code, Cursor, etc.)'],
			paragraphs: [
				'Run <code>dotnet --version</code> before installing Glider. If <code>dotnet</code> is missing or the installed SDK is below 10, install the <strong>.NET 10 SDK</strong> first.',
				'Windows: <code>winget install -e --id Microsoft.DotNet.SDK.10</code>. macOS/Linux: use the official <a href="https://dotnet.microsoft.com/download/dotnet/10.0" target="_blank" rel="noreferrer">Microsoft .NET 10 installation guide</a>.'
			]
		},
		{
			title: '1. Install Glider',
			code: {
				code: 'dotnet tool install --global glider',
				language: 'bash'
			}
		},
		{
			title: '2. Verify Installation',
			code: {
				code: `# List installed tools
dotnet tool list -g

# The tool path should be in your PATH
# macOS/Linux: ~/.dotnet/tools
# Windows: %USERPROFILE%\\.dotnet\\tools`,
				language: 'bash'
			}
		},
		{
			title: '3. Configure Your AI Client',
			paragraphs: ['See the <strong>Installation</strong> section for client-specific instructions.']
		},
		{
			title: '4. Start Using',
			paragraphs: ['Once configured, you can ask your AI assistant:'],
			code: {
				code: `"Load the solution at /path/to/MySolution.sln"
"Load the solution at /path/to/MySolution.slnx"
"Load the solution at /path/to/MySolution.sln with file watching in /path/to/workspace"
"Use search_symbols with query *Service and kinds Type to find all service classes"
"What methods does IUserRepository define?"
"Resolve the Login method and then find_references for the selected symbolKey"
"I changed some files on disk. Sync the documents to see the latest changes."`,
				language: 'plaintext'
			}
		},
		{
			title: 'Notes',
			paragraphs: [
				'In stdio mode, <code>glider</code> waits for MCP input and is intentionally quiet by default. Use <code>glider --verbose</code> if you want startup output/logs (written to stderr).',
				'Async tools use a 20 minute server-side default timeout. Increase it with <code>glider --default-timeout 30m</code>, or use <code>0</code> to disable it. Supported units: <code>ms</code>, <code>s</code>, and <code>m</code>.'
			]
		},
		{
			title: 'Update to Latest',
			code: {
				code: 'dotnet tool update --global glider',
				language: 'bash'
			}
		}
	]
};
