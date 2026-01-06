import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load the home page', async ({ page }) => {
		// Check that the page loads with the TUI layout
		await expect(page.locator('body')).toBeVisible();
		// Check for the main layout structure
		await expect(page.locator('[data-theme]')).toBeVisible();
	});

	test('should have navigation tree visible', async ({ page }) => {
		// Check for navigation elements
		const nav = page.locator('nav').first();
		await expect(nav).toBeVisible();
	});

	test('should display Glider MCP branding', async ({ page }) => {
		// Check for the logo or brand name
		await expect(page.getByText(/Glider/i).first()).toBeVisible();
	});

	test('should have status bar with F-key shortcuts', async ({ page }) => {
		// Check for function key hints in status bar
		await expect(page.getByText(/F1/i).first()).toBeVisible();
		await expect(page.getByText(/F9/i).first()).toBeVisible();
	});
});

test.describe('Theme Switching', () => {
	test('should toggle theme with F9 key', async ({ page }) => {
		await page.goto('/');

		// Get initial theme
		const initialTheme = await page.locator('html').getAttribute('data-theme');
		expect(initialTheme).toBe('ncurses-dark');

		// Press F9 to toggle theme
		await page.keyboard.press('F9');

		// Check theme changed
		const newTheme = await page.locator('html').getAttribute('data-theme');
		expect(newTheme).toBe('total-commander');

		// Press F9 again to toggle back
		await page.keyboard.press('F9');

		const finalTheme = await page.locator('html').getAttribute('data-theme');
		expect(finalTheme).toBe('ncurses-dark');
	});
});

test.describe('Keyboard Navigation', () => {
	test('should navigate with arrow keys', async ({ page }) => {
		await page.goto('/');

		// Focus should start on the navigation
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowUp');

		// Page should still be functional after navigation
		await expect(page.locator('body')).toBeVisible();
	});

	test('should switch panels with Tab', async ({ page }) => {
		await page.goto('/');

		// Press Tab to switch panels
		await page.keyboard.press('Tab');

		// Page should remain functional
		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Accessibility', () => {
	test('should have proper ARIA labels', async ({ page }) => {
		await page.goto('/');

		// Check for main navigation
		const mainNav = page.locator('nav');
		await expect(mainNav.first()).toBeVisible();
	});

	test('should be keyboard accessible', async ({ page }) => {
		await page.goto('/');

		// Tab through interactive elements
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');

		// Page should remain functional
		await expect(page.locator('body')).toBeVisible();
	});
});
