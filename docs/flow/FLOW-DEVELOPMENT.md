# Alur Development: Vibe Coding → Production Ready

Dokumen ini menjelaskan alur kerja pengembangan Cafinity POS dari tahap development hingga production.

---

## 1. Development (Sekarang)
- Selesaikan semua fitur + skeleton + migrate inertia-mock
- Pastikan semua halaman tidak blank

---

## 2. Code Quality
**Tools:**
- **ESLint** — cek syntax error, unused vars
- **Prettier** — format kode konsisten

```bash
npm install -D eslint prettier eslint-plugin-react
```

---

## 3. Testing
**Tools:**
- **Vitest** — unit test komponen React
- **Playwright** atau **Cypress** — end-to-end test (simulasi user klik, form, navigasi)
- **Laravel Pest/PHPUnit** — test API backend

**Yang perlu ditest:**
- Login/auth flow
- CRUD menu, inventori, PO
- Kalkulasi HPP, transaksi POS
- Role permission (owner vs admin vs kasir)

---

## 4. Security
**Frontend:**
- Pastikan token Sanctum tidak expose di localStorage sembarangan
- Semua request pakai HTTPS
- Sanitasi input form

**Backend Laravel:**
- `php artisan route:list` — audit semua route, pastikan semua ada middleware auth
- Rate limiting di API
- Validate semua request pakai FormRequest
- Pastikan tidak ada SQL injection (sudah aman kalau pakai Eloquent)
- CORS config di `config/cors.php` — restrict origin

---

## 5. Performance
**Frontend:**
- **Lighthouse** (Chrome DevTools) — cek score performance, accessibility
- **Code splitting** — React Router sudah support lazy loading:

```jsx
const MenusIndex = lazy(() => import('../Pages/Menus/Index'));

<Suspense fallback={<MenusSkeleton />}>
    <Route path="/menus" element={<MenusIndex />} />
</Suspense>
```

- **Bundle analyzer:**
```bash
npm install -D rollup-plugin-visualizer
```

**Backend:**
- Eager loading relasi Eloquent (`with()`) — hindari N+1 query
- Cache response yang jarang berubah (`Cache::remember`)
- Index database di kolom yang sering di-query

---

## 6. Deployment
**Stack rekomendasi:**
- **Server:** VPS (DigitalOcean/Vultr/Niagahoster) atau shared hosting yang support Laravel
- **Web server:** Nginx + PHP-FPM
- **Database:** MySQL/PostgreSQL
- **SSL:** Let's Encrypt (gratis)
- **Frontend build:**
```bash
npm run build
php artisan optimize
php artisan config:cache
php artisan route:cache
```

---

## 7. Monitoring (Post-deploy)
- **Laravel Telescope** — debug query, request, jobs di production
- **Sentry** — error tracking frontend + backend
- **UptimeRobot** — monitor uptime gratis

---

## Urutan Prioritas Sekarang:

```
1. ✅ Selesaikan skeleton + migrate inertia-mock
2. 🔲 Security audit (route middleware, CORS, auth)
3. 🔲 Lighthouse performance check
4. 🔲 Lazy loading komponen besar
5. 🔲 Testing flow utama (login, POS, transaksi)
6. 🔲 Deploy ke VPS
7. 🔲 Setup monitoring
```

Fokus selesaikan skeleton dulu, baru lanjut ke security + performance. Mau mulai dari mana?