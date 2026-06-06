
# 🎨 Devora POS - Design System & Style Guide

Dokumen ini merupakan panduan antarmuka (UI) dan pengalaman pengguna (UX) untuk ekosistem aplikasi **Devora POS**. Gunakan pedoman ini sebagai standar dasar saat mengembangkan komponen baru agar seluruh aplikasi tetap konsisten, modern, dan optimal untuk operasional cepat.

---

## 1. Palet Warna (Color Palette)

Aplikasi ini menggunakan skema warna modern berbasis *cool-toned tech palette* dari Realtime Colors yang dikombinasikan dengan beberapa warna semantik untuk kebutuhan indikator POS.

    ### Warna Utama (Core Colors)
    | Peran | Hex Code | Visual | Deskripsi |
    | :--- | :--- | :---: | :--- |
    | **Text** | `#050316` | `■` | Digunakan untuk teks utama, judul besar, dan elemen kontras tinggi. |
    | **Background** | `#fbfbfe` | `■` | Warna dasar halaman, area konten belakang, dan landasan utama. |
    | **Primary** | `#2f27ce` | `■` | Warna *brand* utama. Digunakan untuk tombol utama, menu aktif, dan teks sorotan. |
    | **Secondary** | `#dddbff` | `■` | Digunakan untuk batas (border), latar belakang komponen kasir, dan *state focus*. |
    | **Accent** | `#443dff` | `■` | Digunakan untuk tombol aksi (*Call to Action*), gradasi premium, dan elemen interaktif. |

### Warna Semantik & Status (Semantic Colors)
*Warna di bawah ini dipertahankan secara universal demi kecepatan pemahaman psikologis pengguna (kasir/owner).*
* **Selesai / Sukses / Aman:** `#10b981` (Emerald-500) | Latar: `#ecfdf5`
* **Pending / Sedang Dimasak / Peringatan:** `#f59e0b` (Amber-500) | Latar: `#fef3c7`
* **Dibatalkan / Stok Rendah / Error:** `#ef4444` (Rose-500) | Latar: `#fef2f2`

---

## 2. Tipografi & Kelas Tailwind (Typography)

Sistem ini dioptimalkan untuk keterbacaan tinggi pada layar POS kasir maupun dasbor analitik.

* **Judul Utama Halaman (Page Title):**
  ```html
  <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">Judul Halaman</h1>

```


* **Teks Keterangan / Muted Text:**
```html
<p class="text-xs md:text-sm text-[#2f27ce] font-medium mt-1">Keterangan teks di sini...</p>

```


* **Angka Nominal / Harga:**
```html
<span class="text-[14px] font-black text-[#443dff]">Rp 150.000</span>

```



---

## 3. Aturan Komponen Standar (UI Component Tokens)

### 3.1 Input & Form (Fokus & Shadow)

Kasir membutuhkan indikator visual yang sangat kuat ketika sebuah input sedang aktif. Gunakan kombinasi `ring-4` berbasis warna *Secondary* dan *border Accent*:

```html
class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all shadow-sm"

```

### 3.2 Tombol Aksi Utama (Premium Gradient)

Tombol utama yang bersifat konfirmasi atau penyelesaian transaksi wajib menggunakan gradasi horizontal dari *Primary* ke *Accent*:

```html
class="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98]"

```

### 3.3 Tombol Sekunder / Pembatalan

```html
class="border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors rounded-xl"

```

---

## 4. Pedoman UX Khusus Aplikasi POS Kasir

Aplikasi Point of Sale menuntut operasional yang instan dan bebas hambatan. Berikut adalah aturan UX wajib yang telah diterapkan pada kode sistem:

1. **Prinsip Target Klik Besar (Fitts's Law):** Jangan membuat kasir membidik tombol `+` yang kecil untuk memasukkan menu ke keranjang. Ubah seluruh struktur kartu (*Card Menu*) menjadi elemen `<button>` interaktif. Klik di bagian mana saja pada area produk harus langsung memicu fungsi `addToCart()`.
2. **Kecepatan Animasi (*Snappy Feel*):**
Hindari efek transisi lambat (seperti `duration-500` ke atas). Gunakan maksimal `duration-150` atau `duration-200` pada komponen kasir agar aplikasi terasa instan dan responsif.
3. **Efek Tekan Fisik (*Active State*):**
Setiap tombol atau kartu interaktif wajib memiliki properti `active:scale-[0.97]` atau `active:scale-[0.98]` untuk memberikan umpan balik taktil (seolah memencet tombol fisik) kepada kasir.
4. **Gaya Ikonografi Seragam:**
Semua ikon sistem wajib menggunakan satu keluarga yang sama. Proyek ini menggunakan **Solar Icons (Linear / Bold Duotone)** via Iconify untuk menjaga konsistensi ketebalan garis (*stroke*).

---
---

*Diproduksi oleh Velion / Devora Studio - 2026.*

```

### Cara Penggunaan:
1. Buat file baru bernama `DESIGN_SYSTEM.md` di dalam direktori proyekmu (biasanya ditaruh di root folder atau di dalam folder `docs/`).
2. Tempel (*paste*) kode di atas ke dalamnya.
3. Saat kamu atau timmu ingin membuat halaman baru (misalkan halaman *Catalog* atau *Users*), cukup buka file `.md` tersebut dan tiru kombinasi class Tailwind-nya agar warnanya tidak melenceng dari tema *Realtime Colors* yang kamu pakai sekarang.

```