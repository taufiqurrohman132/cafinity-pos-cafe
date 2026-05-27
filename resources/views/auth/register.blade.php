<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register — Devora POS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
</head>
<body class="bg-[#fbfbfe]">

<div class="min-h-screen flex">

    {{-- ====== KIRI: HERO ====== --}}
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-[#050316] via-[#2f27ce]/80 to-[#443dff]/60"></div>
        <div class="absolute inset-0 bg-[#050316]/50"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div class="relative z-10 flex flex-col justify-between p-12 w-full">

            {{-- Logo --}}
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
                    <span class="text-white/90 text-xs font-bold tracking-wide">Mulai Gratis • Tanpa Kartu Kredit</span>
                </div>

                <div>
                    <h1 class="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Bergabung &amp;<br>Kelola Kafe Anda
                    </h1>
                    <h1 class="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mt-1"
                        style="color: #dddbff;">
                        Mulai Sekarang.
                    </h1>
                </div>

                <p class="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                    Daftarkan kafe Anda dan nikmati sistem manajemen terintegrasi untuk penjualan, inventaris, dan performa bisnis.
                </p>

                {{-- Features --}}
                <div class="space-y-3 pt-2">
                    @foreach ([
                        ['solar:chart-2-bold-duotone', 'Dashboard performa real-time'],
                        ['solar:box-bold-duotone',     'Manajemen inventaris otomatis'],
                        ['solar:card-2-bold-duotone',  'Point of Sale yang mudah digunakan'],
                    ] as [$icon, $text])
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                                <iconify-icon icon="{{ $icon }}" class="text-sm text-white"></iconify-icon>
                            </div>
                            <span class="text-white/80 text-sm font-medium">{{ $text }}</span>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Quote --}}
            <p class="text-white/40 text-xs font-medium italic">
                "Efisiensi adalah kunci dari pertumbuhan kafe yang berkelanjutan."
            </p>
        </div>
    </div>

    {{-- ====== KANAN: FORM ====== --}}
    <div class="w-full lg:w-1/2 flex flex-col justify-between bg-white overflow-y-auto">

        <div class="flex-1 flex items-center justify-center px-8 py-12">
            <div class="w-full max-w-sm space-y-6">

                {{-- Logo + Heading --}}
                <div class="text-center space-y-3">
                    <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] shadow-lg shadow-[#443dff]/30">
                        <iconify-icon icon="solar:cup-hot-bold" class="text-2xl text-white"></iconify-icon>
                    </div>
                    <div>
                        <h2 class="text-2xl font-extrabold text-[#050316] tracking-tight">Buat Akun Baru</h2>
                        <p class="text-sm font-medium text-[#2f27ce]/70 mt-1">
                            Isi data di bawah untuk mendaftar ke Devora POS.
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

                {{-- Form --}}
                <form method="POST" action="{{ route('register') }}" class="space-y-4">
                    @csrf

                    {{-- Nama --}}
                    <div class="space-y-1.5">
                        <label class="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide">
                            Nama Lengkap <span class="text-rose-500">*</span>
                        </label>
                        <div class="relative">
                            <iconify-icon icon="solar:user-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                            </iconify-icon>
                            <input type="text" name="name"
                                value="{{ old('name') }}"
                                placeholder="Nama lengkap Anda"
                                required autofocus autocomplete="name"
                                class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#fbfbfe] text-sm pl-10 pr-4
                                    text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40
                                    focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff]
                                    focus:bg-white transition-shadow
                                    @error('name') border-rose-300 bg-rose-50 @enderror">
                        </div>
                    </div>

                    {{-- Email --}}
                    <div class="space-y-1.5">
                        <label class="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide">
                            Email <span class="text-rose-500">*</span>
                        </label>
                        <div class="relative">
                            <iconify-icon icon="solar:letter-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                            </iconify-icon>
                            <input type="email" name="email"
                                value="{{ old('email') }}"
                                placeholder="nama@kafeanda.com"
                                required autocomplete="email"
                                class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#fbfbfe] text-sm pl-10 pr-4
                                    text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40
                                    focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff]
                                    focus:bg-white transition-shadow
                                    @error('email') border-rose-300 bg-rose-50 @enderror">
                        </div>
                    </div>

                    {{-- Password --}}
                    <div class="space-y-1.5">
                        <label class="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide">
                            Kata Sandi <span class="text-rose-500">*</span>
                        </label>
                        <div class="relative">
                            <iconify-icon icon="solar:lock-password-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                            </iconify-icon>
                            <input type="password" name="password" id="password"
                                placeholder="Minimal 8 karakter"
                                required autocomplete="new-password"
                                class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#fbfbfe] text-sm pl-10 pr-12
                                    text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40
                                    focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff]
                                    focus:bg-white transition-shadow
                                    @error('password') border-rose-300 bg-rose-50 @enderror">
                            <button type="button" onclick="togglePassword('password', 'eye-icon-1')"
                                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                <iconify-icon icon="solar:eye-linear" id="eye-icon-1" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>

                    {{-- Konfirmasi Password --}}
                    <div class="space-y-1.5">
                        <label class="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide">
                            Konfirmasi Kata Sandi <span class="text-rose-500">*</span>
                        </label>
                        <div class="relative">
                            <iconify-icon icon="solar:lock-password-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                            </iconify-icon>
                            <input type="password" name="password_confirmation" id="password_confirmation"
                                placeholder="Ulangi kata sandi"
                                required autocomplete="new-password"
                                class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#fbfbfe] text-sm pl-10 pr-12
                                    text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40
                                    focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff]
                                    focus:bg-white transition-shadow">
                            <button type="button" onclick="togglePassword('password_confirmation', 'eye-icon-2')"
                                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                <iconify-icon icon="solar:eye-linear" id="eye-icon-2" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>

                    {{-- Submit --}}
                    <div class="pt-1">
                        <button type="submit"
                            class="w-full h-12 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff]
                                hover:from-[#050316] hover:to-[#2f27ce]
                                text-white text-sm font-extrabold tracking-wide
                                transition-all duration-200 shadow-lg shadow-[#443dff]/30
                                active:scale-[0.98] flex items-center justify-center gap-2">
                            Buat Akun Sekarang
                            <iconify-icon icon="solar:arrow-right-bold" class="text-base"></iconify-icon>
                        </button>
                    </div>

                    {{-- Login link --}}
                    <p class="text-center text-xs font-semibold text-[#2f27ce]/70">
                        Sudah punya akun?
                        <a href="{{ route('login') }}"
                            class="font-extrabold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors">
                            Masuk di sini
                        </a>
                    </p>
                </form>

                {{-- Divider --}}
                <div class="flex items-center gap-3">
                    <div class="flex-1 h-px bg-[#dddbff]"></div>
                    <span class="text-[10px] font-bold text-[#2f27ce]/50 uppercase tracking-widest">Aman & Terenkripsi</span>
                    <div class="flex-1 h-px bg-[#dddbff]"></div>
                </div>

                {{-- Trust badge --}}
                <div class="flex items-center justify-center">
                    <span class="flex items-center gap-1.5 text-[11px] font-semibold text-[#2f27ce]/60">
                        <iconify-icon icon="solar:shield-check-bold-duotone" class="text-sm text-[#443dff]"></iconify-icon>
                        Koneksi aman dengan enkripsi SSL 256-bit
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
            <p class="text-[10px] font-bold text-[#2f27ce]/40 uppercase tracking-widest">
                © {{ date('Y') }} Devora POS
            </p>
        </div>

    </div>
</div>

<script>
    function togglePassword(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon  = document.getElementById(iconId);
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