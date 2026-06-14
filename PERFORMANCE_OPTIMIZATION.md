# Panduan & Peta Jalan Optimasi Performa Cafinity

Dokumen ini berisi peta jalan optimasi performa bertahap untuk SaaS café management system **Cafinity**. Dokumen ini dirancang untuk melacak progress optimasi, menyajikan metrik performa, dan memberikan instruksi bagi AI Agent untuk melanjutkan fase berikutnya.

---

## 1. Ringkasan Performa (Overview)

Metrik performa diukur menggunakan skrip pengujian beban k6 (`tests/Performance/k6-load-test.js`):

| Parameter                 | Baseline (Sebelum) | Target SaaS | Progress Saat Ini | Status        |
| :--------------------------| :------------------:| :-----------:| :-----------------:| :-------------:|
| **Response Time (p95)**   | 14.78s             | < 500ms     | **8.15s**          | 🟡 On Progress |
| **Average Response Time** | 11.23s             | < 200ms     | **4.96s**          | 🟡 On Progress |
| **Throughput (req/s)**    | 1.23 req/s         | 50 req/s+   | **2.34 req/s**     | 🟡 On Progress |
| **Concurrent Users**      | 1 VU               | 500+ VUs    | **20 VUs**        | 🟡 On Progress |

---

## 2. Fase 1 - Pondasi Performa (Phase 1 - Foundation)

Fase ini berfokus pada optimasi tingkat server, penataan cache dasar, pembersihan query duplikat, dan penambahan indeks database.

- [x] **Nginx + PHP-FPM Setup**
  - *Masalah*: Server Apache bawaan kurang efisien menangani banyak request konkuren.
  - *Fix*: Mengkonfigurasi Nginx sebagai reverse proxy ke PHP-FPM.
  - *Verifikasi*: Cek service status di Laragon.
  - *Expected Improvement*: Throughput naik 1.5x, konsumsi memory lebih stabil.
- [x] **PHP Worker Increase ke 10**
  - *Masalah*: Jumlah worker default (biasanya 2-4) terlalu sedikit sehingga request sering mengantre.
  - *Fix*: Mengubah setting `pm.max_children = 10` di config PHP-FPM.
  - *Verifikasi*: Monitor proses `php-cgi` atau `php-fpm` saat load test berjalan.
  - *Expected Improvement*: Penurunan response time di beban puncak.
- [x] **Query Optimization - Hapus Duplikasi hppChart**
  - *Masalah*: Perhitungan HPP per hari di `ReportController.php` memuat ribuan `TransactionItem` ke memory PHP, dihitung dua kali secara duplikat, dan menimpa date filters.
  - *Fix*: Menghapus blok `$hppChart` pertama dan mengganti perhitungan kedua dengan direct `DB::table` JOIN tanpa load Eloquent collection ke memory.
  - *Verifikasi*: Load page `Reports` dengan start/end date berbeda dan bandingkan memory usage.
  - *Expected Improvement*: Pengurangan memory footprint hingga 80% pada query laporan.
- [x] **estimateHpp Pakai DB Join**
  - *Masalah*: Method `estimateHpp()` di `OwnerDashboardController.php` melakukan load model Eloquent beserta relasinya yang memakan CPU dan memori tinggi.
  - *Fix*: Mengubah pencarian menjadi raw JOIN di SQL Level:
    ```php
    DB::table('transaction_items')
        ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
        // ...
        ->selectRaw('SUM(COALESCE(recipes.total_hpp, 0) * transaction_items.qty) as total_hpp')
    ```
  - *Verifikasi*: Cek profil query di laravel debugbar / telemetry database.
  - *Expected Improvement*: Load dashboard owner instan (< 100ms).
- [x] **profitabilityAnalysis dengan Cache::remember**
  - *Masalah*: Eager loading category dan recipe dengan ingredients selalu dievaluasi per request meskipun datanya statis.
  - *Fix*: Menghilangkan eager loading `recipe.ingredients` (karena ingredients tidak digunakan pada view data margin) dan membungkus hasil query ke dalam cache selama 5 menit:
    ```php
    Cache::remember('profitability_analysis', 300, function() { ... })
    ```
  - *Verifikasi*: Refresh dashboard berulang kali; query database berkurang drastis.
  - *Expected Improvement*: Pengurangan database round-trips untuk data menu terlaris.
- [x] **OPcache Activation di php.ini**
  - *Masalah*: Script PHP dicompile ulang dari awal pada setiap request, membuang resource CPU.
  - *Fix*: Mengaktifkan ekstensi OPcache di `php.ini` (`zend_extension=opcache`) dan menyetel directive berikut:
    ```ini
    opcache.enable=1
    opcache.enable_cli=1
    opcache.memory_consumption=128
    opcache.interned_strings_buffer=8
    opcache.max_accelerated_files=10000
    opcache.revalidate_freq=2
    ```
  - *Verifikasi*: Jalankan `php -i` dan pastikan ekstensi OPCache terdeteksi aktif.
  - *Expected Improvement*: Latensi PHP berkurang hingga 50%.
- [x] **Redis Installation & Konfigurasi**
  - *Masalah*: Driver cache default menggunakan file disk local yang lambat.
  - *Fix*: Menginstal Redis server dan mengkonfigurasi driver cache/session di `.env` menjadi `redis`.
  - *Verifikasi*: Jalankan `redis-cli monitor`.
  - *Expected Improvement*: I/O latency cache mendekati 0ms.
- [x] **Queue untuk Async Jobs (Notifikasi, Audit Log)**
  - *Masalah*: Operasi audit log dan pengiriman email berjalan sinkron yang menunda response kirim ke client.
  - *Fix*: Membuat Job class untuk proses pencatatan log audit dan notifikasi, lalu mengirimkannya ke antrean background process (`Queue::push`).
  - *Verifikasi*: Jalankan `php artisan queue:work`.
  - *Expected Improvement*: Response API login dan transaksi selesai < 100ms.
- [x] **npm run build untuk Production Assets**
  - *Masalah*: Aset frontend (Vite/Inertia) berjalan di mode development yang memuat modul JS secara mentah dan lambat.
  - *Fix*: Mengompilasi dan mengecilkan (minify) file JS/CSS ke direktori `public/build` via `npm run build`.
  - *Verifikasi*: Periksa folder `public/build/assets` dan pastikan file berukuran optimal.
  - *Expected Improvement*: Kecepatan muat halaman awal naik 3x.
- [x] **Database Indexes Migration**
  - *Masalah*: Kolom pencarian/filter di `transactions` (status, created_at), `menus` (is_active), `inventories` (stock, min_stock), dan `kitchen_orders` (status) tidak terindeks sehingga memicu Full Table Scan.
  - *Fix*: Menjalankan migration `add_performance_indexes` untuk menambahkan indeks B-Tree pada kolom-kolom kritis tersebut.
  - *Verifikasi*: Cek dengan `SHOW INDEX FROM [nama_tabel]`.
  - *Expected Improvement*: Waktu eksekusi query relasional menurun drastis seiring bertambahnya data.
- [x] **Gzip Compression di Nginx**
  - *Masalah*: Ukuran payload respons HTML, JSON, CSS, dan JS yang dikirim ke browser besar dan memakan bandwidth.
  - *Fix*: Mengaktifkan modul gzip di `nginx.conf` untuk kompresi on-the-fly tipe data teks/json/javascript.
  - *Verifikasi*: Periksa header respons HTTP dan pastikan terdapat header `Content-Encoding: gzip`.
  - *Expected Improvement*: Ukuran transfer data berkurang 60-80%.

---

## 3. Fase 2 - Optimasi Arsitektur (Phase 2 - Architecture)

Fase ini merombak struktur kode agar lebih scalable di tingkat tenant dan API.

- [x] **Multi-tenancy Implementation**
  - *Deskripsi*: Pemisahan data per penyewa (tenant) menggunakan scope query global `TenantScope` atau skema database terpisah.
- [x] **API Rate Limiting per Tenant**
  - *Deskripsi*: Mencegah satu tenant memonopoli resource API menggunakan throttle middleware Laravel.
- [x] **Sanctum Token Expiration & Cache**
  - *Deskripsi*: Cache verifikasi token Sanctum agar tidak memicu query tabel `personal_access_tokens` pada setiap request API.
- [x] **Response Pagination Enforcement**
  - *Deskripsi*: Membatasi ukuran hasil data API (misalnya max 50 items per page) untuk mencegah server kehabisan memory.
- [x] **Select Specific Columns**
  - *Deskripsi*: Mengubah query Eloquent agar hanya memuat kolom yang diperlukan (menghindari `SELECT *`).

---

## 4. Fase 3 - Skala Horizontal (Phase 3 - Scale)

Fase infrastruktur untuk mendukung pertumbuhan SaaS.

- [ ] **Read/Write Replica Database Setup**
  - *Deskripsi*: Memisahkan query SELECT ke read-replica server untuk mengurangi beban database master.
- [ ] **Horizontal Scaling PHP-FPM**
  - *Deskripsi*: Mendeploy banyak server PHP-FPM di belakang load balancer.
- [ ] **Load Balancer Configuration**
  - *Deskripsi*: Mengatur round-robin Nginx/HAProxy di depan server PHP.
- [ ] **CDN Setup (Cloudflare)**
  - *Deskripsi*: Cache file gambar, build assets, dan melindunginya dari DDoS.
- [ ] **Docker Containerization**
  - *Deskripsi*: Dockerize PHP-FPM, Nginx, dan Worker untuk orkestrasi container yang mudah.

---

## 5. Fase 4 - Monitoring & Telemetri (Phase 4 - Monitoring)

Membangun visibilitas kesehatan sistem.

- [ ] **Laravel Telescope Setup** (Development monitoring)
- [ ] **Sentry Error Tracking** (Production monitoring)
- [ ] **k6 Load Testing Scripts** (Continous integration testing)
- [ ] **Grafana + Prometheus metrics** (Infrastrucutre monitoring)
- [ ] **Uptime monitoring**

---

## 6. Panduan Penggunaan dengan AI Agent

AI Agent dapat membaca panduan ini dan mengeksekusi tahapan secara otomatis.

### Template Prompt untuk Memulai Fase 2:
```text
Tolong audit kode Laravel untuk optimasi Fase 2 (Architecture) sesuai panduan PERFORMANCE_OPTIMIZATION.md.
Prioritaskan:
1. Menambahkan cache pada query personal_access_tokens (Sanctum).
2. Memastikan seluruh endpoint API menus, transactions, dan inventories menggunakan pagination.
3. Mengubah select query Eloquent agar spesifik memanggil kolom yang dibutuhkan saja.
Buatkan rencana eksekusinya dan laporkan jika sudah selesai.
```

---

## 7. Hasil Pengujian Benchmark (Benchmark Results)

Jalankan perintah berikut untuk menguji beban server:
```bash
k6 run tests/Performance/k6-load-test.js
```

### Riwayat Hasil Benchmark
| Tahap Pengujian | p95 Response Time | Average Response Time | Throughput | Keterangan |
| :--- | :---: | :---: | :---: | :--- |
| **Baseline** | 14.78s | 11.23s | 1.23 req/s | Pengukuran awal tanpa optimasi |
| **Fase 1 (Awal)** | ~7s | ~4s | 2.50 req/s | Perhitungan HPP & cache menu selesai |
| **Fase 1 (Lengkap)** | 10.46s | 5.96s | 2.08 req/s | OPcache, Gzip, Redis & Queues diaktifkan (20 VUs) |
| **Fase 2 (Architecture)** | 8.15s | 4.96s | 2.34 req/s | Multi-tenancy, rate limiting, Sanctum token caching, pagination & column selection (20 VUs, 0% error rate) |
