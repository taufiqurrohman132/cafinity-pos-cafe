import { test, expect } from '@playwright/test';

test.describe('Cashier Pages and Modals tests', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Cashier
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('rizky.p@smartcafe.id');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Cashier Dashboard smoke test', async ({ page }) => {
    await page.goto('/cashier/dashboard');
    await expect(page.locator('text=Kasir POS')).toBeVisible();
    await expect(page.locator('text=Hari Ini (Pesanan)')).toBeVisible();
  });

  test('POS Cart and Checkout Payment Modal', async ({ page }) => {
    await page.goto('/pos');
    await expect(page.locator('text=POS Transaksi')).toBeVisible();

    // Verify cart is initially empty
    await expect(page.locator('text=Keranjang masih kosong')).toBeVisible();

    // Add specific menu item to cart, waiting for it to be visible
    const menuCard = page.locator('button:has-text("Es Kopi Susu Gula Aren")').first();
    await expect(menuCard).toBeVisible();
    await page.waitForTimeout(500); // Wait for React/Inertia hydration and click handler binding
    await menuCard.click();

    // Verify cart has updated items count
    await expect(page.locator('text=Keranjang masih kosong')).not.toBeVisible();
    await expect(page.locator('text=Item', { hasText: /\d+ Item/ })).toBeVisible();

    // Open Checkout Payment Modal
    const payBtn = page.locator('button:has-text("Bayar Sekarang")');
    await expect(payBtn).toBeVisible();
    await payBtn.click();

    // Verify Payment Modal is visible
    await expect(page.locator('text=Selesaikan Pembayaran')).toBeVisible();
    await expect(page.locator('text=Metode Pembayaran')).toBeVisible();
    await expect(page.locator('text=Jumlah Dibayar')).toBeVisible();

    // Close checkout modal
    await page.locator('button:has-text("Batal")').click();
    await expect(page.locator('text=Selesaikan Pembayaran')).not.toBeVisible();
  });

  test('Transactions page and Invoice detail view', async ({ page }) => {
    await page.goto('/transactions');
    await expect(page.locator('text=Daftar Transaksi')).toBeVisible();

    // Check transaction row click
    const firstTrxRow = page.locator('table tbody tr').first();
    if (await firstTrxRow.count() > 0) {
      await firstTrxRow.click();
      // Verifies navigation to details page (/transactions/:id)
      await expect(page).toHaveURL(/\/transactions\/\w+/);
      await expect(page.locator('text=Detail Transaksi')).toBeVisible();

      // Click view invoice
      const invoiceBtn = page.locator('a:has-text("Invoice"), a:has-text("Cetak")').first();
      if (await invoiceBtn.count() > 0) {
        await invoiceBtn.click();
        await expect(page).toHaveURL(/.*invoice/);
        await expect(page.locator('text=Invoice')).toBeVisible();
      }
    }
  });
});
