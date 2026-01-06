/**
 * History Store
 * Tracks request history with localStorage persistence
 */

import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { nanoid } from 'nanoid';

/**
 * History entry
 */
export interface HistoryEntry {
	id: string;
	toolId: string;
	toolName: string;
	params: Record<string, unknown>;
	success: boolean;
	error?: string;
	duration: number;
	timestamp: number;
}

// Maximum history entries to keep
const MAX_HISTORY_ENTRIES = 100;

// Persistent history store
export const history = persistentAtom<HistoryEntry[]>('glider-mcp-history', [], {
	encode: JSON.stringify,
	decode: (str: string) => {
		try {
			return JSON.parse(str) as HistoryEntry[];
		} catch {
			return [];
		}
	}
});

// Derived: recent history (last 20)
export const recentHistory = computed(history, (entries: HistoryEntry[]) => {
	return entries.slice(0, 20);
});

// Derived: history count
export const historyCount = computed(history, (entries: HistoryEntry[]) => entries.length);

// Derived: successful requests count
export const successCount = computed(
	history,
	(entries: HistoryEntry[]) => entries.filter((e: HistoryEntry) => e.success).length
);

// Derived: failed requests count
export const failedCount = computed(
	history,
	(entries: HistoryEntry[]) => entries.filter((e: HistoryEntry) => !e.success).length
);

/**
 * Add a new history entry
 */
export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
	const newEntry: HistoryEntry = {
		...entry,
		id: nanoid(),
		timestamp: Date.now()
	};

	const current = history.get();
	const updated = [newEntry, ...current].slice(0, MAX_HISTORY_ENTRIES);
	history.set(updated);
}

/**
 * Remove a history entry
 */
export function removeHistoryEntry(id: string): void {
	const current = history.get();
	history.set(current.filter((e: HistoryEntry) => e.id !== id));
}

/**
 * Clear all history
 */
export function clearHistory(): void {
	history.set([]);
}

/**
 * Get history entry by ID
 */
export function getHistoryEntry(id: string): HistoryEntry | undefined {
	return history.get().find((e: HistoryEntry) => e.id === id);
}

/**
 * Get history for a specific tool
 */
export function getToolHistory(toolId: string): HistoryEntry[] {
	return history.get().filter((e: HistoryEntry) => e.toolId === toolId);
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
	if (ms < 1000) {
		return `${Math.round(ms)}ms`;
	}
	return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(ts: number): string {
	const date = new Date(ts);
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}
