<script lang="ts">
	import { history, clearHistory, type HistoryEntry } from '$stores/history';
	import { selectTool, setParams } from '$stores/playground';
	import { ASCIITimeline, type TimelineEntry } from '$lib/components/visualizations';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	const historyEntries = $derived($history);

	// Convert history entries to timeline format
	const timelineEntries = $derived.by((): TimelineEntry[] => {
		return historyEntries.map((entry) => ({
			id: entry.id,
			timestamp: entry.timestamp,
			toolName: entry.toolName,
			duration: entry.duration,
			success: entry.success,
			error: entry.error
		}));
	});

	function handleEntrySelect(entry: TimelineEntry): void {
		// Find the original history entry
		const historyEntry = historyEntries.find((h) => h.id === entry.id);
		if (historyEntry) {
			// Load the tool and params from history
			selectTool(historyEntry.toolId);
			setParams(historyEntry.params);
			onClose?.();
		}
	}

	function handleClearHistory(): void {
		if (confirm('Clear all request history?')) {
			clearHistory();
		}
	}
</script>

<div class="history-view">
	<div class="history-header">
		<span class="header-title">Request History</span>
		<div class="header-actions">
			{#if historyEntries.length > 0}
				<button type="button" class="action-btn" onclick={handleClearHistory}>
					Clear All
				</button>
			{/if}
			{#if onClose}
				<button type="button" class="action-btn" onclick={onClose}>
					Close
				</button>
			{/if}
		</div>
	</div>

	<div class="history-content">
		<ASCIITimeline
			entries={timelineEntries}
			title=""
			onEntrySelect={handleEntrySelect}
		/>
	</div>

	<div class="history-footer">
		<span class="hint">Press <kbd>Enter</kbd> to reload a request</span>
	</div>
</div>

<style>
	.history-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		font-family: var(--font-mono);
	}

	.history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-bottom: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.header-title {
		font-size: var(--font-size-sm);
		color: var(--text-secondary);
		font-weight: 500;
	}

	.header-actions {
		display: flex;
		gap: var(--spacing-sm);
	}

	.action-btn {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		background: none;
		border: 1px solid var(--border-dim);
		padding: 2px var(--spacing-xs);
		cursor: pointer;
	}

	.action-btn:hover {
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.history-content {
		flex: 1;
		overflow: hidden;
	}

	.history-footer {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-top: 1px solid var(--border-dim);
		flex-shrink: 0;
	}

	.hint {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	kbd {
		background-color: var(--status-key-bg);
		color: var(--status-key-fg);
		padding: 2px var(--spacing-xs);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
	}
</style>
