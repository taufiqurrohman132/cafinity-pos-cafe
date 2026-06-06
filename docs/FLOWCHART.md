# Flowchart Cafinity POS (Point of Sale & Cafe Management System)

Dokumen ini berisi diagram alur (flowchart) dari proses bisnis utama yang terjadi pada sistem **Cafinity POS**, termasuk integrasi **QR Self-Order** dan **AI Agent**. Diagram digambarkan menggunakan sintaks [Mermaid.js](https://mermaid.js.org/) yang dapat dirender secara visual.

---

## 1. Alur Transaksi Kasir & Sinkronisasi Dapur (POS & Kitchen Queue Flow)

Alur ini menjelaskan bagaimana pesanan dibuat di kasir (POS) atau melalui scan QR Code di meja (Self-Ordering), masuk ke dapur, hingga pesanan selesai disajikan ke pelanggan dan mengurangi stok bahan baku secara otomatis.

```mermaid
graph TD
    A[Mulai] --> B{Pintu Masuk Pesanan}
    B -- Kasir POS -- > C[Kasir Pilih Menu & Kuantitas]
    B -- Scan QR Self-Order -- > D[Pelanggan Scan QR di Meja]
    
    D --> E[Pelanggan Pilih Menu & Tambahkan Catatan]
    E --> F[Pelanggan Tap Pesan Sekarang]
    
    C --> G[Keranjang Belanja Terisi]
    F --> G
    
    G --> H{Transaksi Ditunda?}
    H -- Ya -- > I[Simpan dengan status HELD / Hold & Resume]
    I --> G
    H -- Tidak -- > J[Hitung Subtotal, Diskon Promo, & Pajak]
    
    J --> K[Pilih Metode Pembayaran: Cash / QRIS / Debit]
    K --> L[Proses Checkout]
    
    L --> M[Simpan Transaksi status COMPLETED]
    M --> N[Cetak Struk/Invoice]
    
    M --> O[Buat Pesanan Dapur Baru status PENDING]
    O --> P[Dapur Lihat Pesanan Real-time di Kitchen Queue]
    
    P --> Q[Staf Dapur Klik 'Mulai Siapkan' status PREPARING]
    Q --> R[Dapur Memasak / Menyiapkan Hidangan]
    
    R --> S[Staf Dapur Klik 'Siap Diambil' status READY]
    S --> T[Pelayan Menyajikan Makanan ke Pelanggan]
    T --> U[Klik 'Selesai' status COMPLETED]
    
    U --> V[Otomatis Pangkas Stok Bahan Baku di Gudang berdasarkan Resep Menu]
    V --> W[Catat Log Pergerakan Stok di Inventory Logs]
    W --> X[Selesai]
```

---

## 2. Alur Pengadaan Bahan Baku (Purchase Order - PO Flow)

Alur ini menggambarkan proses pemesanan bahan baku ke supplier untuk mengisi ulang stok yang menipis di gudang.

```mermaid
graph TD
    A[Mulai] --> B[Admin/Owner Mengidentifikasi Stok Kritis]
    B --> C[Buat Draft Purchase Order PO status PENDING]
    C --> D[Pilih Supplier & Tambahkan Daftar Bahan Baku yang Dipesan]
    
    D --> E{Persetujuan Owner}
    E -- Ditolak -- > F[PO status REJECTED]
    F --> X[Selesai]
    
    E -- Disetujui -- > G[PO status APPROVED]
    G --> H[Kirim Pesanan ke Supplier via Email/WhatsApp]
    H --> I[Supplier Mengirimkan Bahan Baku Fisik ke Kafe]
    
    I --> J[Barang Tiba di Gudang Kafe]
    J --> K[Staf Gudang/Admin Mencocokkan Barang dengan Dokumen PO]
    
    K --> L{Sesuai?}
    L -- Tidak -- > M[Ajukan Komplain / Return ke Supplier]
    M --> I
    
    L -- Ya -- > N[Staf Klik 'Terima Barang' status RECEIVED]
    N --> O[Sistem Otomatis Menambah Stok Fisik Bahan Baku di Gudang]
    O --> P[Catat Log Masuk di Inventory Logs]
    P --> X[Selesai]
```

---

## 3. Alur Perhitungan HPP & Margin Resep (Recipe Costing & HPP Flow)

Alur ini menjelaskan bagaimana Harga Pokok Penjualan (HPP) menu dihitung secara otomatis berdasarkan harga bahan baku penyusunnya, serta kalkulasi margin keuntungan kotor.

```mermaid
graph TD
    A[Mulai] --> B[Admin Tambah Menu Baru]
    B --> C[Tentukan Harga Jual Menu]
    C --> D[Buat Formula Resep]
    
    D --> E[Pilih Bahan Baku Inventaris]
    E --> F[Masukkan Takaran Qty & Satuan Unit]
    
    F --> G{Tambah Bahan Lain?}
    G -- Ya -- > E
    G -- Tidak -- > H[Simpan Resep]
    
    H --> I[Sistem Menghitung Total HPP Menu]
    NoteOverI["Formula: HPP = Total (Qty Bahan x Harga Satuan Unit Bahan)"]
    I --> J[Simpan Total HPP ke Tabel Recipes]
    
    J --> K[Sistem Kalkulasi Margin Keuntungan Kotor Menu]
    NoteOverK["Formula: Margin = ((Harga Jual - HPP) / Harga Jual) x 100%"]
    
    K --> L[Tampilkan Margin & Analisis Laba-Rugi di Dashboard Owner/Admin]
    L --> M[Selesai]
```

---

## 4. Alur Otomasi AI Agent (AI Agent Workflow)

AI Agent bertindak sebagai pengawas proaktif (*proactive monitoring agent*) dan asisten interaktif yang terhubung ke database Cafinity serta API pihak ketiga (WhatsApp, Google Workspace, dll.).

```mermaid
graph TD
    A[Mulai] --> B{Picu AI Agent}
    
    %% Skenario 1: Stok Kritis
    B -- Pantau Stok Berkala -- > C[Sistem Deteksi Stok Bahan Baku <= Min Stock]
    C --> D[AI Agent Buat Draft PO Otomatis ke Supplier]
    D --> E[AI Agent Kirim Notifikasi WhatsApp/Email ke Owner: 'Draft PO #XXX Siap Approve']
    E --> Z[Selesai]
    
    %% Skenario 2: Pertanyaan Owner
    B -- Owner Tanya Chatbot -- > F[Owner Bertanya via Chat: 'Menu apa paling rugi minggu ini?']
    F --> G[AI Agent Query Database Transaksi + Resep + HPP]
    G --> H[AI Agent Hitung Margin & Temukan Menu Margin Terendah]
    H --> I[AI Agent Kirim Jawaban Analitik & Rekomendasi Tindakan ke Owner]
    I --> Z
    
    %% Skenario 3: Laporan Mingguan
    B -- Cron Job Senin 08.00 -- > J[Picu Laporan Mingguan Otomatis]
    J --> K[AI Agent Tarik Data Omzet, Laba Bersih, & Transaksi]
    K --> L[AI Agent Bandingkan Pencapaian dengan Target Bisnis]
    L --> M[AI Agent Generate Ringkasan Laporan PDF]
    M --> N[AI Agent Kirim Laporan via WhatsApp API / Gmail API ke Owner]
    N --> Z
    
    %% Skenario 4: Deteksi Anomali
    B -- Pantau Dapur Real-time -- > O[Deteksi Pesanan Dapur Pending > 15 Menit]
    O --> P[AI Agent Kirim WhatsApp Alert Ke Supervisor: 'Antrean Dapur Terlambat!']
    P --> Z
```
