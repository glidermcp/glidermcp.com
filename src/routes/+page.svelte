<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TUILayout from '$components/tui/TUILayout.svelte';
	import TUINavigationTree from '$components/tui/TUINavigationTree.svelte';
	import type { NavItem } from '$types/navigation';
	import Logo from '$components/tui/Logo.svelte';
	import { PlaygroundView } from '$components/playground';
	import { CodeBlock, ToolCard, InstallGuide, PromptExample } from '$components/docs';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import {
		focusedPanel,
		navSelectedIndex,
		expandedSections,
		setFocusedPanel,
		setNavIndex,
		expandSection
	} from '$stores/keyboard';
	import { TOOLS, TOOL_CATEGORIES, getToolsByCategory, type ToolCategory } from '$lib/utils/tool-metadata';

	// Navigation structure with all 12 tools
	const navItems: NavItem[] = [
		{ id: 'intro', label: 'Introduction' },
		{ id: 'quick-start', label: 'Quick Start' },
		{
			id: 'installation',
			label: 'Installation',
			children: [
				{ id: 'install-claude-code', label: 'Claude Code' },
				{ id: 'install-codex', label: 'Codex CLI' },
				{ id: 'install-gemini', label: 'Gemini CLI' },
				{ id: 'install-cursor', label: 'Cursor' },
				{ id: 'install-copilot', label: 'GitHub Copilot' },
				{ id: 'install-other', label: 'Other Clients' }
			]
		},
		{
			id: 'tools',
			label: 'Tools',
			children: [
				{ id: 'tool-server-status', label: 'server_status' },
				{ id: 'tool-load-solution', label: 'load_solution' },
				{ id: 'tool-load-project', label: 'load_project' },
				{ id: 'tool-unload-solution', label: 'unload_solution' },
				{ id: 'tool-find-types', label: 'find_types' },
				{ id: 'tool-find-usages', label: 'find_usages' },
				{ id: 'tool-find-implementation', label: 'find_implementation' },
				{ id: 'tool-get-type-info', label: 'get_type_info' },
				{ id: 'tool-get-method-signature', label: 'get_method_signature' },
				{ id: 'tool-rename-symbol', label: 'rename_symbol' },
				{ id: 'tool-move-type', label: 'move_type' },
				{ id: 'tool-move-member', label: 'move_member' },
				{ id: 'tool-view-external', label: 'view_external_definition' }
			]
		},
		{ id: 'playground', label: 'Playground' },
		{ id: 'prompts', label: 'Prompts' },
		{ id: 'faq', label: 'FAQ' },
		{ id: 'pricing', label: 'Pricing' }
	];

	// Current selected section ID
	let selectedId = $state('intro');

	// Track focused panel from store
	const currentFocusedPanel = $derived($focusedPanel);

	// Track expanded tools for ToolCard
	let expandedTools = $state<Set<string>>(new Set());

	function toggleToolExpand(toolId: string) {
		const newSet = new Set(expandedTools);
		if (newSet.has(toolId)) {
			newSet.delete(toolId);
		} else {
			newSet.add(toolId);
		}
		expandedTools = newSet;
	}

	function handleNavSelect(item: NavItem) {
		selectedId = item.id;
	}

	// Handle page-level keyboard actions
	function handleAction(action: KeyboardAction): void {
		switch (action) {
			case 'help':
				selectedId = 'intro';
				setNavIndex(0);
				break;
			case 'game':
				// TODO: Open game modal
				console.log('Game not yet implemented');
				break;
		}
	}

	// Handle content panel keyboard navigation
	function handleContentKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		if ($focusedPanel !== 'right') return false;

		switch (action) {
			case 'pageUp':
			case 'pageDown':
				return false;
			case 'back':
				setFocusedPanel('left');
				return true;
			default:
				return false;
		}
	}

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleContentKeyboard);
		expandSection('tools');
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	// Get tool by nav ID
	function getToolFromNavId(navId: string) {
		const toolId = navId.replace('tool-', '').replace(/-/g, '_');
		return TOOLS.find(t => t.id === toolId);
	}
</script>

<svelte:head>
	<title>Glider MCP - Roslyn-powered C# Code Analysis for AI</title>
	<meta name="description" content="Glider MCP is a Roslyn-powered Model Context Protocol server that gives AI assistants deep understanding of C# codebases. 12 powerful tools for code analysis and refactoring." />
</svelte:head>

<TUILayout title="Glider MCP">
	{#snippet leftPanel()}
		<TUINavigationTree items={navItems} onSelect={handleNavSelect} />
	{/snippet}

	{#snippet rightPanel()}
		<div class="content-area" class:focused={currentFocusedPanel === 'right'}>
			{#if selectedId === 'intro'}
				<div class="intro-content">
					<Logo size="large" />

					<h2>Glider MCP</h2>
					<p class="tagline">
						Roslyn-powered C# code analysis for AI assistants
					</p>

					<p>
						Glider is an MCP (Model Context Protocol) server that gives AI assistants
						deep semantic understanding of C# codebases. Built on Roslyn, it provides
						12 powerful tools for code navigation, analysis, and refactoring.
					</p>

					<h3>Key Features</h3>
					<ul class="feature-list">
						<li>Load and analyze .NET solutions and projects</li>
						<li>Find type definitions, implementations, and usages</li>
						<li>Get detailed type and method information</li>
						<li>Semantic rename across entire solutions</li>
						<li>Move types and members between files</li>
						<li>View source of NuGet/framework types</li>
						<li>Works with any MCP-compatible AI client</li>
					</ul>

					<h3>Quick Install</h3>
					<CodeBlock
						code="dotnet tool install --global glider"
						language="bash"
					/>

					<p class="hint">
						Navigate to <strong>Quick Start</strong> for full setup instructions.
					</p>
				</div>

			{:else if selectedId === 'quick-start'}
				<h2>Quick Start</h2>
				<p>Get Glider MCP running in minutes.</p>

				<h3>Prerequisites</h3>
				<ul class="feature-list">
					<li>.NET 10.0 SDK or later</li>
					<li>An MCP-compatible AI client (Claude Code, Cursor, etc.)</li>
				</ul>

				<h3>1. Install Glider</h3>
				<CodeBlock
					code="dotnet tool install --global glider"
					language="bash"
				/>

				<h3>2. Verify Installation</h3>
				<CodeBlock
					code={`# List installed tools
dotnet tool list -g

# The tool path should be in your PATH
# macOS/Linux: ~/.dotnet/tools
# Windows: %USERPROFILE%\\.dotnet\\tools`}
					language="bash"
				/>

				<h3>3. Configure Your AI Client</h3>
				<p>See the <strong>Installation</strong> section for client-specific instructions.</p>

				<h3>4. Start Using</h3>
				<p>Once configured, you can ask your AI assistant:</p>
				<CodeBlock
					code={`"Load the solution at /path/to/MySolution.sln"
"Find all types matching *Service"
"What methods does IUserRepository define?"
"Find all usages of the Login method"`}
					language="plaintext"
				/>

				<h3>Update to Latest</h3>
				<CodeBlock
					code="dotnet tool update --global glider"
					language="bash"
				/>

			{:else if selectedId === 'installation'}
				<h2>Installation Guides</h2>
				<p>
					Choose your AI client below for specific setup instructions.
					Glider works with any MCP-compatible client.
				</p>
				<p class="hint">Use Tab/Arrow keys to navigate, Enter to select.</p>

				{@const clients = [
					{ id: 'install-claude-code', name: 'Claude Code', desc: "Anthropic's CLI for Claude" },
					{ id: 'install-codex', name: 'Codex CLI', desc: "OpenAI's terminal agent" },
					{ id: 'install-gemini', name: 'Gemini CLI', desc: "Google's AI assistant" },
					{ id: 'install-cursor', name: 'Cursor', desc: 'AI-first code editor' },
					{ id: 'install-copilot', name: 'GitHub Copilot', desc: "GitHub's AI coding assistant" },
					{ id: 'install-other', name: 'Other Clients', desc: 'Generic MCP configuration' }
				]}

				<div class="client-grid" role="listbox" aria-label="Installation guides">
					{#each clients as client, index}
						<button
							class="client-card"
							role="option"
							aria-selected={false}
							onclick={() => selectedId = client.id}
							onkeydown={(e) => {
								const grid = e.currentTarget.parentElement;
								const buttons = grid?.querySelectorAll('.client-card');
								if (!buttons) return;

								let newIndex = index;
								if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
									newIndex = Math.min(buttons.length - 1, index + 1);
									e.preventDefault();
								} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
									newIndex = Math.max(0, index - 1);
									e.preventDefault();
								} else if (e.key === 'Home') {
									newIndex = 0;
									e.preventDefault();
								} else if (e.key === 'End') {
									newIndex = buttons.length - 1;
									e.preventDefault();
								}

								if (newIndex !== index) {
									(buttons[newIndex] as HTMLElement)?.focus();
								}
							}}
						>
							<span class="client-name">{client.name}</span>
							<span class="client-desc">{client.desc}</span>
						</button>
					{/each}
				</div>

			{:else if selectedId === 'install-claude-code'}
				<h2>Claude Code Setup</h2>
				<p>Configure Glider with Claude Code CLI.</p>

				<InstallGuide
					client="Claude Code"
					steps={[
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
					]}
				/>

			{:else if selectedId === 'install-codex'}
				<h2>Codex CLI Setup</h2>
				<p>Configure Glider with OpenAI Codex CLI using HTTP transport.</p>

				<InstallGuide
					client="Codex CLI"
					steps={[
						{
							title: 'Install Glider',
							code: 'dotnet tool install --global glider'
						},
						{
							title: 'Start Glider in HTTP mode',
							description: 'Codex uses HTTP transport. Run Glider as an HTTP server.',
							code: 'glider --transport http\n# Listens on http://localhost:3001/mcp'
						},
						{
							title: 'Configure Codex',
							description: 'Add MCP server configuration to your Codex settings.',
							code: `# In your Codex config:
{
  "mcpServers": {
    "glider": {
      "url": "http://localhost:3001/mcp"
    }
  }
}`,
							language: 'json'
						},
						{
							title: 'Custom port (optional)',
							code: 'glider --transport http --port 8080'
						}
					]}
				/>

			{:else if selectedId === 'install-gemini'}
				<h2>Gemini CLI Setup</h2>
				<p>Configure Glider with Google Gemini CLI.</p>

				<InstallGuide
					client="Gemini CLI"
					steps={[
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
					]}
				/>

			{:else if selectedId === 'install-cursor'}
				<h2>Cursor Setup</h2>
				<p>Configure Glider with Cursor IDE.</p>

				<InstallGuide
					client="Cursor"
					steps={[
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
					]}
				/>

			{:else if selectedId === 'install-copilot'}
				<h2>GitHub Copilot Setup</h2>
				<p>Configure Glider with GitHub Copilot (VS Code extension).</p>

				<InstallGuide
					client="GitHub Copilot"
					steps={[
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
					]}
				/>

			{:else if selectedId === 'install-other'}
				<h2>Generic MCP Configuration</h2>
				<p>Configure Glider with any MCP-compatible client.</p>

				<h3>Stdio Transport (Default)</h3>
				<p>Most MCP clients use stdio transport. Configure with:</p>
				<CodeBlock
					code={`{
  "mcpServers": {
    "glider": {
      "command": "glider",
      "args": []
    }
  }
}`}
					language="json"
				/>

				<h3>HTTP Transport</h3>
				<p>For clients that require HTTP (like Codex):</p>
				<CodeBlock
					code={`# Start Glider in HTTP mode
glider --transport http

# Then configure your client to connect to:
# http://localhost:3001/mcp`}
					language="bash"
				/>

				<h3>Environment Variables</h3>
				<CodeBlock
					code={`# Custom port for HTTP transport
glider --transport http --port 8080`}
					language="bash"
				/>

			{:else if selectedId === 'tools'}
				<h2>Available Tools</h2>
				<p>Glider provides 12 MCP tools for C# code analysis and refactoring.</p>

				{#each Object.entries(TOOL_CATEGORIES) as [category, info]}
					{@const tools = getToolsByCategory(category as ToolCategory)}
					{#if tools.length > 0}
						<div class="tool-category">
							<h3>{info.label}</h3>
							<p class="category-desc">{info.description}</p>
							{#each tools as tool}
								<ToolCard
									{tool}
									expanded={expandedTools.has(tool.id)}
									onToggle={() => toggleToolExpand(tool.id)}
								/>
							{/each}
						</div>
					{/if}
				{/each}

			{:else if selectedId.startsWith('tool-')}
				{@const tool = getToolFromNavId(selectedId)}
				{#if tool}
					<h2>{tool.name}</h2>
					<p class="tool-category-badge">[{tool.category}]</p>
					<p>{tool.description}</p>

					{#if tool.parameters.length > 0}
						<h3>Parameters</h3>
						<table class="params-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Type</th>
									<th>Required</th>
									<th>Description</th>
								</tr>
							</thead>
							<tbody>
								{#each tool.parameters as param}
									<tr>
										<td class="param-name">{param.name}</td>
										<td class="param-type">{param.type}</td>
										<td>{param.required ? 'Yes' : 'No'}</td>
										<td>{param.description}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else}
						<p class="muted">This tool requires no parameters.</p>
					{/if}

					{#if tool.examples.length > 0}
						<h3>Examples</h3>
						{#each tool.examples as example}
							<p class="example-desc">{example.description}</p>
							<CodeBlock
								code={JSON.stringify(example.params, null, 2)}
								language="json"
							/>
						{/each}
					{/if}

					{#if tool.responseDescription}
						<h3>Response</h3>
						<p>{tool.responseDescription}</p>
					{/if}

					<p class="hint">
						Go to <strong>Playground</strong> to test this tool interactively.
					</p>
				{:else}
					<p class="muted">Tool not found.</p>
				{/if}

			{:else if selectedId === 'playground'}
				<PlaygroundView />

			{:else if selectedId === 'prompts'}
				<h2>Prompt Examples</h2>
				<p>Effective prompts for working with Glider MCP.</p>

				<PromptExample
					title="Loading Solutions"
					description="Start by loading your .NET solution or project."
					prompts={[
						'Load the solution at /path/to/MySolution.sln',
						'Load the project at /path/to/MyProject.csproj'
					]}
				/>

				<PromptExample
					title="Finding Types"
					description="Search for types using patterns and wildcards."
					prompts={[
						'Find all types matching *Service',
						'Find types that start with I (interfaces)',
						'Find all types in the DataLayer project'
					]}
				/>

				<PromptExample
					title="Exploring Code"
					description="Navigate and understand your codebase."
					prompts={[
						'Show me the type hierarchy for UserService',
						'What methods does IAuthService define?',
						'Find all usages of the Login method',
						'Find all implementations of IRepository'
					]}
				/>

				<PromptExample
					title="Getting Details"
					description="Get detailed information about specific symbols."
					prompts={[
						'Get detailed info about the UserController class',
						'What is the signature of GetUserById method?',
						'Show me the source of JsonSerializer from System.Text.Json'
					]}
				/>

				<PromptExample
					title="Refactoring"
					description="Perform semantic refactoring operations."
					prompts={[
						'Rename the OldClassName to NewClassName',
						'Move the Helper class to the Utils namespace',
						'Move the ProcessData method from OldClass to NewClass',
						'Preview renaming UserService to UserManager without applying'
					]}
				/>

				<PromptExample
					title="Complex Analysis"
					description="Multi-step analysis workflows."
					prompts={[
						'I need to understand how authentication works. Find the IAuthService interface, list its methods, and show where Login is called.',
						'Find all classes that implement IRepository and show their public methods.',
						'Show me the dependency chain from UserController to the database layer.'
					]}
				/>

			{:else if selectedId === 'faq'}
				<h2>Frequently Asked Questions</h2>

				<div class="faq-item">
					<h3>What is Glider MCP?</h3>
					<p>
						Glider is a Model Context Protocol (MCP) server that uses Microsoft's Roslyn
						compiler platform to provide semantic understanding of C# codebases to AI assistants.
						Unlike grep-based search, Glider understands code structure, types, and relationships.
					</p>
				</div>

				<div class="faq-item">
					<h3>Which AI assistants work with Glider?</h3>
					<p>
						Any MCP-compatible client: Claude Code, Cursor, GitHub Copilot, Codex CLI,
						Gemini CLI, and more. If your AI tool supports MCP, it can use Glider.
					</p>
				</div>

				<div class="faq-item">
					<h3>Does it support .NET Framework?</h3>
					<p>
						Yes! Glider works with .NET Framework, .NET Core, .NET 5/6/7/8/9/10+ solutions.
						Roslyn can analyze any C# code that compiles.
					</p>
				</div>

				<div class="faq-item">
					<h3>How does it differ from grep/ripgrep?</h3>
					<p>
						Glider provides <strong>semantic</strong> understanding. It knows that
						<code>IService</code> in one file refers to the same interface as in another.
						It can find implementations, usages, and perform safe renames that grep cannot.
					</p>
				</div>

				<div class="faq-item">
					<h3>Why do versions expire?</h3>
					<p>
						Each version expires 1 month after release to ensure users stay on recent versions
						with the latest fixes. Simply run <code>dotnet tool update --global glider</code>
						to get the latest version.
					</p>
				</div>

				<div class="faq-item">
					<h3>Can I use HTTP transport?</h3>
					<p>
						Yes! Run <code>glider --transport http</code> to start an HTTP server on port 3001.
						This is useful for clients like Codex that require HTTP connections.
					</p>
				</div>

				<div class="faq-item">
					<h3>How do I view NuGet package source code?</h3>
					<p>
						Use the <code>view_external_definition</code> tool. It first tries SourceLink
						to get original source, then falls back to ILSpy decompilation if SourceLink
						is unavailable.
					</p>
				</div>

			{:else if selectedId === 'pricing'}
				<h2>Pricing</h2>

				<div class="pricing-card">
					<h3>Free</h3>
					<p class="price">$0</p>
					<ul class="feature-list">
						<li>All 12 tools included</li>
						<li>Unlimited solutions</li>
						<li>Both stdio and HTTP transport</li>
						<li>Works with any MCP client</li>
						<li>Community support via GitHub</li>
					</ul>
				</div>

				<h3>Version Policy</h3>
				<p>
					Each version of Glider expires 1 month after release. This ensures
					users stay on recent versions with the latest improvements and fixes.
				</p>
				<p>
					You'll receive a warning 7 days before expiration. Update with:
				</p>
				<CodeBlock
					code="dotnet tool update --global glider"
					language="bash"
				/>

				<h3>Author</h3>
				<p>
					Built by <a href="https://sacrorum.com" class="link">Bogdan Novosad</a>
				</p>
				<p class="muted">bogdan@sacrorum.com</p>

				<h3>License</h3>
				<p>All Rights Reserved</p>

			{:else}
				<h2>{selectedId}</h2>
				<p class="muted">Content for {selectedId} section.</p>
			{/if}
		</div>
	{/snippet}
</TUILayout>

<style>
	.content-area {
		padding: var(--spacing-md);
		padding-left: var(--spacing-lg);
		height: 100%;
		overflow: auto;
	}

	.content-area.focused {
		/* Visual indicator that content is focused */
	}

	.intro-content {
		max-width: 650px;
	}

	.tagline {
		color: var(--accent);
		font-size: var(--font-size-base);
		margin-bottom: var(--spacing-lg);
	}

	h2 {
		color: var(--text-primary);
		font-size: var(--font-size-lg);
		font-weight: 700;
		margin: 0 0 var(--spacing-md) 0;
		border-bottom: 1px solid var(--border-dim);
		padding-bottom: var(--spacing-sm);
	}

	h3 {
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		font-weight: 600;
		margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
	}

	p {
		color: var(--text-secondary);
		margin: 0 0 var(--spacing-md) 0;
		line-height: 1.6;
	}

	.muted {
		color: var(--text-muted);
	}

	.hint {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--spacing-lg) 0;
		color: var(--text-secondary);
	}

	.feature-list li {
		padding: var(--spacing-xs) 0;
	}

	.feature-list li::before {
		content: '- ';
		color: var(--text-muted);
	}

	.link {
		color: var(--accent);
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}

	/* Client grid */
	.client-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
	}

	.client-card {
		display: flex;
		flex-direction: column;
		padding: var(--spacing-md);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		cursor: pointer;
		text-align: left;
		font-family: var(--font-mono);
		transition: border-color 0.15s;
	}

	.client-card:hover {
		border-color: var(--accent);
	}

	.client-card:focus {
		outline: none;
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.client-card:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.client-name {
		color: var(--accent);
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
	}

	.client-desc {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	/* Tool category */
	.tool-category {
		margin-bottom: var(--spacing-xl);
	}

	.tool-category h3 {
		color: var(--accent);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: var(--spacing-xs);
	}

	.category-desc {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-md);
	}

	.tool-category-badge {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-top: calc(-1 * var(--spacing-sm));
	}

	/* Params table */
	.params-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--font-size-sm);
		margin: var(--spacing-md) 0;
	}

	.params-table th {
		text-align: left;
		color: var(--text-muted);
		font-weight: 500;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
	}

	.params-table td {
		padding: var(--spacing-xs) var(--spacing-sm);
		color: var(--text-secondary);
		vertical-align: top;
		border-bottom: 1px solid var(--border-dim);
	}

	.param-name {
		color: var(--accent) !important;
		font-family: var(--font-mono);
	}

	.param-type {
		color: var(--text-muted) !important;
		font-family: var(--font-mono);
	}

	.example-desc {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-xs);
	}

	/* FAQ */
	.faq-item {
		margin-bottom: var(--spacing-lg);
		padding-bottom: var(--spacing-lg);
		border-bottom: 1px solid var(--border-dim);
	}

	.faq-item:last-child {
		border-bottom: none;
	}

	.faq-item h3 {
		color: var(--text-primary);
		margin-top: 0;
	}

	.faq-item code {
		background-color: var(--bg-secondary);
		padding: 2px var(--spacing-xs);
		color: var(--accent);
	}

	/* Pricing */
	.pricing-card {
		background-color: var(--bg-secondary);
		border: 1px solid var(--accent);
		padding: var(--spacing-lg);
		margin: var(--spacing-lg) 0;
		max-width: 300px;
	}

	.pricing-card h3 {
		margin: 0 0 var(--spacing-sm) 0;
		color: var(--accent);
	}

	.price {
		font-size: 2rem;
		color: var(--text-primary);
		font-weight: 700;
		margin: 0 0 var(--spacing-md) 0;
	}
</style>
