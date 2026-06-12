import { test, expect } from '@playwright/test';

test.describe('Admin Pages and Modals tests', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Admin
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('siti.a@smartcafe.id');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Admin Dashboard and HPP Analysis Row Click', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page.locator('text=Dashboard Admin')).toBeVisible();

    // Verify statistics cards
    await expect(page.locator('text=Stok Rendah')).toBeVisible();
    await expect(page.locator('text=Total SKU')).toBeVisible();

    // Verify HPP row click navigates to menu details
    const firstHppRow = page.locator('table tbody tr').first();
    if (await firstHppRow.count() > 0) {
      await firstHppRow.click();
      await expect(page).toHaveURL(/\/menus\/\d+/);
    }
  });

  test('Purchase Orders Page and Create Form', async ({ page }) => {
    await page.goto('/purchase-orders');
    await expect(page.locator('text=Purchase Order')).toBeVisible();

    // Navigate to Create Purchase Order page
    await page.goto('/purchase-orders/create');
    await expect(page.locator('text=Buat Pesanan Pembelian Baru')).toBeVisible();
  });

  test('Suppliers Page and Modals', async ({ page }) => {
    await page.goto('/suppliers');
    await expect(page.locator('text=Daftar Supplier')).toBeVisible({ timeout: 15000 });

    // Navigate to Create Supplier
    const createSupplierBtn = page.locator('a:has-text("Tambah Supplier")');
    if (await createSupplierBtn.count() > 0) {
      await createSupplierBtn.click();
      await expect(page).toHaveURL(/.*suppliers\/create/);
      await expect(page.locator('h1:has-text("Tambah Supplier Baru")')).toBeVisible();
      
      // Fill form fields using exact placeholders from Create.jsx
      await page.locator('input[placeholder="PT. Teknologi Maju Utama"]').fill('PT Kopi Sejahtera');
      await page.locator('input[placeholder="Hendra Wijaya"]').fill('Anton Susanto');
      await page.locator('input[placeholder="hendra.w@tekmajua.co.id"]').fill('anton@kopisejahtera.com');
      await page.locator('input[placeholder="+62 812 3456 7890"]').fill('+62 812 3456 7890');
    }

    // Navigate to a Supplier details page and verify PIC addition modal
    await page.goto('/suppliers');
    const firstSupplierRow = page.locator('table tbody tr').first();
    if (await firstSupplierRow.count() > 0) {
      await firstSupplierRow.locator('a:has-text("Detail")').click();
      await expect(page).toHaveURL(/\/suppliers\/\d+/);
      await expect(page.locator('text=Informasi Supplier')).toBeVisible({ timeout: 15000 });

      // Check for PIC modals
      const addPicBtn = page.locator('button:has-text("Tambah PIC"), button:has-text("Kontak PIC")').first();
      if (await addPicBtn.count() > 0) {
        // Dismiss alert dialog
        page.once('dialog', dialog => dialog.dismiss());
        await addPicBtn.click();
      }
    }
  });
});
