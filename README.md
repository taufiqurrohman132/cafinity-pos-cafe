# Cafinity POS (Point of Sale & Cafe Management System)

Cafinity POS adalah aplikasi Point of Sale (Kasir) dan Manajemen Cafe modern berbasis web. Aplikasi ini dirancang untuk menyederhanakan operasional harian kafe—mulai dari transaksi penjualan, antrean dapur secara real-time, manajemen persediaan barang (inventaris), hingga analisis profitabilitas berdasarkan perhitungan resep (HPP).

---

## 🚀 Fitur Utama

### 📊 1. Multi-Role Dashboard
Dashboard dinamis yang disesuaikan secara khusus untuk setiap peran pengguna:
* **Dashboard Owner**: Menyajikan metrik performa bisnis tingkat tinggi seperti omzet harian, estimasi laba bersih, rata-rata nominal transaksi (*average ticket size*), grafik tren penjualan terintegrasi, menu terlaris, jam-jam sibuk (*busy hours*), pencapaian target harian, status inventaris kritis, dan antrean dapur langsung.
* **Dashboard Admin**: Berfokus pada pengelolaan stok barang baku, pergerakan stok harian (*stock movement*), status purchase order pending, serta analisis margin keuntungan menu.
* **Dashboard Kasir**: Menampilkan status giliran kerja (*shift info*), ringkasan transaksi harian kasir, dan penambahan stok darurat.

### 💳 2. Point of Sale (POS)
* Pencarian produk dan penyaringan berdasarkan kategori secara cepat.
* Fitur **Hold & Resume** untuk menunda transaksi pelanggan sewaktu-waktu.
* Proses checkout fleksibel terintegrasi dengan pencetakan struk penjualan.
* Pengelolaan pengembalian dana (*refund*) transaksi.

### 🍳 3. Live Kitchen Queue (Antrean Dapur)
* Sistem pelacakan pesanan makanan dan minuman langsung di area dapur.
* Status pesanan interaktif: **Menunggu (Pending)** ➔ **Memasak (Preparing)** ➔ **Siap Diambil (Ready)** ➔ **Selesai (Completed)**.
* Notifikasi durasi persiapan untuk memastikan efisiensi layanan.

### 📋 4. Menu Catalog & Recipe Costing (HPP)
* Pengaturan katalog menu makanan/minuman beserta unggah gambar produk.
* Modul **Recipe Costing** untuk menghitung **Harga Pokok Penjualan (HPP)** secara presisi berdasarkan bahan baku yang digunakan.
* Analisis margin keuntungan (*profitability analysis*) otomatis untuk memantau menu mana yang paling menguntungkan.

### 📦 5. Manajemen Inventaris & Log Persediaan
* Manajemen bahan baku lengkap dengan kategori inventaris dan supplier.
* Fitur **Peringatan Stok Rendah** otomatis ketika persediaan menyentuh batas minimum.
* Pencatatan histori perubahan stok (*Inventory Log*) secara detail (stok masuk/keluar, alasan, dan personel yang memproses).

### 📈 6. Laporan Bisnis & Target Penjualan
* Analisis laporan penjualan, laporan pergerakan stok, dan laporan laba-rugi (*Profit & Loss*).
* Ekspor laporan ke format **Excel** dan **PDF**.
* Sistem pengaturan target penjualan harian/bulanan (*Targets & Goals*).

### 🔐 7. Manajemen Akses & Keamanan (Spatie RBAC)
* Pembagian otorisasi akses menggunakan pustaka **Spatie Laravel Permission**.
* Antarmuka matriks role-permission untuk menentukan hak akses secara spesifik untuk setiap fitur.

---

## 🛠️ Spesifikasi Teknologi

Aplikasi ini dibangun menggunakan arsitektur modern SPA (Single Page Application) tanpa reload halaman berkat integrasi Inertia.js:

* **Backend**: Laravel 11.x (PHP 8.2+)
* **Database**: MySQL / MariaDB
* **Frontend**: React.js (dengan Vite & TailwindCSS)
* **Penjembatan**: Inertia.js (React Adapter)
* **Manajemen Peran & Otorisasi**: Spatie Laravel Permission
* **Routing Frontend**: Tighten Ziggy (Ziggy-js)
* **Desain Antarmuka**: TailwindCSS & HSL custom palette (modern minimalis, glassmorphism, responsive mobile-friendly)

---

## 💾 Langkah Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek Cafinity POS di lingkungan lokal Anda:

### 1. Klon Repositori
```bash
git clone https://github.com/username/cafinity-app-laravel.git
cd cafinity-app-laravel
```

### 2. Instalasi Dependensi Backend
```bash
composer install
```

### 3. Instalasi Dependensi Frontend
```bash
npm install
```

### 4. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` lalu sesuaikan kredensial database Anda:
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Migrasi dan Seeding Database
Jalankan migrasi database beserta data awal untuk pengguna, kategori, menu, resep, dan roles:
```bash
php artisan migrate:fresh --seed
```

### 6. Jalankan Server Pengembangan
Jalankan dev server untuk Laravel dan Vite di terminal yang terpisah:
```bash
# Terminal 1 (Laravel Server)
php artisan serve

# Terminal 2 (Vite Compiler)
npm run dev
```
Akses aplikasi melalui browser Anda pada alamat `http://127.0.0.1:8000`.

---

## 🔑 Akun Uji Coba (Credentials)

Setelah melakukan *seeding* database, Anda dapat masuk menggunakan akun uji coba di bawah ini untuk menguji fungsionalitas masing-masing peran:

| Nama | Email | Sandi | Role |
| :--- | :--- | :--- | :--- |
| **Budi Santoso** | budi.s@smartcafe.id | `password` | **Owner** (Semua Hak Akses) |
| **Siti Aminah** | siti.a@smartcafe.id | `password` | **Admin** (Pengelola Menu & Stok) |
| **Rizky Pratama** | rizky.p@smartcafe.id | `password` | **Cashier** (Point of Sale & Transaksi) |

*Catatan: Pada lingkungan lokal/development, Anda juga bisa menggunakan pintasan login cepat melalui URL `/dev-login/{role}` (contoh: `/dev-login/owner` atau `/dev-login/cashier`).*

---

## 📂 Struktur Folder Penting

* `app/Http/Controllers/` — Logika kontroler backend.
  * `app/Http/Controllers/Dashboard/` — Kontroler spesifik dashboard per-role.
* `app/Models/` — Model Eloquent database (`User`, `Inventory`, `Menu`, `Recipe`, dll.).
* `database/migrations/` — Skema tabel database.
* `database/seeders/` — Data awal (*dummy data*) untuk pengujian.
* `resources/js/Pages/` — Komponen halaman React.js.
  * `resources/js/Pages/UserManagement/` — Antarmuka User Directory & Roles.
  * `resources/js/Pages/Inventories/` — Pengelolaan bahan baku dan restock.
* `resources/js/Components/` — Komponen UI React yang dapat digunakan kembali (*reusable*).
  * `resources/js/Components/Sidebar.jsx` — Navigasi sidebar persisten.
* `resources/js/Layouts/AppLayout.jsx` — Layout utama aplikasi (Persistent Layout).

---

## 📄 Lisensi

Aplikasi ini dikembangkan untuk kebutuhan internal kafe dan dilisensikan di bawah lisensi [MIT License](LICENSE).
