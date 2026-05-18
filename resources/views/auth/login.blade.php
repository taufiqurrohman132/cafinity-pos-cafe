<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Smart Cafe POS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
</head>
<body class="bg-white">

<div class="min-h-screen flex">

    {{-- ======================== LEFT: HERO ======================== --}}
    <div class="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-between p-10"
        style="background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(22,101,52,0.75) 100%),
               url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80') center/cover no-repeat;">

        {{-- Top Logo --}}
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl">
                <iconify-icon icon="mdi:coffee-outline"></iconify-icon>
            </div>
            <span class="text-white font-bold text-lg">Smart Cafe POS</span>
        </div>

        {{-- Center Content --}}
        <div class="space-y-6">

            {{-- Badge --}}
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-white text-xs font-semibold">Versi Terbaru 2.4.0 • Sekarang Tersedia</span>
            </div>

            {{-- Headline --}}
            <div>
                <h1 class="text-5xl font-extrabold text-white leading-tight">
                    Kelola Bisnis<br>Kafe Anda
                </h1>
                <h1 class="text-5xl font-extrabold text-green-400 leading-tight mt-1">
                    Lebih Efisien.
                </h1>
            </div>

            <p class="text-white/75 text-base leading-relaxed max-w-md">
                Sistem manajemen terintegrasi untuk penjualan, inventaris, dan
                performa bisnis dalam satu genggaman tangan Anda.
            </p>

            {{-- Stats --}}
            <div class="flex items-center gap-12 pt-2">
                <div>
                    <p class="text-4xl font-extrabold text-white">500+</p>
                    <p class="text-white/60 text-sm mt-1">Mitra Kafe Aktif</p>
                </div>
                <div class="w-px h-12 bg-white/20"></div>
                <div>
                    <p class="text-4xl font-extrabold text-white">99.9%</p>
                    <p class="text-white/60 text-sm mt-1">Uptime Sistem</p>
                </div>
            </div>
        </div>

        {{-- Quote --}}
        <p class="text-white/50 text-sm italic">
            "Efisiensi adalah kunci dari pertumbuhan kafe yang berkelanjutan."
        </p>

    </div>

    {{-- ======================== RIGHT: FORM ======================== --}}
    <div class="flex-1 flex flex-col items-center justify-between py-10 px-6 sm:px-12 bg-white">

        <div class="w-full max-w-sm space-y-7">

            {{-- Logo --}}
            <div class="text-center">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 text-3xl mb-4">
                    <iconify-icon icon="mdi:coffee-outline"></iconify-icon>
                </div>
                <p class="text-green-600 font-bold text-lg">Smart Cafe POS</p>
            </div>

            {{-- Heading --}}
            <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-900">Selamat Datang</h2>
                <p class="text-gray-400 text-sm mt-2 leading-relaxed">
                    Silakan masuk ke akun Anda untuk mengelola operasional kafe.
                </p>
            </div>

            {{-- Form --}}
            <form method="POST" action="{{ route('login') }}" class="space-y-5">
                @csrf

                {{-- Email --}}
                <div class="space-y-1.5">
                    <label class="text-sm font-semibold text-gray-700">Email atau Nama Pengguna</label>
                    <div class="relative">
                        <iconify-icon icon="mdi:email-outline" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                        <input type="email" name="email" placeholder="nama@kafeanda.com" required
                            class="w-full h-12 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition @error('email') border-red-400 @enderror"
                            value="{{ old('email') }}">
                    </div>
                    @error('email')
                        <p class="text-xs text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Password --}}
                <div class="space-y-1.5">
                    <div class="flex justify-between items-center">
                        <label class="text-sm font-semibold text-gray-700">Kata Sandi</label>
                        <a href="{{ route('password.request') }}" class="text-xs font-semibold text-green-600 hover:text-green-700 transition">
                            Lupa kata sandi?
                        </a>
                    </div>
                    <div class="relative">
                        <iconify-icon icon="mdi:lock-outline" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                        <input type="password" name="password" placeholder="••••••••" required
                            class="w-full h-12 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition @error('password') border-red-400 @enderror">
                    </div>
                    @error('password')
                        <p class="text-xs text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Remember Me --}}
                <div class="flex items-center gap-2.5">
                    <input type="checkbox" name="remember" id="remember"
                        class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-200">
                    <label for="remember" class="text-sm text-gray-600">Ingat saya di perangkat ini</label>
                </div>

                {{-- Submit --}}
                <button type="submit"
                    class="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm">
                    Masuk ke Dashboard
                    <iconify-icon icon="mdi:arrow-right" class="text-base"></iconify-icon>
                </button>

            </form>

            {{-- Security Note --}}
            <div class="text-center space-y-3">
                <div class="flex items-center gap-2 justify-center text-xs text-gray-400">
                    <iconify-icon icon="mdi:shield-check-outline" class="text-sm"></iconify-icon>
                    Koneksi aman dengan enkripsi SSL 256-bit
                </div>
                <div class="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span class="flex items-center gap-1.5">
                        <iconify-icon icon="mdi:help-circle-outline"></iconify-icon> Bantuan
                    </span>
                    <span class="flex items-center gap-1.5">
                        <iconify-icon icon="mdi:web"></iconify-icon> Bahasa Indonesia
                    </span>
                </div>
            </div>

        </div>

        {{-- Footer --}}
        <div class="text-center space-y-2 mt-8">
            <div class="flex items-center justify-center gap-3 text-[11px] text-gray-400">
                <a href="#" class="hover:text-gray-600 transition">Syarat & Ketentuan</a>
                <span>•</span>
                <a href="#" class="hover:text-gray-600 transition">Kebijakan Privasi</a>
                <span>•</span>
                <a href="#" class="hover:text-gray-600 transition">Hubungi Kami</a>
            </div>
            <p class="text-[10px] text-gray-300 uppercase tracking-wider font-medium">
                © 2024 Smart Cafe POS oleh Digital Brew Team
            </p>
        </div>

    </div>

</div>

</body>
</html>