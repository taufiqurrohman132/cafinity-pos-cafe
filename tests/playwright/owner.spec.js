import { test, expect } from '@playwright/test';

test.describe('Owner Pages and Modals tests', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Owner
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('budi.s@smartcafe.id');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Owner Dashboard and Goal/Target Modal', async ({ page }) => {
    // Navigate explicitly if redirect is loading
    await page.goto('/owner/dashboard');
    await expect(page.locator('text=Dashboard Owner')).toBeVisible();

    // Verify statistics cards and interactive charts are rendered
    await expect(page.locator('text=Pendapatan Hari Ini').first()).toBeVisible();
    await expect(page.locator('text=Estimasi Laba Bersih')).toBeVisible();

    // Open "Goal Hari Ini" target modal
    const targetBtn = page.locator('button:has-text("Set Target"), button:has-text("Ubah Target")').first();
    await expect(targetBtn).toBeVisible();
    await targetBtn.click();

    // Verify modal elements are visible
    await expect(page.locator('text=Atur Target Performa')).toBeVisible();
    await expect(page.locator('text=Periode Target')).toBeVisible();

    // Interact with nominal input (type new target value)
    const targetInput = page.locator('input[type="text"]').first();
    await targetInput.fill('20.000.000');

    // Close the target modal by clicking Batal
    await page.locator('button:has-text("Batal")').click();
    await expect(page.locator('text=Atur Target Performa')).not.toBeVisible();
  });

  test('Menus Catalog and Row Click Navigation', async ({ page }) => {
    await page.goto('/menus');
    await expect(page.locator('text=Katalog Menu')).toBeVisible();

    // Click on the first menu item row if it exists in the table
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.count() > 0) {
      await firstRow.click();
      // Verifies navigation to details page (/menus/:id)
      await expect(page).toHaveURL(/\/menus\/\d+/);
      await expect(page.locator('text=Detail Menu')).toBeVisible();
    }
  });

  test('Promotions and Create Modals', async ({ page }) => {
    await page.goto('/promotions');
    await expect(page.locator('text=Promosi & Bundling')).toBeVisible();

    // Open Create Promo Modal
    const createBtn = page.locator('button:has-text("Buat Promo Baru")');
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    // Verify promo forms switcher/tab modal is visible
    await expect(page.locator('button:has-text("Diskon Promosi")')).toBeVisible();

    // Select Bundle Promo Form type tab
    const bundleTab = page.locator('button:has-text("Bundling Menu")');
    await bundleTab.click();
    await expect(page.locator('text=Harga Bundel Spesial')).toBeVisible();

    // Close the promotion modal
    await page.locator('button:has-text("Batal")').click();
    await expect(page.locator('button:has-text("Diskon Promosi")')).not.toBeVisible();
  });

  test('Recipe Costing Page', async ({ page }) => {
    await page.goto('/recipe-costing');
    await expect(page.locator('text=Recipe Costing')).toBeVisible();
    await expect(page.locator('text=Katalog Resep')).toBeVisible();
  });

  test('Inventories Page and Forms', async ({ page }) => {
    await page.goto('/inventories');
    await expect(page.locator('text=Manajemen Inventaris')).toBeVisible();

    // Navigate to Create Inventory Stock
    await page.goto('/inventories/create');
    await expect(page.locator('text=Tambah Bahan Baku')).toBeVisible();

    // Navigate to Low Stock List
    await page.goto('/inventories/low-stock/list');
    await expect(page.locator('text=Stok Menipis')).toBeVisible();
  });

  test('Reports Page', async ({ page }) => {
    await page.goto('/reports');
    await expect(page.locator('text=Laporan Bisnis')).toBeVisible({ timeout: 15000 });
  });

  test('Targets & Goals Pages', async ({ page }) => {
    await page.goto('/targets-goals');
    await expect(page.locator('text=Target & Performa')).toBeVisible({ timeout: 15000 });

    // Navigate to AOV Targets details page
    await page.goto('/targets-goals/aov');
    await expect(page.locator('text=Laporan Rata-rata Nilai Tiket (AOV)')).toBeVisible({ timeout: 15000 });
  });

  test('User Directory and User Modals', async ({ page }) => {
    await page.goto('/users');
    await expect(page.locator('text=Daftar Pengguna')).toBeVisible({ timeout: 15000 });

    // Open Create User modal
    const addUserBtn = page.locator('button:has-text("Tambah Pengguna")');
    if (await addUserBtn.count() > 0) {
      await addUserBtn.click();
      await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
      // Close modal
      await page.locator('button:has-text("Batal")').click();
    }
  });

  test('Settings, Notifications, Search, and Profile pages', async ({ page }) => {
    // Settings Page
    await page.goto('/settings');
    await expect(page.locator('text=Pengaturan Bisnis')).toBeVisible();

    // Notifications Page
    await page.goto('/notifications');
    await expect(page.locator('text=Pusat Notifikasi')).toBeVisible({ timeout: 15000 });

    // Global Search
    await page.goto('/search');
    await expect(page.locator('text=Pencarian Global')).toBeVisible();

    // Profile Page
    await page.goto('/profile');
    await expect(page.locator('text=Pengaturan Profil')).toBeVisible({ timeout: 15000 });
  });
});
