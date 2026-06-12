# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cashier.spec.js >> Cashier Pages and Modals tests >> POS Cart and Checkout Payment Modal
- Location: tests\playwright\cashier.spec.js:20:3

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('text=Keranjang masih kosong')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for locator('text=Keranjang masih kosong')
    13 × locator resolved to <h4 class="text-[14px] font-bold text-brand-primary">Keranjang masih kosong</h4>
       - unexpected value "visible"

```

```yaml
- heading "Keranjang masih kosong" [level=4]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Cashier Pages and Modals tests', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Authenticate as Cashier
  7  |     await page.goto('/login');
  8  |     await page.locator('input[type="email"]').fill('rizky.p@smartcafe.id');
  9  |     await page.locator('input[type="password"]').fill('password');
  10 |     await page.locator('button[type="submit"]').click();
  11 |     await expect(page).toHaveURL(/.*dashboard/);
  12 |   });
  13 | 
  14 |   test('Cashier Dashboard smoke test', async ({ page }) => {
  15 |     await page.goto('/cashier/dashboard');
  16 |     await expect(page.locator('text=Kasir POS')).toBeVisible();
  17 |     await expect(page.locator('text=Hari Ini (Pesanan)')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('POS Cart and Checkout Payment Modal', async ({ page }) => {
  21 |     await page.goto('/pos');
  22 |     await expect(page.locator('text=POS Transaksi')).toBeVisible();
  23 | 
  24 |     // Verify cart is initially empty
  25 |     await expect(page.locator('text=Keranjang masih kosong')).toBeVisible();
  26 | 
  27 |     // Add specific menu item to cart, waiting for it to be visible
  28 |     const menuCard = page.locator('button:has-text("Es Kopi Susu Gula Aren")').first();
  29 |     await expect(menuCard).toBeVisible();
  30 |     await page.waitForTimeout(500); // Wait for React/Inertia hydration and click handler binding
  31 |     await menuCard.click();
  32 | 
  33 |     // Verify cart has updated items count
> 34 |     await expect(page.locator('text=Keranjang masih kosong')).not.toBeVisible();
     |                                                                   ^ Error: expect(locator).not.toBeVisible() failed
  35 |     await expect(page.locator('text=Item', { hasText: /\d+ Item/ })).toBeVisible();
  36 | 
  37 |     // Open Checkout Payment Modal
  38 |     const payBtn = page.locator('button:has-text("Bayar Sekarang")');
  39 |     await expect(payBtn).toBeVisible();
  40 |     await payBtn.click();
  41 | 
  42 |     // Verify Payment Modal is visible
  43 |     await expect(page.locator('text=Selesaikan Pembayaran')).toBeVisible();
  44 |     await expect(page.locator('text=Metode Pembayaran')).toBeVisible();
  45 |     await expect(page.locator('text=Jumlah Dibayar')).toBeVisible();
  46 | 
  47 |     // Close checkout modal
  48 |     await page.locator('button:has-text("Batal")').click();
  49 |     await expect(page.locator('text=Selesaikan Pembayaran')).not.toBeVisible();
  50 |   });
  51 | 
  52 |   test('Transactions page and Invoice detail view', async ({ page }) => {
  53 |     await page.goto('/transactions');
  54 |     await expect(page.locator('text=Daftar Transaksi')).toBeVisible();
  55 | 
  56 |     // Check transaction row click
  57 |     const firstTrxRow = page.locator('table tbody tr').first();
  58 |     if (await firstTrxRow.count() > 0) {
  59 |       await firstTrxRow.click();
  60 |       // Verifies navigation to details page (/transactions/:id)
  61 |       await expect(page).toHaveURL(/\/transactions\/\w+/);
  62 |       await expect(page.locator('text=Detail Transaksi')).toBeVisible();
  63 | 
  64 |       // Click view invoice
  65 |       const invoiceBtn = page.locator('a:has-text("Invoice"), a:has-text("Cetak")').first();
  66 |       if (await invoiceBtn.count() > 0) {
  67 |         await invoiceBtn.click();
  68 |         await expect(page).toHaveURL(/.*invoice/);
  69 |         await expect(page.locator('text=Invoice')).toBeVisible();
  70 |       }
  71 |     }
  72 |   });
  73 | });
  74 | 
```