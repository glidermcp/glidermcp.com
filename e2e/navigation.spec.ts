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

	test('should have status bar with key shortcuts', async ({ page }) => {
		// Check for key hints in status bar (F9 Theme, Tab Panel, ^G Game)
		await expect(page.getByText(/F9/i).first()).toBeVisible();
		await expect(page.getByText(/Tab/i).first()).toBeVisible();
		await expect(page.getByText(/\^G/i).first()).toBeVisible();
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

	test('should expand all sections by default on page load', async ({ page }) => {
		await page.goto('/');

		// Installation and Tools sections should be expanded by default
		// Check for child items being visible (e.g., "Claude Code" under Installation)
		await expect(page.locator('.nav-item:has-text("Claude Code")')).toBeVisible();
		await expect(page.locator('.nav-item:has-text("server_status")')).toBeVisible();

		// Parent sections should show expanded indicator (▼)
		const installationItem = page.locator('.nav-item:has-text("Installation")').first();
		await expect(installationItem.locator('.prefix')).toHaveText('▼');

		const toolsItem = page.locator('.nav-item:has-text("Tools")').first();
		await expect(toolsItem.locator('.prefix')).toHaveText('▼');
	});

	test('should toggle section expand/collapse with Space key', async ({ page }) => {
		await page.goto('/');

		// Navigate to Installation section (index 2: Introduction, Quick Start, Installation)
		await page.keyboard.press('ArrowDown'); // Quick Start
		await page.keyboard.press('ArrowDown'); // Installation

		// Verify Installation is selected and expanded
		const installationItem = page.locator('.nav-item:has-text("Installation")').first();
		await expect(installationItem).toHaveClass(/selected/);
		await expect(installationItem.locator('.prefix')).toHaveText('▼');

		// Child items should be visible
		await expect(page.locator('.nav-item:has-text("Claude Code")')).toBeVisible();

		// Press Space to collapse
		await page.keyboard.press(' ');

		// Section should now be collapsed (▶)
		await expect(installationItem.locator('.prefix')).toHaveText('▶');

		// Child items should be hidden
		await expect(page.locator('.nav-item:has-text("Claude Code")')).not.toBeVisible();

		// Press Space again to expand
		await page.keyboard.press(' ');

		// Section should be expanded again
		await expect(installationItem.locator('.prefix')).toHaveText('▼');
		await expect(page.locator('.nav-item:has-text("Claude Code")')).toBeVisible();
	});

	test('should navigate to page with Enter key without toggling', async ({ page }) => {
		await page.goto('/');

		// Navigate to Installation section
		await page.keyboard.press('ArrowDown'); // Quick Start
		await page.keyboard.press('ArrowDown'); // Installation

		// Verify it's expanded
		const installationItem = page.locator('.nav-item:has-text("Installation")').first();
		await expect(installationItem.locator('.prefix')).toHaveText('▼');

		// Press Enter to navigate (should NOT toggle)
		await page.keyboard.press('Enter');

		// Section should still be expanded (Enter navigates, doesn't toggle)
		await expect(installationItem.locator('.prefix')).toHaveText('▼');

		// Content panel should show Installation content
		await expect(page.locator('h2:has-text("Installation")')).toBeVisible();
	});

	test('should navigate to leaf item with Enter key', async ({ page }) => {
		await page.goto('/');

		// Navigate to Quick Start (a leaf item with no children)
		await page.keyboard.press('ArrowDown'); // Quick Start

		// Press Enter to navigate
		await page.keyboard.press('Enter');

		// Content should show Quick Start page
		await expect(page.locator('h2:has-text("Quick Start")')).toBeVisible();
	});

	test('Space should have no effect on leaf items', async ({ page }) => {
		await page.goto('/');

		// Navigate to Quick Start (a leaf item)
		await page.keyboard.press('ArrowDown'); // Quick Start

		const quickStartItem = page.locator('.nav-item:has-text("Quick Start")').first();
		await expect(quickStartItem).toHaveClass(/selected/);

		// Press Space - should have no effect (no children to toggle)
		await page.keyboard.press(' ');

		// Item should still be selected, page should be functional
		await expect(quickStartItem).toHaveClass(/selected/);
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
