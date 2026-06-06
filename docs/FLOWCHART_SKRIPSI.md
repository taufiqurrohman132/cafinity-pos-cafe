# DIAGRAM ALUR (FLOWCHART) DAN ARSITEKTUR SISTEM CAFINITY POS

Dokumen ini menyajikan pemetaan alur proses bisnis ujung-ke-ujung (*end-to-end*) secara terintegrasi antara pengguna (aktor) dan sistem, serta diagram arsitektur sistem profesional (*Professional System Overview Architecture Diagram*) untuk sistem **Cafinity POS** (versi non-AI dan POS murni). Dokumen ini dirancang sebagai dokumen teknis pendukung untuk penulisan Bab 3 dan Bab 4 Skripsi.

---

## 1. Core Feature End-to-End Flowchart (Alur Mulai Sampai Finish)

Diagram alur berikut menggambarkan seluruh alur proses bisnis inti sistem Cafinity POS secara berurutan dalam satu diagram tunggal, mulai dari setup formula resep, pemesanan langsung di kasir (POS), antrean dapur digital, pemangkasan stok otomatis berdasarkan resep, pengawasan stok, hingga alur pengadaan barang (Purchase Order) secara manual.

```mermaid
flowchart TD
    %% ==========================================
    %% DEFINISI STYLING & CLASS (Aesthetic POS)
    %% ==========================================
    classDef start_end fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20;
    classDef setup fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b;
    classDef transaction fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100;
    classDef kitchen fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#b71c1c;
    classDef inventory fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c;
    classDef decision fill:#fffde7,stroke:#fbc02d,stroke-width:2px,color:#f57f17;

    %% Nodes Mulai & Selesai
    Start([Mulai]) ::: start_end
    Finish([Selesai]) ::: start_end

    %% ==========================================
    %% FASE 1: SETUP DATA & COSTING (RECIPE HPP)
    %% ==========================================
    subgraph Fase1 [Fase 1: Setup Bahan Baku & Recipe Costing]
        A1[Owner/Admin Input Bahan Baku & Harga per Unit] ::: setup
        A2[Owner/Admin Buat Formula Resep untuk Setiap Menu] ::: setup
        A3[RecipeObserver Menghitung Total HPP Menu secara Otomatis] ::: setup
        A4[Harga Jual & HPP Disimpan di database: menus & recipes] ::: setup
    end

    %% ==========================================
    %% FASE 2: TRANSAKSI & PEMESANAN (POS KASIR)
    %% ==========================================
    subgraph Fase2 [Fase 2: Alur Transaksi Kasir POS]
        B1[Kasir Buka Shift & Akses Antarmuka POS] ::: transaction
        B2[Kasir Pilih Menu & Atur Kuantitas Keranjang] ::: transaction
        B3[Sistem Hitung Otomatis Subtotal, Pajak, dan Diskon] ::: transaction
        B4[Kasir Pilih Pembayaran: Cash / Debit / QRIS] ::: transaction
        B5[Kasir Checkout: Transaksi Tersimpan sebagai COMPLETED & Cetak Struk] ::: transaction
    end

    %% ==========================================
    %% FASE 3: KITCHEN QUEUE & PEMROSESAN DAPUR
    %% ==========================================
    subgraph Fase3 [Fase 3: Antrean Dapur Real-time & Pelacakan Waktu]
        C1[Kitchen Queue Menerima Antrean Baru status PENDING] ::: kitchen
        C2[Koki Klik 'Mulai Siapkan' status PREPARING & Catat Timestamp] ::: kitchen
        C3[Koki Memasak / Menyiapkan Hidangan] ::: kitchen
        C4[Koki Klik 'Siap Diambil' status READY] ::: kitchen
        C5[Pelayan Menyajikan Makanan ke Pelanggan] ::: kitchen
        C6[Pelayan Klik 'Selesai' status COMPLETED & Catat Waktu Saji] ::: kitchen
    end

    %% ==========================================
    %% FASE 4: PEMOTONGAN STOK OTOMATIS
    %% ==========================================
    subgraph Fase4 [Fase 4: Pemotongan Stok Inventaris Gudang]
        D1[Sistem Memangkas Stok Bahan Baku di Gudang berdasarkan Resep Menu] ::: inventory
        D2[Sistem Mencatat Histori Perubahan ke Tabel inventory_logs] ::: inventory
    end

    %% ==========================================
    %% FASE 5: PENGAWASAN STOK & PENGADAAN (MANUAL PO)
    %% ==========================================
    subgraph Fase5 [Fase 5: Pengawasan Stok Kritis & Alur Purchase Order]
        E1{Apakah Stok <= Batas Minimum?} ::: decision
        
        %% Alur PO Manual
        E2_PO[Sistem Menampilkan Peringatan Stok Rendah di Dashboard] ::: inventory
        E3_PO[Admin/Owner Membuat Draft Purchase Order PO Manual] ::: inventory
        E4_PO[Owner Review & Menyetujui PO di Sistem status APPROVED] ::: inventory
        E5_PO[Kirim PO ke Supplier & Supplier Mengirim Barang] ::: inventory
        E6_PO[Staf Gudang Terima Barang & Klik 'Terima Barang' status RECEIVED] ::: inventory
        E7_PO[Sistem Menambah Stok Gudang & Catat Log Masuk] ::: inventory
    end

    %% ==========================================
    %% FASE 6: PELAPORAN BISNIS & ANALISIS
    %% ==========================================
    subgraph Fase6 [Fase 6: Laporan Harian & Ekspor Laba Rugi]
        F1[Owner/Admin Mengakses Dashboard Laporan Penjualan] ::: setup
        F2[Owner/Admin Filter Laporan berdasarkan Rentang Waktu / Kasir] ::: setup
        F3[Sistem Mengagregasi Total Omzet, Total HPP, dan Margin Laba Rugi] ::: setup
        F4[Owner/Admin Ekspor Laporan ke Format Excel / PDF] ::: setup
    end

    %% ==========================================
    %% KONEKSI ALUR (FLOW CONNECTIONS)
    %% ==========================================
    
    %% Fase 1 ke Fase 2
    Start --> A1
    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> B1
    
    %% Fase 2 ke Fase 3
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> C1
    
    %% Fase 3 ke Fase 4
    C1 --> C2
    C2 --> C3
    C3 --> C4
    C4 --> C5
    C5 --> C6
    C6 --> D1
    
    %% Fase 4 ke Fase 5 (Pengecekan Stok)
    D1 --> D2
    D2 --> E1
    
    %% Branching PO
    E1 -->|Ya| E2_PO
    E2_PO --> E3_PO
    E3_PO --> E4_PO
    E4_PO --> E5_PO
    E5_PO --> E6_PO
    E6_PO --> E7_PO
    E7_PO --> F1
    
    E1 -->|Tidak| F1
    
    %% Fase 5 ke Fase 6 ke Selesai
    F1 --> F2
    F2 --> F3
    F3 --> F4
    F4 --> Finish
```

---

## 2. Penjelasan Alur Ujung-ke-Ujung (6 Fase Utama)

Proses bisnis sistem Cafinity POS terbagi secara logis ke dalam 6 fase utama berikut:

### Fase 1: Setup Data & Costing (Recipe HPP)
*   **Input Inventaris**: Owner atau Admin memasukkan data bahan baku fisik (misal: biji kopi, susu, cangkir) ke dalam database inventaris, lengkap dengan harga beli per unit terkecil.
*   **Pembuatan Resep**: Admin menyusun formula resep untuk setiap menu hidangan yang dijual. Sistem menggunakan database trigger/observer (`RecipeObserver`) untuk menghitung **Harga Pokok Penjualan (HPP)** menu secara otomatis berdasarkan jumlah kebutuhan bahan dikalikan harga unit. Hasil perhitungan disimpan ke tabel `recipes` untuk menghasilkan margin keuntungan kotor menu secara real-time.

### Fase 2: Alur Transaksi Kasir POS
*   **Transaksi Kasir**: Pembelian dilayani langsung oleh kasir di kasir utama menggunakan layar POS (*Point of Sale*). Kasir memasukkan menu pesanan ke keranjang belanja, menerapkan diskon promosi jika ada, menghitung pajak (PPN), lalu memproses transaksi menggunakan metode pembayaran tunai (*cash*), debit, atau QRIS.
*   **Penyimpanan**: Sistem menyimpan transaksi dengan status `completed`, memotong uang kas shift kasir aktif, mencetak struk fisik/invoice belanja, dan mengirimkan antrean pesanan dapur baru ke database `kitchen_orders`.

### Fase 3: Antrean Dapur & Pemrosesan
*   **Kitchen Queue**: Staf dapur memantau pesanan baru secara real-time melalui layar monitor antrean dapur digital. Koki menekan tombol "Mulai Siapkan" untuk mengubah status pengerjaan pesanan dapur menjadi `preparing` (mencatat timestamp mulai).
*   **Penyajian Makanan**: Koki mengolah hidangan di dapur. Setelah selesai, koki menekan tombol "Siap Diambil" (`ready`). Pelayan menyajikan makanan langsung ke meja pelanggan, lalu menekan tombol "Selesai" (`completed` - mencatat timestamp selesai).

### Fase 4: Pemotongan Stok Otomatis
*   **Pengurangan Stok**: Begitu pesanan dapur ditandai selesai (`completed`), backend Laravel secara otomatis memicu metode pemotongan stok bahan baku di gudang (`inventories`) berdasarkan formula resep menu yang dipesan.
*   **Pencatatan Log**: Sistem menulis riwayat pengurangan bahan baku secara instan ke tabel `inventory_logs` untuk menjaga auditabilitas mutasi barang.

### Fase 5: Pengawasan Stok Kritis & Alur Purchase Order (PO)
*   **Peringatan Stok Rendah**: Sistem mengevaluasi persediaan gudang pasca-potong. Jika persediaan bahan baku berada di bawah ambang batas minimal (`stock <= min_stock`), dashboard Admin/Owner menampilkan peringatan stok rendah (*low stock alert*).
*   **Pengadaan Barang Manual (PO)**: Admin membuat rancangan *Purchase Order* (PO) dengan memilih Supplier dan mendaftarkan bahan baku yang dibeli. Owner mereview draft PO dan merubah statusnya menjadi `approved`.
*   **Penerimaan Barang**: Barang fisik dikirim oleh Supplier. Staf gudang menerima barang, mencocokkan kuantitas fisik, dan menekan tombol "Terima Barang" (status PO berubah menjadi `received`). Backend secara otomatis menambah stok bahan baku bersangkutan di gudang dan mencatat log pergerakan stok masuk.

### Fase 6: Pelaporan Bisnis & Analisis
*   **Akses Laporan**: Owner atau Admin membuka menu laporan pada dashboard untuk memantau performa penjualan harian, mingguan, atau bulanan.
*   **Filter & Agregasi**: Pengguna dapat menyaring laporan penjualan berdasarkan rentang tanggal tertentu atau nama kasir. Sistem secara otomatis menghitung total pendapatan kotor (omzet), biaya produksi total (HPP resep), dan laba bersih.
*   **Ekspor Dokumen**: Laporan yang telah difilter dapat diekspor menjadi berkas Excel/CSV untuk kebutuhan analisis data internal atau diunduh dalam format PDF sebagai arsip fisik bulanan kafe.

---

## 3. Professional System Overview Architecture Diagram

Berikut adalah diagram arsitektur sistem berlapis (*layered architecture*) Cafinity POS yang menggambarkan interaksi komponen antarmuka pengguna, penghubung data, core backend Laravel, database MySQL, hingga integrasi file export standar:

```mermaid
graph TB
    %% ==========================================
    %% COLOR DESIGN SYSTEMS (Aesthetics)
    %% ==========================================
    classDef tier fill:#1a1a24,stroke:#3b3b4f,stroke-width:2px,color:#ffffff;
    classDef client fill:#0288d1,stroke:#01579b,stroke-width:1px,color:#ffffff;
    classDef adapter fill:#00b0ff,stroke:#0091ea,stroke-width:1px,color:#000000;
    classDef backend fill:#e53935,stroke:#b71c1c,stroke-width:1px,color:#ffffff;
    classDef db fill:#2e7d32,stroke:#1b5e20,stroke-width:1px,color:#ffffff;
    classDef ext fill:#f57c00,stroke:#e65100,stroke-width:1px,color:#ffffff;
    classDef actorNode fill:#eceff1,stroke:#607d8b,stroke-width:2px,color:#263238;

    %% ==========================================
    %% STRUCTURE LAYERS
    %% ==========================================
    
    subgraph ClientLayer ["LAYER 1: CLIENT USER INTERFACE (REACT SPA)"]
        UI_POS["POS Terminal UI (Cashier)"] ::: client
        UI_Kitchen["Kitchen Monitor UI (Chef)"] ::: client
        UI_Dashboard["Admin & Owner Dashboard"] ::: client
    end

    subgraph AdapterLayer ["LAYER 2: COMMUNICATION ADAPTER (INERTIA.JS)"]
        AD_Inertia["Inertia.js Bridge<br>(Data Hydration / SPA Router)"] ::: adapter
        AD_Ziggy["Ziggy JS Route Connector"] ::: adapter
        AD_Axios["Axios (REST API Handler)"] ::: adapter
    end

    subgraph BackendLayer ["LAYER 3: CORE APPLICATION (LARAVEL 11 MVC)"]
        BE_Route["Web/API Router & Middleware"] ::: backend
        BE_Auth["RBAC Auth (Spatie Laravel Permission)"] ::: backend
        
        subgraph BE_Controller ["Laravel Controllers"]
            CTR_POS["POS & Checkout Controller"] ::: backend
            CTR_Kitchen["Kitchen Queue Controller"] ::: backend
            CTR_Inv["Inventory & PO Controller"] ::: backend
            CTR_Recipe["Recipe & Costing Controller"] ::: backend
            CTR_Report["Report & Export Controller"] ::: backend
        end
        
        subgraph BE_Observer ["Laravel Observers & Events"]
            OBS_Recipe["RecipeObserver (HPP Calculator)"] ::: backend
            OBS_Stock["InventoryObserver (Auto Stock Deductor)"] ::: backend
        end
    end

    subgraph DatabaseLayer ["LAYER 4: PERSISTENCE STORAGE (MYSQL)"]
        DB_Users[("users & roles")] ::: db
        DB_Menus[("categories, menus, bundles")] ::: db
        DB_Recipe[("recipes & ingredients")] ::: db
        DB_Stock[("inventories & logs")] ::: db
        DB_Trans[("transactions & kitchen_orders")] ::: db
        DB_PO[("purchase_orders & items")] ::: db
    end

    subgraph ExternalLayer ["LAYER 5: HARDWARE & DOCUMENT SERVICES"]
        EXT_Print["Receipt Printer / Cash Drawer"] ::: ext
        EXT_Excel["Laravel Excel Export Library"] ::: ext
        EXT_Pdf["DomPDF Document Generator"] ::: ext
        EXT_SMTP["Gmail SMTP (Email Notification)"] ::: ext
    end

    %% Apply Style Directives for Subgraphs (Tiers)
    style ClientLayer fill:#1a1a24,stroke:#3b3b4f,stroke-width:2px,color:#ffffff
    style AdapterLayer fill:#1a1a24,stroke:#3b3b4f,stroke-width:2px,color:#ffffff
    style BackendLayer fill:#1a1a24,stroke:#3b3b4f,stroke-width:2px,color:#ffffff
    style DatabaseLayer fill:#1a1a24,stroke:#3b3b4f,stroke-width:2px,color:#ffffff
    style ExternalLayer fill:#1a1a24,stroke:#3b3b4f,stroke-width:2px,color:#ffffff

    %% ==========================================
    %% CONNECTION FLOWS
    %% ==========================================
    
    %% User to Client Layer
    KasirUser([Kasir]) ::: actorNode -.-> UI_POS
    DapurUser([Staf Dapur]) ::: actorNode -.-> UI_Kitchen
    OwnerUser([Owner / Admin]) ::: actorNode -.-> UI_Dashboard
    
    %% Layer 1 to Layer 2
    ClientLayer <==> AD_Inertia
    ClientLayer <==> AD_Ziggy
    ClientLayer <==> AD_Axios

    %% Layer 2 to Layer 3
    AD_Inertia <==> BE_Route
    AD_Ziggy <==> BE_Route
    AD_Axios <==> BE_Route
    
    %% Layer 3 internal routing
    BE_Route --> BE_Auth
    BE_Auth --> BE_Controller
    
    %% Controllers to Observers & DB
    CTR_POS --> OBS_Stock
    CTR_Recipe --> OBS_Recipe
    BE_Controller <==> DatabaseLayer
    OBS_Recipe <==> DB_Recipe
    OBS_Stock <==> DB_Stock
    
    %% Controllers to Hardware / Export libraries
    CTR_POS ===> EXT_Print
    CTR_Report ===> EXT_Excel
    CTR_Report ===> EXT_Pdf
    BE_Controller ===> EXT_SMTP
```

---

## 4. Penjelasan Detil Arsitektur Sistem

### 1. Client User Interface (React SPA)
Antarmuka pengguna dikembangkan menggunakan React.js yang bertindak sebagai *Single Page Application* (SPA) dengan performa tinggi. Aplikasi ini terbagi menjadi tiga antarmuka utama: antarmuka Kasir (POS Terminal), monitor antrean dapur (Kitchen Monitor), dan dashboard panel administrasi untuk Owner/Admin. Tampilan menggunakan TailwindCSS dengan gaya visual premium, glassmorphic card, bertema gelap, serta didukung *micro-animations* yang responsif.

### 2. Communication Adapter (Inertia.js)
Inertia.js digunakan sebagai jembatan data antara Laravel (backend) dan React (frontend). Inertia mengeliminasi kebutuhan untuk membangun REST API terpisah secara manual. Controller Laravel dapat langsung mengirimkan data berupa array PHP (hydrated data) ke React props secara aman tanpa reload halaman penuh. Pustaka `ziggy-js` digunakan untuk mengekspos daftar routing Laravel langsung di sisi klien React.

### 3. Core Application (Laravel 11 MVC)
Inti sistem bisnis berjalan di atas Laravel 11. Modul ini bertugas mengatur routing web, autentikasi berbasis hak akses peran staf (RBAC menggunakan Spatie Laravel Permission), controllers untuk masing-masing fitur utama (POS, Dapur, Inventaris, Resep HPP, Laporan, PO), serta pemanfaatan **Laravel Observers** (`RecipeObserver` dan `InventoryObserver`) untuk menghitung HPP resep dan memotong stok gudang secara otomatis berdasarkan transaksi penjualan.

### 4. Database Layer (MySQL)
Penyimpanan data relasional menggunakan MySQL. Struktur data dioptimalkan dengan relasi antar tabel (Foreign Keys, Cascade) untuk menjamin konsistensi data transaksi penjualan, stok bahan baku, formula resep, status order dapur, target pencapaian bisnis, serta logs audit sistem.

### 5. Hardware & Document Services (Integrasi Eksternal)
*   **Receipt Printer / Cash Drawer**: Integrasi langsung dengan perangkat kasir lokal untuk mencetak struk transaksi penjualan kasir setelah transaksi berstatus `completed`.
*   **Laravel Excel Export Library**: Pustaka eksternal yang diintegrasikan di backend untuk mengunduh laporan penjualan dan laporan laba rugi dalam format berkas Excel/CSV.
*   **DomPDF Document Generator**: Pustaka backend untuk merender template HTML laporan bulanan menjadi dokumen PDF siap cetak.
*   **Gmail SMTP Service**: Digunakan untuk pengiriman notifikasi persetujuan PO atau pengiriman notifikasi penting lainnya kepada Owner secara otomatis menggunakan email standar.
