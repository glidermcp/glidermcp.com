<script lang="ts">
	import { onMount, onDestroy, tick, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import {
		focusedPanel,
		navSelectedIndex,
		expandedSections,
		navUp,
		navDown,
		setNavIndex,
		toggleSection,
		expandSection,
		collapseSection
	} from '$stores/keyboard';
	import type { NavItem } from '$types/navigation';

	interface Props {
		items: NavItem[];
		currentPath?: string;
	}

	let { items, currentPath = '/' }: Props = $props();

	// Flatten items for keyboard navigation
	interface FlatItem {
		item: NavItem;
		depth: number;
		parentId?: string;
		isExpanded?: boolean;
		hasChildren: boolean;
	}

	// Reactive derived state
	const flatItems = $derived.by(() => {
		const result: FlatItem[] = [];
		const expanded = $expandedSections;

		function flatten(navItems: NavItem[], depth = 0, parentId?: string) {
			for (const item of navItems) {
				const hasChildren = !!item.children?.length;
				const isExpanded = expanded.has(item.id);

				result.push({
					item,
					depth,
					parentId,
					isExpanded,
					hasChildren
				});

				if (hasChildren && isExpanded) {
					flatten(item.children!, depth + 1, item.id);
				}
			}
		}

		flatten(items);
		return result;
	});

	const selectedIndex = $derived($navSelectedIndex);
	const isActive = $derived($focusedPanel === 'left');

	// Track last synced path to detect actual navigation changes
	let lastSyncedPath = $state('');

	function findParentChain(navItems: NavItem[], href: string, parents: string[] = []): string[] | null {
		for (const item of navItems) {
			if (item.href === href) {
				return item.children?.length ? [...parents, item.id] : parents;
			}

			if (item.children?.length) {
				const result = findParentChain(item.children, href, [...parents, item.id]);
				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	// Sync selection with current path when the path actually changes (user navigated)
	// This should ONLY run when currentPath changes, not when flatItems changes
	$effect(() => {
		const path = currentPath; // Only depend on currentPath
		if (path !== lastSyncedPath) {
			lastSyncedPath = path;
			const parentChain = findParentChain(items, path) ?? [];
			for (const id of parentChain) {
				expandSection(id);
			}

			// Use untrack to prevent flatItems from being a dependency
			untrack(() => {
				tick().then(() => {
					const pathIndex = flatItems.findIndex(f => f.item.href === path);
					if (pathIndex >= 0) {
						setNavIndex(pathIndex);
					}
				});
			});
		}
	});

	// Keep selection in bounds when items change
	$effect(() => {
		if (selectedIndex >= flatItems.length && flatItems.length > 0) {
			setNavIndex(flatItems.length - 1);
		}
	});

	function handleKeyboard(action: KeyboardAction, event: KeyboardEvent): boolean {
		// Only handle if left panel is focused
		if (!isActive) return false;

		switch (action) {
			case 'up':
				navUp();
				scrollToSelected();
				return true;

			case 'down':
				navDown(flatItems.length - 1);
				scrollToSelected();
				return true;

			case 'left': {
				const current = flatItems[selectedIndex];
				if (!current) return false;

				if (current.hasChildren && current.isExpanded) {
					collapseSection(current.item.id);
				} else if (current.parentId) {
					// Jump to parent
					const parentIndex = flatItems.findIndex(f => f.item.id === current.parentId);
					if (parentIndex >= 0) {
						setNavIndex(parentIndex);
						scrollToSelected();
					}
				}
				return true;
			}

			case 'right': {
				const current = flatItems[selectedIndex];
				if (!current) return false;

				if (current.hasChildren) {
					if (!current.isExpanded) {
						expandSection(current.item.id);
					} else {
						// Move to first child
						if (selectedIndex + 1 < flatItems.length) {
							setNavIndex(selectedIndex + 1);
							scrollToSelected();
						}
					}
				}
				return true;
			}

			case 'toggle': {
				// IMPORTANT: Prevent default immediately to stop Space from triggering
				// the native anchor click behavior which would navigate to the href
				event.preventDefault();
				event.stopPropagation();

				// Space: Toggle expand/collapse for sections with children
				const current = flatItems[selectedIndex];
				if (!current || current.item.disabled) 
					return true;

				if (current.hasChildren) {
					toggleSection(current.item.id);
				}
				return true;
			}

			case 'select': {
				// Enter: Navigate to the page
				const current = flatItems[selectedIndex];
				if (!current || current.item.disabled) return false;

				goto(current.item.href);
				return true;
			}

			case 'home': {
				setNavIndex(0);
				scrollToSelected();
				return true;
			}

			case 'end': {
				setNavIndex(flatItems.length - 1);
				scrollToSelected();
				return true;
			}

			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		// Use requestAnimationFrame to ensure DOM is updated
		requestAnimationFrame(() => {
			const container = document.querySelector('.nav-tree');
			const selectedEl = document.querySelector('.nav-item.selected');
			if (container && selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}

	function handleItemClick(event: MouseEvent, index: number): void {
		// Ignore clicks triggered by keyboard (Space/Enter activate anchors)
		// We handle keyboard navigation separately in handleKeyboard
		if (event.detail === 0) return;

		const flat = flatItems[index];
		if (!flat || flat.item.disabled) return;

		setNavIndex(index);

		if (flat.hasChildren) {
			toggleSection(flat.item.id);
		}

		// Navigate via SvelteKit (link will handle it, but prevent default to avoid flash)
		// Actually let the anchor handle navigation
	}

	function handleToggleClick(event: MouseEvent, index: number): void {
		event.preventDefault();
		event.stopPropagation();

		const flat = flatItems[index];
		if (!flat || !flat.hasChildren) return;

		toggleSection(flat.item.id);
	}

	// Check if a path is the current path or is an ancestor
	function isCurrentPath(href: string): boolean {
		return currentPath === href;
	}

	// Register keyboard handler
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = keyboardManager.addHandler(handleKeyboard);
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	function getPrefix(flat: FlatItem): string {
		if (flat.hasChildren) {
			return flat.isExpanded ? '▼' : '▶';
		}
		return '•';
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<nav class="nav-tree" class:active={isActive} role="tree" aria-label="Navigation">
	{#each flatItems as flat, index}
		<a
			href={flat.item.href}
			class="nav-item"
			class:playground={flat.item.href === '/playground'}
			class:selected={index === selectedIndex}
			class:current={isCurrentPath(flat.item.href)}
			class:disabled={flat.item.disabled}
			class:has-children={flat.hasChildren}
			class:expanded={flat.isExpanded}
			role="treeitem"
			aria-selected={index === selectedIndex}
			aria-expanded={flat.hasChildren ? flat.isExpanded : undefined}
			aria-disabled={flat.item.disabled}
			aria-current={isCurrentPath(flat.item.href) ? 'page' : undefined}
			tabindex={index === selectedIndex ? 0 : -1}
			style:padding-left="{flat.depth * 16 + 8}px"
			onclick={(e) => handleItemClick(e, index)}
			onkeydown={(e) => {
				// Prevent Space from triggering anchor click - we handle it in keyboard manager
				if (e.key === ' ') {
					e.preventDefault();
				}
			}}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				class="prefix"
				class:clickable={flat.hasChildren}
				onclick={(e) => flat.hasChildren && handleToggleClick(e, index)}
			>{getPrefix(flat)}</span>
			<span class="label">{flat.item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.nav-tree {
		display: flex;
		flex-direction: column;
		outline: none;
	}

	.nav-item {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		color: var(--text-primary);
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.4;
		text-decoration: none;
	}

	.nav-item:hover:not(.disabled) {
		background-color: var(--focus-bg);
	}

	.nav-item.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.nav-item.current {
		font-weight: 600;
	}

	.nav-tree.active .nav-item.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.nav-tree:not(.active) .nav-item.selected {
		background-color: var(--selection-bg-dim);
		color: var(--text-primary);
	}

	.nav-item.disabled {
		color: var(--text-muted);
		cursor: not-allowed;
		pointer-events: none;
	}

	.nav-item:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: -1px;
	}

	.prefix {
		flex-shrink: 0;
		width: 16px;
		margin-right: var(--spacing-xs);
		color: var(--text-secondary);
		font-size: var(--font-size-sm);
	}

	.prefix.clickable {
		cursor: pointer;
	}

	.prefix.clickable:hover {
		color: var(--accent);
	}

	.nav-item.selected .prefix {
		color: var(--selection-fg);
	}

	.nav-tree:not(.active) .nav-item.selected .prefix {
		color: var(--text-secondary);
	}

	.nav-item.has-children .prefix {
		color: var(--accent);
	}

	.nav-item.selected.has-children .prefix {
		color: var(--selection-fg);
	}

	.label {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 768px) {
		.nav-item.playground {
			display: none;
		}
	}
</style>
