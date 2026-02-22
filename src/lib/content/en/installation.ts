import type { InstallationContent, InstallationGuides, OtherInstallContent } from '../types';

const gliderPathByOsVariants = [
	{
		id: 'macos',
		label: 'macOS',
		code: `# bash/zsh
export PATH="$PATH:$HOME/.dotnet/tools"
which glider`,
		language: 'bash'
	},
	{
		id: 'linux',
		label: 'Linux',
		code: `# bash
export PATH="$PATH:$HOME/.dotnet/tools"
which glider`,
		language: 'bash'
	},
	{
		id: 'windows',
		label: 'Windows',
		code: `# PowerShell
$env:Path += ";$env:USERPROFILE\\.dotnet\\tools"
Get-Command glider`,
		language: 'plaintext'
	}
];

export const installation: InstallationContent = {
	title: 'Installation Guides',
	intro: [
		'Choose your AI client below for specific setup instructions. Glider works with any MCP-compatible client.',
		'<strong>Recommendation:</strong> prefer <strong>project/workspace</strong> configuration when your client supports it. This avoids launching Glider for unrelated projects (and can help reduce token usage).',
		'In stdio mode, <code>glider</code> waits for MCP input and is intentionally quiet by default. Use <code>glider --verbose</code> if you want a startup banner/logs (written to stderr).'
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
				description:
					'Glider is a .NET global tool. If you do not have .NET installed yet, install the .NET SDK first.',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'macOS / Windows / Linux: ensure glider is on PATH',
				description:
					'Most MCP clients can run <code>glider</code> directly if your .NET tools directory is on PATH. If you prefer, you can also use the full path to the executable (shown below).',
				codeVariants: gliderPathByOsVariants
			},
			{
				title: 'Add to Claude Code (project scope) — recommended',
				description:
					'Project-scoped servers only run when you are in that project. See Claude Code MCP docs: <a href="https://docs.anthropic.com/en/docs/claude-code/mcp" target="_blank" rel="noreferrer">docs.anthropic.com/en/docs/claude-code/mcp</a>.',
				code: 'claude mcp add --transport stdio glider --scope project -- glider'
			},
			{
				title: 'Or add globally (user scope)',
				description:
					'Global config runs in every Claude Code project. Use this only if you want Glider available everywhere.',
				code: 'claude mcp add --transport stdio glider --scope user -- glider'
			},
			{
				title: 'Verify',
				description: 'Start a new Claude Code session and check for Glider tools. If you need startup output/logs, re-add Glider with <code>--verbose</code> (e.g. <code>... -- glider --verbose</code>).',
				code: 'claude\n# Then ask: "What Glider tools are available?"'
			}
		]
	},
	'install-codex': {
		id: 'install-codex',
		title: 'Codex CLI Setup',
		subtitle: 'Configure Glider with OpenAI Codex CLI.',
		cardTitle: 'Codex CLI',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'macOS / Windows / Linux: ensure glider is on PATH',
				description:
					'You’ll run Glider as a local HTTP server. Make sure <code>glider</code> is available on PATH.',
				codeVariants: gliderPathByOsVariants
			},
			{
				title: 'Start Glider (Streamable HTTP)',
				description:
					'Codex currently supports MCP servers over <strong>Streamable HTTP</strong>. Start Glider in HTTP mode (default endpoint: <code>http://localhost:5001/mcp</code>). Add <code>--verbose</code> for logs if needed.',
				code: 'glider --transport http',
				language: 'bash'
			},
			{
				title: 'Add Glider to Codex (global config)',
				description:
					'Edit: macOS/Linux <code>~/.codex/config.toml</code>, Windows <code>%USERPROFILE%\\.codex\\config.toml</code>. Codex does not currently support per-repo MCP config, so this is user-scoped. Codex docs: <a href="https://developers.openai.com/codex/mcp/" target="_blank" rel="noreferrer">developers.openai.com/codex/mcp</a>.',
				code: `# ~/.codex/config.toml
[mcp_servers.glider]
url = "http://localhost:5001/mcp"
tool_timeout_sec = 300`,
				language: 'plaintext'
			},
			{
				title: 'Verify',
				description:
					'Start a new Codex session, then run <code>/mcp</code> to confirm the server is available.',
				code: 'codex\n# Then run: /mcp',
				language: 'plaintext'
			},
			{
				title: 'Optional: keep Glider off by default (profile)',
				description:
					'If you prefer, put Glider under a profile and start Codex with <code>--profile glider</code>. Note: some Codex builds only show globally-configured servers in <code>/mcp</code>; if Glider doesn’t appear, move it back to <code>[mcp_servers.glider]</code>.',
				code: `# ~/.codex/config.toml
[profiles.glider]

[profiles.glider.mcp_servers.glider]
url = "http://localhost:5001/mcp"
tool_timeout_sec = 300

# Run with:
# codex --profile glider`,
				language: 'plaintext'
			}
		]
	},
	'install-gemini': {
		id: 'install-gemini',
		title: 'Gemini CLI Setup',
		subtitle: 'Configure Glider with Google Gemini CLI (MCP).',
		cardTitle: 'Gemini CLI',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'macOS / Windows / Linux: ensure glider is on PATH',
				description:
					'Gemini CLI launches stdio MCP servers via <code>command</code>. Make sure <code>glider</code> is available on PATH.',
				codeVariants: gliderPathByOsVariants
			},
			{
				title: 'Project scope (recommended)',
				description:
					'Create <code>.gemini/settings.json</code> in your project. Gemini CLI docs: <a href="https://geminicli.com/docs/tools/mcp-server" target="_blank" rel="noreferrer">geminicli.com/docs/tools/mcp-server</a>.',
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
				title: 'Global scope (user settings)',
				description:
					'Create/modify your user settings file: macOS/Linux <code>~/.gemini/settings.json</code>, Windows <code>%USERPROFILE%\\.gemini\\settings.json</code>.',
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
				title: 'macOS / Windows / Linux: ensure glider is on PATH',
				description:
					'Cursor launches stdio MCP servers via <code>command</code>. Make sure <code>glider</code> is available on PATH.',
				codeVariants: gliderPathByOsVariants
			},
			{
				title: 'Project scope (recommended)',
				description:
					'Create <code>.cursor/mcp.json</code> in your repo (recommended to avoid starting Glider for unrelated projects). Cursor MCP docs: <a href="https://cursor.com/docs/context/mcp#using-mcpjson" target="_blank" rel="noreferrer">https://cursor.com/docs/context/mcp#using-mcpjson</a>.',
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
				title: 'Global scope (user settings)',
				description:
					'Create/modify: macOS/Linux <code>~/.cursor/mcp.json</code>, Windows <code>%USERPROFILE%\\.cursor\\mcp.json</code>.',
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
		]
	},
	'install-copilot': {
		id: 'install-copilot',
		title: 'GitHub Copilot Setup',
		subtitle: 'Configure Glider with GitHub Copilot Chat (VS Code).',
		cardTitle: 'GitHub Copilot',
		steps: [
			{
				title: 'Install Glider',
				code: 'dotnet tool install --global glider'
			},
			{
				title: 'macOS / Windows / Linux: ensure glider is on PATH',
				description:
					'VS Code launches stdio MCP servers via <code>command</code>. Make sure <code>glider</code> is available on PATH.',
				codeVariants: gliderPathByOsVariants
			},
			{
				title: 'Project scope (recommended)',
				description:
					'Create <code>.vscode/mcp.json</code> in your repo. GitHub Copilot MCP docs: <a href="https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-mcp" target="_blank" rel="noreferrer">docs.github.com/.../extending-copilot-chat-with-mcp</a>.',
				code: `{
  "servers": {
    "glider": {
      "type": "stdio",
      "command": "glider",
      "args": []
    }
  }
}`,
				language: 'json'
			},
			{
				title: 'Reload VS Code',
				description:
					'Reload the window to apply changes. If you prefer global setup, configure MCP servers in your VS Code user settings (see GitHub docs above).'
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
			title: 'Recommendation: Project/Workspace Scope',
			description:
				'When possible, configure Glider per <strong>project/workspace</strong> (not globally). This avoids launching it for unrelated projects (and can reduce token usage).'
		},
		{
			title: 'macOS / Windows / Linux: ensure glider is on PATH',
			description:
				'Most clients can run <code>glider</code> directly if your .NET tools directory is on PATH.',
			codeVariants: gliderPathByOsVariants
		},
		{
			title: 'Stdio Transport (common: mcpServers JSON)',
			description:
				'Many clients (Cursor, Gemini CLI, etc.) use this format. Replace the file location with your client’s recommended <strong>project/workspace</strong> config file.',
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
			title: 'VS Code / Copilot (mcp.json)',
			description:
				'VS Code uses a different config format (see VS Code docs: <a href="https://code.visualstudio.com/docs/copilot/chat/mcp-servers" target="_blank" rel="noreferrer">code.visualstudio.com/docs/copilot/chat/mcp-servers</a>).',
			code: {
				code: `{
  "servers": {
    "glider": {
      "type": "stdio",
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
			description:
				'If your client requires HTTP, start Glider in HTTP mode and point the client at the URL:',
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
