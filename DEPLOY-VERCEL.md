I will create the necessary configuration files (`vercel.json` and a server bridge script `api/index.php`) so you can easily deploy this Laravel application to Vercel for testing and demo access.

Edited index.php

I will create the `vercel.json` file in the root directory to configure Vercel's routing rules and compile scripts for building the project assets.

Edited vercel.json

I will view the `package.json` file to make sure the build script is configured correctly for Vercel's automated build step.

Viewed package.json:1-33

Saya mengerti, jika **hanya untuk sekadar testing/demo akses** agar bisa diakses oleh orang lain, dideploy ke Vercel sangatlah praktis dan gratis!

Untuk mempermudah proses deploy Anda, saya telah membuat 2 berkas konfigurasi penting langsung di folder proyek Anda:
1. **[vercel.json](file:///c:/laragon/www/cafinity-app-laravel/vercel.json):** Mengatur agar Vercel mengkompilasi file statis (Vite) dan mengalihkan seluruh lalu lintas server ke *engine* PHP Serverless.
2. **[api/index.php](file:///c:/laragon/www/cafinity-app-laravel/api/index.php):** Bertindak sebagai jembatan (*bridge*) untuk meneruskan request serverless Vercel ke file index Laravel.

Berikut adalah langkah-langkah yang perlu Anda lakukan untuk mendeploy proyek ke Vercel:

---

### Langkah 1: Siapkan Database Cloud (MySQL) Gratis
Karena Vercel tidak menyediakan database, Anda memerlukan database MySQL di cloud yang gratis untuk demo ini. Anda bisa menggunakan:
* **[Aiven.io](https://aiven.io/)** atau **[Clever Cloud](https://www.clever-cloud.com/)** (menyediakan MySQL gratis 10MB–5GB yang sangat cukup untuk keperluan testing).
* Daftarkan akun, buat database MySQL baru, dan catat info koneksinya (Host, Port, Database Name, Username, Password).

---

### Langkah 2: Tambahkan Environment Variables di Vercel
Saat Anda mengimpor proyek Anda di Vercel Dashboard, masuk ke menu **Environment Variables** dan tambahkan variabel berikut:

| Key | Value | Keterangan |
| :--- | :--- | :--- |
| `APP_KEY` | `base64:8mscshfxvTYKaWeaAvFVgsenbSLBP9aVXlm/DvOZono=` | Key lokal Anda |
| `APP_ENV` | `production` | **Sangat penting!** Mengubah status ke `production` otomatis mematikan fitur reset harian di Vercel agar database cloud Anda tidak di-*wipe* terus-menerus. |
| `DB_CONNECTION` | `mysql` | Tipe database |
| `DB_HOST` | *(Host database cloud Anda)* | Alamat host cloud |
| `DB_PORT` | `3306` *(atau port cloud Anda)* | Port database |
| `DB_DATABASE` | *(Nama database cloud Anda)* | Nama database |
| `DB_USERNAME` | *(Username database cloud Anda)* | User database |
| `DB_PASSWORD` | *(Password database cloud Anda)* | Password database |
| `SESSION_DRIVER` | `cookie` | **Penting untuk Vercel:** Menyimpan session di cookie agar user tidak gampang log out karena Vercel serverless bersifat stateless. |
| `CACHE_STORE` | `array` | Menyimpan cache di RAM serverless |

---

### Langkah 3: Menjalankan Migrasi & Seed Pertama Kali di Cloud
Setelah aplikasi Vercel berhasil dibuild (*deployed*), database cloud Anda masih kosong. Anda perlu mengisinya dengan menjalankan perintah migrasi pertama kali. 
Anda bisa melakukannya melalui terminal lokal Anda dengan menghubungkannya sementara ke database cloud:
1. Ubah sementara nilai `DB_...` di berkas `.env` lokal Anda menggunakan data koneksi database cloud.
2. Jalankan perintah seeder di terminal lokal Anda:
   ```bash
   php artisan migrate:fresh --seed
   ```
3. Kembalikan berkas `.env` lokal Anda ke pengaturan semula (mengarah ke Laragon) setelah selesai.

Sekarang aplikasi demo Anda di Vercel akan terhubung ke database cloud dan siap diakses secara online oleh siapa saja!