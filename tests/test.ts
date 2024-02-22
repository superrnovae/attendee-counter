import { expect, test } from '@playwright/test';

test('User page is contaning the user information', async ({ page }) => {
	await page.goto('/user');
	await expect(page.getByTestId('user-container')).toBeVisible();
});
