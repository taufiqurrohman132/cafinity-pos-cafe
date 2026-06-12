import { test, expect } from '@playwright/test';

test.describe('Kitchen Queue tests', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Kitchen Staff
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('junaedi@smartcafe.id');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Kitchen Orders Page elements and filters', async ({ page }) => {
    await page.goto('/kitchen-orders');
    await expect(page.locator('text=Antrean Dapur')).toBeVisible();

    // Verify filter buttons exist (All, Pending, Preparing, Ready)
    await expect(page.locator('a:has-text("Semua")')).toBeVisible();
    await expect(page.locator('a:has-text("Menunggu")')).toBeVisible();
    await expect(page.locator('a:has-text("Memasak")')).toBeVisible();
    
    // Verify stats cards for kitchen queue are rendered
    await expect(page.locator('text=Pesanan Aktif')).toBeVisible();
    await expect(page.locator('text=Rata-rata Masak')).toBeVisible();
  });
});
