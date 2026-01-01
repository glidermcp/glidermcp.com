<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TUILayout from '$components/tui/TUILayout.svelte';
	import TUINavigationTree, { type NavItem } from '$components/tui/TUINavigationTree.svelte';
	import Logo from '$components/tui/Logo.svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import {
		focusedPanel,
		navSelectedIndex,
		expandedSections,
		setFocusedPanel,
		setNavIndex,
		expandSection
	} from '$stores/keyboard';

	// Navigation structure
	const navItems: NavItem[] = [
		{ id: 'intro', label: 'Introduction' },
		{ id: 'quick-start', label: 'Quick Start' },
		{
			id: 'tools',
			label: 'Tools',
			children: [
				{ id: 'server-status', label: 'server_status' },
				{ id: 'load-solution', label: 'load_solution' },
				{ id: 'unload-solution', label: 'unload_solution' },
				{ id: 'find-types', label: 'find_types' },
				{ id: 'find-usages', label: 'find_usages' },
				{ id: 'find-implementation', label: 'find_implementation' },
				{ id: 'get-type-info', label: 'get_type_info' },
				{ id: 'get-method-signature', label: 'get_method_signature' }
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

	function handleNavSelect(item: NavItem) {
		selectedId = item.id;
		// Keep focus on left panel for keyboard navigation
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
				// Let browser handle scrolling
				return false;
			case 'back':
				// ESC goes back to nav
				setFocusedPanel('left');
				return true;
			default:
				return false;
		}
	}

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleContentKeyboard);
		// Expand tools section by default
		expandSection('tools');
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<svelte:head>
	<title>Glider MCP - Roslyn-powered C# Code Analysis</title>
	<meta name="description" content="Glider MCP is a Roslyn-powered Model Context Protocol server that gives AI assistants deep understanding of C# codebases." />
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

					<h2>Welcome to Glider MCP</h2>
					<p>
						Glider is a Roslyn-powered MCP server that gives AI assistants
						deep understanding of C# codebases. It provides semantic code
						analysis, type exploration, and symbol discovery capabilities.
					</p>

					<h3>Features</h3>
					<ul class="feature-list">
						<li>Load and analyze .NET solutions</li>
						<li>Find type definitions and implementations</li>
						<li>Discover symbol usages across projects</li>
						<li>Get detailed type and method information</li>
						<li>Navigate inheritance hierarchies</li>
						<li>Real-time diagnostics</li>
					</ul>

					<h3>Quick Install</h3>
					<pre class="code-block">npx @anthropic/claude-code mcp add glider -- \
  dotnet run --project /path/to/Glider.Server</pre>
				</div>

			{:else if selectedId === 'quick-start'}
				<h2>Quick Start</h2>
				<p>Get started with Glider MCP in minutes.</p>

				<h3>1. Clone the Repository</h3>
				<pre class="code-block">git clone https://github.com/sacrorum/glider.git
cd glider</pre>

				<h3>2. Build the Server</h3>
				<pre class="code-block">dotnet build</pre>

				<h3>3. Configure Your AI Assistant</h3>
				<p>Add Glider to your MCP configuration:</p>
				<pre class="code-block">{`{
  "mcpServers": {
    "glider": {
      "command": "dotnet",
      "args": ["run", "--project", "/path/to/Glider.Server"]
    }
  }
}`}</pre>

				<h3>4. Start Exploring</h3>
				<p>Load a solution and start querying your codebase:</p>
				<pre class="code-block">"Load the solution at /path/to/MySolution.sln"
"Find all usages of IService interface"
"What types implement IRepository?"</pre>

			{:else if selectedId === 'playground'}
				<h2>Playground</h2>
				<p class="muted">
					Connect to a local Glider MCP server to test tools interactively.
				</p>
				<div class="connection-status">
					<span class="status-indicator disconnected"></span>
					<span>Not connected - Start server at localhost:3001</span>
				</div>
				<p class="hint">
					<kbd>F5</kbd> to execute selected tool
				</p>

			{:else if selectedId === 'tools'}
				<h2>Available Tools</h2>
				<p>Glider provides 8 MCP tools for C# code analysis:</p>

				<div class="tool-categories">
					<h3>Diagnostics</h3>
					<ul class="tool-list">
						<li><code>server_status</code> - Check server status and loaded solution</li>
					</ul>

					<h3>Solution Management</h3>
					<ul class="tool-list">
						<li><code>load_solution</code> - Load a .NET solution for analysis</li>
						<li><code>unload_solution</code> - Unload the current solution</li>
					</ul>

					<h3>Search</h3>
					<ul class="tool-list">
						<li><code>find_types</code> - Find types by name pattern</li>
						<li><code>find_usages</code> - Find all usages of a symbol</li>
						<li><code>find_implementation</code> - Find implementations of interface/abstract class</li>
					</ul>

					<h3>Analysis</h3>
					<ul class="tool-list">
						<li><code>get_type_info</code> - Get detailed type information</li>
						<li><code>get_method_signature</code> - Get method signature details</li>
					</ul>
				</div>

			{:else if selectedId.startsWith('server-status') || selectedId.startsWith('load-') || selectedId.startsWith('unload-') || selectedId.startsWith('find-') || selectedId.startsWith('get-')}
				<h2>{selectedId.replace(/-/g, '_')}</h2>
				<p class="muted">Tool documentation for {selectedId.replace(/-/g, '_')}</p>
				<p class="hint">Select "Playground" to test this tool interactively.</p>

			{:else if selectedId === 'prompts'}
				<h2>Prompt Examples</h2>
				<p>Effective prompts for working with Glider MCP:</p>

				<h3>Loading Solutions</h3>
				<pre class="code-block">"Load the solution at /path/to/MySolution.sln"</pre>

				<h3>Finding Types</h3>
				<pre class="code-block">"Find all types matching *Service"
"Find types that implement IRepository"</pre>

				<h3>Exploring Code</h3>
				<pre class="code-block">"Show me the type hierarchy for UserService"
"What methods does IAuthService define?"
"Find all usages of the Login method"</pre>

			{:else if selectedId === 'faq'}
				<h2>FAQ</h2>

				<h3>What is Glider MCP?</h3>
				<p>
					Glider is a Model Context Protocol (MCP) server that uses Roslyn
					to provide semantic understanding of C# codebases to AI assistants.
				</p>

				<h3>Which AI assistants work with Glider?</h3>
				<p>
					Any MCP-compatible client: Claude Code, Cursor, GitHub Copilot,
					Gemini CLI, and more.
				</p>

				<h3>Does it support .NET Framework?</h3>
				<p>
					Yes, Glider works with both .NET Framework and .NET Core/5+/6+/7+/8+ solutions.
				</p>

			{:else if selectedId === 'pricing'}
				<h2>Pricing</h2>
				<p>
					Glider MCP is currently <strong>free and open source</strong>.
				</p>

				<h3>Current Model</h3>
				<ul class="feature-list">
					<li>Free for personal and commercial use</li>
					<li>MIT License</li>
					<li>Community support via GitHub</li>
				</ul>

				<h3>Author</h3>
				<p>
					Built by <a href="https://sacrorum.com" class="link">Bogdan Novosad</a>
				</p>
				<p class="muted">bogdan@sacrorum.com</p>

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
		max-width: 600px;
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

	.tool-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--spacing-md) 0;
	}

	.tool-list li {
		padding: var(--spacing-xs) 0;
		color: var(--text-secondary);
	}

	.tool-list code {
		background-color: var(--bg-secondary);
		padding: 2px var(--spacing-xs);
		color: var(--accent);
		margin-right: var(--spacing-sm);
	}

	.code-block {
		background-color: var(--bg-secondary);
		padding: var(--spacing-md);
		border: 1px solid var(--border-dim);
		overflow-x: auto;
		font-size: var(--font-size-sm);
		color: var(--text-primary);
		margin: var(--spacing-sm) 0 var(--spacing-md) 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		color: var(--text-muted);
		margin: var(--spacing-md) 0;
	}

	.status-indicator {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.status-indicator.disconnected {
		background-color: var(--text-muted);
	}

	.status-indicator.connected {
		background-color: var(--accent);
	}

	.hint {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	kbd {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		padding: 2px var(--spacing-xs);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.link {
		color: var(--accent);
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}

	.tool-categories h3 {
		color: var(--accent);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-top: var(--spacing-lg);
	}

	.tool-categories h3:first-child {
		margin-top: var(--spacing-md);
	}
</style>
