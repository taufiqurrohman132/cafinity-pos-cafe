# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flows >> should login successfully with valid credentials and redirect to dashboard
- Location: tests\playwright\auth.spec.js:35:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:oxc] Transform failed with 2 errors: [PARSE_ERROR] Error: Unterminated regular expression ╭─[ resources/js/Pages/Profile/Edit.jsx:259:10 ] │ 259 │ </> │ ─┬─ │ ╰─── ─────╯ [PARSE_ERROR] Error: Expected corresponding closing tag for JSX fragment. ╭─[ resources/js/Pages/Profile/Edit.jsx:258:15 ] │ 66 │ <> │ ─┬ │ ╰── Opened here │ 258 │ </div> │ ─┬─ │ ╰─── Expected `</>` ─────╯"
  - generic [ref=e5]: C:/laragon/www/cafinity-app-laravel/resources/js/Pages/Profile/Edit.jsx
  - generic [ref=e6]: at transformWithOxc (file:///C:/laragon/www/cafinity-app-laravel/node_modules/vite/dist/node/chunks/node.js:3340:19) at TransformPluginContext.transform (file:///C:/laragon/www/cafinity-app-laravel/node_modules/vite/dist/node/chunks/node.js:3408:26) at EnvironmentPluginContainer.transform (file:///C:/laragon/www/cafinity-app-laravel/node_modules/vite/dist/node/chunks/node.js:30193:51) at async loadAndTransform (file:///C:/laragon/www/cafinity-app-laravel/node_modules/vite/dist/node/chunks/node.js:24511:26) at async viteTransformMiddleware (file:///C:/laragon/www/cafinity-app-laravel/node_modules/vite/dist/node/chunks/node.js:24305:20)
  - generic [ref=e7]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e8]: server.hmr.overlay
    - text: to
    - code [ref=e9]: "false"
    - text: in
    - code [ref=e10]: vite.config.js
    - text: .
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
  23 |     await page.locator('input[type="email"]').fill('nonexistent@smartcafe.id');
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
> 37 |     await page.locator('input[type="email"]').fill('budi.s@smartcafe.id');
     |                                               ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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