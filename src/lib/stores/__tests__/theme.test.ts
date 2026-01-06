import { describe, it, expect, beforeEach, vi } from 'vitest';
import { theme, toggleTheme, setTheme, isDarkTheme, applyTheme } from '../theme';

describe('theme store', () => {
	beforeEach(() => {
		// Reset theme to default
		theme.set('ncurses-dark');
		// Clear any document mocks
		vi.clearAllMocks();
	});

	describe('theme atom', () => {
		it('should have ncurses-dark as default theme', () => {
			expect(theme.get()).toBe('ncurses-dark');
		});

		it('should persist theme changes', () => {
			theme.set('total-commander');
			expect(theme.get()).toBe('total-commander');
		});
	});

	describe('isDarkTheme computed', () => {
		it('should return true for ncurses-dark theme', () => {
			theme.set('ncurses-dark');
			expect(isDarkTheme.get()).toBe(true);
		});

		it('should return false for total-commander theme', () => {
			theme.set('total-commander');
			expect(isDarkTheme.get()).toBe(false);
		});
	});

	describe('toggleTheme', () => {
		it('should toggle from ncurses-dark to total-commander', () => {
			theme.set('ncurses-dark');
			toggleTheme();
			expect(theme.get()).toBe('total-commander');
		});

		it('should toggle from total-commander to ncurses-dark', () => {
			theme.set('total-commander');
			toggleTheme();
			expect(theme.get()).toBe('ncurses-dark');
		});
	});

	describe('setTheme', () => {
		it('should set theme to specified value', () => {
			setTheme('total-commander');
			expect(theme.get()).toBe('total-commander');

			setTheme('ncurses-dark');
			expect(theme.get()).toBe('ncurses-dark');
		});
	});

	describe('applyTheme', () => {
		it('should set data-theme attribute on document element', () => {
			const mockSetAttribute = vi.fn();
			Object.defineProperty(globalThis, 'document', {
				value: {
					documentElement: {
						setAttribute: mockSetAttribute
					}
				},
				writable: true
			});

			applyTheme('total-commander');
			expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'total-commander');
		});
	});
});
