<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { keyboardManager, type KeyboardAction } from '$lib/services/keyboard-manager';
	import type { TimelineEntry } from '$lib/types/visualizations';

	interface Props {
		entries: TimelineEntry[];
		title?: string;
		interactive?: boolean;
		maxEntries?: number;
		onEntrySelect?: (entry: TimelineEntry, index: number) => void;
	}

	let {
		entries,
		title = 'Request History',
		interactive = true,
		maxEntries = 50,
		onEntrySelect
	}: Props = $props();

	let selectedIndex = $state(0);

	// Limit and sort entries (newest first)
	const displayEntries = $derived.by(() => {
		return [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, maxEntries);
	});

	// Keep selection in bounds
	$effect(() => {
		if (selectedIndex >= displayEntries.length && displayEntries.length > 0) {
			selectedIndex = Math.max(0, displayEntries.length - 1);
		}
	});

	function formatTime(timestamp: number): string {
		const date = new Date(timestamp);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	function formatDuration(ms: number): string {
		if (ms < 1000) {
			return `${ms}ms`;
		} else if (ms < 10000) {
			return `${(ms / 1000).toFixed(1)}s`;
		} else {
			return `${(ms / 1000).toFixed(0)}s`;
		}
	}

	function handleKeyboard(action: KeyboardAction): boolean {
		if (!interactive || displayEntries.length === 0) return false;

		switch (action) {
			case 'up':
				if (selectedIndex > 0) {
					selectedIndex--;
					scrollToSelected();
				}
				return true;

			case 'down':
				if (selectedIndex < displayEntries.length - 1) {
					selectedIndex++;
					scrollToSelected();
				}
				return true;

			case 'select': {
				const entry = displayEntries[selectedIndex];
				if (entry) {
					onEntrySelect?.(entry, selectedIndex);
				}
				return true;
			}

			case 'home':
				selectedIndex = 0;
				scrollToSelected();
				return true;

			case 'end':
				selectedIndex = displayEntries.length - 1;
				scrollToSelected();
				return true;

			default:
				return false;
		}
	}

	function scrollToSelected(): void {
		requestAnimationFrame(() => {
			const container = document.querySelector('.timeline-list');
			const selectedEl = container?.querySelector('.timeline-entry.selected');
			if (container && selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}

	function handleEntryClick(index: number): void {
		if (!interactive) return;
		selectedIndex = index;
		const entry = displayEntries[index];
		if (entry) {
			onEntrySelect?.(entry, index);
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

<div class="ascii-timeline-container">
	{#if title}
		<div class="timeline-title">
			<span>{title}</span>
			<span class="entry-count">({displayEntries.length} entries)</span>
		</div>
	{/if}
	<div class="timeline-list" aria-label={title}>
		{#if displayEntries.length > 0}
			{#each displayEntries as entry, index}
				<button
					type="button"
					class="timeline-entry"
					class:selected={interactive && index === selectedIndex}
					class:success={entry.success}
					class:error={!entry.success}
					aria-pressed={interactive && index === selectedIndex}
					tabindex={interactive && index === selectedIndex ? 0 : -1}
					onclick={() => handleEntryClick(index)}
					disabled={!interactive}
				>
					<span class="timestamp">[{formatTime(entry.timestamp)}]</span>
					<span class="tool-name">{entry.toolName}</span>
					<span class="arrow">→</span>
					<span class="duration">{formatDuration(entry.duration)}</span>
					<span class="status-icon">{entry.success ? '✓' : '✗'}</span>
					{#if !entry.success && entry.error}
						<span class="error-hint" title={entry.error}>({entry.error.slice(0, 30)}{entry.error.length > 30 ? '...' : ''})</span>
					{/if}
				</button>
			{/each}
		{:else}
			<div class="empty-state">
				<p>No requests yet.</p>
				<p class="hint">Execute a tool to see history here.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.ascii-timeline-container {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		height: 100%;
	}

	.timeline-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.entry-count {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.timeline-list {
		flex: 1;
		overflow: auto;
		padding: var(--spacing-sm);
	}

	.timeline-entry {
		display: flex;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		line-height: 1.4;
		white-space: nowrap;
		cursor: pointer;
		border-left: 2px solid transparent;
		background: none;
		border-top: none;
		border-right: none;
		border-bottom: none;
		width: 100%;
		text-align: left;
		font: inherit;
		color: inherit;
	}

	.timeline-entry:disabled {
		cursor: default;
		opacity: 0.7;
	}

	.timeline-entry:hover {
		background-color: var(--focus-bg);
	}

	.timeline-entry.selected {
		background-color: var(--selection-bg);
		color: var(--selection-fg);
	}

	.timeline-entry.success {
		border-left-color: var(--accent);
	}

	.timeline-entry.error {
		border-left-color: var(--error, #ff5555);
	}

	.timeline-entry.selected.success,
	.timeline-entry.selected.error {
		border-left-color: var(--selection-fg);
	}

	.timestamp {
		color: var(--text-muted);
		flex-shrink: 0;
		margin-right: var(--spacing-sm);
	}

	.timeline-entry.selected .timestamp {
		color: var(--selection-fg);
		opacity: 0.8;
	}

	.tool-name {
		color: var(--accent);
		flex-shrink: 0;
	}

	.timeline-entry.selected .tool-name {
		color: var(--selection-fg);
	}

	.arrow {
		color: var(--text-muted);
		margin: 0 var(--spacing-xs);
		flex-shrink: 0;
	}

	.timeline-entry.selected .arrow {
		color: var(--selection-fg);
		opacity: 0.7;
	}

	.duration {
		color: var(--text-secondary);
		flex-shrink: 0;
		margin-right: var(--spacing-xs);
	}

	.timeline-entry.selected .duration {
		color: var(--selection-fg);
	}

	.status-icon {
		flex-shrink: 0;
		font-weight: bold;
	}

	.timeline-entry.success .status-icon {
		color: var(--accent);
	}

	.timeline-entry.error .status-icon {
		color: var(--error, #ff5555);
	}

	.timeline-entry.selected .status-icon {
		color: var(--selection-fg);
	}

	.error-hint {
		margin-left: var(--spacing-sm);
		font-size: var(--font-size-xs);
		color: var(--error, #ff5555);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timeline-entry.selected .error-hint {
		color: var(--selection-fg);
		opacity: 0.8;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-lg);
		color: var(--text-muted);
		text-align: center;
	}

	.empty-state p {
		margin: 0;
	}

	.empty-state .hint {
		margin-top: var(--spacing-sm);
		font-size: var(--font-size-sm);
	}
</style>
