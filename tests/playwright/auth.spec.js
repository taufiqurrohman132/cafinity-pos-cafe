import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/login');
  });

  test('should display the login page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Login — Cafinity POS/);
    
    // Check main elements
    await expect(page.locator('text=Selamat Datang')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation error on incorrect credentials', async ({ page }) => {
    // Input invalid details
    await page.locator('input[type="email"]').fill('nonexistent@smartcafe.id');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // Expect error alert or message to appear (Laravel 422/401 validation errors)
    // The errors object will render a rose-50 card with warning content
    const errorCard = page.locator('div.bg-rose-50');
    await expect(errorCard).toBeVisible();
  });

  test('should login successfully with valid credentials and redirect to dashboard', async ({ page }) => {
    // Use seeded owner credentials
    await page.locator('input[type="email"]').fill('budi.s@smartcafe.id');
    await page.locator('input[type="password"]').fill('password');
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // Redirection should route to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
