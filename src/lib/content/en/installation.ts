import type { InstallationContent, InstallationGuides, OtherInstallContent } from '../types';

export const installation: InstallationContent = {
	title: 'Installation Guides',
	intro: [
		'Choose your AI client below for specific setup instructions. Glider works with any MCP-compatible client.'
	],
	hint: 'Use Tab/Arrow keys to navigate, Enter to select.',
	ariaLabel: 'Installation guides',
	notFoundText: 'Installation guide not found.',
	clients: [
		{ id: 'install-claude-code', name: 'Claude Code', desc: "Anthropic's CLI for Claude", href: '/installation/claude-code' },
		{ id: 'install-codex', name: 'Codex CLI', desc: "OpenAI's terminal agent", href: '/installation/codex' },
		{ id: 'install-gemini', name: 'Gemini CLI', desc: "Google's AI assistant", href: '/installation/gemini' },
		{ id: 'install-cursor', name: 'Cursor', desc: 'AI-first code editor', href: '/installation/cursor' },
		{ id: 'install-copilot', name: 'GitHub Copilot', desc: "GitHub's AI coding assistant", href: '/installation/copilot' },
		{ id: 'install-other', name: 'Other Clients', desc: 'Generic MCP configuration', href: '/installation/other' }
	]
};

export const installationGuides: InstallationGuides = {
	'install-claude-code': {
		id: 'install-claude-code',
		title: 'Claude Code Setup',
		subtitle: 'Configure Glider with Claude Code CLI.',
		cardTitle: 'Claude Code',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'Add to Claude Code (project scope)',
				description: 'Recommended: project-scoped config for per-project control.',
				code: 'claude mcp add --transport stdio glider --scope project -- ~/.dotnet/tools/glider'
			},
			{
				title: 'Or add globally (user scope)',
				description: 'For use across all projects.',
				code: 'claude mcp add --transport stdio glider --scope user -- ~/.dotnet/tools/glider'
			},
			{
				title: 'Verify',
				description: 'Start a new Claude Code session and check for Glider tools.',
				code: 'claude\n# Then ask: "What Glider tools are available?"'
			}
		]
	},
	'install-codex': {
		id: 'install-codex',
		title: 'Codex CLI Setup',
		subtitle: 'Configure Glider with OpenAI Codex CLI using HTTP transport.',
		cardTitle: 'Codex CLI',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'Start Glider in HTTP mode',
				description: 'Codex uses HTTP transport. Run Glider as an HTTP server.',
				code: 'glider --transport http\n# Listens on http://localhost:5001/mcp'
			},
			{
				title: 'Configure Codex',
				description: 'Add MCP server configuration to your Codex settings.',
				code: `# In your Codex config:
{
  "mcpServers": {
    "glider": {
      "url": "http://localhost:5001/mcp"
    }
  }
}`,
				language: 'json'
			},
			{
				title: 'Custom port (optional)',
				code: 'glider --transport http --port 8080'
			}
		]
	},
	'install-gemini': {
		id: 'install-gemini',
		title: 'Gemini CLI Setup',
		subtitle: 'Configure Glider with Google Gemini CLI.',
		cardTitle: 'Gemini CLI',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'Configure Gemini CLI',
				description: 'Add Glider to your MCP configuration file.',
				code: `{
  "mcpServers": {
    "glider": {
      "command": "glider",
      "args": []
    }
  }
}`,
				language: 'json'
			},
			{
				title: 'Alternative: Full path',
				description: 'If glider is not in PATH, use the full path.',
				code: `{
  "mcpServers": {
    "glider": {
      "command": "~/.dotnet/tools/glider",
      "args": []
    }
  }
}`,
				language: 'json'
			}
		]
	},
	'install-cursor': {
		id: 'install-cursor',
		title: 'Cursor Setup',
		subtitle: 'Configure Glider with Cursor IDE.',
		cardTitle: 'Cursor',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'Open Cursor Settings',
				description: 'Go to Settings > Features > MCP Servers'
			},
			{
				title: 'Add MCP Server',
				description: 'Add a new stdio MCP server with the following configuration:',
				code: `Name: glider
Command: ~/.dotnet/tools/glider
Arguments: (leave empty)`,
				language: 'plaintext'
			},
			{
				title: 'Restart Cursor',
				description: 'Restart Cursor to load the new MCP server.'
			}
		]
	},
	'install-copilot': {
		id: 'install-copilot',
		title: 'GitHub Copilot Setup',
		subtitle: 'Configure Glider with GitHub Copilot (VS Code extension).',
		cardTitle: 'GitHub Copilot',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'Configure VS Code settings',
				description: 'Add to your VS Code settings.json:',
				code: `{
  "github.copilot.chat.mcp.servers": {
    "glider": {
      "command": "glider",
      "args": []
    }
  }
}`,
				language: 'json'
			},
			{
				title: 'Reload VS Code',
				description: 'Reload the window to apply changes.'
			}
		]
	}
};

export const installationOther: OtherInstallContent = {
	id: 'install-other',
	title: 'Generic MCP Configuration',
	subtitle: 'Configure Glider with any MCP-compatible client.',
	sections: [
		{
			title: 'Stdio Transport (Default)',
			description: 'Most MCP clients use stdio transport. Configure with:',
			code: {
				code: `{
  "mcpServers": {
    "glider": {
      "command": "glider",
      "args": []
    }
  }
}`,
				language: 'json'
			}
		},
		{
			title: 'HTTP Transport',
			description: 'For clients that require HTTP (like Codex):',
			code: {
				code: `# Start Glider in HTTP mode
glider --transport http

# Then configure your client to connect to:
# http://localhost:5001/mcp`,
				language: 'bash'
			}
		},
		{
			title: 'Environment Variables',
			code: {
				code: '# Custom port for HTTP transport\nglider --transport http --port 8080',
				language: 'bash'
			}
		}
	]
};
