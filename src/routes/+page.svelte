<script lang="ts">
	import TUILayout from '$components/tui/TUILayout.svelte';
	import ListItem from '$components/ui/ListItem.svelte';
	import { toggleTheme } from '$stores/theme';

	interface NavItem {
		id: string;
		label: string;
		icon?: string;
		children?: NavItem[];
	}

	const navItems: NavItem[] = [
		{ id: 'intro', label: 'Introduction', icon: '▶' },
		{ id: 'quick-start', label: 'Quick Start', icon: '▶' },
		{
			id: 'tools',
			label: 'Tools',
			icon: '▼',
			children: [
				{ id: 'server-status', label: 'server_status' },
				{ id: 'load-solution', label: 'load_solution' },
				{ id: 'find-types', label: 'find_types' },
				{ id: 'find-usages', label: 'find_usages' },
				{ id: 'get-type-info', label: 'get_type_info' }
			]
		},
		{ id: 'playground', label: 'Playground', icon: '▶' },
		{ id: 'prompts', label: 'Prompts', icon: '▶' },
		{ id: 'faq', label: 'FAQ', icon: '▶' },
		{ id: 'pricing', label: 'Pricing', icon: '▶' }
	];

	let selectedId = $state('intro');
	let focusedPanel = $state<'left' | 'right'>('left');

	function handleNavSelect(id: string) {
		selectedId = id;
		focusedPanel = 'right';
	}

	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'Tab':
				e.preventDefault();
				focusedPanel = focusedPanel === 'left' ? 'right' : 'left';
				break;
			case 'F9':
				e.preventDefault();
				toggleTheme();
				break;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Glider MCP - Roslyn-powered C# Code Analysis</title>
</svelte:head>

<TUILayout title="Glider MCP" {focusedPanel}>
	{#snippet leftPanel()}
		<nav class="nav-tree" aria-label="Navigation">
			{#each navItems as item}
				<ListItem
					selected={selectedId === item.id}
					prefix={item.icon || '▶'}
					onclick={() => handleNavSelect(item.id)}
				>
					{item.label}
				</ListItem>
				{#if item.children && selectedId.startsWith(item.id)}
					{#each item.children as child}
						<ListItem
							selected={selectedId === child.id}
							indent={1}
							prefix="•"
							onclick={() => handleNavSelect(child.id)}
						>
							{child.label}
						</ListItem>
					{/each}
				{/if}
			{/each}
		</nav>
	{/snippet}

	{#snippet rightPanel()}
		<div class="content-area">
			{#if selectedId === 'intro'}
				<div class="intro-content">
					<pre class="ascii-logo">
   ____  _ _     _
  / ___|| (_) __| | ___ _ __
 | |  _ | | |/ _` |/ _ \ '__|
 | |_| || | | (_| |  __/ |
  \____||_|_|\__,_|\___|_|

  MCP Server for C# Code Analysis
					</pre>

					<h2>Welcome to Glider MCP</h2>
					<p>
						Glider is a Roslyn-powered MCP server that gives AI assistants
						deep understanding of C# codebases. It provides semantic code
						analysis, type exploration, and refactoring capabilities.
					</p>

					<h3>Features</h3>
					<ul class="feature-list">
						<li>├─ Load and analyze .NET solutions</li>
						<li>├─ Find type definitions and implementations</li>
						<li>├─ Discover symbol usages across projects</li>
						<li>├─ Get detailed type and method information</li>
						<li>├─ Safe refactoring operations</li>
						<li>└─ Real-time diagnostics</li>
					</ul>

					<h3>Quick Install</h3>
					<pre class="code-block">
npx @anthropic/claude-code mcp add glider -- \
  dotnet run --project /path/to/Glider.Server
					</pre>
				</div>
			{:else if selectedId === 'quick-start'}
				<h2>Quick Start</h2>
				<p>Get started with Glider MCP in minutes.</p>
				<ol class="steps-list">
					<li>1. Clone the Glider repository</li>
					<li>2. Build the server: <code>dotnet build</code></li>
					<li>3. Configure your AI assistant</li>
					<li>4. Load a solution and start exploring</li>
				</ol>
			{:else if selectedId === 'playground'}
				<h2>Playground</h2>
				<p class="muted">
					Connect to a local Glider MCP server to test tools interactively.
				</p>
				<div class="connection-status">
					<span class="status-disconnected">○</span>
					<span>Not connected - Start server at localhost:3001</span>
				</div>
			{:else}
				<h2>{selectedId.replace(/-/g, '_')}</h2>
				<p class="muted">Content for {selectedId} section.</p>
			{/if}
		</div>
	{/snippet}
</TUILayout>

<style>
	.nav-tree {
		display: flex;
		flex-direction: column;
	}

	.content-area {
		padding: var(--spacing-md);
		height: 100%;
		overflow: auto;
	}

	.ascii-logo {
		color: var(--accent);
		font-size: var(--font-size-sm);
		line-height: 1.2;
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
		font-weight: 500;
		margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
	}

	p {
		color: var(--text-secondary);
		margin: 0 0 var(--spacing-md) 0;
		line-height: 1.5;
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

	.steps-list {
		list-style: none;
		padding: 0;
		margin: 0;
		color: var(--text-secondary);
	}

	.steps-list li {
		padding: var(--spacing-sm) 0;
	}

	.steps-list code {
		background-color: var(--bg-secondary);
		padding: var(--spacing-xs) var(--spacing-sm);
		color: var(--accent);
	}

	.code-block {
		background-color: var(--bg-secondary);
		padding: var(--spacing-md);
		border: 1px solid var(--border-dim);
		overflow-x: auto;
		font-size: var(--font-size-sm);
		color: var(--text-primary);
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-dim);
		color: var(--text-muted);
	}

	.status-disconnected {
		color: var(--text-muted);
	}

	.intro-content {
		max-width: 600px;
	}
</style>
