import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';

export type ThemeType = 'ncurses-dark' | 'total-commander';

export const theme = persistentAtom<ThemeType>('glider-theme', 'ncurses-dark');

export const isDarkTheme = computed(theme, (t) => t === 'ncurses-dark');

export function toggleTheme(): void {
	const current = theme.get();
	theme.set(current === 'ncurses-dark' ? 'total-commander' : 'ncurses-dark');
}

export function setTheme(newTheme: ThemeType): void {
	theme.set(newTheme);
}

// Apply theme to document
export function applyTheme(themeValue: ThemeType): void {
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-theme', themeValue);
	}
}
