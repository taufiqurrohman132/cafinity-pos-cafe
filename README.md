# ☕ Cafinity POS (Point of Sale & Cafe Management System)

Cafinity POS adalah platform Point of Sale (Kasir) dan Manajemen Cafe modern berbasis web. Sistem ini dirancang untuk mendigitalisasi dan menyederhanakan operasional harian kafe secara menyeluruh—mulai dari transaksi penjualan kasir, antrean dapur secara real-time, manajemen persediaan barang (inventaris), pengadaan barang (purchase order) via supplier, hingga analisis profitabilitas mendalam berdasarkan perhitungan resep (HPP).

---

## 🚀 Fitur Utama & Modul

Aplikasi ini memiliki modul fitur lengkap yang mencakup kebutuhan Owner, Admin, Kasir, hingga kru dapur:

### 📊 1. Multi-Role Dashboard
Dashboard dinamis yang disesuaikan secara khusus dengan wewenang masing-masing peran pengguna:
* **Dashboard Owner**: Menyajikan analisis performa bisnis tingkat tinggi seperti total omzet harian, estimasi laba bersih, rata-rata nilai transaksi (*Average Order Value / AOV*), tren grafik penjualan interaktif, daftar menu terlaris, jam-jam sibuk (*busy hours*), pelacakan pencapaian target harian, status inventaris kritis, serta antrean dapur langsung.
* **Dashboard Admin**: Berfokus pada pemantauan pergerakan stok harian (*stock movement*), status purchase order tertunda (pending), nilai inventaris terikat, serta visualisasi stok bahan baku yang menipis.
* **Dashboard Kasir**: Menampilkan status giliran kerja (*shift info*), ringkasan transaksi kasir yang aktif, pencapaian transaksi harian, dan akses cepat ke stok darurat.

### 💳 2. Point of Sale (POS)
* Sistem keranjang belanja interaktif dengan penyaringan cepat berdasarkan kategori produk.
* Fitur **Hold & Resume** untuk menyimpan keranjang belanja sementara (menunda transaksi pelanggan) dan melanjutkannya nanti.
* Proses checkout fleksibel terintegrasi dengan kalkulator kembalian otomatis dan cetak struk/invoice penjualan.
* Fitur pembatalan transaksi (*Cancel*) dan pengembalian dana (*Refund*) transaksi yang sudah selesai.

### 🍳 3. Live Kitchen Queue (Antrean Dapur)
* Sistem pemantauan status persiapan makanan dan minuman secara real-time di dapur.
* Transisi status pesanan interaktif: **Menunggu (Pending)** ➔ **Memasak (Preparing)** ➔ **Siap Diambil (Ready)** ➔ **Selesai (Completed)**.
* Kemampuan untuk memundurkan status pesanan jika terjadi kesalahan dapur.
* Indikator durasi persiapan untuk mengukur efisiensi kerja kru dapur.

### 📋 4. Katalog Menu & Recipe Costing (HPP)
* Pengelolaan katalog menu lengkap (makanan, minuman, add-ons) disertai unggah gambar.
* Modul **Recipe Costing** untuk menghitung **Harga Pokok Penjualan (HPP)** secara presisi per porsi berdasarkan porsi bahan baku yang digunakan.
* Analisis margin keuntungan (*profitability analysis*) otomatis untuk memantau performa margin menu.

### 📦 5. Manajemen Inventaris & Log Persediaan
* Manajemen bahan baku (ingredients) lengkap dengan kategori inventaris dan satuan unit fleksibel.
* Fitur **Stock Opname & Adjustments** untuk menyesuaikan stok fisik dengan stok sistem disertai alasan perubahan.
* Fitur **Peringatan Stok Rendah** otomatis ketika persediaan menyentuh batas minimum yang telah ditentukan.
* Pencatatan histori pergerakan stok (*Inventory Log*) detail mencakup jenis aksi, kuantitas, waktu, dan staf penanggung jawab.

### 🔌 6. Supplier & Purchase Order (PO)
* Manajemen direktori supplier/vendor penyuplai bahan baku.
* Pembuatan draft **Purchase Order (PO)** untuk pengadaan bahan baku ke supplier.
* Alur persetujuan PO oleh Owner/Admin: **Draft ➔ Pending Approval ➔ Approved / Rejected ➔ Received**.
* Modul penerimaan barang (*Receive PO*) dengan verifikasi jumlah stok masuk secara otomatis memperbarui persediaan utama.

### 📈 7. Laporan Bisnis & Target Penjualan
* Analisis laporan penjualan, laporan pergerakan stok harian, dan laporan laba-rugi (*Profit & Loss*).
* Ekspor laporan langsung ke format dokumen **Excel** dan **PDF**.
* Penyetelan target penjualan berkala (*Targets & Goals*) serta analisis performa nominal transaksi rata-rata (*Average Order Value / AOV*).

### 🔐 8. Hak Akses (Spatie RBAC) & Manajemen Pengguna
* Pengelolaan data pengguna (staf kafe) lengkap dengan fitur reset sandi dan penonaktifan akun.
* Matriks hak akses interaktif berbasis **Spatie Laravel Permission** untuk mengatur *permission* spesifik bagi setiap *role* (Owner, Admin, Cashier, Kitchen Staff, dll.).

### ⚙️ 9. Pengaturan & Personalisasi Sistem
* **General Settings**: Mengonfigurasi nama kafe, alamat, mata uang, dan detail kontak di struk.
* **Appearance Settings**: Mengatur tema antarmuka dan preferensi layout.
* **Security Settings**: Mengganti kata sandi pengguna secara berkala.
* **Notification Center**: Notifikasi real-time untuk stok rendah, purchase order baru, dan aktivitas penting lainnya.
* **Global Search**: Fitur pencarian instan di seluruh sistem untuk menemukan menu, transaksi, bahan baku, atau supplier.

---

## 🛠️ Spesifikasi Teknologi

Cafinity POS dibangun dengan arsitektur modern Single Page Application (SPA) murni berbasis React di frontend dan Laravel sebagai API & routing wildcard di backend:

* **Backend Framework**: Laravel 13.x (PHP 8.3+)
* **Database**: MySQL / MariaDB
* **Frontend Library**: React 19.x (dikompilasi dengan Vite)
* **Routing Frontend**: React Router DOM v7
* **Komunikasi API**: Axios (dilengkapi interceptor token otomatis via AuthContext)
* **Manajemen Peran & Otorisasi**: Spatie Laravel Permission (pada API Backend)
* **Desain Antarmuka**: Vanilla CSS & TailwindCSS v4 (dengan HSL custom palette, glassmorphism, responsive layout, micro-animations, dan layout *fixed-height modals*)
* **Icon Library**: Iconify (@iconify/react & iconify-icon)
* **Visualisasi Data**: Chart.js & React-Chartjs-2

---

## 📂 Struktur Folder Penting

```
cafinity-app-laravel/
├── app/
│   ├── Http/Controllers/Api/       # Controller API backend penyedia data SPA React
│   │   ├── AuthController.php      # Autentikasi JWT/Sanctum
│   │   ├── DashboardController.php # Agregasi metrik performa bisnis
│   │   ├── InventoryController.php # Stok, penyesuaian, & peringatan stok rendah
│   │   ├── MenuController.php      # Katalog produk dan manajemen upload gambar
│   │   ├── PurchaseOrder.php       # Approval workflow pengadaan barang
│   │   ├── ReportController.php    # Ekspor laporan (Excel & PDF) & analisis laba-rugi
│   │   └── ... (19 controllers)
│   └── Models/                     # Eloquent Models (User, Inventory, Menu, Recipe, PO, dll.)
├── routes/
│   ├── api.php                     # Rute API yang dilindungi middleware 'auth:sanctum'
│   └── web.php                     # Wildcard route untuk mengarahkan semua lalu lintas ke React SPA
├── resources/
│   ├── views/app.blade.php         # Entrypoint HTML Blade untuk React SPA
│   ├── css/app.css                 # File style utama (Tailwind + CSS Tokens)
│   └── js/                         # Direktori Frontend React SPA
│       ├── app.jsx                 # Render root DOM
│       ├── AppRoot.jsx             # Bootstrapper provider (Auth, React Router)
│       ├── api/client.js           # Konfigurasi Axios instance
│       ├── router/index.jsx        # Peta rute navigasi SPA (React Router v7)
│       ├── Layouts/                # Layout persisten (Sidebar, Navbar, global state)
│       ├── Components/             # UI Components reusable (Modal, Datepicker, Skeletons)
│       └── Pages/                  # Halaman SPA per modul fitur:
│           ├── Auth/               # Login
│           ├── Dashboard/          # Dashboard khusus per-Role (Owner/Admin/Cashier)
│           ├── POS/                # Keranjang kasir, hold/resume, checkout
│           ├── KitchenOrders/      # Pemantauan antrean live dapur
│           ├── Menus/              # Katalog menu & input HPP
│           ├── Recipe/             # Simulasi Recipe Costing (HPP)
│           ├── Inventories/        # Stok, stock opname, & riwayat stok
│           ├── Supplier/           # Direktori Supplier
│           ├── PurchaseOrder/      # Workflow pengadaan barang
│           ├── Reports/            # Ekspor PDF/Excel laporan bisnis
│           ├── TargetsGoals/       # Set target omzet & Average Order Value (AOV)
│           ├── UserManagement/     # Matriks permission & direktori staf
│           └── Settings/           # Konfigurasi aplikasi
└── docs/
    └── DESIGN_SYSTEM_V-2.0.md      # Panduan style, token CSS, dan standar UI komponen
```

---

## 🎨 Panduan Style & Komponen UI (Design System)

Semua elemen antarmuka diatur menggunakan token CSS terstandarisasi untuk konsistensi visual:
* **Background Utama**: Selalu menggunakan `--color-brand-bg` (`#fbfbfe`), warna putih murni `#ffffff` hanya digunakan untuk permukaan card di atas background.
* **Palette Warna**: Didominasi oleh HSL-custom brand colors (`--color-brand-primary: #2f27ce`, `--color-brand-secondary: #443dff`) serta semantic colors (Success, Warning, Danger, Info).
* **Tipografi**: Menggunakan font *Plus Jakarta Sans* untuk teks umum dan *JetBrains Mono* untuk kode, SKU, nomor invoice, dan nilai nominal uang.
* **Modal Fixed Height**: Mengikuti aturan terbaru, seluruh modal interaktif utama menggunakan tinggi tetap berbasis viewport (misal: `h-[92vh]`, `h-[90vh]`, `h-[85vh]`, `h-[75vh]`) dengan area scrollable internal (`overflow-y-auto`) agar tetap rapi di segala ukuran layar tanpa pergeseran layout dinamis.

*Detail token warna, tipografi, grid system, dan blueprint HTML button/form dapat diakses langsung pada berkas [DESIGN_SYSTEM_V-2.0.md](file:///c:/laragon/www/cafinity-app-laravel/docs/DESIGN_SYSTEM_V-2.0.md).*

---

## 💾 Langkah Instalasi

Pastikan Anda telah memasang **PHP >= 8.3**, **Composer**, **Node.js (LTS)**, dan **MySQL/MariaDB** di komputer Anda.

### Cara Cepat (Menggunakan Composer Scripts)

Proyek ini telah dikonfigurasi dengan perintah gabungan otomatis pada Composer untuk mempermudah pengaturan awal:

#### 1. Setup Proyek Awal
Jalankan perintah ini di direktori proyek. Perintah ini akan menginstal dependensi PHP & JS, menyalin berkas `.env`, membuat kunci enkripsi aplikasi, dan melakukan kompilasi aset frontend pertama kali:
```bash
composer run setup
```

#### 2. Migrasi dan Seeding Database
Pastikan kredensial database di berkas `.env` Anda telah disesuaikan dengan server MySQL lokal, lalu jalankan perintah migrasi dan seeding bawaan Laravel:
```bash
php artisan migrate:fresh --seed
```

#### 3. Jalankan Lingkungan Pengembangan (Concurrently)
Untuk menyalakan server Laravel, listener queue, log pail, dan Vite compiler sekaligus dalam satu terminal:
```bash
composer run dev
```
Buka browser Anda dan akses aplikasi pada alamat **`http://127.0.0.1:8000`**.

---

### Cara Manual (Langkah demi Langkah)

Jika ingin menjalankan perintah satu per satu secara manual:

#### 1. Klon Repositori & Masuk ke Folder
```bash
git clone https://github.com/username/cafinity-app-laravel.git
cd cafinity-app-laravel
```

#### 2. Instalasi Dependensi
```bash
composer install
npm install
```

#### 3. Konfigurasi Environment & Key
```bash
cp .env.example .env
php artisan key:generate
```
*(Jangan lupa untuk membuat database kosong di MySQL dan memperbarui konfigurasi `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` di `.env`)*.

#### 4. Migrasi & Seed Database
```bash
php artisan migrate:fresh --seed
```

#### 5. Jalankan Server Secara Terpisah
Jalankan perintah ini di dua jendela terminal berbeda:
```bash
# Jendela Terminal 1 (Server Laravel)
php artisan serve

# Jendela Terminal 2 (Kompiler Frontend Vite)
npm run dev
```

---

## 🔑 Akun Uji Coba (Credentials)

Gunakan daftar akun berikut setelah melakukan *seeding* database untuk menguji hak akses masing-masing peran:

| Nama Pengguna     | Surel (Email)          | Kata Sandi (Password) | Hak Akses (Role)                            |
| :------------------| :-----------------------| :----------------------| :--------------------------------------------|
| **Budi Santoso**  | `budi.s@smartcafe.id`  | `password`            | **Owner** (Semua Hak Akses & Laporan)       |
| **Siti Aminah**   | `siti.a@smartcafe.id`  | `password`            | **Admin** (Pengelola Menu, Stok, & PO)      |
| **Rizky Pratama** | `rizky.p@smartcafe.id` | `password`            | **Cashier** (Kasir POS, Hold/Resume, Shift) |

---

## 🧪 Pengujian (Testing)

Aplikasi ini dilengkapi pengujian terintegrasi untuk menjamin kualitas kode:

* **Backend Unit & Feature Test**:
  ```bash
  composer run test
  ```
* **Frontend E2E Test (Playwright)**:
  ```bash
  npm run test:e2e
  ```
* **Performance Load Test (k6)**:
  ```bash
  k6 run tests/Performance/k6-load-test.js
  ```

---

## 📄 Lisensi

Platform Cafinity POS ini dikembangkan untuk kebutuhan manajemen internal kafe dan dilisensikan di bawah [MIT License](LICENSE).
