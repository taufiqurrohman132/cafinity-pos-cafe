# ENTITY RELATIONSHIP DIAGRAM (ERD) - CAFINITY POS

Dokumen ini mendokumentasikan desain database relasional untuk sistem **Cafinity POS** (Point of Sale & Cafe Management System). Rancangan database ini disusun untuk mendukung operasional transaksi kasir, kalkulasi HPP otomatis (Recipe Costing), manajemen stok bahan baku, antrean dapur digital, dan purchase order secara konsisten dan terintegrasi. Dokumen ini disiapkan sebagai pendukung penulisan Bab 3 (Perancangan Database) Skripsi.

---

## 1. Diagram ERD (Mermaid.js)

Berikut adalah diagram hubungan entitas (ERD) yang memperlihatkan tabel-tabel database, field, tipe data, *primary key* (PK), *foreign key* (FK), serta kardinalitas relasi antar entitas.

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password
        string role
        string status
        datetime shift_terakhir
        boolean two_fa_enabled
        string two_fa_method
        string two_fa_secret
        datetime last_login
        datetime created_at
        datetime updated_at
    }

    CATEGORIES {
        int id PK
        string name
        string slug UK
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    MENUS {
        int id PK
        int category_id FK
        string name
        string slug UK
        text description
        int price
        string image
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    SUPPLIERS {
        int id PK
        string name
        string phone
        string email
        text address
        string city
        string province
        string category
        string payment_term
        int lead_time
        decimal min_order
        string status
        decimal rating
        text notes
        string code UK
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    INVENTORY_CATEGORIES {
        int id PK
        string name
        datetime created_at
        datetime updated_at
    }

    INVENTORIES {
        int id PK
        int inventory_category_id FK
        int supplier_id FK
        string name
        string unit
        float stock
        float min_stock
        int price_per_unit
        datetime created_at
        datetime updated_at
    }

    INVENTORY_LOGS {
        int id PK
        int inventory_id FK
        int user_id FK
        string type
        float qty
        float stock_before
        float stock_after
        text notes
        datetime created_at
        datetime updated_at
    }

    RECIPES {
        int id PK
        int menu_id FK "unique"
        int total_hpp
        text notes
        datetime created_at
        datetime updated_at
    }

    RECIPE_INGREDIENTS {
        int id PK
        int recipe_id FK
        int inventory_id FK
        float qty
        string unit
        datetime created_at
        datetime updated_at
    }

    TRANSACTIONS {
        int id PK
        int cashier_id FK
        string status
        int total_amount
        int discount
        int tax
        string payment_method
        int paid_amount
        int change_amount
        text notes
        datetime created_at
        datetime updated_at
    }

    TRANSACTION_ITEMS {
        int id PK
        int transaction_id FK
        int menu_id FK
        int qty
        int price
        int discount
        int subtotal
        text notes
        datetime created_at
        datetime updated_at
    }

    KITCHEN_ORDERS {
        int id PK
        int transaction_id FK "unique"
        string status
        datetime prepared_at
        datetime completed_at
        text notes
        datetime created_at
        datetime updated_at
    }

    KITCHEN_ORDER_ITEMS {
        int id PK
        int kitchen_order_id FK
        int menu_id FK
        int qty
        string status
        text notes
        datetime created_at
        datetime updated_at
    }

    PURCHASE_ORDERS {
        int id PK
        int supplier_id FK
        int user_id FK
        string status
        int total_amount
        string po_number UK
        date delivery_date
        string delivery_location
        string reference_number
        text notes
        int created_by FK
        datetime approved_at
        datetime ordered_at
        datetime received_at
        datetime created_at
        datetime updated_at
    }

    PURCHASE_ORDER_ITEMS {
        int id PK
        int purchase_order_id FK
        int inventory_id FK
        float qty
        string unit
        int price_per_unit
        int subtotal
        datetime created_at
        datetime updated_at
    }

    PROMOTIONS {
        int id PK
        string name
        string type
        int value
        int min_purchase
        date start_date
        date end_date
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    BUNDLES {
        int id PK
        string name
        text description
        int price
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    BUNDLE_ITEMS {
        int id PK
        int bundle_id FK
        int menu_id FK
        int qty
        datetime created_at
        datetime updated_at
    }

    TARGETS {
        int id PK
        string label
        string type
        int target_value
        int current_value
        string period
        date start_date
        date end_date
        datetime created_at
        datetime updated_at
    }

    SETTINGS {
        int id PK
        string key UK
        text value
        datetime created_at
        datetime updated_at
    }

    AUDIT_LOGS {
        int id PK
        int user_id FK
        string action
        string model_type
        int model_id
        json metadata
        datetime created_at
        datetime updated_at
    }

    SUPPLIER_CONTACTS {
        int id PK
        int supplier_id FK
        string name
        string phone
        string email
        string position
        boolean is_primary
        datetime created_at
        datetime updated_at
    }

    SUPPLIER_DOCUMENTS {
        int id PK
        int supplier_id FK
        string type
        string filename
        string path
        int uploaded_by FK
        datetime uploaded_at
        datetime created_at
        datetime updated_at
    }

    PO_APPROVALS {
        int id PK
        int purchase_order_id FK
        int approver_id FK
        string status
        text notes
        int level
        datetime acted_at
        datetime created_at
        datetime updated_at
    }

    SESSIONS {
        int id PK
        int user_id FK
        string device
        string browser
        string ip_address
        string location
        datetime last_activity
        datetime created_at
        datetime updated_at
    }

    %% ==========================================
    %% KARDINALITAS RELASI (CARDINALITIES)
    %% ==========================================
    
    %% Relasi Pengguna (Users)
    USERS ||--o{ TRANSACTIONS : "kasir_id"
    USERS ||--o{ INVENTORY_LOGS : "user_id"
    USERS ||--o{ PURCHASE_ORDERS : "user_id"
    USERS ||--o{ AUDIT_LOGS : "user_id"
    USERS ||--o{ SESSIONS : "user_id"
    USERS ||--o{ SUPPLIER_DOCUMENTS : "uploaded_by"
    USERS ||--o{ PO_APPROVALS : "approver_id"
    USERS ||--o{ PURCHASE_ORDERS : "created_by"

    %% Relasi Katalog Menu
    CATEGORIES ||--o{ MENUS : "category_id"
    MENUS ||--|| RECIPES : "menu_id (1:1)"
    MENUS ||--o{ TRANSACTION_ITEMS : "menu_id"
    MENUS ||--o{ KITCHEN_ORDER_ITEMS : "menu_id"
    MENUS ||--o{ BUNDLE_ITEMS : "menu_id"
    BUNDLES ||--o{ BUNDLE_ITEMS : "bundle_id"

    %% Relasi Inventaris & Pemasok
    SUPPLIERS ||--o{ INVENTORIES : "supplier_id"
    SUPPLIERS ||--o{ PURCHASE_ORDERS : "supplier_id"
    SUPPLIERS ||--o{ SUPPLIER_CONTACTS : "supplier_id"
    SUPPLIERS ||--o{ SUPPLIER_DOCUMENTS : "supplier_id"
    INVENTORY_CATEGORIES ||--o{ INVENTORIES : "inventory_category_id"
    INVENTORIES ||--o{ INVENTORY_LOGS : "inventory_id"
    INVENTORIES ||--o{ RECIPE_INGREDIENTS : "inventory_id"
    INVENTORIES ||--o{ PURCHASE_ORDER_ITEMS : "inventory_id"
    
    %% Relasi Resep
    RECIPES ||--o{ RECIPE_INGREDIENTS : "recipe_id"

    %% Relasi Transaksi & Antrean Dapur
    TRANSACTIONS ||--o{ TRANSACTION_ITEMS : "transaction_id"
    TRANSACTIONS ||--|o KITCHEN_ORDERS : "transaction_id (1:1)"
    KITCHEN_ORDERS ||--o{ KITCHEN_ORDER_ITEMS : "kitchen_order_id"

    %% Relasi Pengadaan (PO)
    PURCHASE_ORDERS ||--o{ PURCHASE_ORDER_ITEMS : "purchase_order_id"
    PURCHASE_ORDERS ||--o{ PO_APPROVALS : "purchase_order_id"
```

---

## 2. Diagram ERD Notasi Chen (Konseptual - Simbol Kotak, Oval & Belah Ketupat)

Diagram di bawah ini menyajikan **ERD Notasi Chen** (Conceptual ERD) yang sering digunakan dalam penulisan akademis (Skripsi). Diagram ini memisahkan secara visual antara **Entitas** (simbol Kotak/Persegi Panjang), **Atribut** (simbol Oval/Kapsul), dan **Relasi** (simbol Belah Ketupat/Diamond) beserta garis penghubung yang berlabel nilai kardinalitas hubungan ($1, N, M$).

```mermaid
flowchart TD
    %% ==========================================
    %% DEFINISI STYLING & CLASS (Chen Notation)
    %% ==========================================
    classDef entity fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b;
    classDef attribute fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px,color:#212121;
    classDef relation fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100;

    %% ==========================================
    %% ENTITAS (RECTANGLES)
    %% ==========================================
    USERS[USERS] ::: entity
    CATEGORIES[CATEGORIES] ::: entity
    MENUS[MENUS] ::: entity
    RECIPES[RECIPES] ::: entity
    INVENTORIES[INVENTORIES] ::: entity
    SUPPLIERS[SUPPLIERS] ::: entity
    TRANSACTIONS[TRANSACTIONS] ::: entity
    KITCHEN_ORDERS[KITCHEN_ORDERS] ::: entity
    PURCHASE_ORDERS[PURCHASE_ORDERS] ::: entity
    SUPPLIER_CONTACTS[SUPPLIER_CONTACTS] ::: entity
    SUPPLIER_DOCUMENTS[SUPPLIER_DOCUMENTS] ::: entity
    PO_APPROVALS[PO_APPROVALS] ::: entity
    SESSIONS[SESSIONS] ::: entity

    %% ==========================================
    %% ATRIBUT UTAMA (OVALS / STADIUMS)
    %% ==========================================
    %% Atribut USERS
    U_id([<u>id</u>]) ::: attribute
    U_name([name]) ::: attribute
    U_role([role]) ::: attribute
    
    %% Atribut CATEGORIES
    C_id([<u>id</u>]) ::: attribute
    C_name([name]) ::: attribute
    
    %% Atribut MENUS
    M_id([<u>id</u>]) ::: attribute
    M_name([name]) ::: attribute
    M_price([price]) ::: attribute
    
    %% Atribut RECIPES
    R_id([<u>id</u>]) ::: attribute
    R_hpp([total_hpp]) ::: attribute
    
    %% Atribut INVENTORIES
    I_id([<u>id</u>]) ::: attribute
    I_name([name]) ::: attribute
    I_stock([stock]) ::: attribute
    
    %% Atribut SUPPLIERS
    S_id([<u>id</u>]) ::: attribute
    S_name([name]) ::: attribute
    
    %% Atribut TRANSACTIONS
    T_id([<u>id</u>]) ::: attribute
    T_total([total_amount]) ::: attribute
    T_method([payment_method]) ::: attribute
    
    %% Atribut KITCHEN_ORDERS
    K_id([<u>id</u>]) ::: attribute
    K_status([status]) ::: attribute
    
    %% Atribut PURCHASE_ORDERS
    P_id([<u>id</u>]) ::: attribute
    P_total([total_amount]) ::: attribute

    %% Atribut dari Relasi Banyak-ke-Banyak (M:N)
    TI_qty([qty]) ::: attribute
    RI_qty([qty]) ::: attribute
    POI_qty([qty]) ::: attribute

    %% Atribut SUPPLIER_CONTACTS
    SC_id([<u>id</u>]) ::: attribute
    SC_name([name]) ::: attribute

    %% Atribut SUPPLIER_DOCUMENTS
    SD_id([<u>id</u>]) ::: attribute
    SD_filename([filename]) ::: attribute

    %% Atribut PO_APPROVALS
    PA_id([<u>id</u>]) ::: attribute
    PA_status([status]) ::: attribute

    %% Atribut SESSIONS
    SE_id([<u>id</u>]) ::: attribute
    SE_device([device]) ::: attribute

    %% ==========================================
    %% RELASI / HUBUNGAN (DIAMONDS)
    %% ==========================================
    Rel_User_Tx{mencatat} ::: relation
    Rel_User_PO{membuat} ::: relation
    Rel_Cat_Menu{memiliki} ::: relation
    Rel_Menu_Rec{memiliki} ::: relation
    Rel_Menu_Tx{terdapat_pada} ::: relation
    Rel_Rec_Inv{memerlukan} ::: relation
    Rel_Sup_Inv{menyuplai} ::: relation
    Rel_Sup_PO{menerima} ::: relation
    Rel_PO_Inv{memesan} ::: relation
    Rel_Tx_KO{memicu} ::: relation
    Rel_Sup_SC{memiliki_pic} ::: relation
    Rel_Sup_SD{menyertakan_dokumen} ::: relation
    Rel_User_SD{mengunggah_dokumen} ::: relation
    Rel_PO_PA{membutuhkan_approval} ::: relation
    Rel_User_PA{menyetujui_po} ::: relation
    Rel_User_SE{memiliki_sesi} ::: relation

    %% ==========================================
    %% GARIS HUBUNG ENTITAS - ATRIBUT & RELASI
    %% ==========================================
    
    %% USERS
    USERS --- U_id
    USERS --- U_name
    USERS --- U_role
    USERS ---|1| Rel_User_Tx
    USERS ---|1| Rel_User_PO
    USERS ---|1| Rel_User_SD
    USERS ---|1| Rel_User_PA
    USERS ---|1| Rel_User_SE

    %% CATEGORIES
    CATEGORIES --- C_id
    CATEGORIES --- C_name
    CATEGORIES ---|1| Rel_Cat_Menu

    %% MENUS
    MENUS --- M_id
    MENUS --- M_name
    MENUS --- M_price
    MENUS ---|N| Rel_Cat_Menu
    MENUS ---|1| Rel_Menu_Rec
    MENUS ---|M| Rel_Menu_Tx

    %% RECIPES
    RECIPES --- R_id
    RECIPES --- R_hpp
    RECIPES ---|1| Rel_Menu_Rec
    RECIPES ---|M| Rel_Rec_Inv

    %% INVENTORIES
    INVENTORIES --- I_id
    INVENTORIES --- I_name
    INVENTORIES --- I_stock
    INVENTORIES ---|N| Rel_Rec_Inv
    INVENTORIES ---|N| Rel_Sup_Inv
    INVENTORIES ---|N| Rel_PO_Inv

    %% SUPPLIERS
    SUPPLIERS --- S_id
    SUPPLIERS --- S_name
    SUPPLIERS ---|1| Rel_Sup_Inv
    SUPPLIERS ---|1| Rel_Sup_PO
    SUPPLIERS ---|1| Rel_Sup_SC
    SUPPLIERS ---|1| Rel_Sup_SD

    %% TRANSACTIONS
    TRANSACTIONS --- T_id
    TRANSACTIONS --- T_total
    TRANSACTIONS --- T_method
    TRANSACTIONS ---|N| Rel_User_Tx
    TRANSACTIONS ---|N| Rel_Menu_Tx
    TRANSACTIONS ---|1| Rel_Tx_KO

    %% KITCHEN_ORDERS
    KITCHEN_ORDERS --- K_id
    KITCHEN_ORDERS --- K_status
    KITCHEN_ORDERS ---|1| Rel_Tx_KO

    %% PURCHASE_ORDERS
    PURCHASE_ORDERS --- P_id
    PURCHASE_ORDERS --- P_total
    PURCHASE_ORDERS ---|N| Rel_User_PO
    PURCHASE_ORDERS ---|N| Rel_Sup_PO
    PURCHASE_ORDERS ---|M| Rel_PO_Inv
    PURCHASE_ORDERS ---|1| Rel_PO_PA

    %% SUPPLIER_CONTACTS
    SUPPLIER_CONTACTS --- SC_id
    SUPPLIER_CONTACTS --- SC_name
    SUPPLIER_CONTACTS ---|N| Rel_Sup_SC

    %% SUPPLIER_DOCUMENTS
    SUPPLIER_DOCUMENTS --- SD_id
    SUPPLIER_DOCUMENTS --- SD_filename
    SUPPLIER_DOCUMENTS ---|N| Rel_Sup_SD
    SUPPLIER_DOCUMENTS ---|N| Rel_User_SD

    %% PO_APPROVALS
    PO_APPROVALS --- PA_id
    PO_APPROVALS --- PA_status
    PO_APPROVALS ---|N| Rel_PO_PA
    PO_APPROVALS ---|N| Rel_User_PA

    %% SESSIONS
    SESSIONS --- SE_id
    SESSIONS --- SE_device
    SESSIONS ---|N| Rel_User_SE

    %% Menghubungkan Atribut Relasi
    Rel_Menu_Tx --- TI_qty
    Rel_Rec_Inv --- RI_qty
    Rel_PO_Inv --- POI_qty
```

---

## 3. Kamus Data (Data Dictionary)

Berikut adalah spesifikasi kolom untuk setiap entitas/tabel yang ada di dalam sistem Cafinity POS:

### 1. Tabel `users`
Tabel ini digunakan untuk menyimpan data identitas karyawan kafe (owner, admin, kasir).
*   `id` (INT, PK, Auto Increment): ID unik pengguna.
*   `name` (VARCHAR): Nama lengkap karyawan.
*   `email` (VARCHAR, Unique): Alamat email untuk kredensial login.
*   `password` (VARCHAR): Kata sandi terenkripsi (bcrypt).
*   `role` (ENUM: `'owner'`, `'admin'`, `'cashier'`): Peran hak akses staf.
*   `status` (VARCHAR): Status keaktifan akun (default: `'active'`).
*   `shift_terakhir` (DATETIME, Nullable): Waktu shift kerja kasir terakhir kali dibuka.
*   `two_fa_enabled` (BOOLEAN): Status 2FA aktif atau tidak (default: `false`).
*   `two_fa_method` (VARCHAR, Nullable): Metode 2FA yang digunakan (`'totp'`, `'sms'`).
*   `two_fa_secret` (VARCHAR, Nullable): Secret key untuk autentikasi TOTP.
*   `last_login` (DATETIME, Nullable): Waktu aktivitas login terakhir pengguna.

### 2. Tabel `categories`
Tabel ini mengelompokkan menu makanan dan minuman (contoh: Coffee, Non-Coffee, Pastry).
*   `id` (INT, PK, Auto Increment): ID unik kategori menu.
*   `name` (VARCHAR): Nama kategori.
*   `slug` (VARCHAR, Unique): Slug URL kategori.
*   `is_active` (BOOLEAN): Status keaktifan kategori (default: `true`).

### 3. Tabel `menus`
Tabel yang menampung daftar produk/hidangan yang dijual ke pelanggan.
*   `id` (INT, PK, Auto Increment): ID unik menu.
*   `category_id` (INT, FK ke `categories`): Kategori menu.
*   `name` (VARCHAR): Nama menu hidangan.
*   `slug` (VARCHAR, Unique): Slug URL menu.
*   `description` (TEXT, Nullable): Deskripsi detail menu.
*   `price` (UNSIGNED INT): Harga jual menu.
*   `image` (VARCHAR, Nullable): Path file gambar menu.
*   `is_active` (BOOLEAN): Status menu dapat dipesan atau tidak (default: `true`).

### 4. Tabel `suppliers`
Tabel penyedia bahan baku mentah untuk operasional kafe.
*   `id` (INT, PK, Auto Increment): ID unik supplier.
*   `name` (VARCHAR): Nama supplier / badan usaha.
*   `phone` (VARCHAR, Nullable): Nomor kontak supplier.
*   `email` (VARCHAR): Kontak email utama.
*   `address` (TEXT): Alamat pengiriman utama.
*   `city` (VARCHAR): Kota lokasi supplier.
*   `province` (VARCHAR): Provinsi lokasi supplier.
*   `category` (VARCHAR): Kategori penyuplaian (contoh: `'Bahan Baku'`, `'Packaging'`, dll).
*   `payment_term` (VARCHAR): Ketentuan pembayaran (contoh: `'COD'`, `'Net7'`, `'Net14'`, `'Net30'`).
*   `lead_time` (INT): Waktu tunggu pengiriman barang (dalam hari).
*   `min_order` (DECIMAL): Batas minimum nilai pembelian (minimum order value).
*   `status` (VARCHAR): Status kemitraan (`'active'`, `'inactive'`, `'blacklist'`).
*   `rating` (DECIMAL, Nullable): Rata-rata performa supplier dihitung dari riwayat PO.
*   `notes` (TEXT, Nullable): Catatan internal tentang supplier.
*   `code` (VARCHAR, Unique): Kode unik pengenal supplier (format: SUP-XXXX).
*   `is_active` (BOOLEAN): Status keaktifan kerja sama supplier.

### 5. Tabel `inventory_categories`
Tabel pengelompokan bahan baku (contoh: Beans, Milk, Syrup, Packaging).
*   `id` (INT, PK, Auto Increment): ID unik kategori inventaris.
*   `name` (VARCHAR): Nama kategori persediaan.

### 6. Tabel `inventories`
Tabel untuk mencatat stok fisik bahan baku mentah yang disimpan di gudang kafe.
*   `id` (INT, PK, Auto Increment): ID unik item inventaris.
*   `inventory_category_id` (INT, FK ke `inventory_categories`): Kategori bahan baku.
*   `supplier_id` (INT, FK ke `suppliers`, Nullable): Pemasok utama barang.
*   `name` (VARCHAR): Nama bahan baku (misal: Biji Kopi Arabika, Susu UHT).
*   `unit` (VARCHAR): Satuan ukur terkecil (gram, ml, pcs, pack).
*   `stock` (FLOAT): Kuantitas stok fisik terkini di gudang.
*   `min_stock` (FLOAT): Ambang batas peringatan stok rendah.
*   `price_per_unit` (UNSIGNED INT): HPP rata-rata per satuan unit bahan baku.

### 7. Tabel `inventory_logs`
Tabel historis perubahan stok masuk/keluar untuk keperluan audit persediaan.
*   `id` (INT, PK, Auto Increment): ID log.
*   `inventory_id` (INT, FK ke `inventories`): Bahan baku terkait.
*   `user_id` (INT, FK ke `users`): Operator yang merubah stok.
*   `type` (VARCHAR): Jenis mutasi (`'in'`, `'out'`, `'restock'`, `'waste'`).
*   `qty` (FLOAT): Jumlah barang yang bermutasi.
*   `stock_before` (FLOAT): Kuantitas stok sebelum mutasi.
*   `stock_after` (FLOAT): Kuantitas stok sesudah mutasi.
*   `notes` (TEXT, Nullable): Catatan keterangan mutasi.

### 8. Tabel `recipes`
Tabel induk untuk formula resep menu. Menghubungkan menu dengan total biaya bahan baku.
*   `id` (INT, PK, Auto Increment): ID unik resep.
*   `menu_id` (INT, FK ke `menus`, Unique): Relasi satu resep untuk satu menu (1:1).
*   `total_hpp` (UNSIGNED INT): Total biaya HPP gabungan bahan penyusun resep.
*   `notes` (TEXT, Nullable): Catatan pembuatan resep.

### 9. Tabel `recipe_ingredients`
Tabel detil bahan baku penyusun sebuah resep (tabel pivot resep dan inventaris).
*   `id` (INT, PK, Auto Increment): ID unik item resep.
*   `recipe_id` (INT, FK ke `recipes`): Resep terkait.
*   `inventory_id` (INT, FK ke `inventories`): Bahan baku yang dibutuhkan.
*   `qty` (FLOAT): Jumlah takaran bahan yang dibutuhkan (misal: 15.00).
*   `unit` (VARCHAR): Satuan takar (gram, ml, pcs).

### 10. Tabel `transactions`
Tabel transaksi utama untuk mencatat setiap checkout penjualan di kasir.
*   `id` (INT, PK, Auto Increment): ID unik transaksi.
*   `cashier_id` (INT, FK ke `users`): Pengguna dengan peran kasir yang memproses.
*   `status` (ENUM: `'pending'`, `'held'`, `'completed'`, `'cancelled'`, `'refunded'`): Status transaksi.
*   `total_amount` (UNSIGNED INT): Nilai total akhir setelah pajak & diskon.
*   `discount` (UNSIGNED INT): Nilai diskon dalam nominal rupiah.
*   `tax` (UNSIGNED INT): Nilai pajak PPN (nominal rupiah).
*   `payment_method` (VARCHAR): Metode pembayaran (`'cash'`, `'qris'`, `'debit'`).
*   `paid_amount` (UNSIGNED INT): Uang tunai yang dibayar pelanggan.
*   `change_amount` (UNSIGNED INT): Kembalian uang pelanggan.
*   `notes` (TEXT, Nullable): Catatan transaksi kasir.

### 11. Tabel `transaction_items`
Tabel detil menu makanan/minuman yang dibeli dalam satu transaksi.
*   `id` (INT, PK, Auto Increment): ID unik item transaksi.
*   `transaction_id` (INT, FK ke `transactions`): Nota transaksi terkait.
*   `menu_id` (INT, FK ke `menus`): Menu yang dibeli.
*   `qty` (UNSIGNED INT): Jumlah pembelian menu.
*   `price` (UNSIGNED INT): Harga jual menu pada saat transaksi dilakukan.
*   `discount` (UNSIGNED INT): Nilai diskon potongan item menu.
*   `subtotal` (UNSIGNED INT): Total biaya item (`qty * price - discount`).
*   `notes` (VARCHAR, Nullable): Catatan pesanan pelanggan (misal: *less sugar*).

### 12. Tabel `kitchen_orders`
Tabel induk antrean digital di dapur untuk memantau status pembuatan pesanan.
*   `id` (INT, PK, Auto Increment): ID unik antrean dapur.
*   `transaction_id` (INT, FK ke `transactions`, Unique): Relasi 1:1 ke nota transaksi penjualan.
*   `status` (ENUM: `'pending'`, `'preparing'`, `'ready'`, `'completed'`): Status kesiapan masakan.
*   `prepared_at` (DATETIME, Nullable): Waktu koki mulai menyiapkan pesanan.
*   `completed_at` (DATETIME, Nullable): Waktu pesanan selesai dibuat dan disajikan.
*   `notes` (TEXT, Nullable): Catatan khusus dari kasir untuk dapur.

### 13. Tabel `kitchen_order_items`
Tabel rincian item hidangan yang harus dibuat oleh koki.
*   `id` (INT, PK, Auto Increment): ID unik item dapur.
*   `kitchen_order_id` (INT, FK ke `kitchen_orders`): Rujukan antrean dapur.
*   `menu_id` (INT, FK ke `menus`): Menu hidangan yang disiapkan.
*   `qty` (UNSIGNED INT): Jumlah porsi.
*   `status` (VARCHAR): Status pengerjaan per item (misal: `'pending'`, `'preparing'`, `'done'`).
*   `notes` (VARCHAR, Nullable): Salinan catatan instruksi masak dari kasir.

### 14. Tabel `purchase_orders`
Tabel pengadaan bahan baku ke supplier untuk mengisi ulang stok gudang.
*   `id` (INT, PK, Auto Increment): ID unik Purchase Order.
*   `supplier_id` (INT, FK ke `suppliers`): Pemasok tujuan order.
*   `user_id` (INT, FK ke `users`): Pengguna terkait (sudah ada).
*   `status` (ENUM: `'pending'`, `'approved'`, `'rejected'`, `'received'`): Tahapan approval PO.
*   `total_amount` (UNSIGNED INT): Estimasi total biaya belanja PO.
*   `po_number` (VARCHAR, Unique): Nomor PO unik.
*   `delivery_date` (DATE, Nullable): Estimasi tanggal pengiriman.
*   `delivery_location` (VARCHAR): Gudang/lokasi tujuan pengiriman.
*   `reference_number` (VARCHAR, Nullable): Referensi invoice/faktur dari supplier.
*   `notes` (TEXT, Nullable): Catatan & ketentuan tambahan PO.
*   `created_by` (INT, FK ke `users`): ID pengguna (staf) pembuat PO.
*   `approved_at` (DATETIME, Nullable): Waktu persetujuan final PO.
*   `ordered_at` (DATETIME): Tanggal dan waktu PO diajukan.
*   `received_at` (DATETIME, Nullable): Tanggal dan waktu barang fisik diterima di gudang.

### 15. Tabel `purchase_order_items`
Tabel rincian kuantitas bahan baku yang diorder dalam dokumen PO.
*   `id` (INT, PK, Auto Increment): ID item PO.
*   `purchase_order_id` (INT, FK ke `purchase_orders`): Dokumen PO induk.
*   `inventory_id` (INT, FK ke `inventories`): Bahan baku yang dipesan.
*   `qty` (FLOAT): Jumlah barang yang dipesan.
*   `unit` (VARCHAR): Satuan beli (kg, ml, pcs, box).
*   `price_per_unit` (UNSIGNED INT): Harga kesepakatan per unit.
*   `subtotal` (UNSIGNED INT): Subtotal harga belanja item (`qty * price_per_unit`).

### 16. Tabel `promotions`
Tabel potongan diskon promo belanja (persentase atau nominal tetap).
*   `id` (INT, PK, Auto Increment): ID promosi.
*   `name` (VARCHAR): Nama promosi.
*   `type` (VARCHAR): Jenis diskon (`'percentage'` / `'fixed_amount'`).
*   `value` (UNSIGNED INT): Nilai besaran diskon.
*   `min_purchase` (UNSIGNED INT): Syarat minimal nominal transaksi.
*   `start_date` (DATE): Awal masa aktif promo.
*   `end_date` (DATE): Akhir masa aktif promo.
*   `is_active` (BOOLEAN): Status promo aktif atau tidak.

### 17. Tabel `bundles`
Tabel menu paket bundling (misal: Paket Combo Kopi + Donat dengan harga lebih hemat).
*   `id` (INT, PK, Auto Increment): ID bundle.
*   `name` (VARCHAR): Nama paket bundling.
*   `description` (TEXT, Nullable): Penjelasan paket.
*   `price` (UNSIGNED INT): Harga jual paket bundle.
*   `is_active` (BOOLEAN): Status keaktifan paket bundle.

### 18. Tabel `bundle_items`
Tabel detil menu yang terdapat di dalam paket bundling.
*   `id` (INT, PK, Auto Increment): ID item bundle.
*   `bundle_id` (INT, FK ke `bundles`): Paket bundle induk.
*   `menu_id` (INT, FK ke `menus`): Menu hidangan anggota paket.
*   `qty` (UNSIGNED INT): Kuantitas menu dalam paket.

### 19. Tabel `targets`
Tabel pencapaian sasaran bisnis (omzet pendapatan, laba, atau jumlah transaksi).
*   `id` (INT, PK, Auto Increment): ID target.
*   `label` (VARCHAR): Nama target (misal: Target Omzet Bulanan).
*   `type` (VARCHAR): Parameter target (`'revenue'`, `'orders'`, `'profit'`).
*   `target_value` (UNSIGNED BIG INT): Nilai target yang ingin dicapai.
*   `current_value` (UNSIGNED BIG INT): Akumulasi nilai saat ini yang sudah tercapai.
*   `period` (VARCHAR): Durasi target (`'daily'`, `'weekly'`, `'monthly'`).
*   `start_date` (DATE): Tanggal mulai pelacakan target.
*   `end_date` (DATE): Tanggal akhir pelacakan target.

### 20. Tabel `settings`
Tabel konfigurasi parameter global sistem (pajak, nama kafe, alamat).
*   `id` (INT, PK, Auto Increment): ID setting.
*   `key` (VARCHAR, Unique): Nama key parameter (contoh: `'tax_rate'`).
*   `value` (TEXT, Nullable): Nilai parameter (contoh: `'11'`).

### 21. Tabel `audit_logs`
Tabel log keamanan yang mencatat seluruh aktivitas perubahan data krusial oleh staf.
*   `id` (INT, PK, Auto Increment): ID audit log.
*   `user_id` (INT, FK ke `users`, Nullable): Pelaku aktivitas.
*   `action` (VARCHAR): Deskripsi aktivitas (contoh: `'create_menu'`, `'void_transaction'`).
*   `model_type` (VARCHAR, Nullable): Nama Class Model terkait (contoh: `App\Models\Menu`).
*   `model_id` (INT, Nullable): ID record model yang diubah.
*   `metadata` (JSON, Nullable): Detail payload data sebelum dan sesudah perubahan.

### 22. Tabel `supplier_contacts`
Tabel ini digunakan untuk mencatat kontak PIC (Person In Charge) untuk masing-masing supplier.
*   `id` (INT, PK, Auto Increment): ID unik kontak.
*   `supplier_id` (INT, FK ke `suppliers`): ID supplier terkait.
*   `name` (VARCHAR): Nama lengkap PIC.
*   `phone` (VARCHAR): Nomor telepon PIC.
*   `email` (VARCHAR): Alamat email PIC.
*   `position` (VARCHAR): Jabatan atau peran PIC di perusahaan supplier.
*   `is_primary` (BOOLEAN): Menandakan apakah kontak ini adalah kontak utama (primary) atau bukan.

### 23. Tabel `supplier_documents`
Tabel ini digunakan untuk menyimpan dokumen administratif dari supplier (seperti NPWP, kontrak kerja sama, sertifikat, dll).
*   `id` (INT, PK, Auto Increment): ID unik dokumen.
*   `supplier_id` (INT, FK ke `suppliers`): ID supplier terkait.
*   `type` (VARCHAR): Jenis dokumen (contoh: `'NPWP'`, `'Kontrak'`, `'Sertifikat'`).
*   `filename` (VARCHAR): Nama asli berkas dokumen.
*   `path` (VARCHAR): Path atau lokasi penyimpanan berkas di storage server.
*   `uploaded_by` (INT, FK ke `users`): ID staf yang mengunggah dokumen.
*   `uploaded_at` (DATETIME): Tanggal dan waktu dokumen diunggah.

### 24. Tabel `po_approvals`
Tabel historis persetujuan berjenjang untuk dokumen Purchase Order (PO).
*   `id` (INT, PK, Auto Increment): ID unik persetujuan.
*   `purchase_order_id` (INT, FK ke `purchase_orders`): ID PO terkait.
*   `approver_id` (INT, FK ke `users`): ID user yang bertindak sebagai approver.
*   `status` (ENUM: `'pending'`, `'approved'`, `'rejected'`): Status persetujuan.
*   `notes` (TEXT, Nullable): Catatan masukan dari approver.
*   `level` (INT): Urutan tingkat approval (level 1, 2, dst).
*   `acted_at` (DATETIME, Nullable): Tanggal dan waktu keputusan disetujui atau ditolak.

### 25. Tabel `sessions`
Tabel opsional untuk melacak sesi aktif pengguna demi tujuan keamanan (Security / Session Tracking).
*   `id` (INT, PK, Auto Increment): ID unik sesi.
*   `user_id` (INT, FK ke `users`): ID user pemilik sesi.
*   `device` (VARCHAR): Nama perangkat yang digunakan (misal: `'PC'`, `'Mobile'`).
*   `browser` (VARCHAR): Nama dan versi peramban/browser.
*   `ip_address` (VARCHAR): Alamat IP asal pengguna.
*   `location` (VARCHAR, Nullable): Estimasi kota dan negara berdasarkan IP.
*   `last_activity` (DATETIME): Waktu aktivitas terakhir pengguna.
*   `created_at` (DATETIME): Tanggal dan waktu pengguna masuk (login).

---

## 4. Penjelasan Relasi & Integritas Data (Constraints)

1.  **Relasi Satu-ke-Banyak (One-to-Many / 1:N)**:
    *   `users ||--o{ transactions`: Seorang staf kasir dapat memproses banyak transaksi penjualan harian.
    *   `categories ||--o{ menus`: Satu kategori menu (misalnya: *Espresso*) mengelompokkan banyak menu hidangan terkait.
    *   `suppliers ||--o{ inventories`: Satu pemasok dapat menyuplai banyak jenis bahan baku mentah ke gudang.
    *   `recipes ||--o{ recipe_ingredients`: Satu formula resep menu terdiri dari banyak takaran bahan baku penyusun.
    *   `transactions ||--o{ transaction_items`: Satu nota transaksi kasir berisi rincian daftar menu hidangan yang dibeli.
    *   `suppliers ||--o{ supplier_contacts`: Satu pemasok dapat memiliki banyak kontak PIC.
    *   `suppliers ||--o{ supplier_documents`: Satu pemasok dapat menyertakan banyak dokumen administratif.
    *   `purchase_orders ||--o{ po_approvals`: Satu Purchase Order dapat melewati beberapa tahapan persetujuan/approval.
    *   `users ||--o{ po_approvals`: Seorang pengguna dapat melakukan persetujuan pada banyak Purchase Order.
    *   `users ||--o{ sessions`: Seorang pengguna dapat memiliki banyak sesi masuk aktif.

2.  **Relasi Satu-ke-Satu (One-to-One / 1:1)**:
    *   `menus ||--|| recipes`: Satu menu hidangan yang terdaftar hanya memiliki maksimal satu formula resep unik untuk menghindari redundansi biaya produksi.
    *   `transactions ||--|o kitchen_orders`: Setiap checkout transaksi penjualan kasir (yang berstatus `completed`) memicu tepat satu baris antrean dapur (*Kitchen Order*) untuk diproses koki.

3.  **Integritas Referential (On Delete Restrict / Cascade)**:
    *   **Restrict**: Penghapusan bahan baku pada tabel `inventories` dicegah jika bahan baku tersebut masih terdaftar dalam formula `recipe_ingredients` aktif guna mencegah kerusakan kalkulasi HPP otomatis.
    *   **Cascade**: Penghapusan data transaksi pada tabel `transactions` (jika terjadi pembatalan sistem) secara otomatis menghapus rincian item transaksi di `transaction_items` dan data antrean dapurnya di `kitchen_orders`.
    *   **Cascade**: Penghapusan pemasok pada tabel `suppliers` secara otomatis menghapus data kontak PIC di `supplier_contacts` dan dokumen administratif di `supplier_documents`.
    *   **Cascade**: Penghapusan Purchase Order di `purchase_orders` secara otomatis menghapus riwayat persetujuannya di `po_approvals`.
