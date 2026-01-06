<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import type { TreeNode } from '$lib/types/visualizations';

	interface Props {
		data: TreeNode;
		title?: string;
		interactive?: boolean;
		onNodeSelect?: (node: TreeNode, path: number[]) => void;
	}

	let { data, title = '', interactive = true, onNodeSelect }: Props = $props();

	// Flatten tree for keyboard navigation
	interface FlatNode {
		node: TreeNode;
		depth: number;
		path: number[];
		isLast: boolean;
		prefixes: string[];
		isExpanded: boolean;
		hasChildren: boolean;
	}

	// Track collapsed state for each path (stringified)
	let collapsedPaths = $state<Set<string>>(new Set());
	let selectedIndex = $state(0);

	function getPathKey(path: number[]): string {
		return path.join('-');
	}

	function isCollapsed(path: number[]): boolean {
		return collapsedPaths.has(getPathKey(path));
	}

	function toggleCollapsed(path: number[]): void {
		const key = getPathKey(path);
		const newSet = new Set(collapsedPaths);
		if (newSet.has(key)) {
			newSet.delete(key);
		} else {
			newSet.add(key);
		}
		collapsedPaths = newSet;
	}

	// Flatten tree for rendering
	const flatNodes = $derived.by(() => {
		const result: FlatNode[] = [];

		function flatten(
			node: TreeNode,
			depth: number,
			path: number[],
			isLast: boolean,
			prefixes: string[]
		): void {
			const hasChildren = !!node.children?.length;
			const collapsed = isCollapsed(path);

			result.push({
				node,
				depth,
				path: [...path],
				isLast,
				prefixes: [...prefixes],
				isExpanded: hasChildren && !collapsed,
				hasChildren
			});

			if (hasChildren && !collapsed) {
				const childPrefixes = [...prefixes, isLast ? '   ' : '│  '];
				node.children!.forEach((child, i) => {
					const childIsLast = i === node.children!.length - 1;
					flatten(child, depth + 1, [...path, i], childIsLast, childPrefixes);
				});
			}
		}

		flatten(data, 0, [0], true, []);
		return result;
	});

	// Keep selection in bounds
	$effect(() => {
		if (selectedIndex >= flatNodes.length) {
			selectedIndex = Math.max(0, flatNodes.length - 1);
		}
	});

	function getTypeIcon(type?: string): string {
		switch (type) {
			case 'class':
				return 'C';
			case 'interface':
				return 'I';
			case 'base':
				return 'B';
			case 'method':
				return 'M';
			case 'property':
				return 'P';
			case 'namespace':
				return 'N';
			case 'file':
				return 'F';
			case 'folder':
				return 'D';
			default:
				return ' ';
		}
	}

	function getPrefix(flat: FlatNode): string {
		if (flat.depth === 0) return '';
		const connector = flat.isLast ? '└─' : '├─';
		return flat.prefixes.join('') + connector;
	}

	function getExpandIcon(flat: FlatNode): string {
		if (!flat.hasChildren) return ' ';
		return flat.isExpanded ? '▼' : '▶';
	}

	function handleKeyboard(action: KeyboardAction): boolean {
		if (!interactive) return false;

		switch (action) {
			case 'up':
				if (selectedIndex > 0) {
					selectedIndex--;
					scrollToSelected();
				}
				return true;

			case 'down':
				if (selectedIndex < flatNodes.length - 1) {
					selectedIndex++;
					scrollToSelected();
				}
				return true;

			case 'left': {
				const current = flatNodes[selectedIndex];
				if (current?.hasChildren && current.isExpanded) {
					toggleCollapsed(current.path);
				}
				return true;
			}

			case 'right': {
				const current = flatNodes[selectedIndex];
				if (current?.hasChildren && !current.isExpanded) {
					toggleCollapsed(current.path);
				}
				return true;
			}

			case 'select': {
				const current = flatNodes[selectedIndex];
				if (current) {
					if (current.hasChildren) {
						toggleCollapsed(current.path);
					}
					onNodeSelect?.(current.node, current.path);
				}
				return true;
			}

			case 'home':
				selectedIndex = 0;
				scrollToSelected();
				return true;

			case 'end':
				selectedIndex = flatNodes.length - 1;
				scrollToSelected();
				return true;

			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		requestAnimationFrame(() => {
			const container = document.querySelector('.ascii-tree');
			const selectedEl = container?.querySelector('.tree-node.selected');
			if (container && selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}

	function handleNodeClick(index: number): void {
		selectedIndex = index;
		const flat = flatNodes[index];
		if (flat) {
			if (flat.hasChildren) {
				toggleCollapsed(flat.path);
			}
			onNodeSelect?.(flat.node, flat.path);
		}
	}

	// Register keyboard handler
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		if (interactive) {
			unsubscribe = keyboardManager.addHandler(handleKeyboard);
		}
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="ascii-tree-container">
	{#if title}
		<div class="tree-title">{title}</div>
	{/if}
	<div class="ascii-tree" role="tree" aria-label={title || 'Tree view'}>
		{#each flatNodes as flat, index}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="tree-node"
				class:selected={interactive && index === selectedIndex}
				class:has-children={flat.hasChildren}
				role="treeitem"
				aria-selected={interactive && index === selectedIndex}
				aria-expanded={flat.hasChildren ? flat.isExpanded : undefined}
				tabindex={interactive && index === selectedIndex ? 0 : -1}
				onclick={() => interactive && handleNodeClick(index)}
			>
				<span class="prefix">{getPrefix(flat)}</span>
				<span class="expand-icon" class:visible={flat.hasChildren}>{getExpandIcon(flat)}</span>
				<span class="type-icon" data-type={flat.node.type}>[{getTypeIcon(flat.node.type)}]</span>
				<span class="node-name">{flat.node.name}</span>
				{#if flat.node.meta}
					<span class="node-meta">{flat.node.meta}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.ascii-tree-container {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		height: 100%;
	}

	.tree-title {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.ascii-tree {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
	}

	.tree-node {
		display: flex;
		align-items: center;
		padding: 2px 0;
		line-height: 1.4;
		white-space: nowrap;
		cursor: default;
	}

	.tree-node.has-children {
		cursor: pointer;
	}

	.tree-node:hover {
		background-color: var(--focus-bg);
	}

	.tree-node.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.prefix {
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.tree-node.selected .prefix {
		color: var(--selection-fg);
		opacity: 0.7;
	}

	.expand-icon {
		width: 12px;
		margin-right: 4px;
		color: var(--accent);
		flex-shrink: 0;
		visibility: hidden;
	}

	.expand-icon.visible {
		visibility: visible;
	}

	.tree-node.selected .expand-icon {
		color: var(--selection-fg);
	}

	.type-icon {
		margin-right: var(--spacing-xs);
		font-size: var(--font-size-xs);
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.type-icon[data-type='class'] {
		color: var(--accent);
	}

	.type-icon[data-type='interface'] {
		color: #ff79c6;
	}

	.type-icon[data-type='method'] {
		color: #8be9fd;
	}

	.type-icon[data-type='property'] {
		color: #bd93f9;
	}

	.type-icon[data-type='namespace'] {
		color: #ffb86c;
	}

	.tree-node.selected .type-icon {
		color: var(--selection-fg);
	}

	.node-name {
		color: var(--text-primary);
	}

	.tree-node.selected .node-name {
		color: var(--selection-fg);
	}

	.node-meta {
		margin-left: var(--spacing-sm);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.tree-node.selected .node-meta {
		color: var(--selection-fg);
		opacity: 0.8;
	}
</style>
