# Alur Pengguna Terintegrasi & Detail (Comprehensive End-to-End User Flow) - Cafinity POS

Dokumen ini menjelaskan secara mendetail alur kerja terintegrasi dari seluruh peran (**Owner**, **Admin**, **Kasir**, **Staf Dapur**) beserta proses otomatisasi latar belakang yang berjalan pada sistem **Cafinity POS**.

---

## 1. Flowchart End-to-End Terperinci

```mermaid
graph TD
    %% ────────────────────────────────────────────────────────────────
    %% FASE 1: INISIALISASI & CONFIG
    %% ────────────────────────────────────────────────────────────────
    subgraph Fase1 ["Fase 1: Inisialisasi & Konfigurasi (Owner & Admin)"]
        Start([Mulai]) --> O_Login[Owner/Admin Login ke Sistem]
        O_Login --> O_Config{"Pilih Konfigurasi?"}
        
        O_Config -- "User & RBAC (Owner)" -- > O_RBAC[Kelola User Baru & Matriks Role-Permission]
        O_RBAC --> O_Settings[Atur Tax/PPN & Setting General Aplikasi]
        
        O_Config -- "Menu & Kategori (Admin)" -- > A_Menu[Buat Katalog Menu & Kategori Hidangan]
        A_Menu --> A_Recipe[Input Formula Resep & Takaran Bahan Baku]
        A_Recipe --> A_HPP["Sistem Hitung Otomatis HPP & Margin Profit"]
        
        O_Config -- "Promosi & Bundling (Admin)" -- > A_Promo[Buat Promo/Diskon & Paket Menu Bundling]
        
        O_Settings --> A_Inv[Admin Input Master Data Bahan Baku]
        A_HPP --> A_Inv
        A_Promo --> A_Inv
    end

    %% ────────────────────────────────────────────────────────────────
    %% FASE 2: MANAJEMEN INVENTARIS & PO
    %% ────────────────────────────────────────────────────────────────
    subgraph Fase2 ["Fase 2: Manajemen Persediaan & Purchase Order (Admin & Owner)"]
        A_Inv --> I_Check[Pantau Stok Inventaris Gudang]
        I_Check --> I_Cond{"Apakah Stok <= Min Stock?"}
        
        I_Cond -- Ya -- > I_Alert[Sistem Memicu Peringatan Low Stock & Notifikasi]
        I_Alert --> PO_Draft[Admin Membuat Draft Purchase Order PO]
        PO_Draft --> PO_Items[Masukkan Supplier & Daftar Item Bahan Baku]
        PO_Items --> PO_Review{"Persetujuan PO oleh Owner?"}
        
        PO_Review -- Ditolak -- > PO_Reject[Status PO diubah menjadi REJECTED]
        PO_Reject --> I_Check
        
        PO_Review -- Disetujui -- > PO_Approve[Status PO diubah menjadi APPROVED]
        PO_Approve --> PO_Send[Kirim PO ke Supplier]
        PO_Send --> PO_Arrive[Barang Fisik Supplier Tiba di Gudang Kafe]
        PO_Arrive --> PO_Verify[Admin Mencocokkan Barang dengan Dokumen PO]
        PO_Verify --> PO_Receive[Admin Klik 'Terima Barang' status RECEIVED]
        PO_Receive --> PO_UpdateStock[Sistem Otomatis Menambah Kuantitas Stok & Log Masuk]
        
        I_Cond -- Tidak -- > K_Shift[Kasir Memulai Shift Kerja]
        PO_UpdateStock --> K_Shift
    end

    %% ────────────────────────────────────────────────────────────────
    %% FASE 3: OPERASIONAL TRANSAKSI POS
    %% ────────────────────────────────────────────────────────────────
    subgraph Fase3 ["Fase 3: Operasional Transaksi POS (Kasir)"]
        K_Shift --> K_POS[Kasir Buka Halaman Point of Sale POS]
        K_POS --> K_Search[Cari Menu atau Filter berdasarkan Kategori]
        K_Search --> K_Cart[Tambahkan Menu & Kuantitas ke Keranjang Belanja]
        K_Cart --> K_Notes[Input Catatan Khusus Item: misal, Less Sugar / Hot / Ice]
        
        K_Notes --> K_HoldCond{"Transaksi Mau Ditunda (Hold)?"}
        
        K_HoldCond -- Ya -- > K_HoldAction[Klik 'Hold' & Masukkan Nama/Nomor Meja]
        K_HoldAction --> K_HoldSave[Sistem Menyimpan Transaksi status HELD]
        K_HoldSave --> K_POS
        
        K_HoldSave -.-> K_Resume[Kasir Buka Daftar Hold & Klik 'Resume']
        K_Resume --> K_CartView[Kembali ke Tampilan POS dengan Keranjang Terisi]
        K_CartView --> K_PromoCond
        
        K_HoldCond -- Tidak -- > K_PromoCond{"Ada Diskon / Kode Promo?"}
        
        K_PromoCond -- Ya -- > K_ApplyPromo[Pilih & Terapkan Diskon ke Keranjang]
        K_ApplyPromo --> K_Calculate[Sistem Hitung Subtotal - Promo + PPN]
        
        K_PromoCond -- Tidak -- > K_Calculate
        
        K_Calculate --> K_PaySelect[Pilih Metode Pembayaran: Cash / QRIS / Debit]
        
        K_PaySelect --> K_PayVerify{"Pembayaran Berhasil?"}
        K_PayVerify -- Tidak -- > K_PaySelect
        
        K_PayVerify -- Ya -- > K_Checkout[Klik 'Checkout' / 'Selesaikan Transaksi']
        K_Checkout --> K_Completed[Simpan Transaksi status COMPLETED]
        K_Completed --> K_Print[Sistem Mencetak Struk Penjualan / Invoice]
    end

    %% ────────────────────────────────────────────────────────────────
    %% FASE 4: ANTREAN DAPUR (KITCHEN QUEUE)
    %% ────────────────────────────────────────────────────────────────
    subgraph Fase4 ["Fase 4: Antrean Dapur & Pelayanan (Koki & Pelayan)"]
        K_Print --> D_Pending[Sistem Membuat Kitchen Order Baru status PENDING]
        D_Pending --> D_Monitor[Koki Melihat Antrean Dapur secara Real-time]
        
        D_Monitor --> D_TimeCheck{"Apakah Order Pending > 15 Menit?"}
        D_TimeCheck -- Ya -- > D_Warning[Sistem Menampilkan Indikator Late Order]
        D_Warning --> D_Prep[Koki Klik 'Mulai Siapkan']
        
        D_TimeCheck -- Tidak -- > D_Prep
        
        D_Prep --> D_Preparing[Sistem Ubah Status menjadi PREPARING & Catat Waktu prepared_at]
        D_Preparing --> D_Cooking[Koki Memasak & Menyiapkan Hidangan]
        D_Cooking --> D_Ready[Koki Klik 'Siap Diambil' status READY]
        D_Ready --> D_Serve[Pelayan Mengantarkan Hidangan ke Meja Pelanggan]
        D_Serve --> D_Complete[Pelayan/Koki Klik 'Selesai']
        D_Complete --> D_StatusCompleted[Status Kitchen Order diubah menjadi COMPLETED]
    end

    %% ────────────────────────────────────────────────────────────────
    %% FASE 5: OTOMASI STOK & LAPORAN
    %% ────────────────────────────────────────────────────────────────
    subgraph Fase5 ["Fase 5: Otomasi Sistem & Pelaporan Analitik (Sistem & Owner)"]
        D_StatusCompleted --> S_RecipeCheck[Sistem Memeriksa Formula Resep Menu Terbeli]
        S_RecipeCheck --> S_StockDec[Sistem Memotong Stok Bahan Baku di Gudang]
        S_StockDec --> S_Log[Catat Log Pergerakan Stok status OUT di Inventory Logs]
        
        S_Log --> O_Report[Agregasi Transaksi ke Laporan Penjualan & Laba Rugi]
        O_Report --> O_Dashboard[Owner Memantau Dashboard Owner]
        
        O_Dashboard --> O_Metrics{Analisis Metrik Keuangan}
        O_Metrics -- "Laporan Laba Rugi" -- > O_Export[Ekspor Laporan Keuangan ke PDF / Excel]
        O_Metrics -- "Target & Goals" -- > O_Target[Pantau & Atur Sasaran Omzet Baru]
        O_Metrics -- "Jam Sibuk & Menu Terlaris" -- > O_Evaluation[Evaluasi Operasional & Jam Kerja Staf]
        
        O_Export --> End([Selesai])
        O_Target --> End
        O_Evaluation --> End
    end

    %% ────────────────────────────────────────────────────────────────
    %% STYLING MERMAID DIAGRAM
    %% ────────────────────────────────────────────────────────────────
    classDef fase1 fill:#efe6ff,stroke:#8c52ff,stroke-width:2px;
    classDef fase2 fill:#e6f3ff,stroke:#007fff,stroke-width:2px;
    classDef fase3 fill:#fff2e6,stroke:#ff7f00,stroke-width:2px;
    classDef fase4 fill:#e6ffe6,stroke:#00cc44,stroke-width:2px;
    classDef fase5 fill:#ffe6e6,stroke:#ff3333,stroke-width:2px;

    class Fase1 fase1;
    class Fase2 fase2;
    class Fase3 fase3;
    class Fase4 fase4;
    class Fase5 fase5;
```

---

## 2. Rincian Detail Setiap Tahapan Operasional

### A. Fase 1: Inisialisasi & Konfigurasi (Owner & Admin)
Fase ini merupakan pondasi operasional sistem yang diatur oleh **Owner** dan **Admin**:
*   **User & RBAC (Role-Based Access Control)**:
    *   Owner mendaftarkan staf baru di menu Pengguna ([UserController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/UserController.php)).
    *   Owner mengatur matriks hak akses melalui Spatie GUI ([RolePermissionController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/RolePermissionController.php)) untuk membatasi fitur kasir, admin, dan owner.
*   **Menu & Kategori**:
    *   Admin menyusun kategori menu (seperti *Coffee*, *Non-Coffee*, *Pastry*) dan mengunggah gambar produk di katalog menu ([MenuController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/MenuController.php)).
*   **Recipe Costing (HPP)**:
    *   Setiap menu dihubungkan dengan resep ([RecipeController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/RecipeController.php)).
    *   Admin memasukkan takaran bahan baku (misal: *Cappuccino* membutuhkan `15 gram` Biji Espresso dan `150 ml` Susu).
    *   Sistem menghitung Harga Pokok Penjualan (HPP) menu secara real-time dengan rumus:
        $$\text{HPP Menu} = \sum (\text{Takaran Bahan Baku} \times \text{Harga per Unit Bahan})$$
    *   Sistem menghitung margin keuntungan kotor menu secara otomatis:
        $$\text{Margin Kotor} = \frac{\text{Harga Jual} - \text{HPP}}{\text{Harga Jual}} \times 100\%$$
*   **Promosi & Bundling**:
    *   Admin mengelola kode promosi ([PromotionController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/PromotionController.php)) dan paket bundling menu ([BundleController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/BundleController.php)) untuk menarik pelanggan.

### B. Fase 2: Manajemen Persediaan & Purchase Order (Admin & Owner)
Memastikan bahan baku selalu tersedia di gudang untuk menjaga kelancaran produksi:
*   **Deteksi Stok Rendah**:
    *   Sistem memantau tabel `inventories` secara real-time. Jika `stock` $\le$ `min_stock`, sistem memicu notifikasi stok kritis ([InventoryController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/InventoryController.php)).
*   **Alur Pengadaan PO (Purchase Order)**:
    *   Admin membuat draft PO ([PurchaseOrderController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/PurchaseOrderController.php)) dan menentukan Supplier ([SupplierController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/SupplierController.php)).
    *   Owner melakukan verifikasi anggaran. Jika disetujui (`APPROVED`), PO dikirim ke Supplier.
    *   Saat barang fisik tiba, Admin memverifikasi kuantitas barang fisik dengan sistem. Jika sesuai, Admin menekan tombol "Terima Barang" (`RECEIVED`).
    *   Sistem secara otomatis menambah stok bahan baku di tabel `inventories` dan mencatat log masuk di `inventory_logs`.

### C. Fase 3: Operasional Transaksi Kasir (Kasir)
Operasional harian pelayanan transaksi kasir menggunakan Point of Sale (POS):
*   **Keranjang Belanja & Kustomisasi**:
    *   Kasir memilih menu pada halaman POS ([TransactionController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/TransactionController.php)).
    *   Kasir dapat menambahkan catatan khusus (misal: *no sugar*, *extra ice*), yang nantinya akan dikirim ke dapur.
*   **Hold & Resume (Transaksi Ditunda)**:
    *   Jika antrean kasir padat dan pelanggan ingin memesan menu tambahan nanti, Kasir menekan tombol "Hold" (`status = held`).
    *   Kasir dapat memanggil kembali keranjang belanja tersebut melalui tombol "Resume" pada transaksi held.
*   **Checkout & Pembayaran**:
    *   Kasir menerapkan diskon promo jika ada. Sistem menghitung diskon dan menambahkan pajak PPN sesuai konfigurasi di database `settings`.
    *   Kasir memilih metode pembayaran (Tunai, QRIS, Debit).
    *   Untuk metode tunai, kasir menginput uang diterima dan sistem menghitung kembalian.
    *   Kasir mengklik checkout, transaksi disimpan sebagai `COMPLETED`, dan sistem mencetak struk fisik.

### D. Fase 4: Antrean Dapur (Kitchen Queue)
Proses penyajian pesanan secara real-time untuk menjembatani kasir dan dapur:
*   **Antrean Masuk**:
    *   Setiap transaksi `COMPLETED` otomatis membuat baris antrean baru di kitchen queue ([KitchenOrderController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/KitchenOrderController.php)) dengan status `PENDING`.
*   **Peringatan Pesanan Terlambat (Late Warning)**:
    *   Jika pesanan berstatus `PENDING` atau `PREPARING` lebih dari 15 menit, sistem memicu indikator visual "Late Order" pada layar dapur untuk mempercepat proses pembuatan.
*   **Perubahan Status Dapur**:
    *   Koki menekan tombol "Mulai Siapkan" (status berubah menjadi `PREPARING`, waktu mulai dicatat di `prepared_at`).
    *   Setelah matang, koki menekan tombol "Siap Diambil" (`READY`).
    *   Pelayan mengantarkan hidangan ke meja pelanggan dan menandai selesai (`COMPLETED`, waktu selesai dicatat di `completed_at`).

### E. Fase 5: Otomasi Sistem & Analisis Bisnis (Sistem & Owner)
Langkah penting untuk sinkronisasi inventaris dan analisis performa bisnis:
*   **Pemotongan Stok Bahan Baku Otomatis**:
    *   Saat status pesanan dapur selesai (`COMPLETED`), sistem otomatis membaca formula resep dari menu yang dibeli.
    *   Sistem memotong kuantitas stok bahan baku penyusunnya secara real-time pada tabel `inventories`.
    *   Perubahan stok dicatat secara resmi sebagai log pengeluaran (`type = out`) di `inventory_logs` beserta user kasir/staf dapur yang memprosesnya.
*   **Laporan Keuangan & Evaluasi Owner**:
    *   Seluruh transaksi diakumulasikan ke dalam database untuk diolah oleh [ReportController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/ReportController.php).
    *   Owner mengakses dashboard analitik ([OwnerDashboardController.php](file:///c:/laragon/www/cafinity-app-laravel/app/Http/Controllers/Dashboard/OwnerDashboardController.php)) untuk melihat grafik omzet harian, laba bersih, jam sibuk (*busy hours*), dan target pencapaian (*targets & goals*).
    *   Owner dapat mengekspor laporan keuangan lengkap dalam format Excel atau PDF untuk audit internal kafe.
