# Product Requirement Document (PRD)
## Cafinity POS (Point of Sale & Cafe Management System)

Dokumen Spesifikasi Kebutuhan Produk (PRD) ini disusun secara detail untuk merekonstruksi, memetakan, dan mendokumentasikan fungsionalitas sistem **Cafinity POS** berbasis codebase yang aktif. Dokumen ini berfungsi sebagai acuan tunggal (*source of truth*) untuk pengembangan, pengujian, dan operasional sistem.

---

## 1. Pendahuluan & Gambaran Umum

**Cafinity POS** adalah aplikasi Point of Sale (Kasir) dan Manajemen Cafe modern berbasis web. Sistem ini dirancang untuk menyederhanakan seluruh lini operasional kafe—mulai dari penerimaan pesanan di kasir, pelacakan persiapan makanan/minuman di dapur secara real-time, manajemen persediaan bahan baku (inventaris) terintegrasi dengan supplier, hingga perhitungan biaya produksi presisi berbasis resep (Harga Pokok Penjualan/HPP) untuk menghasilkan analisis laba-rugi bisnis yang akurat.

### Target Solusi:
1. **Efisiensi Transaksi Kasir**: Proses pencarian menu, penanganan antrean fleksibel (fitur *Hold & Resume*), serta integrasi pembayaran dan cetak struk cepat.
2. **Sinkronisasi Kasir & Dapur**: Menghilangkan miskomunikasi kertas fisik dengan antrean pesanan dapur digital (*Live Kitchen Queue*) yang diperbarui secara real-time.
3. **Recipe Costing Presisi**: Perhitungan Harga Pokok Penjualan (HPP) otomatis berdasarkan bahan baku yang digunakan dalam resep menu untuk memantau margin profitabilitas riil.
4. **Kontrol Inventaris Ketat**: Peringatan stok bahan baku kritis, riwayat log pergerakan persediaan komprehensif, serta modul pemesanan barang ke supplier (*Purchase Order*) yang terintegrasi.
5. **Transparansi Target Bisnis**: Fitur pelacakan performa bisnis (*Targets & Goals*) terhadap sasaran omzet, laba bersih, atau jumlah transaksi.

---

## 2. Arsitektur & Spesifikasi Teknologi

Aplikasi ini menggunakan arsitektur **Single Page Application (SPA)** modern yang menggabungkan keandalan keamanan backend dengan kecepatan rendering sisi klien tanpa adanya reload halaman penuh:

*   **Backend (Engine)**: Laravel 11.x (PHP 8.2+) dengan arsitektur MVC (Model-View-Controller).
*   **Database**: MySQL / MariaDB sebagai penyimpanan relasional.
*   **Frontend**: React.js 18.x dengan bundler supercepat Vite.
*   **Penjembatan (Adapter)**: Inertia.js (React Adapter) untuk menyalurkan data backend ke frontend React secara langsung tanpa perlu membangun REST API terpisah secara manual.
*   **Manajemen Peran & Otorisasi**: Pustaka *Spatie Laravel Permission* untuk mengontrol akses berbasis Role-Permission.
*   **Routing Antarmuka**: *Tighten Ziggy* (`ziggy-js`) untuk mengekspos rute Laravel langsung di komponen React.
*   **Desain Antarmuka**: TailwindCSS dengan kustomisasi palet HSL untuk menyajikan visual premium minimalis, glassmorphism, responsif mobile-friendly, dan micro-animations.

---

## 3. Struktur Database & Hubungan Relasional (Schema)

Berikut adalah detail skema tabel database berdasarkan berkas migrasi aktif pada sistem:

### 3.1 Tabel Pengguna & Hak Akses
*   `users`: Menyimpan data identitas staf kafe.
    *   `id` (PK)
    *   `name` (string)
    *   `email` (string, unique)
    *   `password` (string, hashed)
    *   `role` (enum: `owner`, `admin`, `cashier`)
    *   `status` (enum/string: default `'active'`, `'inactive'`)
    *   `shift_terakhir` (datetime, nullable)
*   `roles` & `permissions` (Spatie): Mengatur grup peran dan hak akses spesifik per fitur.

### 3.2 Tabel Kategori & Menu Hidangan
*   `categories`: Kategori menu makanan/minuman (misal: *Espresso*, *Non-Coffee*, *Pastry*).
    *   `id` (PK)
    *   `name` (string)
    *   `slug` (string, unique)
    *   `is_active` (boolean, default `true`)
*   `menus`: Katalog menu hidangan kafe yang dijual ke pelanggan.
    *   `id` (PK)
    *   `category_id` (FK ke `categories`)
    *   `name` (string)
    *   `slug` (string, unique)
    *   `description` (text, nullable)
    *   `price` (unsigned integer)
    *   `image` (string, nullable - path gambar produk)
    *   `is_active` (boolean, default `true`)

### 3.3 Tabel Inventaris & Log Persediaan
*   `suppliers`: Daftar pemasok bahan baku kafe.
    *   `id` (PK)
    *   `name` (string)
    *   `email` (string, nullable)
    *   `phone` (string, nullable)
    *   `address` (text, nullable)
    *   `is_active` (boolean, default `true`)
*   `inventory_categories`: Kategori bahan baku (misal: *Biji Kopi*, *Susu*, *Sirup*, *Packaging*).
    *   `id` (PK)
    *   `name` (string)
*   `inventories`: Daftar bahan baku fisik yang digunakan untuk membuat produk/menu.
    *   `id` (PK)
    *   `inventory_category_id` (FK ke `inventory_categories`, nullable)
    *   `supplier_id` (FK ke `suppliers`, nullable)
    *   `name` (string)
    *   `unit` (string - misal: *gram*, *ml*, *pcs*)
    *   `stock` (float, default `0.00`)
    *   `min_stock` (float, default `0.00` - batas peringatan stok rendah)
    *   `price_per_unit` (unsigned integer - harga HPP dasar per satuan unit)
*   `inventory_logs`: Rekaman histori perubahan stok masuk/keluar untuk audit internal.
    *   `id` (PK)
    *   `inventory_id` (FK ke `inventories`)
    *   `user_id` (FK ke `users` - personel pemroses)
    *   `type` (string - misal: `'in'`, `'out'`, `'restock'`, `'waste'`)
    *   `qty` (float)
    *   `stock_before` (float)
    *   `stock_after` (float)
    *   `notes` (text, nullable)

### 3.4 Tabel Resep & Perhitungan HPP
*   `recipes`: Menghubungkan menu dengan kebutuhan bahan baku penyusunnya.
    *   `id` (PK)
    *   `menu_id` (FK ke `menus`, unique)
    *   `total_hpp` (unsigned integer - kalkulasi total biaya bahan baku)
    *   `notes` (text, nullable)
*   `recipe_ingredients`: Pivot bahan baku yang dibutuhkan dalam satu resep porsi menu.
    *   `id` (PK)
    *   `recipe_id` (FK ke `recipes`)
    *   `inventory_id` (FK ke `inventories`)
    *   `qty` (float - kuantitas kebutuhan, misal 15 gram biji kopi)
    *   `unit` (string)

### 3.5 Tabel Transaksi Penjualan (POS)
*   `transactions`: Induk catatan penjualan kasir.
    *   `id` (PK)
    *   `cashier_id` (FK ke `users` sebagai kasir penginput)
    *   `status` (enum: `'pending'`, `'held'`, `'completed'`, `'cancelled'`, `'refunded'`)
    *   `total_amount` (unsigned integer - total bersih setelah diskon + pajak)
    *   `discount` (unsigned integer)
    *   `tax` (unsigned integer)
    *   `payment_method` (string - misal: `'cash'`, `'qris'`, `'debit'`)
    *   `paid_amount` (unsigned integer - nominal uang yang dibayarkan)
    *   `change_amount` (unsigned integer - kembalian)
    *   `notes` (text, nullable)
*   `transaction_items`: Rincian item menu dalam satu transaksi.
    *   `id` (PK)
    *   `transaction_id` (FK ke `transactions`)
    *   `menu_id` (FK ke `menus`)
    *   `qty` (unsigned integer)
    *   `price` (unsigned integer - harga jual saat transaksi)
    *   `discount` (unsigned integer)
    *   `subtotal` (unsigned integer - `qty * price`)
    *   `notes` (string, nullable)

### 3.6 Tabel Antrean Dapur (Live Kitchen Queue)
*   `kitchen_orders`: Induk status antrean dapur untuk satu transaksi.
    *   `id` (PK)
    *   `transaction_id` (FK ke `transactions`)
    *   `status` (enum: `'pending'`, `'preparing'`, `'ready'`, `'completed'`)
    *   `prepared_at` (datetime, nullable - waktu mulai diproses/dimasak)
    *   `completed_at` (datetime, nullable - waktu selesai diproses)
    *   `notes` (text, nullable)
*   `kitchen_order_items`: Rincian item menu yang harus disiapkan oleh dapur.
    *   `id` (PK)
    *   `kitchen_order_id` (FK ke `kitchen_orders`)
    *   `menu_id` (FK ke `menus`)
    *   `qty` (unsigned integer)
    *   `status` (string/enum - status per item)
    *   `notes` (string, nullable - catatan pesanan khusus, misal: *less sugar*, *no ice*)

### 3.7 Tabel Dokumen Purchase Order (PO)
*   `purchase_orders`: Dokumen pengadaan bahan baku dari supplier.
    *   `id` (PK)
    *   `supplier_id` (FK ke `suppliers`)
    *   `user_id` (FK ke `users` - pembuat PO)
    *   `status` (enum: `'pending'`, `'approved'`, `'rejected'`, `'received'`)
    *   `total_amount` (unsigned integer)
    *   `notes` (text, nullable)
    *   `ordered_at` (datetime)
    *   `received_at` (datetime, nullable)
*   `purchase_order_items`: Daftar bahan baku yang diorder dalam PO.
    *   `id` (PK)
    *   `purchase_order_id` (FK ke `purchase_orders`)
    *   `inventory_id` (FK ke `inventories`)
    *   `qty` (float)
    *   `unit` (string)
    *   `price_per_unit` (unsigned integer)
    *   `subtotal` (unsigned integer)

### 3.8 Tabel Promosi & Bundling
*   `promotions`: Diskon khusus yang berlaku pada periode tertentu.
    *   `id` (PK)
    *   `name` (string)
    *   `type` (string - misal: `'percentage'`, `'fixed_amount'`)
    *   `value` (unsigned integer)
    *   `min_purchase` (unsigned integer)
    *   `start_date` (date)
    *   `end_date` (date)
    *   `is_active` (boolean)
*   `bundles`: Paket menu bundling (misal: *Paket Sarapan Coffee + Croissant*).
    *   `id` (PK)
    *   `name` (string)
    *   `description` (text, nullable)
    *   `price` (unsigned integer)
    *   `is_active` (boolean)
*   `bundle_items`: Rincian menu di dalam paket bundling.
    *   `id` (PK)
    *   `bundle_id` (FK ke `bundles`)
    *   `menu_id` (FK ke `menus`)
    *   `qty` (unsigned integer)

### 3.9 Tabel Laporan Target & Sistem
*   `targets`: Sasaran performa bisnis kafe.
    *   `id` (PK)
    *   `label` (string - misal: *Target Omzet Weekend*)
    *   `type` (enum: `'revenue'`, `'orders'`, `'profit'`)
    *   `target_value` (unsigned big integer)
    *   `current_value` (unsigned big integer, default `0`)
    *   `period` (string - misal: `'daily'`, `'weekly'`, `'monthly'`)
    *   `start_date` (date)
    *   `end_date` (date)
*   `settings`: Parameter konfigurasi sistem (misal: persentase pajak, alamat kafe, dll).
    *   `id` (PK)
    *   `key` (string, unique)
    *   `value` (text, nullable)
*   `audit_logs`: Log keamanan aktivitas sensitif staf.
    *   `id` (PK)
    *   `user_id` (FK ke `users`, nullable)
    *   `action` (string - nama aksi)
    *   `model_type` (string, nullable)
    *   `model_id` (unsigned big integer, nullable)
    *   `metadata` (json, nullable)

---

## 4. Hak Akses & Matriks Peran Pengguna (RBAC)

Pembagian hak akses diatur ketat menggunakan middleware Spatie pada backend Laravel dan disinkronkan ke komponen UI React.

| Modul / Fitur | Owner | Admin | Cashier |
| :--- | :---: | :---: | :---: |
| **Owner Dashboard** (Grafik Omzet & Profit) |  Ya  | Tidak | Tidak |
| **Admin Dashboard** (Stok & Margin Menu) |  Ya  |  Ya  | Tidak |
| **Cashier Dashboard** (Shift & Ringkasan Harian) |  Ya  |  Ya  |  Ya  |
| **User Directory & Reset Password** (CRUD) |  Ya  | Tidak | Tidak |
| **Role & Permission Matrix GUI** |  Ya  | Tidak | Tidak |
| **Pembersihan Cache & Optimasi Sistem** |  Ya  | Tidak | Tidak |
| **Pengaturan Target Bisnis** (*Targets & Goals*) |  Ya  | Tidak | Tidak |
| **Katalog Menu & Kategori** (CRUD) |  Ya  |  Ya  | Tidak |
| **Recipe Costing & HPP** (CRUD) |  Ya  |  Ya  | Tidak |
| **Inventaris & Bahan Baku** (CRUD) |  Ya  |  Ya  | Tidak |
| **Pemesanan Barang Supplier** (*Purchase Orders*) |  Ya  |  Ya  | Tidak |
| **Supplier & Kategori Inventaris** (CRUD) |  Ya  |  Ya  | Tidak |
| **Promosi & Bundling Menu** (CRUD) |  Ya  |  Ya  | Tidak |
| **Laporan Bisnis & Ekspor Laba Rugi** (Excel/PDF) |  Ya  |  Ya  | Tidak |
| **Point of Sale (POS)** (Checkout/Hold/Resume) |  Ya  |  Ya  |  Ya  |
| **Riwayat Transaksi & Print Invoice** |  Ya  |  Ya  |  Ya  |
| **Refund Transaksi** |  Ya  |  Ya  |  Ya  |
| **Live Kitchen Queue** (Update Status Dapur) |  Ya  |  Ya  |  Ya  |
| **Pengaturan Profil Akun** |  Ya  |  Ya  |  Ya  |

---

## 5. Spesifikasi Fungsional Modul Fitur

### 5.1 Modul Autentikasi & Profil Pengguna
*   **Login & Logout**: Sistem login standar menggunakan email dan password terenkripsi.
*   **Bypass Login Developer**: Di lingkungan pengembangan lokal (`environment('local')`), tersedia pintasan URL `/dev-login/{role}` untuk mempercepat masuk sebagai peran tertentu tanpa mengetik sandi.
*   **Profil Mandiri**: Pengguna dapat mengubah nama, email, dan mengganti password melalui menu pengaturan profil.

### 5.2 Modul Multi-Role Dashboard
*   **Owner Dashboard**:
    *   Metrik performa tingkat tinggi: total omzet harian, estimasi keuntungan bersih (pendapatan dikurangi total HPP riil), nominal rata-rata transaksi (*Average Order Value* / AOV), dan persentase kenaikan/penurunan tren dari periode sebelumnya.
    *   Grafik interaktif area chart: menggambarkan garis tren pendapatan harian berdampingan dengan laba bersih.
    *   Diagram Donut: distribusi komposisi penjualan berdasarkan kategori menu makanan/minuman.
    *   Diagram Jam Sibuk: visualisasi bar chart waktu pemesanan terpadat di kafe berdasarkan jam operasional.
    *   Widget daftar menu terlaris (*best-selling items*) beserta margin keuntungannya.
    *   Widget progress target penjualan bulanan yang sedang berjalan.
*   **Admin Dashboard**:
    *   Fokus pada kondisi operasional pergudangan: status total nilai aset inventaris saat ini, jumlah bahan baku dengan stok menipis (di bawah `min_stock`), dan log perubahan stok terbaru.
    *   Pintasan untuk melihat item kritis yang harus segera dipesan ulang (*critical items*).
*   **Cashier Dashboard**:
    *   Menampilkan ringkasan uang kas masuk dari shift kerja kasir aktif saat ini.
    *   Jumlah transaksi harian kasir tersebut dan pintasan cepat menuju halaman POS.

### 5.3 Modul Point of Sale (POS)
*   **Katalog Menu Interaktif**: Menampilkan menu aktif secara grid, lengkap dengan gambar, nama, dan harga jual.
*   **Pencarian & Filter Cepat**: Cari menu berdasarkan nama atau saring berdasarkan kategori menu (misal: *Coffee*, *Snacks*).
*   **Manajemen Keranjang (Cart)**:
    *   Menambahkan menu, mengatur jumlah item (*quantity*), serta menyematkan catatan opsional pada item (misal: *normal ice*, *sugar 50%*).
    *   Perhitungan otomatis Subtotal, Diskon promosi, Pajak penjualan (PPN, dikonfigurasi dinamis dari database `settings`), dan Total Akhir secara real-time.
*   **Fitur Hold & Resume**:
    *   Kasir dapat menunda transaksi keranjang yang sedang berjalan (status `'held'`) dengan memberikan label/catatan transaksi.
    *   Keranjang tertunda dapat dipanggil kembali (*resume*) kapan saja untuk melanjutkan checkout ketika pelanggan siap membayar.
*   **Checkout Fleksibel**:
    *   Mendukung penentuan metode pembayaran (Cash, Debit, QRIS).
    *   Input nominal uang bayar untuk menghitung nilai kembalian uang pelanggan secara presisi.
    *   Setelah checkout selesai, status transaksi menjadi `'completed'` dan sistem secara otomatis memicu antrean dapur baru.

### 5.4 Modul Live Kitchen Queue (Antrean Dapur)
*   **Pelacakan Pesanan Masuk**: Setiap transaksi POS yang sukses langsung memicu baris antrean pesanan di modul dapur secara real-time tanpa reload halaman.
*   **Pembaruan Status Interaktif**:
    *   `Pending` (Menunggu): Pesanan baru masuk dari kasir.
    *   `Preparing` (Memasak): Dapur mengklik tombol "Mulai Siapkan". Sistem mencatat waktu mulai persiapan (`prepared_at`).
    *   `Ready` (Siap Diambil): Hidangan selesai diolah dan siap disajikan.
    *   `Completed` (Selesai): Pelayan menyerahkan hidangan ke pelanggan dan pesanan ditutup. Sistem mencatat waktu selesai (`completed_at`).
*   **Indikator Durasi & Warning**:
    *   Menghitung durasi pengerjaan pesanan dapur.
    *   Menyajikan statistik durasi rata-rata waktu masak hari ini (*average cooking time*).
    *   Menampilkan peringatan visual jika pesanan berada di status antrean terlalu lama melebihi batas toleransi 15 menit (*late orders*).

### 5.5 Modul Menu Catalog & Recipe Costing (HPP)
*   **Katalog Menu**: Pengelolaan data menu lengkap dengan nama, slug otomatis, kategori, harga jual, foto hidangan, dan status aktif.
*   **Pembuat Formula Resep**:
    *   Setiap menu dapat didaftarkan satu resep uniknya.
    *   Resep dibentuk dengan memilih bahan baku (inventaris) dan memasukkan besaran takaran unit (misal: *Menu Caffe Latte membutuhkan 15 gram biji espresso, 150 ml susu segar, dan 1 pcs cup take-away*).
*   **Kalkulasi HPP & Margin Otomatis**:
    *   Sistem menghitung Harga Pokok Penjualan (HPP) menu secara presisi dengan formula:
        $$\text{HPP Menu} = \sum (\text{Kuantitas Bahan} \times \text{Harga per Unit Bahan})$$
    *   Saat resep disimpan atau bahan baku diperbarui harganya, `RecipeObserver` otomatis memicu penulisan ulang total biaya bahan baku ke kolom `total_hpp` di tabel `recipes`.
    *   Sistem menghitung persentase margin keuntungan kotor menu secara dinamis:
        $$\text{Margin Profit} = \frac{\text{Harga Jual} - \text{HPP}}{\text{Harga Jual}} \times 100\%$$
    *   Analisis ini memudahkan Owner/Admin dalam mengidentifikasi menu mana yang paling menguntungkan (*high-margin*) dan tidak menguntungkan (*low-margin*).

### 5.6 Modul Manajemen Inventaris, Log, & PO
*   **Manajemen Bahan Baku**: Mencatat bahan mentah beserta satuan unit standar pengukurannya (gram, ml, pcs, kg), stok saat ini, dan ambang batas minimum stok (*low stock limit*).
*   **Peringatan Stok Kritis**:
    *   Sistem mendeteksi item inventaris yang stoknya berada di bawah atau sama dengan batas minimum (`stock <= min_stock`).
    *   Notifikasi stok rendah ditampilkan di dashboard Owner/Admin untuk mencegah kehabisan bahan baku saat operasional.
*   **Log Perubahan Persediaan**: Setiap transaksi masuk/keluar mencatat detail log perubahan (stok awal, kuantitas dikurangi/ditambah, stok akhir, alasan, dan personel).
*   **Alur Pengadaan Barang (Purchase Order / PO)**:
    1.  **Drafting PO**: Admin/Owner membuat pengajuan PO baru dengan memilih Supplier dan mendaftarkan bahan baku yang akan dibeli beserta harga kesepakatan. PO berstatus `'pending'`.
    2.  **Approval**: Owner menyetujui (`'approved'`) atau menolak (`'rejected'`) dokumen PO tersebut.
    3.  **Receipt (Penerimaan)**: Ketika barang fisik tiba di gudang kafe, staf menerima PO di sistem (`'received'`).
    4.  **Auto Update Stock**: Sistem secara otomatis memanggil metode `adjustStock()` pada Model `Inventory` untuk meningkatkan jumlah stok fisik bahan baku bersangkutan di gudang dan mencatat log masuk resmi.

### 5.7 Modul Promosi & Bundling
*   **Manajemen Promosi**: Membuat kode promosi atau jenis diskon potongan langsung (nominal rupiah atau persentase) dengan batasan minimal transaksi pembelian dan tanggal kadaluwarsa.
*   **Paket Bundling**: Menyusun produk paket gabungan beberapa menu dengan harga paket khusus yang lebih ekonomis dibandingkan membeli satuan, mempermudah strategi *cross-selling*.

### 5.8 Modul Laporan Bisnis & Analytics
*   **Dashboard Laporan Utama**: Konsolidasi data ringkasan pendapatan, total transaksi, rata-rata tiket transaksi belanja, dan keuntungan kotor.
*   **Laporan Terspesialisasi**:
    *   *Laporan Penjualan (Sales Report)*: Detail transaksi per kasir, per metode pembayaran, dan per rentang waktu.
    *   *Laporan Inventaris (Inventory Report)*: Nilai valuasi aset stok di gudang dan pergerakannya.
    *   *Laporan Laba Rugi (Profit & Loss)*: Efisiensi pengeluaran HPP menu dibandingkan omzet penjualan.
*   **Ekspor Data**: Mendukung ekspor file instan ke format **Excel/CSV** untuk analisis data mendalam dan pengunduhan format **PDF** untuk arsip fisik cetak laporan bulanan.

### 5.9 Modul Pengaturan Target (Targets & Goals)
*   Owner dapat menetapkan target pencapaian berupa pendapatan, jumlah pesanan, atau laba bersih dalam suatu periode (Harian/Bulanan). Progress pencapaian dihitung otomatis dari agregasi transaksi yang berhasil diselesaikan di periode target tersebut.

### 5.10 Modul Administrasi & Sistem Keamanan
*   **GUI Matrix Role & Permission**: Antarmuka visual untuk mengatur hak akses Spatie (Permissions) terhadap Role yang terdaftar (Owner, Admin, Cashier) secara dinamis.
*   **Manajemen Pengguna**: CRUD staf kafe, mereset password staf yang lupa, dan menonaktifkan akun staf yang sudah tidak bekerja lagi (toggle status active/inactive).
*   **System Status & Utility**: Modul utility bagi Owner untuk membersihkan cache aplikasi (*clear cache*) dan menjalankan optimasi sistem (*optimize*) guna mempercepat load server.

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

*   **Performa & Latensi**:
    *   Aplikasi wajib beroperasi sebagai Single Page Application (SPA) dengan respons transisi halaman kurang dari 1 detik berkat Inertia.js.
    *   Pencarian menu di halaman POS harus bersifat instan tanpa adanya tundaan loading visual yang mengganggu proses transaksi kasir.
*   **Keamanan Sistem (Security)**:
    *   Seluruh password staf wajib disimpan menggunakan algoritma hashing bawaan Laravel (`bcrypt` / `argon2id`).
    *   Middleware Spatie wajib memproteksi seluruh endpoint HTTP backend dari akses ilegal di luar hak akses perannya.
    *   Perlindungan standar terhadap eksploitasi keamanan web seperti Cross-Site Request Forgery (CSRF), Cross-Site Scripting (XSS), dan SQL Injection.
*   **Desain & Pengalaman Pengguna (UX/UI)**:
    *   Antarmuka menggunakan pendekatan desain modern, minimalis, bertema gelap (*sleek dark mode*) opsional, efek glassmorphism, serta responsive layout yang optimal diakses baik via tablet kasir maupun monitor desktop komputer dapur.
    *   Aksi-aksi interaktif (seperti menambah keranjang, merubah status dapur) wajib memiliki micro-animations halus dan umpan balik (*toast notification*) instan yang intuitif.

---

## 7. Skenario Pengujian & Verifikasi Alur Utama

Untuk memastikan kualitas fungsionalitas sistem berjalan dengan sempurna, berikut adalah skenario utama pengujian ujung-ke-ujung (*end-to-end*):

### 7.1 Transaksi Kasir hingga Selesai Sajian Dapur
1.  Kasir login dan masuk ke modul POS, memilih beberapa item menu kopi dan cemilan.
2.  Kasir melakukan input diskon promosi dan pajak, lalu menekan checkout dengan pembayaran tunai (Cash).
3.  Transaksi berhasil tersimpan sebagai `'completed'`. Sistem mencetak invoice pembayaran.
4.  *Verifikasi backend*: Sistem wajib membuat data baru di tabel `kitchen_orders` dengan status `'pending'` yang menunjuk ke transaksi tersebut.
5.  Staf dapur membuka antrean dapur, melihat pesanan tersebut, lalu menekan tombol "Mulai Siapkan". Status berubah menjadi `'preparing'`.
6.  Setelah selesai memasak, dapur menekan tombol "Siap Diambil". Status berubah menjadi `'ready'`.
7.  Pelayan mengantar makanan dan menandai selesai. Status berubah menjadi `'completed'`.

### 7.2 Alur Restock Pengadaan Inventaris (PO)
1.  Admin masuk ke menu Purchase Order, membuat rancangan PO baru ke supplier X untuk pemesanan 50 kg Biji Kopi Arabika. PO berstatus `'pending'`.
2.  Owner masuk ke menu PO, meninjau rancangan PO, lalu menyetujui PO tersebut. Status berubah menjadi `'approved'`.
3.  Barang fisik tiba di gudang. Admin membuka PO yang telah disetujui, mencocokkan barang, lalu menekan tombol "Terima Barang".
4.  *Verifikasi backend*: Status PO berubah menjadi `'received'`. Sistem secara otomatis menambah kuantitas stok Biji Kopi Arabika sebanyak 50 kg di tabel `inventories` dan menulis histori baris baru di tabel `inventory_logs`.

### 7.3 Verifikasi Perhitungan HPP & Margin
1.  Admin membuat resep baru untuk *Menu Cappuccino*.
2.  Bahan baku ditambahkan: 15 gram biji espresso (harga unit: Rp200/gram) dan 150 ml susu segar (harga unit: Rp50/ml).
3.  Menu Cappuccino memiliki harga jual Rp25.000.
4.  *Kalkulasi*:
    *   HPP Susu = $150 \times 50 = Rp7.500$
    *   HPP Kopi = $15 \times 200 = Rp3.000$
    *   Total HPP Resep = $Rp7.500 + Rp3.000 = Rp10.500$
    *   Margin Kotor = $((Rp25.000 - Rp10.500) / Rp25.000) \times 100\% = 58\%$
5.  *Verifikasi database*: Sistem wajib menyimpan nilai `total_hpp = 10500` di tabel `recipes` dan nilai margin `58.0%` wajib terhitung secara dinamis saat diakses di antarmuka laporan maupun resep.

---

## 8. Kredensial Uji Coba Default (Seed Data)

Setelah melakukan seeder database (`php artisan migrate:fresh --seed`), akun-akun berikut terbuat secara otomatis untuk keperluan evaluasi sistem:

| Nama | Email | Kata Sandi | Peran Utama (Role) |
| :--- | :--- | :--- | :--- |
| **Budi Santoso** | budi.s@smartcafe.id | `password` | **Owner** (Akses Laporan, Manajemen User, RBAC) |
| **Siti Aminah** | siti.a@smartcafe.id | `password` | **Admin** (Pengelola Menu, Stok, Resep, PO) |
| **Rizky Pratama** | rizky.p@smartcafe.id | `password` | **Cashier** (Point of Sale, Kasir, Dapur) |

*Pintasan Cepat*: Di lingkungan lokal, Anda dapat langsung mengetikkan `http://127.0.0.1:8000/dev-login/owner` atau `/dev-login/admin` atau `/dev-login/cashier` di peramban untuk masuk secara instan tanpa memasukkan kredensial.
