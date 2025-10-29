import { test, expect } from '@playwright/test';

// Sample browser test: Login page loads and shows login form

test('Login page loads and displays login form', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
