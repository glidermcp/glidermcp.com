/**
 * Keyboard Navigation Store
 * Tracks focus state for Commander-style panel navigation
 */

import { atom, computed } from 'nanostores';

export type FocusedPanel = 'left' | 'right';

// Which panel currently has focus
export const focusedPanel = atom<FocusedPanel>('left');

// Index of selected item in the left navigation tree
export const navSelectedIndex = atom<number>(0);

// Expanded sections in the navigation tree (by section id)
export const expandedSections = atom<Set<string>>(new Set());

// Whether a modal/dialog is open (blocks panel navigation)
export const modalOpen = atom<boolean>(false);

// Current content scroll position
export const contentScrollTop = atom<number>(0);

// Derived: is left panel focused
export const isLeftFocused = computed(focusedPanel, (panel) => panel === 'left');

// Derived: is right panel focused
export const isRightFocused = computed(focusedPanel, (panel) => panel === 'right');

/**
 * Toggle between left and right panels
 */
export function togglePanel(): void {
	if (modalOpen.get()) return;
	focusedPanel.set(focusedPanel.get() === 'left' ? 'right' : 'left');
}

/**
 * Set focused panel
 */
export function setFocusedPanel(panel: FocusedPanel): void {
	focusedPanel.set(panel);
}

/**
 * Move selection up in navigation
 */
export function navUp(): void {
	const current = navSelectedIndex.get();
	if (current > 0) {
		navSelectedIndex.set(current - 1);
	}
}

/**
 * Move selection down in navigation
 */
export function navDown(maxIndex: number): void {
	const current = navSelectedIndex.get();
	if (current < maxIndex) {
		navSelectedIndex.set(current + 1);
	}
}

/**
 * Set navigation selection
 */
export function setNavIndex(index: number): void {
	navSelectedIndex.set(index);
}

/**
 * Toggle section expansion
 */
export function toggleSection(sectionId: string): void {
	const current = expandedSections.get();
	const newSet = new Set(current);
	if (newSet.has(sectionId)) {
		newSet.delete(sectionId);
	} else {
		newSet.add(sectionId);
	}
	expandedSections.set(newSet);
}

/**
 * Expand a section
 */
export function expandSection(sectionId: string): void {
	const current = expandedSections.get();
	if (!current.has(sectionId)) {
		const newSet = new Set(current);
		newSet.add(sectionId);
		expandedSections.set(newSet);
	}
}

/**
 * Collapse a section
 */
export function collapseSection(sectionId: string): void {
	const current = expandedSections.get();
	if (current.has(sectionId)) {
		const newSet = new Set(current);
		newSet.delete(sectionId);
		expandedSections.set(newSet);
	}
}

/**
 * Check if section is expanded
 */
export function isSectionExpanded(sectionId: string): boolean {
	return expandedSections.get().has(sectionId);
}

/**
 * Set modal state
 */
export function setModalOpen(open: boolean): void {
	modalOpen.set(open);
}

/**
 * Reset navigation state
 */
export function resetNavigation(): void {
	focusedPanel.set('left');
	navSelectedIndex.set(0);
	expandedSections.set(new Set());
	modalOpen.set(false);
	contentScrollTop.set(0);
}
