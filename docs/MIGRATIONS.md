FASE 1 — Persiapan & Setup (2-3 hari)
1.1 Backup project dulu
    → git commit semua perubahan terakhir
    → buat branch baru: git checkout -b migrate/react-router

1.2 Install Sanctum
    → composer require laravel/sanctum
    → php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
    → php artisan migrate

1.3 Konfigurasi Sanctum
    → tambah Sanctum middleware di bootstrap/app.php
    → set SANCTUM_STATEFUL_DOMAINS di .env
    → konfigurasi cors.php

1.4 Install package frontend baru
    → npm install react-router-dom axios
    → npm remove @inertiajs/react (nanti, setelah semua selesai)

FASE 2 — Bikin API Auth (1-2 hari)
2.1 Buat API routes di routes/api.php
    → POST /api/auth/login
    → POST /api/auth/logout
    → GET  /api/auth/me

2.2 Buat AuthController untuk API
    → login → return token + user data + role
    → logout → revoke token
    → me → return current user

2.3 Test API via Postman
    → pastikan login return token
    → pastikan protected route butuh token

FASE 3 — Setup React Router & Struktur Frontend (1-2 hari)
3.1 Ubah entry point
    → resources/js/app.jsx → hapus createInertiaApp
    → ganti dengan ReactDOM.createRoot + BrowserRouter

3.2 Bikin struktur folder baru
    resources/js/
    ├── api/          → axios instance + interceptors
    ├── hooks/        → useAuth, useFetch, dll
    ├── layouts/      → AuthLayout, DashboardLayout
    ├── pages/        → semua halaman
    ├── components/   → komponen reusable
    └── router/       → route definitions + protected route

3.3 Bikin axios instance
    → base URL ke /api
    → auto attach token di header
    → auto redirect ke login kalau 401

3.4 Bikin AuthContext + useAuth hook
    → simpan token di localStorage
    → simpan user data + role
    → fungsi login, logout

3.5 Bikin ProtectedRoute component
    → cek apakah sudah login
    → cek role (owner/admin/kasir)
    → redirect kalau tidak sesuai

3.6 Bikin router/index.jsx
    → define semua routes
    → wrap dengan ProtectedRoute per role

3.7 Update routes/web.php Laravel
    → semua route return satu view (app.blade.php)
    → biarkan React Router yang handle frontend routing

FASE 4 — Migrasi Halaman Satu Per Satu (1-2 minggu)
Urutan migrasi dari yang paling simpel:
4.1 Login Page
    → hapus Inertia props
    → pakai useAuth hook
    → POST ke /api/auth/login

4.2 Dashboard
    → buat GET /api/dashboard di Laravel
    → pindah logic dari DashboardController ke DashboardService
    → fetch data pakai axios di useEffect / React Query

4.3 Menu Catalog
    → GET /api/menus
    → POST /api/menus
    → PUT /api/menus/{id}
    → DELETE /api/menus/{id}

4.4 Inventory
    → GET /api/inventory
    → POST /api/inventory
    → dll

4.5 Recipe Costing
    → GET /api/recipes
    → GET /api/recipes/{id}
    → PUT /api/recipes/{id}

4.6 POS / Transaksi
    → GET /api/transactions
    → POST /api/transactions
    → ini yang paling kompleks, kerjain terakhir

4.7 Reports
    → GET /api/reports/sales
    → GET /api/reports/profit
    → dll

4.8 Users Management
    → GET /api/users
    → POST /api/users
    → dll

FASE 5 — Cleanup & Finishing (2-3 hari)
5.1 Hapus semua sisa Inertia
    → npm remove @inertiajs/react @inertiajs/core
    → hapus HandleInertiaRequests middleware
    → hapus Inertia::render() di semua controller

5.2 Hapus layout pattern Inertia
    → ComponentName.layout = ... di setiap file

5.3 Pasang skeleton screen
    → sekarang skeleton beneran keliatan saat navigasi
    → pasang di semua halaman yang fetch data

5.4 Testing menyeluruh
    → test semua CRUD per halaman
    → test role access (owner vs admin vs kasir)
    → test token expired handling

5.5 Build & pastikan production ready
    → npm run build
    → pastikan semua asset load dengan benar