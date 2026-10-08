# 🎨 Cafinity POS — Design System & Style Guide v2.0

*Diproduksi oleh Velion / Devora Studio & Cafinity Team — 2026*

---

## 1. Fondasi: CSS Design Tokens

Semua nilai wajib direferensi dari token ini. Jangan hardcode hex atau angka langsung di komponen.

```css
:root {
  /* === BRAND COLORS === */
  --color-brand-dark:      #050316;
  --color-brand-bg:        #fbfbfe;
  --color-brand-primary:   #2f27ce;
  --color-brand-secondary: #443dff;
  --color-brand-light:     #dddbff;

  /* === SEMANTIC COLORS === */
  --color-success:         #10b981;
  --color-success-bg:      #ecfdf5;
  --color-success-text:    #065f46;

  --color-warning:         #f59e0b;
  --color-warning-bg:      #fef3c7;
  --color-warning-text:    #92400e;

  --color-danger:          #ef4444;
  --color-danger-bg:       #fef2f2;
  --color-danger-text:     #b91c1c;

  --color-info:            #3b82f6;
  --color-info-bg:         #eff6ff;
  --color-info-text:       #1e40af;

  /* === NEUTRAL === */
  --color-white:           #ffffff;
  --color-gray-50:         #f9fafb;
  --color-gray-100:        #f3f4f6;
  --color-gray-200:        #e5e7eb;
  --color-gray-300:        #d1d5db;
  --color-gray-400:        #9ca3af;
  --color-gray-500:        #6b7280;
  --color-gray-600:        #4b5563;
  --color-gray-700:        #374151;
  --color-gray-800:        #1f2937;
  --color-gray-900:        #111827;

  /* === TYPOGRAPHY === */
  --font-sans:             'Plus Jakarta Sans', sans-serif;
  --font-mono:             'JetBrains Mono', monospace;

  /* === FONT SIZE === */
  --text-xs:     11px;
  --text-sm:     13px;
  --text-base:   14px;
  --text-md:     16px;
  --text-lg:     18px;
  --text-xl:     20px;
  --text-2xl:    24px;
  --text-3xl:    28px;
  --text-4xl:    32px;
  --text-display: 40px;

  /* === LINE HEIGHT === */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* === FONT WEIGHT === */
  --font-regular:    400;
  --font-medium:     500;
  --font-semibold:   600;
  --font-bold:       700;
  --font-extrabold:  800;
  --font-black:      900;

  /* === SPACING (4px base) === */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;

  /* === BORDER RADIUS === */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  20px;
  --radius-full: 9999px;

  /* === SHADOW === */
  --shadow-xs:  0 1px 2px rgba(5, 3, 22, 0.05);
  --shadow-sm:  0 1px 3px rgba(5, 3, 22, 0.08), 0 1px 2px rgba(5, 3, 22, 0.04);
  --shadow-md:  0 4px 6px rgba(5, 3, 22, 0.06), 0 2px 4px rgba(5, 3, 22, 0.04);
  --shadow-lg:  0 10px 15px rgba(5, 3, 22, 0.08), 0 4px 6px rgba(5, 3, 22, 0.04);
  --shadow-xl:  0 20px 25px rgba(5, 3, 22, 0.10), 0 8px 10px rgba(5, 3, 22, 0.04);
  --shadow-brand: 0 8px 20px rgba(47, 39, 206, 0.15);

  /* === BORDER === */
  --border-default: 1px solid var(--color-brand-light);
  --border-subtle:  1px solid var(--color-gray-100);
  --border-strong:  1px solid var(--color-gray-300);

  /* === TRANSITION === */
  --transition-fast:   all 0.15s ease;
  --transition-base:   all 0.2s ease;
  --transition-slow:   all 0.3s ease;
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 2. Font Setup

Tambahkan di `<head>` atau `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Untuk Tailwind, daftarkan di `tailwind.config.js`:

```js
fontFamily: {
  sans: ['Plus Jakarta Sans', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

---

## 3. Tipografi — Type Scale Lengkap

| Level | Token | Size | Weight | Line Height | Penggunaan |
|---|---|---|---|---|---|
| Display | `text-display` | 40px | 800 | 1.25 | Hero section, splash screen |
| H1 | `text-3xl` | 28px | 800 | 1.25 | Judul halaman utama |
| H2 | `text-2xl` | 24px | 700 | 1.375 | Judul section |
| H3 | `text-xl` | 20px | 700 | 1.375 | Sub-section, judul card besar |
| H4 | `text-lg` | 18px | 600 | 1.5 | Judul card, grup form |
| Body Large | `text-md` | 16px | 400 | 1.625 | Paragraf utama |
| Body | `text-base` | 14px | 400 | 1.5 | Konten umum, label |
| Body Small | `text-sm` | 13px | 400 | 1.5 | Deskripsi, helper text |
| Caption | `text-xs` | 11px | 500 | 1.5 | Timestamp, metadata |
| Overline | `text-xs` | 11px | 600 | 1.5 | Label kategori uppercase |
| Nominal/Harga | `text-base` | 14px | 900 | 1 | Angka harga, total transaksi |
| Kode/SKU | `font-mono` | 13px | 400 | 1.5 | Kode produk, invoice ID |

### Tailwind class helper yang wajib ada

```html
<!-- H1 halaman -->
<h1 class="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight">

<!-- H2 section -->
<h2 class="text-2xl font-bold text-brand-dark leading-snug">

<!-- H4 card title -->
<h4 class="text-lg font-semibold text-brand-dark">

<!-- Body default -->
<p class="text-sm text-gray-600 leading-relaxed">

<!-- Muted / helper text -->
<p class="text-xs text-brand-primary/60 font-medium">

<!-- Label overline -->
<span class="text-[11px] font-semibold uppercase tracking-widest text-gray-400">

<!-- Harga / nominal -->
<span class="text-sm font-black text-brand-secondary">

<!-- Kode / ID -->
<code class="font-mono text-sm text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
```

---

## 4. Palet Warna Lengkap

### Brand Colors
| Token | Hex | Penggunaan |
|---|---|---|
| `brand-dark` | `#050316` | Teks utama, judul, elemen kontras |
| `brand-bg` | `#fbfbfe` | Background halaman |
| `brand-primary` | `#2f27ce` | Tombol utama, nav aktif, teks sorotan |
| `brand-secondary` | `#443dff` | CTA, gradasi, elemen interaktif |
| `brand-light` | `#dddbff` | Border, background komponen pasif, focus ring |

### Semantic Colors
| Token | Hex | BG | Text | Penggunaan |
|---|---|---|---|---|
| Success | `#10b981` | `#ecfdf5` | `#065f46` | Selesai, sukses, tren positif |
| Warning | `#f59e0b` | `#fef3c7` | `#92400e` | Pending, dimasak, peringatan |
| Danger | `#ef4444` | `#fef2f2` | `#b91c1c` | Batal, stok rendah, error |
| Info | `#3b82f6` | `#eff6ff` | `#1e40af` | Informasi, panduan, tips |

### Penggunaan Warna — Aturan Tegas

- **Jangan pakai warna brand untuk teks body.** Teks body selalu `text-gray-600` atau `text-gray-700`.
- **Jangan pakai semantic color hanya untuk dekorasi.** Merah selalu berarti error/bahaya, hijau selalu berarti sukses.
- **Gunakan opacity modifier** (`text-brand-primary/60`) untuk teks muted, bukan ganti ke warna lain.
- **Background halaman** selalu `brand-bg (#fbfbfe)`, bukan putih murni `#ffffff`. Putih murni hanya untuk card/surface di atasnya.

---

## 5. Spacing & Layout

### Spacing Scale (4px base)
| Token      | Value | Tailwind | Contoh penggunaan               |
| ------------| -------| ----------| ---------------------------------|
| `space-1`  | 4px   | `p-1`    | Jarak antar ikon dan teks       |
| `space-2`  | 8px   | `p-2`    | Padding badge, gap inline       |
| `space-3`  | 12px  | `p-3`    | Padding tombol kecil            |
| `space-4`  | 16px  | `p-4`    | Padding card standar            |
| `space-5`  | 20px  | `p-5`    | Padding card besar              |
| `space-6`  | 24px  | `p-6`    | Gap antar section dalam halaman |
| `space-8`  | 32px  | `p-8`    | Padding container               |
| `space-12` | 48px  | `p-12`   | Jarak antar blok besar          |
| `space-16` | 64px  | `p-16`   | Padding layout halaman          |

### Grid System
| Breakpoint | Width | Kolom | Padding samping |
|---|---|---|---|
| `sm` | ≥ 640px | 4 kolom | 16px |
| `md` | ≥ 768px | 8 kolom | 24px |
| `lg` | ≥ 1024px | 12 kolom | 32px |
| `xl` | ≥ 1280px | 12 kolom | 40px |
| `2xl` | ≥ 1536px | 12 kolom | 48px |

### Layout Halaman — Struktur Wajib
```
┌─────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content │
│                         │  max-w: 1200px│
│                         │  px: 24–32px  │
│                         │  py: 24px     │
└─────────────────────────────────────────┘
```

Sidebar collapse di breakpoint `< lg (1024px)`.

---

## 6. Komponen — Semua States

### 6.1 Button

**Varian yang tersedia:** Primary, Secondary, Outline, Ghost, Danger, Link

#### Primary Button
```html
<!-- Default -->
<button class="px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm hover:bg-brand-secondary hover:shadow-brand active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none">
  Label Tombol
</button>
```

**States:**
| State | Tampilan |
|---|---|
| Default | `bg-brand-primary`, shadow-sm |
| Hover | `bg-brand-secondary`, shadow-brand |
| Active | `scale-[0.97]` |
| Focus | `ring-2 ring-brand-primary ring-offset-2` |
| Disabled | `opacity-40 cursor-not-allowed` |
| Loading | Ikon spinner + teks "Memproses...", `pointer-events-none` |

#### Secondary Button
```html
<button class="px-4 py-2.5 bg-brand-light text-brand-primary text-sm font-semibold rounded-xl transition-all duration-150 hover:bg-brand-light/70 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed">
  Label Tombol
</button>
```

#### Outline Button
```html
<button class="px-4 py-2.5 bg-transparent border border-brand-light text-brand-primary text-sm font-semibold rounded-xl transition-all duration-150 hover:bg-brand-light/30 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-brand-light disabled:opacity-40 disabled:cursor-not-allowed">
  Label Tombol
</button>
```

#### Ghost Button
```html
<button class="px-4 py-2.5 bg-transparent text-brand-primary text-sm font-semibold rounded-xl transition-all duration-150 hover:bg-brand-light/40 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-brand-light disabled:opacity-40 disabled:cursor-not-allowed">
  Label Tombol
</button>
```

#### Danger Button
```html
<button class="px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl transition-all duration-150 hover:bg-red-600 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed">
  Hapus
</button>
```

#### Button dengan Loading State
```html
<button class="px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl pointer-events-none opacity-80 flex items-center gap-2">
  <iconify-icon icon="solar:refresh-linear" class="animate-spin text-base"></iconify-icon>
  Memproses...
</button>
```

#### Ukuran Button
| Size | Class |
|---|---|
| XS | `px-2.5 py-1.5 text-xs rounded-lg` |
| SM | `px-3 py-2 text-xs rounded-xl` |
| MD (default) | `px-4 py-2.5 text-sm rounded-xl` |
| LG | `px-5 py-3 text-base rounded-xl` |
| XL | `px-6 py-3.5 text-base rounded-2xl` |

---

### 6.2 Input & Form Elements

#### Text Input
```html
<!-- Default -->
<input
  type="text"
  class="w-full px-3.5 py-2.5 text-sm text-brand-dark bg-white border border-brand-light rounded-xl outline-none transition-all duration-150 placeholder:text-gray-400
  hover:border-brand-primary/40
  focus:border-brand-secondary focus:ring-2 focus:ring-brand-light
  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
  placeholder="Cari menu..."
/>

<!-- Error state -->
<input
  type="text"
  class="w-full px-3.5 py-2.5 text-sm text-brand-dark bg-white border border-red-300 rounded-xl outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
/>
<p class="mt-1 text-xs text-red-500 flex items-center gap-1">
  <iconify-icon icon="solar:danger-circle-linear"></iconify-icon>
  Nama menu tidak boleh kosong
</p>

<!-- Success state -->
<input
  type="text"
  class="w-full px-3.5 py-2.5 text-sm text-brand-dark bg-white border border-emerald-300 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
/>
```

**States:**
| State | Border | Ring |
|---|---|---|
| Default | `border-brand-light` | — |
| Hover | `border-brand-primary/40` | — |
| Focus | `border-brand-secondary` | `ring-2 ring-brand-light` |
| Error | `border-red-300` | `ring-2 ring-red-100` |
| Success | `border-emerald-300` | `ring-2 ring-emerald-100` |
| Disabled | `border-gray-200 bg-gray-50` | — |

#### Input dengan Icon
```html
<div class="relative">
  <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></iconify-icon>
  <input type="text" class="w-full pl-10 pr-3.5 py-2.5 text-sm ..." placeholder="Cari menu..." />
</div>
```

#### Select / Dropdown
```html
<select class="w-full px-3.5 py-2.5 text-sm text-brand-dark bg-white border border-brand-light rounded-xl outline-none appearance-none cursor-pointer transition-all duration-150 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light disabled:bg-gray-50 disabled:cursor-not-allowed">
  <option value="">Pilih Kategori</option>
  <option value="food">Makanan</option>
  <option value="drink">Minuman</option>
</select>
```

#### Textarea
```html
<textarea class="w-full px-3.5 py-2.5 text-sm text-brand-dark bg-white border border-brand-light rounded-xl outline-none resize-none transition-all duration-150 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light placeholder:text-gray-400" rows="4" placeholder="Catatan tambahan..."></textarea>
```

#### Checkbox & Radio
```html
<!-- Checkbox -->
<label class="flex items-center gap-2.5 cursor-pointer group">
  <input type="checkbox" class="w-4 h-4 rounded accent-brand-primary cursor-pointer" />
  <span class="text-sm text-gray-700 group-hover:text-brand-dark transition-colors">Label pilihan</span>
</label>

<!-- Radio -->
<label class="flex items-center gap-2.5 cursor-pointer group">
  <input type="radio" class="w-4 h-4 accent-brand-primary cursor-pointer" />
  <span class="text-sm text-gray-700 group-hover:text-brand-dark transition-colors">Label pilihan</span>
</label>
```

#### Toggle Switch
```html
<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer" />
  <div class="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-primary peer-focus:ring-2 peer-focus:ring-brand-light transition-all duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:after:translate-x-4"></div>
  <span class="ml-2.5 text-sm font-medium text-gray-700">Aktif</span>
</label>
```

#### Form Group — Struktur Standar
```html
<div class="space-y-1.5">
  <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nama Menu</label>
  <input type="text" class="w-full ..." />
  <p class="text-xs text-gray-400">Maksimal 60 karakter.</p>
  <!-- atau error message di sini -->
</div>
```

---

### 6.3 Badge & Chip

```html
<!-- Status badges -->
<span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
  Selesai
</span>

<span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700">
  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
  Pending
</span>

<span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700">
  <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
  Dibatalkan
</span>

<span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
  Sedang Dimasak
</span>

<!-- Brand badge -->
<span class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-light text-brand-primary">
  Populer
</span>

<!-- Neutral badge -->
<span class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
  Kategori
</span>
```

---

### 6.4 Card

#### Card Standar
```html
<div class="bg-white rounded-2xl border border-brand-light shadow-sm p-5">
  <!-- konten -->
</div>
```

#### Card Interaktif (dengan hover)
```html
<div class="bg-white rounded-2xl border border-brand-light shadow-sm p-5 transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/10 hover:border-brand-primary/30 cursor-pointer">
  <!-- konten -->
</div>
```

#### Stat Card (Dashboard Owner)
```html
<div class="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
  <!-- Header: ikon + menu -->
  <div class="flex items-start justify-between mb-4">
    <div class="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
      <iconify-icon icon="solar:wallet-money-linear" class="text-2xl text-brand-secondary"></iconify-icon>
    </div>
    <button class="text-gray-300 hover:text-gray-500 transition-colors">
      <iconify-icon icon="solar:menu-dots-bold"></iconify-icon>
    </button>
  </div>

  <!-- Nilai -->
  <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Pendapatan Hari Ini</p>
  <p class="text-2xl font-extrabold text-brand-dark">Rp 2.450.000</p>

  <!-- Tren -->
  <div class="flex items-center gap-1 mt-2">
    <iconify-icon icon="solar:arrow-up-linear" class="text-emerald-500 text-sm"></iconify-icon>
    <span class="text-xs font-semibold text-emerald-600">12.5%</span>
    <span class="text-xs text-gray-400">vs kemarin</span>
  </div>
</div>
```

#### Card Section dengan Header
```html
<div class="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
  <!-- Header card -->
  <div class="px-5 py-4 border-b border-brand-light flex items-center justify-between">
    <div>
      <h3 class="text-base font-semibold text-brand-dark">Judul Section</h3>
      <p class="text-xs text-gray-400 mt-0.5">Deskripsi singkat</p>
    </div>
    <button class="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
      Lihat Semua →
    </button>
  </div>

  <!-- Body card -->
  <div class="p-5">
    <!-- konten -->
  </div>
</div>
```

---

### 6.5 Tabel

```html
<div class="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <!-- Head -->
      <thead>
        <tr class="border-b border-brand-light bg-brand-bg">
          <th class="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Nama</th>
          <th class="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Kategori</th>
          <th class="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Harga</th>
          <th class="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
          <th class="px-5 py-3.5"></th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody class="divide-y divide-gray-50">
        <tr class="hover:bg-gradient-to-r hover:from-brand-light/30 hover:to-transparent transition-all duration-150 cursor-pointer">
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                <iconify-icon icon="solar:cup-hot-linear" class="text-brand-primary text-base"></iconify-icon>
              </div>
              <span class="font-medium text-brand-dark">Kopi Susu</span>
            </div>
          </td>
          <td class="px-5 py-4 text-gray-500">Minuman</td>
          <td class="px-5 py-4 text-right font-black text-brand-secondary text-sm">Rp 22.000</td>
          <td class="px-5 py-4 text-center">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Aktif
            </span>
          </td>
          <td class="px-5 py-4 text-right">
            <button class="text-gray-300 hover:text-brand-primary transition-colors">
              <iconify-icon icon="solar:menu-dots-bold"></iconify-icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Footer tabel: pagination -->
  <div class="px-5 py-3.5 border-t border-brand-light flex items-center justify-between">
    <p class="text-xs text-gray-400">Menampilkan 1–10 dari 48 data</p>
    <!-- komponen pagination -->
  </div>
</div>
```

---

### 6.6 Modal & Dialog

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

  <!-- Modal container -->
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

    <!-- Header -->
    <div class="px-6 py-5 border-b border-brand-light flex items-center justify-between">
      <h2 class="text-lg font-bold text-brand-dark">Judul Modal</h2>
      <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
        <iconify-icon icon="solar:close-linear" class="text-lg"></iconify-icon>
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-5">
      <p class="text-sm text-gray-600 leading-relaxed">Konten modal di sini.</p>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-brand-light flex items-center justify-end gap-3 bg-gray-50/50">
      <button class="px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
        Batal
      </button>
      <button class="px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-all shadow-sm active:scale-[0.97]">
        Konfirmasi
      </button>
    </div>
  </div>

</div>
```

#### Modal Konfirmasi Hapus (Danger)
```html
<div class="px-6 py-5 border-b border-red-100 flex items-center gap-3">
  <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
    <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-xl text-red-500"></iconify-icon>
  </div>
  <div>
    <h2 class="text-base font-bold text-brand-dark">Hapus Menu?</h2>
    <p class="text-xs text-gray-400 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
  </div>
</div>
```

---

### 6.7 Toast & Notifikasi

```html
<!-- Toast container — fixed bottom right -->
<div class="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 max-w-sm w-full">

  <!-- Toast Success -->
  <div class="flex items-start gap-3 bg-white border border-emerald-200 rounded-2xl shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
    <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
      <iconify-icon icon="solar:check-circle-linear" class="text-emerald-500 text-lg"></iconify-icon>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-brand-dark">Transaksi Berhasil</p>
      <p class="text-xs text-gray-400 mt-0.5">Pesanan #INV-0042 telah disimpan.</p>
    </div>
    <button class="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
      <iconify-icon icon="solar:close-linear"></iconify-icon>
    </button>
  </div>

  <!-- Toast Error -->
  <div class="flex items-start gap-3 bg-white border border-red-200 rounded-2xl shadow-lg p-4">
    <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
      <iconify-icon icon="solar:close-circle-linear" class="text-red-500 text-lg"></iconify-icon>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-brand-dark">Gagal Menyimpan</p>
      <p class="text-xs text-gray-400 mt-0.5">Periksa koneksi internet kamu.</p>
    </div>
  </div>

  <!-- Toast Warning -->
  <div class="flex items-start gap-3 bg-white border border-amber-200 rounded-2xl shadow-lg p-4">
    <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
      <iconify-icon icon="solar:danger-triangle-linear" class="text-amber-500 text-lg"></iconify-icon>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-brand-dark">Stok Hampir Habis</p>
      <p class="text-xs text-gray-400 mt-0.5">Kopi Arabica tersisa 3 porsi.</p>
    </div>
  </div>

</div>
```

---

### 6.8 Empty State

Wajib ada di setiap halaman yang bisa memiliki kondisi data kosong.

```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-4">
    <iconify-icon icon="solar:box-linear" class="text-3xl text-brand-primary/60"></iconify-icon>
  </div>
  <h3 class="text-base font-semibold text-brand-dark mb-1">Belum Ada Data</h3>
  <p class="text-sm text-gray-400 max-w-xs leading-relaxed mb-5">Menu belum tersedia. Mulai tambahkan menu pertama kamu sekarang.</p>
  <button class="px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-all shadow-sm active:scale-[0.97]">
    <iconify-icon icon="solar:add-circle-linear" class="mr-1.5"></iconify-icon>
    Tambah Menu
  </button>
</div>
```

---

### 6.9 Skeleton Loading

Gunakan saat data sedang di-fetch, sebelum konten muncul.

```html
<!-- Skeleton stat card -->
<div class="bg-white p-5 rounded-2xl border border-brand-light shadow-sm animate-pulse">
  <div class="w-11 h-11 rounded-xl bg-gray-100 mb-4"></div>
  <div class="h-3 bg-gray-100 rounded w-24 mb-2"></div>
  <div class="h-7 bg-gray-100 rounded w-32 mb-2"></div>
  <div class="h-3 bg-gray-100 rounded w-20"></div>
</div>

<!-- Skeleton tabel row -->
<tr class="animate-pulse">
  <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-32"></div></td>
  <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-20"></div></td>
  <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-24 ml-auto"></div></td>
  <td class="px-5 py-4"><div class="h-6 bg-gray-100 rounded-full w-16 mx-auto"></div></td>
</tr>

<!-- Skeleton card list -->
<div class="flex items-center gap-3 p-3 animate-pulse">
  <div class="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0"></div>
  <div class="flex-1">
    <div class="h-3.5 bg-gray-100 rounded w-3/4 mb-2"></div>
    <div class="h-3 bg-gray-100 rounded w-1/2"></div>
  </div>
  <div class="h-4 bg-gray-100 rounded w-16"></div>
</div>
```

---

### 6.10 Pagination

```html
<div class="flex items-center justify-between">
  <p class="text-xs text-gray-400">Menampilkan <span class="font-semibold text-brand-dark">1–10</span> dari <span class="font-semibold text-brand-dark">48</span> data</p>

  <div class="flex items-center gap-1">
    <!-- Prev -->
    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-light hover:text-brand-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
      <iconify-icon icon="solar:arrow-left-linear" class="text-base"></iconify-icon>
    </button>

    <!-- Halaman aktif -->
    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary text-white text-sm font-semibold">1</button>

    <!-- Halaman lain -->
    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 text-sm hover:bg-brand-light hover:text-brand-primary transition-all">2</button>
    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 text-sm hover:bg-brand-light hover:text-brand-primary transition-all">3</button>

    <span class="w-8 h-8 flex items-center justify-center text-gray-300 text-sm">...</span>
    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 text-sm hover:bg-brand-light hover:text-brand-primary transition-all">5</button>

    <!-- Next -->
    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-light hover:text-brand-primary transition-all">
      <iconify-icon icon="solar:arrow-right-linear" class="text-base"></iconify-icon>
    </button>
  </div>
</div>
```

---

### 6.11 Breadcrumb

```html
<nav class="flex items-center gap-1.5 text-xs text-gray-400">
  <a href="/dashboard" class="hover:text-brand-primary transition-colors font-medium">Dashboard</a>
  <iconify-icon icon="solar:alt-arrow-right-linear" class="text-gray-300 text-[10px]"></iconify-icon>
  <a href="/menus" class="hover:text-brand-primary transition-colors font-medium">Menu</a>
  <iconify-icon icon="solar:alt-arrow-right-linear" class="text-gray-300 text-[10px]"></iconify-icon>
  <span class="text-brand-dark font-semibold">Kopi Susu</span>
</nav>
```

---

### 6.12 Dropdown Menu

```html
<div class="relative">
  <!-- Trigger -->
  <button class="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-gray-600 border border-brand-light rounded-xl bg-white hover:border-brand-primary/40 hover:text-brand-dark transition-all">
    Filter
    <iconify-icon icon="solar:alt-arrow-down-linear" class="text-xs"></iconify-icon>
  </button>

  <!-- Menu -->
  <div class="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl border border-brand-light shadow-lg z-10 py-1.5 overflow-hidden">
    <button class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-light/40 hover:text-brand-primary text-left transition-colors flex items-center gap-2.5">
      <iconify-icon icon="solar:sort-linear" class="text-base text-gray-400"></iconify-icon>
      Urutkan A–Z
    </button>
    <button class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-light/40 hover:text-brand-primary text-left transition-colors flex items-center gap-2.5">
      <iconify-icon icon="solar:calendar-linear" class="text-base text-gray-400"></iconify-icon>
      Terbaru
    </button>
    <div class="my-1.5 border-t border-brand-light"></div>
    <button class="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 text-left transition-colors flex items-center gap-2.5">
      <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-base"></iconify-icon>
      Hapus Filter
    </button>
  </div>
</div>
```

---

### 6.13 Alert / Banner

```html
<!-- Info -->
<div class="flex items-start gap-3 px-4 py-3.5 bg-blue-50 border border-blue-200 rounded-xl">
  <iconify-icon icon="solar:info-circle-linear" class="text-blue-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
  <div>
    <p class="text-sm font-semibold text-blue-800">Periode laporan diperbarui</p>
    <p class="text-xs text-blue-600 mt-0.5">Data ditampilkan berdasarkan rentang tanggal yang kamu pilih.</p>
  </div>
</div>

<!-- Warning -->
<div class="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
  <iconify-icon icon="solar:danger-triangle-linear" class="text-amber-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
  <div>
    <p class="text-sm font-semibold text-amber-800">Stok hampir habis</p>
    <p class="text-xs text-amber-600 mt-0.5">3 bahan baku tersisa kurang dari batas minimum.</p>
  </div>
</div>

<!-- Danger -->
<div class="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl">
  <iconify-icon icon="solar:close-circle-linear" class="text-red-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
  <div>
    <p class="text-sm font-semibold text-red-800">Gagal memuat data</p>
    <p class="text-xs text-red-600 mt-0.5">Terjadi kesalahan saat mengambil data dari server.</p>
  </div>
</div>

<!-- Success -->
<div class="flex items-start gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
  <iconify-icon icon="solar:check-circle-linear" class="text-emerald-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
  <div>
    <p class="text-sm font-semibold text-emerald-800">Pengaturan disimpan</p>
    <p class="text-xs text-emerald-600 mt-0.5">Perubahan kamu berhasil diterapkan.</p>
  </div>
</div>
```

---

### 6.14 Avatar

```html
<!-- Avatar dengan gambar -->
<img src="/avatar.jpg" alt="Nama User" class="w-9 h-9 rounded-full object-cover ring-2 ring-brand-light" />

<!-- Avatar inisial (fallback) -->
<div class="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-sm font-bold text-brand-primary flex-shrink-0">
  AR
</div>

<!-- Avatar group (overlap) -->
<div class="flex -space-x-2">
  <img src="/a1.jpg" class="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
  <img src="/a2.jpg" class="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
  <div class="w-8 h-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">+3</div>
</div>
```

---

### 6.15 Komponen Khusus POS Kasir

#### Kartu Produk Katalog
```html
<button class="text-left bg-white rounded-2xl border-2 border-brand-light shadow-sm hover:shadow-md hover:shadow-brand-secondary/20 hover:border-brand-primary/50 active:scale-[0.97] transition-all duration-150 overflow-hidden flex flex-col group relative">
  <!-- Gambar / Fallback -->
  <div class="w-full aspect-square bg-brand-light/50 flex items-center justify-center overflow-hidden">
    <img src="/menu.jpg" alt="Kopi Susu" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.classList.add('hidden')" />
    <!-- Fallback ikon -->
    <iconify-icon icon="solar:cup-hot-linear" class="text-4xl text-brand-primary/40 hidden group-[.img-error]:flex"></iconify-icon>
  </div>

  <!-- Info produk -->
  <div class="p-3">
    <p class="text-sm font-semibold text-brand-dark leading-snug line-clamp-1">Kopi Susu</p>
    <p class="text-xs text-gray-400 mt-0.5">Minuman</p>
    <p class="text-sm font-black text-brand-secondary mt-1.5">Rp 22.000</p>
  </div>

  <!-- Badge stok habis -->
  <div class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl opacity-0 pointer-events-none [.out-of-stock_&]:opacity-100">
    <span class="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">Stok Habis</span>
  </div>
</button>
```

#### Quick Cash Buttons (POS Pembayaran)
```html
<!-- Aktif / terpilih -->
<button class="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-primary text-white border border-brand-primary shadow-sm transition-all active:scale-[0.97]">
  Rp 100.000
</button>

<!-- Tidak aktif -->
<button class="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand-light/30 text-brand-primary border border-brand-light hover:bg-brand-light/75 transition-all active:scale-[0.97]">
  Rp 50.000
</button>
```

#### Order Item Row (Keranjang)
```html
<div class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
  <div class="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
    <iconify-icon icon="solar:cup-hot-linear" class="text-brand-primary text-lg"></iconify-icon>
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold text-brand-dark line-clamp-1">Kopi Susu</p>
    <p class="text-xs font-black text-brand-secondary">Rp 22.000</p>
  </div>
  <!-- Quantity control -->
  <div class="flex items-center gap-1.5">
    <button class="w-7 h-7 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center text-base font-bold hover:bg-brand-primary hover:text-white transition-all active:scale-[0.95]">−</button>
    <span class="w-6 text-center text-sm font-bold text-brand-dark">1</span>
    <button class="w-7 h-7 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center text-base font-bold hover:bg-brand-primary hover:text-white transition-all active:scale-[0.95]">+</button>
  </div>
</div>
```

#### Kitchen Order Card
```html
<div class="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden">
  <!-- Header -->
  <div class="px-4 py-3 bg-amber-50 flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold text-amber-700 uppercase tracking-wide">Meja 4</p>
      <p class="text-[11px] text-amber-600 mt-0.5">14:32 · 8 menit lalu</p>
    </div>
    <span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      Dimasak
    </span>
  </div>

  <!-- Items -->
  <div class="p-4 space-y-2">
    <div class="flex justify-between text-sm">
      <span class="font-semibold text-brand-dark">2× Kopi Susu</span>
      <span class="text-gray-400 text-xs">−</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="font-semibold text-brand-dark">1× Roti Bakar</span>
      <span class="text-xs text-gray-400 italic">extra keju</span>
    </div>
  </div>

  <!-- Action -->
  <div class="px-4 pb-4">
    <button class="w-full py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-all active:scale-[0.97]">
      Tandai Selesai
    </button>
  </div>
</div>
```

---

## 7. Ikonografi

- **Library:** Solar Icons (Linear sebagai default, Bold Duotone untuk aksen)
- **Implementasi:** via Iconify (`iconify-icon` web component)
- **Ukuran:**

| Konteks | Size class |
|---|---|
| Inline teks | `text-sm` (14px) |
| Tombol | `text-base` (16px) |
| Card icon | `text-xl` (20px) atau `text-2xl` (24px) |
| Stat card | `text-2xl` (24px) |
| Empty state | `text-4xl` (36–40px) |

- **Fallback gambar produk:** Jika gambar gagal dimuat, tampilkan ikon kategori dari Solar Icons.

---

## 8. Motion & Animasi

### Prinsip
- **Snappy untuk POS:** Semua interaksi kasir maksimal `duration-150`.
- **Smooth untuk dashboard:** Transisi data dan chart bisa `duration-300`.
- **Jangan animasi yang menghalangi** operasional kasir.

### Easing
| Konteks | Easing |
|---|---|
| Default transisi | `ease` (ease-in-out) |
| Tombol masuk / munculan | `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring — sedikit overshoot) |
| Slide panel/modal | `ease-out` |
| Fade | `ease-in-out` |

### Referensi cepat
| Efek | Class |
|---|---|
| Tekan fisik tombol | `active:scale-[0.97]` |
| Tekan fisik kartu POS | `active:scale-[0.97]` |
| Zoom ikon stat card | `group-hover:scale-105` |
| Zoom gambar produk | `group-hover:scale-105` |
| Spinner loading | `animate-spin` |
| Pulse skeleton | `animate-pulse` |
| Pulse dot status aktif | `animate-pulse` |

---

## 9. Aksesibilitas (Dasar)

### Kontras Warna (WCAG AA)
| Kombinasi | Rasio | Status |
|---|---|---|
| `brand-dark` di atas `brand-bg` | ≥ 12:1 | ✅ Lulus |
| `brand-primary` di atas `white` | ≥ 5.5:1 | ✅ Lulus |
| `brand-secondary` di atas `white` | ≥ 5:1 | ✅ Lulus |
| Teks putih di atas `brand-primary` | ≥ 5.5:1 | ✅ Lulus |
| `gray-400` di atas `white` | ~3.5:1 | ⚠️ Hanya untuk teks non-esensial |

### Aturan Wajib
- Semua `<button>` yang hanya berisi ikon **wajib** punya `aria-label`.
- Semua `<img>` wajib punya `alt`. Gambar dekoratif pakai `alt=""`.
- Semua input wajib punya `<label>` yang terhubung via `htmlFor` / `for`.
- Jangan gunakan warna sebagai satu-satunya pembeda informasi — selalu dampingi dengan teks atau ikon.
- Focus ring **tidak boleh dihapus** (`outline-none` hanya boleh dipakai jika diganti `focus:ring-*`).
- Urutan tab (`tabIndex`) harus mengikuti urutan visual halaman.

---

## 10. Responsivitas

### Breakpoint
| Nama | Min-width | Penggunaan |
|---|---|---|
| `sm` | 640px | Layout mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Sidebar muncul, layout 2 kolom |
| `xl` | 1280px | Layout desktop penuh |
| `2xl` | 1536px | Monitor lebar |

### Perilaku Layout per Breakpoint
| Elemen | Mobile (< lg) | Desktop (≥ lg) |
|---|---|---|
| Sidebar | Tersembunyi, toggle via hamburger | Fixed 240px kiri |
| Grid stat card | 2 kolom | 4 kolom |
| Grid katalog POS | 2 kolom | 3–4 kolom |
| Tabel | Horizontal scroll | Full width |
| Modal | Full screen atau bottom sheet | Centered dengan max-w |

---

*Cafinity Design System v2.0 — Velion / Devora Studio & Cafinity Team — 2026*

---


Tidak konsisten itu **wajar banget** di tahap development — hampir semua project awal begitu. Tapi untuk SaaS/POS yang mau dipoles, perlu ada aturannya.

---

## Rekomendasi: Pakai aturan ini

### Halaman baru — kalau formnya **kompleks**
Kriteria:
- Field > 6
- Ada upload gambar/file
- Ada sub-section atau tab dalam form
- Data relasi banyak (supplier, kategori, dll)

Contoh di Cafinity: **Tambah/Edit Inventory, Tambah Menu, Tambah Purchase Order**

---

### Modal — kalau formnya **simpel**
Kriteria:
- Field ≤ 4
- Tidak ada upload
- Aksi cepat yang tidak butuh konteks banyak

Contoh di Cafinity: **Tambah Kategori, Tambah Satuan, Konfirmasi hapus**

---

### Drawer (slide dari kanan) — kalau butuh **lihat data sambil edit**
Kriteria:
- User perlu lihat list di belakangnya sambil edit
- Form medium (4–8 field) tapi tidak terlalu kompleks
- Preview detail sebelum aksi

Contoh di Cafinity: **Edit stok cepat, Detail transaksi, Filter laporan**

---

## Untuk file kamu ini (InventoriesCreate)

Form ini punya **7 field + relasi supplier + kategori** → **halaman baru sudah tepat.** Jangan dipindah ke modal.

---

## Aturan konsistensi yang bisa langsung diterapkan

| Aksi | Pattern |
|---|---|
| Tambah data kompleks | Halaman baru |
| Edit data kompleks | Halaman baru |
| Tambah data simpel | Modal |
| Edit inline / quick edit | Drawer atau modal |
| Konfirmasi hapus | Modal kecil (danger) |
| Detail / preview | Drawer |

Tulis ini di design system kamu di bagian baru **"Navigation Patterns"** — biar konsisten ke depannya. Mau aku tambahin section itu ke dokumen tadi?
