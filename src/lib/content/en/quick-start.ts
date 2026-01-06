import type { QuickStartContent } from '../types';

export const quickStart: QuickStartContent = {
	title: 'Quick Start',
	intro: 'Get Glider MCP running in minutes.',
	sections: [
		{
			title: 'Prerequisites',
			list: ['.NET 10.0 SDK or later', 'An MCP-compatible AI client (Claude Code, Cursor, etc.)']
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
"Find all types matching *Service"
"What methods does IUserRepository define?"
"Find all usages of the Login method"`,
				language: 'plaintext'
			}
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
