<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import type { SolutionNode } from '$lib/types/visualizations';

	interface Props {
		data: SolutionNode;
		title?: string;
		interactive?: boolean;
		onNodeSelect?: (node: SolutionNode, path: number[]) => void;
	}

	let { data, title = 'Solution Explorer', interactive = true, onNodeSelect }: Props = $props();

	// Flatten tree for keyboard navigation
	interface FlatNode {
		node: SolutionNode;
		depth: number;
		path: number[];
		isLast: boolean;
		prefixes: string[];
		isExpanded: boolean;
		hasChildren: boolean;
	}

	// Track collapsed state
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
			node: SolutionNode,
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

	function getTypeIcon(type: string): string {
		switch (type) {
			case 'solution':
				return 'S';
			case 'project':
				return 'P';
			case 'folder':
				return 'D';
			case 'file':
				return 'F';
			default:
				return ' ';
		}
	}

	function getTypeClass(type: string): string {
		return `type-${type}`;
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

	function formatMeta(node: SolutionNode): string {
		if (node.meta) return node.meta;
		if (node.fileCount !== undefined && node.type !== 'file') {
			return `(${node.fileCount} file${node.fileCount !== 1 ? 's' : ''})`;
		}
		return '';
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
			const container = document.querySelector('.solution-tree');
			const selectedEl = container?.querySelector('.solution-node.selected');
			if (container && selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}

	function handleNodeClick(index: number): void {
		if (!interactive) return;
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

<div class="solution-explorer-container">
	{#if title}
		<div class="explorer-title">{title}</div>
	{/if}
	<div class="solution-tree" role="tree" aria-label={title}>
		{#each flatNodes as flat, index}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="solution-node {getTypeClass(flat.node.type)}"
				class:selected={interactive && index === selectedIndex}
				class:has-children={flat.hasChildren}
				role="treeitem"
				aria-selected={interactive && index === selectedIndex}
				aria-expanded={flat.hasChildren ? flat.isExpanded : undefined}
				tabindex={interactive && index === selectedIndex ? 0 : -1}
				onclick={() => handleNodeClick(index)}
			>
				<span class="prefix">{getPrefix(flat)}</span>
				<span class="expand-icon" class:visible={flat.hasChildren}>{getExpandIcon(flat)}</span>
				<span class="type-icon">[{getTypeIcon(flat.node.type)}]</span>
				<span class="node-name">{flat.node.name}</span>
				{#if formatMeta(flat.node)}
					<span class="node-meta">{formatMeta(flat.node)}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.solution-explorer-container {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		height: 100%;
	}

	.explorer-title {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.solution-tree {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
	}

	.solution-node {
		display: flex;
		align-items: center;
		padding: 2px 0;
		line-height: 1.4;
		white-space: nowrap;
		cursor: default;
	}

	.solution-node.has-children {
		cursor: pointer;
	}

	.solution-node:hover {
		background-color: var(--focus-bg);
	}

	.solution-node.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.prefix {
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.solution-node.selected .prefix {
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

	.solution-node.selected .expand-icon {
		color: var(--selection-fg);
	}

	.type-icon {
		margin-right: var(--spacing-xs);
		font-size: var(--font-size-xs);
		flex-shrink: 0;
	}

	/* Type-specific colors */
	.solution-node.type-solution .type-icon {
		color: #ff79c6;
	}

	.solution-node.type-project .type-icon {
		color: var(--accent);
	}

	.solution-node.type-folder .type-icon {
		color: #ffb86c;
	}

	.solution-node.type-file .type-icon {
		color: var(--text-secondary);
	}

	.solution-node.selected .type-icon {
		color: var(--selection-fg);
	}

	.node-name {
		color: var(--text-primary);
	}

	/* Solution and project names are bold */
	.solution-node.type-solution .node-name,
	.solution-node.type-project .node-name {
		font-weight: 500;
	}

	.solution-node.selected .node-name {
		color: var(--selection-fg);
	}

	.node-meta {
		margin-left: var(--spacing-sm);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.solution-node.selected .node-meta {
		color: var(--selection-fg);
		opacity: 0.8;
	}
</style>
