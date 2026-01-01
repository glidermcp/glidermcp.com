<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
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
		onSelect?: (item: NavItem) => void;
	}

	let { items, onSelect }: Props = $props();

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
					// Collapse current section
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
						// Expand section
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

			case 'select': {
				const current = flatItems[selectedIndex];
				if (!current || current.item.disabled) return false;

				if (current.hasChildren) {
					toggleSection(current.item.id);
				}
				onSelect?.(current.item);
				return true;
			}

			case 'home':
				setNavIndex(0);
				scrollToSelected();
				return true;

			case 'end':
				setNavIndex(flatItems.length - 1);
				scrollToSelected();
				return true;

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

	function handleItemClick(index: number): void {
		setNavIndex(index);
		const flat = flatItems[index];
		if (!flat || flat.item.disabled) return;

		if (flat.hasChildren) {
			toggleSection(flat.item.id);
		}
		onSelect?.(flat.item);
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
		return flat.depth > 0 ? '•' : '▶';
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<nav class="nav-tree" class:active={isActive} role="tree" aria-label="Navigation">
	{#each flatItems as flat, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="nav-item"
			class:selected={index === selectedIndex}
			class:disabled={flat.item.disabled}
			class:has-children={flat.hasChildren}
			class:expanded={flat.isExpanded}
			role="treeitem"
			aria-selected={index === selectedIndex}
			aria-expanded={flat.hasChildren ? flat.isExpanded : undefined}
			aria-disabled={flat.item.disabled}
			tabindex={index === selectedIndex ? 0 : -1}
			style:padding-left="{flat.depth * 16 + 8}px"
			onclick={() => handleItemClick(index)}
		>
			<span class="prefix">{getPrefix(flat)}</span>
			<span class="label">{flat.item.label}</span>
		</div>
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
	}

	.nav-item:hover:not(.disabled) {
		background-color: var(--focus-bg);
	}

	.nav-item.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
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
</style>
