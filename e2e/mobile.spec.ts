import { test, expect } from '@playwright/test';

test.describe('Mobile layout', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should toggle the navigation drawer', async ({ page }) => {
		const main = page.locator('.tui-main');
		await expect(main).not.toHaveClass(/mobile-nav-open/);

		await page.locator('button.hamburger-button').click();
		await expect(main).toHaveClass(/mobile-nav-open/);

		await page.locator('.tui-panel-overlay').click();
		await expect(main).not.toHaveClass(/mobile-nav-open/);
	});

	test('should toggle theme from the header on mobile', async ({ page }) => {
		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-theme', 'ncurses-dark');

		const themeButton = page.locator('button.theme-indicator');
		await expect(themeButton).toBeVisible();
		await expect(page.locator('.theme-toggle')).not.toBeVisible();

		await themeButton.click();
		await expect(html).toHaveAttribute('data-theme', 'total-commander');
	});

	test('should hide the footer status bar on mobile', async ({ page }) => {
		await expect(page.locator('.tui-statusbar')).not.toBeVisible();
	});
});
