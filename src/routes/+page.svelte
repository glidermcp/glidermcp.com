<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TUILayout from '$components/tui/TUILayout.svelte';
	import TUINavigationTree from '$components/tui/TUINavigationTree.svelte';
	import type { NavItem } from '$types/navigation';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import {
		focusedPanel,
		expandedSections,
		setFocusedPanel,
		setNavIndex,
		expandSection
	} from '$stores/keyboard';
	import HomeContent from '$components/pages/HomeContent.svelte';
	import { getContent, type Locale } from '$lib/content';
	import { FlappyBird } from '$components/game';
	import { showGame } from '$stores/game';

	// Current selected section ID
	let selectedId = $state('intro');

	// Track focused panel from store
	const currentFocusedPanel = $derived($focusedPanel);

	// Track expanded tools for ToolCard
	let expandedTools = $state<Set<string>>(new Set());

	let locale = $state<Locale>('en');
	const content = $derived(getContent(locale));

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

	/**
	 * Handle content selection (e.g., from InstallationOverview cards)
	 * Updates selectedId, expands parent section if needed, and syncs nav selection
	 */
	function handleContentSelect(id: string) {
		selectedId = id;

		// Find parent section and expand it if needed
		for (const item of content.navItems) {
			if (item.children) {
				const childIndex = item.children.findIndex((child) => child.id === id);
				if (childIndex >= 0) {
					// Expand the parent section
					expandSection(item.id);

					// Calculate the nav index: count items before parent + 1 (parent) + childIndex + 1
					let navIndex = 0;
					for (const navItem of content.navItems) {
						if (navItem.id === item.id) {
							// Found parent, add 1 for parent itself, then child position
							navIndex += 1 + childIndex;
							break;
						}
						navIndex++; // Count this item
						// If this section is expanded, count its children
						if (navItem.children && $expandedSections.has(navItem.id)) {
							navIndex += navItem.children.length;
						}
					}
					setNavIndex(navIndex);
					return;
				}
			}
		}

		// If not a child item, find it as a top-level item
		let navIndex = 0;
		for (const navItem of content.navItems) {
			if (navItem.id === id) {
				setNavIndex(navIndex);
				return;
			}
			navIndex++;
			if (navItem.children && $expandedSections.has(navItem.id)) {
				navIndex += navItem.children.length;
			}
		}
	}

	// Handle page-level keyboard actions
	function handleAction(action: KeyboardAction): void {
		switch (action) {
			case 'help':
				selectedId = 'intro';
				setNavIndex(0);
				break;
			case 'game':
				showGame();
				break;
		}
	}

	// Handle content panel keyboard navigation
	function handleContentKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		// Handle game action globally
		if (action === 'game') {
			showGame();
			return true;
		}

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
</script>

<svelte:head>
	<title>{content.meta.title}</title>
	<meta name="description" content={content.meta.description} />
</svelte:head>

<TUILayout title="Glider MCP">
	{#snippet leftPanel()}
		<TUINavigationTree items={content.navItems} onSelect={handleNavSelect} />
	{/snippet}

	{#snippet rightPanel()}
		<div class="content-area" class:focused={currentFocusedPanel === 'right'}>
			<HomeContent
				selectedId={selectedId}
				{content}
				expandedTools={expandedTools}
				onSelect={handleContentSelect}
				onToggleTool={toggleToolExpand}
			/>
		</div>
	{/snippet}
</TUILayout>

<FlappyBird />

<style>
	.content-area {
		padding: var(--spacing-md);
		padding-left: var(--spacing-lg);
		height: 100%;
		overflow: auto;
	}

	.content-area.focused {
		outline: 1px solid var(--border);
		outline-offset: -1px;
	}

	.content-area :global(.intro-content) {
		max-width: 650px;
	}

	.content-area :global(.tagline) {
		color: var(--accent);
		font-size: var(--font-size-base);
		margin-bottom: var(--spacing-lg);
	}

	.content-area :global(h2) {
		color: var(--text-primary);
		font-size: var(--font-size-lg);
		font-weight: 700;
		margin: 0 0 var(--spacing-md) 0;
		border-bottom: 1px solid var(--border-dim);
		padding-bottom: var(--spacing-sm);
	}

	.content-area :global(h3) {
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		font-weight: 600;
		margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
	}

	.content-area :global(p) {
		color: var(--text-secondary);
		margin: 0 0 var(--spacing-md) 0;
		line-height: 1.6;
	}

	.content-area :global(.muted) {
		color: var(--text-muted);
	}

	.content-area :global(.hint) {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.content-area :global(.feature-list) {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--spacing-lg) 0;
		color: var(--text-secondary);
	}

	.content-area :global(.feature-list li) {
		padding: var(--spacing-xs) 0;
	}

	.content-area :global(.feature-list li::before) {
		content: '- ';
		color: var(--text-muted);
	}

	.content-area :global(.link) {
		color: var(--accent);
		text-decoration: none;
	}

	.content-area :global(.link:hover) {
		text-decoration: underline;
	}

	/* Client grid */
	.content-area :global(.client-grid) {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
	}

	.content-area :global(.client-card) {
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

	.content-area :global(.client-card:hover) {
		border-color: var(--accent);
	}

	.content-area :global(.client-card:focus) {
		outline: none;
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.content-area :global(.client-card:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.content-area :global(.client-card.selected) {
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.content-area :global(.client-grid.active .client-card.selected) {
		border-color: var(--accent);
		background-color: var(--selection-bg);
	}

	.content-area :global(.client-grid.active .client-card.selected .client-name),
	.content-area :global(.client-grid.active .client-card.selected .client-desc) {
		color: var(--selection-fg);
	}

	.content-area :global(.client-grid:not(.active) .client-card.selected) {
		border-color: var(--border);
		background-color: var(--selection-bg-dim);
	}

	.content-area :global(.client-name) {
		color: var(--accent);
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
	}

	.content-area :global(.client-desc) {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	/* Tool category */
	.content-area :global(.tool-category) {
		margin-bottom: var(--spacing-xl);
	}

	.content-area :global(.tool-category h3) {
		color: var(--accent);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: var(--spacing-xs);
	}

	.content-area :global(.category-desc) {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-md);
	}

	.content-area :global(.tool-category-badge) {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-top: calc(-1 * var(--spacing-sm));
	}

	/* Params table */
	.content-area :global(.params-table) {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--font-size-sm);
		margin: var(--spacing-md) 0;
	}

	.content-area :global(.params-table th) {
		text-align: left;
		color: var(--text-muted);
		font-weight: 500;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
	}

	.content-area :global(.params-table td) {
		padding: var(--spacing-xs) var(--spacing-sm);
		color: var(--text-secondary);
		vertical-align: top;
		border-bottom: 1px solid var(--border-dim);
	}

	.content-area :global(.param-name) {
		color: var(--accent) !important;
		font-family: var(--font-mono);
	}

	.content-area :global(.param-type) {
		color: var(--text-muted) !important;
		font-family: var(--font-mono);
	}

	.content-area :global(.example-desc) {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-xs);
	}

	/* FAQ */
	.content-area :global(.faq-item) {
		margin-bottom: var(--spacing-lg);
		padding-bottom: var(--spacing-lg);
		border-bottom: 1px solid var(--border-dim);
	}

	.content-area :global(.faq-item:last-child) {
		border-bottom: none;
	}

	.content-area :global(.faq-item h3) {
		color: var(--text-primary);
		margin-top: 0;
	}

	.content-area :global(.faq-item code) {
		background-color: var(--bg-secondary);
		padding: 2px var(--spacing-xs);
		color: var(--accent);
	}

	/* Pricing */
	.content-area :global(.pricing-card) {
		background-color: var(--bg-secondary);
		border: 1px solid var(--accent);
		padding: var(--spacing-lg);
		margin: var(--spacing-lg) 0;
		max-width: 300px;
	}

	.content-area :global(.pricing-card h3) {
		margin: 0 0 var(--spacing-sm) 0;
		color: var(--accent);
	}

	.content-area :global(.price) {
		font-size: 2rem;
		color: var(--text-primary);
		font-weight: 700;
		margin: 0 0 var(--spacing-md) 0;
	}
</style>
