# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flows >> should show validation error on incorrect credentials
- Location: tests\playwright\auth.spec.js:21:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Flows', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Navigate to the login page before each test
  7  |     await page.goto('/login');
  8  |   });
  9  | 
  10 |   test('should display the login page correctly', async ({ page }) => {
  11 |     // Check page title
  12 |     await expect(page).toHaveTitle(/Login — Cafinity POS/);
  13 |     
  14 |     // Check main elements
  15 |     await expect(page.locator('text=Selamat Datang')).toBeVisible();
  16 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  17 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  18 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('should show validation error on incorrect credentials', async ({ page }) => {
  22 |     // Input invalid details
> 23 |     await page.locator('input[type="email"]').fill('nonexistent@smartcafe.id');
     |                                               ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  24 |     await page.locator('input[type="password"]').fill('wrongpassword');
  25 |     
  26 |     // Submit
  27 |     await page.locator('button[type="submit"]').click();
  28 |     
  29 |     // Expect error alert or message to appear (Laravel 422/401 validation errors)
  30 |     // The errors object will render a rose-50 card with warning content
  31 |     const errorCard = page.locator('div.bg-rose-50');
  32 |     await expect(errorCard).toBeVisible();
  33 |   });
  34 | 
  35 |   test('should login successfully with valid credentials and redirect to dashboard', async ({ page }) => {
  36 |     // Use seeded owner credentials
  37 |     await page.locator('input[type="email"]').fill('budi.s@smartcafe.id');
  38 |     await page.locator('input[type="password"]').fill('password');
  39 |     
  40 |     // Submit
  41 |     await page.locator('button[type="submit"]').click();
  42 |     
  43 |     // Redirection should route to dashboard
  44 |     await expect(page).toHaveURL(/.*dashboard/);
  45 |   });
  46 | });
  47 | 
```