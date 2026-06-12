# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> Admin Pages and Modals tests >> Suppliers Page and Modals
- Location: tests\playwright\admin.spec.js:39:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Daftar Supplier')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Daftar Supplier')

```

```yaml
- complementary:
  - heading "Cafinity POS" [level=1]
  - navigation:
    - link "Dashboard":
      - /url: /admin/dashboard
      - img
      - text: Dashboard
    - link "Point of Sale":
      - /url: /pos
      - img
      - text: Point of Sale
    - link "Transactions":
      - /url: /transactions
      - img
      - text: Transactions
    - link "Kitchen Queue":
      - /url: /kitchen-orders
      - img
      - text: Kitchen Queue
    - link "Menu Catalog":
      - /url: /menus
      - img
      - text: Menu Catalog
    - link "Promosi & Bundling":
      - /url: /promotions
      - img
      - text: Promosi & Bundling
    - link "Recipe Costing":
      - /url: /recipe-costing
      - img
      - text: Recipe Costing
    - link "Inventory":
      - /url: /inventories
      - img
      - text: Inventory
    - link "Purchase Order":
      - /url: /purchase-orders
      - img
      - text: Purchase Order
    - link "Supplier":
      - /url: /suppliers
      - img
      - text: Supplier
    - link "Reports":
      - /url: /reports
      - img
      - text: Reports
    - link "Settings":
      - /url: /settings
      - img
      - text: Settings
  - button "Sign Out":
    - img
    - text: Sign Out
- banner:
  - img
  - textbox "Search menu..."
  - link:
    - /url: /notifications
    - img
  - link:
    - /url: /settings
    - img
  - link "Siti Aminah Admin S":
    - /url: /profile
    - paragraph: Siti Aminah
    - paragraph: Admin
    - text: S
- main:
  - table:
    - rowgroup:
      - row:
        - columnheader
        - columnheader
        - columnheader
        - columnheader
        - columnheader
        - columnheader
        - columnheader
        - columnheader
    - rowgroup:
      - row:
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
      - row:
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
      - row:
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
      - row:
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
      - row:
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
        - cell
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Pages and Modals tests', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Authenticate as Admin
  7  |     await page.goto('/login');
  8  |     await page.locator('input[type="email"]').fill('siti.a@smartcafe.id');
  9  |     await page.locator('input[type="password"]').fill('password');
  10 |     await page.locator('button[type="submit"]').click();
  11 |     await expect(page).toHaveURL(/.*dashboard/);
  12 |   });
  13 | 
  14 |   test('Admin Dashboard and HPP Analysis Row Click', async ({ page }) => {
  15 |     await page.goto('/admin/dashboard');
  16 |     await expect(page.locator('text=Dashboard Admin')).toBeVisible();
  17 | 
  18 |     // Verify statistics cards
  19 |     await expect(page.locator('text=Stok Rendah')).toBeVisible();
  20 |     await expect(page.locator('text=Total SKU')).toBeVisible();
  21 | 
  22 |     // Verify HPP row click navigates to menu details
  23 |     const firstHppRow = page.locator('table tbody tr').first();
  24 |     if (await firstHppRow.count() > 0) {
  25 |       await firstHppRow.click();
  26 |       await expect(page).toHaveURL(/\/menus\/\d+/);
  27 |     }
  28 |   });
  29 | 
  30 |   test('Purchase Orders Page and Create Form', async ({ page }) => {
  31 |     await page.goto('/purchase-orders');
  32 |     await expect(page.locator('text=Purchase Order')).toBeVisible();
  33 | 
  34 |     // Navigate to Create Purchase Order page
  35 |     await page.goto('/purchase-orders/create');
  36 |     await expect(page.locator('text=Buat Pesanan Pembelian Baru')).toBeVisible();
  37 |   });
  38 | 
  39 |   test('Suppliers Page and Modals', async ({ page }) => {
  40 |     await page.goto('/suppliers');
> 41 |     await expect(page.locator('text=Daftar Supplier')).toBeVisible();
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  42 | 
  43 |     // Navigate to Create Supplier
  44 |     const createSupplierBtn = page.locator('a:has-text("Tambah Supplier")');
  45 |     if (await createSupplierBtn.count() > 0) {
  46 |       await createSupplierBtn.click();
  47 |       await expect(page).toHaveURL(/.*suppliers\/create/);
  48 |       await expect(page.locator('h1:has-text("Tambah Supplier Baru")')).toBeVisible();
  49 |       
  50 |       // Fill form fields using exact placeholders from Create.jsx
  51 |       await page.locator('input[placeholder="PT. Teknologi Maju Utama"]').fill('PT Kopi Sejahtera');
  52 |       await page.locator('input[placeholder="Hendra Wijaya"]').fill('Anton Susanto');
  53 |       await page.locator('input[placeholder="hendra.w@tekmajua.co.id"]').fill('anton@kopisejahtera.com');
  54 |       await page.locator('input[placeholder="+62 812 3456 7890"]').fill('+62 812 3456 7890');
  55 |     }
  56 | 
  57 |     // Navigate to a Supplier details page and verify PIC addition modal
  58 |     await page.goto('/suppliers');
  59 |     const firstSupplierRow = page.locator('table tbody tr').first();
  60 |     if (await firstSupplierRow.count() > 0) {
  61 |       await firstSupplierRow.locator('a:has-text("Detail")').click();
  62 |       await expect(page).toHaveURL(/\/suppliers\/\d+/);
  63 |       await expect(page.locator('text=Informasi Supplier')).toBeVisible();
  64 | 
  65 |       // Check for PIC modals
  66 |       const addPicBtn = page.locator('button:has-text("Tambah PIC"), button:has-text("Kontak PIC")').first();
  67 |       if (await addPicBtn.count() > 0) {
  68 |         // Dismiss alert dialog
  69 |         page.once('dialog', dialog => dialog.dismiss());
  70 |         await addPicBtn.click();
  71 |       }
  72 |     }
  73 |   });
  74 | });
  75 | 
```