import { test, expect } from '@playwright/test';

test.describe('Flappy Glider Game', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should launch game with Ctrl+G shortcut', async ({ page }) => {
		// Press Ctrl+G to launch game
		await page.keyboard.press('Control+g');

		// Wait for game modal to appear
		const gameModal = page.locator('.game-container');
		await expect(gameModal).toBeVisible();
	});

	test('should launch game by clicking ^G button in status bar', async ({ page }) => {
		// Find and click the Game button in the status bar
		const gameButton = page.locator('.status-key').filter({ hasText: '^G' });
		await gameButton.click();

		// Wait for game modal to appear
		const gameModal = page.locator('.game-container');
		await expect(gameModal).toBeVisible();
	});

	test('should close game with Escape key', async ({ page }) => {
		// Launch game
		await page.keyboard.press('Control+g');

		// Wait for game modal to appear
		const gameModal = page.locator('.game-container');
		await expect(gameModal).toBeVisible();

		// Press Escape to close
		await page.keyboard.press('Escape');

		// Game modal should be hidden
		await expect(gameModal).not.toBeVisible();
	});
});
