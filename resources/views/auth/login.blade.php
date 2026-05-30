<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Devora POS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
</head>
<body class="bg-[#fbfbfe]">

<div class="min-h-screen flex">

    {{-- ====== KIRI: HERO ====== --}}
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {{-- Background image placeholder — ganti src dengan foto cafe kamu --}}
        <div class="absolute inset-0 bg-gradient-to-br from-[#050316] via-[#2f27ce]/80 to-[#443dff]/60"></div>

        {{-- Overlay gelap supaya teks terbaca --}}
        <div class="absolute inset-0 bg-[#050316]/50"></div>

        {{-- Pattern overlay --}}
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div class="relative z-10 flex flex-col justify-between p-12 w-full">

            {{-- Logo kiri --}}
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <iconify-icon icon="solar:cup-hot-bold" class="text-xl text-white"></iconify-icon>
                </div>
                <span class="text-white font-extrabold text-lg tracking-tight">Devora POS</span>
            </div>

            {{-- Konten tengah --}}
            <div class="space-y-6">
                <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span class="text-white/90 text-xs font-bold tracking-wide">Versi Terbaru 2.4.0 • Sekarang Tersedia</span>
                </div>

                <div>
                    <h1 class="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Kelola Bisnis<br>Kafe Anda
                    </h1>
                    <h1 class="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mt-1"
                        style="color: #dddbff;">
                        Lebih Efisien.
                    </h1>
                </div>

                <p class="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                    Sistem manajemen terintegrasi untuk penjualan, inventaris, dan performa bisnis dalam satu genggaman tangan Anda.
                </p>

                {{-- Stats --}}
                <div class="flex items-center gap-10 pt-2">
                    <div>
                        <p class="text-3xl font-extrabold text-white">500+</p>
                        <p class="text-white/60 text-xs font-medium mt-0.5">Mitra Kafe Aktif</p>
                    </div>
                    <div class="w-px h-10 bg-white/20"></div>
                    <div>
                        <p class="text-3xl font-extrabold text-white">99.9%</p>
                        <p class="text-white/60 text-xs font-medium mt-0.5">Uptime Sistem</p>
                    </div>
                </div>
            </div>

            {{-- Quote bawah --}}
            <p class="text-white/40 text-xs font-medium italic">
                "Efisiensi adalah kunci dari pertumbuhan kafe yang berkelanjutan."
            </p>
        </div>
    </div>

    {{-- ====== KANAN: FORM ====== --}}
    <div class="w-full lg:w-1/2 flex flex-col justify-between bg-white">

        <div class="flex-1 flex items-center justify-center px-8 py-12">
            <div class="w-full max-w-sm space-y-7">

                {{-- Logo kanan --}}
                <div class="text-center space-y-3">
                    <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] shadow-lg shadow-[#443dff]/30">
                        <iconify-icon icon="solar:cup-hot-bold" class="text-2xl text-white"></iconify-icon>
                    </div>
                    <div>
                        <h2 class="text-2xl font-extrabold text-[#050316] tracking-tight">Selamat Datang</h2>
                        <p class="text-sm font-medium text-[#2f27ce]/70 mt-1">
                            Silakan masuk ke akun Anda untuk mengelola operasional kafe.
                        </p>
                    </div>
                </div>

                {{-- Error --}}
                @if ($errors->any())
                    <div class="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                        <iconify-icon icon="solar:danger-triangle-bold-duotone" class="text-rose-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                        <div>
                            @foreach ($errors->all() as $error)
                                <p class="text-xs font-semibold text-rose-600">{{ $error }}</p>
                            @endforeach
                        </div>
                    </div>
                @endif

                @if (session('status'))
                    <div class="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                        <p class="text-xs font-semibold text-emerald-700">{{ session('status') }}</p>
                    </div>
                @endif

                {{-- Form --}}
                <form method="POST" action="{{ route('login') }}" class="space-y-5">
                    @csrf

                    {{-- Email --}}
                    <div class="space-y-1.5">
                        <label class="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                            Email atau Nama Pengguna
                        </label>
                        <div class="relative">
                            <iconify-icon icon="solar:letter-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                            </iconify-icon>
                            <input
                                type="email"
                                name="email"
                                value="{{ old('email') }}"
                                placeholder="nama@kafeanda.com"
                                required autofocus autocomplete="email"
                                class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#fbfbfe] text-sm pl-10 pr-4
                                    text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40
                                    focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff]
                                    focus:bg-white transition-shadow
                                    @error('email') border-rose-300 bg-rose-50 @enderror">
                        </div>
                    </div>

                    {{-- Password --}}
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                Kata Sandi
                            </label>
                            @if (Route::has('password.request'))
                                <a href="{{ route('password.request') }}"
                                    class="text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors">
                                    Lupa kata sandi?
                                </a>
                            @endif
                        </div>
                        <div class="relative">
                            <iconify-icon icon="solar:lock-password-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                            </iconify-icon>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required autocomplete="current-password"
                                class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#fbfbfe] text-sm pl-10 pr-12
                                    text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40
                                    focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff]
                                    focus:bg-white transition-shadow
                                    @error('password') border-rose-300 bg-rose-50 @enderror">
                            <button type="button" onclick="togglePassword()"
                                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                <iconify-icon icon="solar:eye-linear" id="eye-icon" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>

                    {{-- Remember me --}}
                    <div class="flex items-center gap-2.5">
                        <input type="checkbox" name="remember" id="remember"
                            class="w-4 h-4 rounded border-[#dddbff] text-[#443dff] accent-[#443dff] cursor-pointer">
                        <label for="remember" class="text-xs font-semibold text-[#050316]/70 cursor-pointer select-none">
                            Ingat saya di perangkat ini
                        </label>
                    </div>

                    {{-- Submit --}}
                    <button type="submit"
                        class="w-full h-12 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff]
                            hover:from-[#050316] hover:to-[#2f27ce]
                            text-white text-sm font-extrabold tracking-wide
                            transition-all duration-200 shadow-lg shadow-[#443dff]/30
                            active:scale-[0.98] flex items-center justify-center gap-2">
                        Masuk ke Dashboard
                        <iconify-icon icon="solar:arrow-right-bold" class="text-base"></iconify-icon>
                    </button>
                </form>

                {{-- Divider --}}
                <div class="flex items-center gap-3">
                    <div class="flex-1 h-px bg-[#dddbff]"></div>
                    <span class="text-[10px] font-bold text-[#2f27ce]/50 capitalize tracking-widest">Aman & Terenkripsi</span>
                    <div class="flex-1 h-px bg-[#dddbff]"></div>
                </div>

                {{-- Trust badges --}}
                <div class="flex items-center justify-center gap-6 text-[11px] font-semibold text-[#2f27ce]/60">
                    <span class="flex items-center gap-1.5">
                        <iconify-icon icon="solar:shield-check-bold-duotone" class="text-sm text-[#443dff]"></iconify-icon>
                        Koneksi aman SSL 256-bit
                    </span>
                </div>

                <div class="flex items-center justify-center gap-5 text-[11px] font-semibold text-[#2f27ce]/60">
                    <span class="flex items-center gap-1.5 cursor-pointer hover:text-[#443dff] transition-colors">
                        <iconify-icon icon="solar:question-circle-linear" class="text-sm"></iconify-icon>
                        Bantuan
                    </span>
                    <span class="flex items-center gap-1.5 cursor-pointer hover:text-[#443dff] transition-colors">
                        <iconify-icon icon="solar:global-linear" class="text-sm"></iconify-icon>
                        Bahasa Indonesia
                    </span>
                </div>

            </div>
        </div>

        {{-- Footer --}}
        <div class="px-8 py-5 border-t border-[#dddbff] text-center space-y-2">
            <div class="flex items-center justify-center gap-4 text-[11px] font-semibold text-[#2f27ce]/60">
                <a href="#" class="hover:text-[#443dff] transition-colors">Syarat &amp; Ketentuan</a>
                <span class="text-[#dddbff]">•</span>
                <a href="#" class="hover:text-[#443dff] transition-colors">Kebijakan Privasi</a>
                <span class="text-[#dddbff]">•</span>
                <a href="#" class="hover:text-[#443dff] transition-colors">Hubungi Kami</a>
            </div>
            <p class="text-[10px] font-bold text-[#2f27ce]/40 capitalize tracking-widest">
                © {{ date('Y') }} Devora POS
            </p>
        </div>

    </div>
</div>

<script>
    function togglePassword() {
        const input = document.getElementById('password');
        const icon  = document.getElementById('eye-icon');
        if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('icon', 'solar:eye-closed-linear');
        } else {
            input.type = 'password';
            icon.setAttribute('icon', 'solar:eye-linear');
        }
    }
</script>

</body>
</html>