import { describe, it, expect, beforeEach } from 'vitest';
import {
	focusedPanel,
	navSelectedIndex,
	expandedSections,
	modalOpen,
	isLeftFocused,
	isRightFocused,
	togglePanel,
	setFocusedPanel,
	navUp,
	navDown,
	setNavIndex,
	toggleSection,
	expandSection,
	collapseSection,
	isSectionExpanded,
	setModalOpen,
	resetNavigation
} from '../keyboard';

describe('keyboard store', () => {
	beforeEach(() => {
		resetNavigation();
	});

	describe('focusedPanel', () => {
		it('should default to left panel', () => {
			expect(focusedPanel.get()).toBe('left');
		});

		it('should allow setting to right panel', () => {
			setFocusedPanel('right');
			expect(focusedPanel.get()).toBe('right');
		});
	});

	describe('computed focus states', () => {
		it('should return true for isLeftFocused when left is focused', () => {
			setFocusedPanel('left');
			expect(isLeftFocused.get()).toBe(true);
			expect(isRightFocused.get()).toBe(false);
		});

		it('should return true for isRightFocused when right is focused', () => {
			setFocusedPanel('right');
			expect(isLeftFocused.get()).toBe(false);
			expect(isRightFocused.get()).toBe(true);
		});
	});

	describe('togglePanel', () => {
		it('should toggle from left to right', () => {
			setFocusedPanel('left');
			togglePanel();
			expect(focusedPanel.get()).toBe('right');
		});

		it('should toggle from right to left', () => {
			setFocusedPanel('right');
			togglePanel();
			expect(focusedPanel.get()).toBe('left');
		});

		it('should not toggle when modal is open', () => {
			setFocusedPanel('left');
			setModalOpen(true);
			togglePanel();
			expect(focusedPanel.get()).toBe('left');
		});
	});

	describe('navSelectedIndex', () => {
		it('should default to 0', () => {
			expect(navSelectedIndex.get()).toBe(0);
		});

		it('should allow setting index', () => {
			setNavIndex(5);
			expect(navSelectedIndex.get()).toBe(5);
		});
	});

	describe('navUp', () => {
		it('should decrement index when above 0', () => {
			setNavIndex(5);
			navUp();
			expect(navSelectedIndex.get()).toBe(4);
		});

		it('should not go below 0', () => {
			setNavIndex(0);
			navUp();
			expect(navSelectedIndex.get()).toBe(0);
		});
	});

	describe('navDown', () => {
		it('should increment index when below max', () => {
			setNavIndex(3);
			navDown(10);
			expect(navSelectedIndex.get()).toBe(4);
		});

		it('should not go above maxIndex', () => {
			setNavIndex(10);
			navDown(10);
			expect(navSelectedIndex.get()).toBe(10);
		});
	});

	describe('expandedSections', () => {
		it('should start with empty set', () => {
			expect(expandedSections.get().size).toBe(0);
		});

		it('should allow expanding sections', () => {
			expandSection('tools');
			expect(isSectionExpanded('tools')).toBe(true);
		});

		it('should allow collapsing sections', () => {
			expandSection('tools');
			collapseSection('tools');
			expect(isSectionExpanded('tools')).toBe(false);
		});

		it('should toggle section state', () => {
			toggleSection('tools');
			expect(isSectionExpanded('tools')).toBe(true);
			toggleSection('tools');
			expect(isSectionExpanded('tools')).toBe(false);
		});
	});

	describe('modalOpen', () => {
		it('should default to false', () => {
			expect(modalOpen.get()).toBe(false);
		});

		it('should allow setting modal state', () => {
			setModalOpen(true);
			expect(modalOpen.get()).toBe(true);
		});
	});

	describe('resetNavigation', () => {
		it('should reset all state to defaults', () => {
			setFocusedPanel('right');
			setNavIndex(5);
			expandSection('tools');
			setModalOpen(true);

			resetNavigation();

			expect(focusedPanel.get()).toBe('left');
			expect(navSelectedIndex.get()).toBe(0);
			expect(expandedSections.get().size).toBe(0);
			expect(modalOpen.get()).toBe(false);
		});
	});
});
