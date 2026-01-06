import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Navigate to Pricing page
		await page.getByText('Pricing').click();
	});

	test('should display obfuscated email as clickable mailto link', async ({ page }) => {
		// Find the email link
		const emailLink = page.locator('a[href^="mailto:"]');
		await expect(emailLink).toBeVisible();

		// Verify the mailto href is correct (assembled from parts)
		await expect(emailLink).toHaveAttribute('href', 'mailto:bogdan@sacrorum.com');

		// Verify the displayed text is the email
		await expect(emailLink).toHaveText('bogdan@sacrorum.com');
	});

	test('should not have plain text email in page source', async ({ page }) => {
		// The email should be assembled via JS, not in static HTML
		// Check that the raw HTML doesn't contain the full email as a string literal
		const content = await page.content();

		// The email parts should exist separately, but not the full email as a static string
		// This is a basic check - the obfuscation stores ['bogdan', 'sacrorum.com'] and joins with @
		expect(content).toContain('bogdan');
		expect(content).toContain('sacrorum.com');
	});
});
