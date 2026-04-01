import { describe, expect, it } from 'vitest';
import { keyboardManager } from '../keyboard-manager';

describe('keyboard manager display labels', () => {
	it('uses the shared terminal-style labels for status-bar hints', () => {
		expect(keyboardManager.getKeyDisplay('theme')).toBe('F9');
		expect(keyboardManager.getKeyDisplay('tab')).toBe('Tab');
		expect(keyboardManager.getKeyDisplay('back')).toBe('Esc');
		expect(keyboardManager.getKeyDisplay('copy')).toBe('^C');
		expect(keyboardManager.getKeyDisplay('game')).toBe('^G');
	});
});