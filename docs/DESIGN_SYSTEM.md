# 🎨 Cafinity POS - Design System & Style Guide

Dokumen ini merupakan panduan antarmuka (UI) dan pengalaman pengguna (UX) untuk ekosistem aplikasi **Cafinity POS**. Gunakan pedoman ini sebagai standar dasar saat mengembangkan komponen baru agar seluruh aplikasi tetap konsisten, modern, dan optimal untuk dasbor analitik dan transaksi kasir.

---

## 1. Palet Warna (Color Palette)

Aplikasi ini menggunakan skema warna modern berbasis *cool-toned tech palette* yang dikombinasikan dengan beberapa warna semantik untuk kebutuhan indikator POS dan dasbor owner.

### Warna Utama & Tailwind Token (Core Colors)
| Token Tailwind | Hex Code | Visual | Deskripsi |
| :--- | :--- | :---: | :--- |
| **`brand-dark`** | `#050316` | `■` | Digunakan untuk teks utama, judul besar, dan elemen kontras tinggi. |
| **`brand-bg`** | `#fbfbfe` | `■` | Warna dasar halaman, area konten belakang, dan landasan utama. |
| **`brand-primary`** | `#2f27ce` | `■` | Warna *brand* utama. Digunakan untuk tombol utama, menu aktif, dan teks sorotan. |
| **`brand-light`** | `#dddbff` | `■` | Digunakan untuk batas (border), latar belakang komponen kasir, dan *state focus*. |
| **`brand-secondary`** | `#443dff` | `■` | Digunakan untuk tombol aksi (*Call to Action*), gradasi premium, dan elemen interaktif. |

### Warna Semantik & Status (Semantic Colors)
* **Selesai / Sukses / Tren Positif:** `#10b981` (Emerald-500) | Latar: `#ecfdf5`
* **Pending / Sedang Dimasak / Peringatan:** `#f59e0b` (Amber-500) | Latar: `#fef3c7`
* **Dibatalkan / Stok Rendah / Tren Negatif:** `#ef4444` (Rose-500) | Latar: `#fef2f2`

---

## 2. Tipografi & Kelas Tailwind (Typography)

Sistem ini dioptimalkan untuk keterbacaan tinggi pada layar POS kasir maupun dasbor analitik owner.

* **Judul Utama Halaman (Page Title):**
  ```html
  <h1 class="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">Judul Halaman</h1>
  ```

* **Teks Keterangan / Muted Text:**
  ```html
  <p class="text-xs md:text-sm text-brand-primary/60 font-medium mt-1">Keterangan teks di sini...</p>
  ```

* **Angka Nominal / Harga:**
  ```html
  <span class="text-[14px] font-black text-brand-secondary">Rp 150.000</span>
  ```

---

## 3. Komponen Dasbor Owner (Owner Dashboard Components)

Dasbor Owner memprioritaskan penyajian data metrik bisnis secara informatif, dinamis, dan premium.

### 3.1 Kartu Metrik Utama (Stat Cards)
Setiap kartu statistik menggunakan interaksi visual yang mengambang dan zoom ikon:
```html
<div class="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
    <!-- Ikon dengan transisi zoom saat kartu di-hover -->
    <div class="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
        <iconify-icon icon="solar:wallet-money-linear" class="text-2xl text-brand-secondary"></iconify-icon>
    </div>
</div>
```

### 3.2 Efek Hover Gradient Premium pada List Item & Baris Tabel
Gunakan gradasi transparan dari kiri ke kanan agar sorotan daftar data (seperti menu terlaris atau baris analitik) terlihat kontras dan halus:
* **List Item Card:**
  ```html
  <Link to="/menus/1" class="flex items-center justify-between py-2 px-2.5 bg-transparent hover:bg-gradient-to-r hover:from-brand-light/60 hover:to-transparent border border-transparent hover:border-brand-light/80 rounded-2xl transition-all duration-300 hover:shadow-md hover:shadow-brand-primary/5 group">
      ...
  </Link>
  ```
* **Baris Tabel Analisis:**
  ```html
  <tr class="hover:bg-gradient-to-r hover:from-brand-light/40 hover:to-transparent transition-all cursor-pointer">
      ...
  </tr>
  ```

---

## 4. Pedoman UX Khusus Aplikasi POS Kasir

Aplikasi Point of Sale menuntut operasional transaksi kasir yang instan, responsif, dan bebas hambatan.

### 4.1 Target Klik Besar (Fitts's Law)
Kartu katalog produk pada POS kasir dirancang dengan tombol penuh. Klik di area produk mana saja langsung memicu fungsi tambah keranjang belanja:
```html
<button class="text-left bg-white rounded-2xl border-2 border-brand-light shadow-sm hover:shadow-md hover:shadow-brand-secondary/20 hover:border-brand-light active:scale-[0.97] transition-all duration-150 overflow-hidden flex flex-col group relative">
    ...
</button>
```

### 4.2 Umpan Balik Input & Pembayaran (Quick Cash suggestions)
*   **Indikator Fokus Form**: Gunakan `focus:ring-2 focus:ring-brand-light focus:border-brand-secondary` pada input teks pencarian menu.
*   **Pilihan Cepat Uang Pas**: Menyediakan tombol pintas nominal uang tunai yang dinilai dari total belanja pelanggan, menggunakan style toggle aktif-nonaktif:
    ```html
    <!-- Aktif -->
    <button class="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-primary text-white border-brand-primary shadow-sm">Rp 100.000</button>
    <!-- Non-aktif -->
    <button class="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-light/30 text-brand-primary border-brand-light hover:bg-brand-light/75">Rp 50.000</button>
    ```

### 4.3 Kecepatan Animasi & Umpan Balik Taktil
*   **Snappy Transitions**: Hindari transisi lambat. Semua interaksi transisi visual POS wajib menggunakan `duration-150` hingga `duration-300`.
*   **Efek Tekan Fisik**: Gunakan `active:scale-[0.98]` pada setiap tombol konfirmasi utama atau checkout.

---

## 5. Pedoman Ikonografi & Media

*   **Keluarga Ikon**: Seluruh ikon sistem wajib menggunakan **Solar Icons (Linear / Bold Duotone)** via Iconify untuk memastikan konsistensi ketebalan garis (*stroke*).
*   **Penanganan Placeholder Gambar**: Apabila produk menu tidak memiliki gambar unggahan, sistem harus memuat ikon bawaan kategori sebagai fallback visual untuk menjaga kerapian estetika antarmuka.

---
*Diproduksi oleh Velion / Devora Studio & Cafinity Team - 2026.*