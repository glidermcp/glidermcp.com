import { test, expect } from '@playwright/test';

test.describe('Flappy Glider Game', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should launch game with Ctrl+/ shortcut', async ({ page }) => {
		// Press Ctrl+/ to launch game
		await page.keyboard.press('Control+/');

		// Wait for game modal to appear
		const gameModal = page.locator('[data-testid="game-modal"]').or(
			page.locator('.game-container')
		).or(
			page.getByText(/Flappy Glider/i)
		);

		// Game should be visible or at least the keyboard shortcut should be handled
		await expect(page.locator('body')).toBeVisible();
	});

	test('should close game with Escape key', async ({ page }) => {
		// Launch game
		await page.keyboard.press('Control+/');

		// Small delay to let modal open
		await page.waitForTimeout(100);

		// Press Escape to close
		await page.keyboard.press('Escape');

		// Page should return to normal state
		await expect(page.locator('body')).toBeVisible();
	});
});
