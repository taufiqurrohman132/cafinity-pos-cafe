import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login({ status, errors: serverErrors }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login — Cafinity POS" />
            <div className="min-h-screen flex bg-[#fbfbfe]">

                {/* ====== KIRI: HERO ====== */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#050316] via-[#2f27ce]/80 to-[#443dff]/60"></div>
                    <div className="absolute inset-0 bg-[#050316]/50"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                    <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                <iconify-icon icon="solar:cup-hot-linear" class="text-xl text-white"></iconify-icon>
                            </div>
                            <span className="text-white font-extrabold text-lg tracking-tight">Cafinity POS</span>
                        </div>

                        {/* Konten tengah */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-white/90 text-xs font-bold tracking-wide">Versi Terbaru 2.4.0 • Sekarang Tersedia</span>
                            </div>

                            <div>
                                <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                                    Kelola Bisnis<br />Kafe Anda
                                </h1>
                                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mt-1" style={{ color: '#dddbff' }}>
                                    Lebih Efisien.
                                </h1>
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                                Sistem manajemen terintegrasi untuk penjualan, inventaris, dan performa bisnis dalam satu genggaman tangan Anda.
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-10 pt-2">
                                <div>
                                    <p className="text-3xl font-extrabold text-white">500+</p>
                                    <p className="text-white/60 text-xs font-medium mt-0.5">Mitra Kafe Aktif</p>
                                </div>
                                <div className="w-px h-10 bg-white/20"></div>
                                <div>
                                    <p className="text-3xl font-extrabold text-white">99.9%</p>
                                    <p className="text-white/60 text-xs font-medium mt-0.5">Uptime Sistem</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-white/40 text-xs font-medium italic">
                            "Efisiensi adalah kunci dari pertumbuhan kafe yang berkelanjutan."
                        </p>
                    </div>
                </div>

                {/* ====== KANAN: FORM ====== */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white">
                    <div className="flex-1 flex items-center justify-center px-8 py-12">
                        <div className="w-full max-w-sm space-y-7">

                            {/* Logo */}
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] shadow-lg shadow-[#443dff]/30">
                                    <iconify-icon icon="solar:cup-hot-linear" class="text-2xl text-white"></iconify-icon>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-[#050316] tracking-tight">Selamat Datang</h2>
                                    <p className="text-sm font-medium text-[#2f27ce]/70 mt-1">
                                        Silakan masuk ke akun Anda untuk mengelola operasional kafe.
                                    </p>
                                </div>
                            </div>

                            {/* Error */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                    <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                                    <div>
                                        {Object.values(errors).map((error, i) => (
                                            <p key={i} className="text-xs font-semibold text-rose-600">{error}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            {status && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                                    <p className="text-xs font-semibold text-emerald-700">{status}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-5">

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                        Email atau Nama Pengguna
                                    </label>
                                    <div className="relative">
                                        <iconify-icon icon="solar:letter-linear"
                                            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                                        </iconify-icon>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="nama@kafeanda.com"
                                            required autoFocus autoComplete="email"
                                            className={`w-full h-12 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-4 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                            Kata Sandi
                                        </label>
                                        <a href="/forgot-password"
                                            className="text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors">
                                            Lupa kata sandi?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <iconify-icon icon="solar:lock-password-linear"
                                            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none">
                                        </iconify-icon>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required autoComplete="current-password"
                                            className={`w-full h-12 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-12 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                        <button type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                            <iconify-icon
                                                icon={showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'}
                                                class="text-lg">
                                            </iconify-icon>
                                        </button>
                                    </div>
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-[#dddbff] accent-[#443dff] cursor-pointer"
                                    />
                                    <label htmlFor="remember" className="text-xs font-semibold text-[#050316]/70 cursor-pointer select-none">
                                        Ingat saya di perangkat ini
                                    </label>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={processing}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-extrabold tracking-wide transition-all duration-200 shadow-lg shadow-[#443dff]/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                    {processing ? 'Memproses...' : 'Masuk ke Dashboard'}
                                    {!processing && <iconify-icon icon="solar:arrow-right-linear" class="text-base"></iconify-icon>}
                                </button>
                            </form>

                            {/* Pendaftaran Akun */}
                            <p className="text-xs text-center text-[#050316]/70 font-semibold mt-3">
                                Belum memiliki akun?{' '}
                                <a href="/register" className="text-[#443dff] hover:underline font-extrabold">
                                    Daftar Akun Baru
                                </a>
                            </p>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#dddbff]"></div>
                                <span className="text-[10px] font-bold text-[#2f27ce]/50 capitalize tracking-widest">Aman & Terenkripsi</span>
                                <div className="flex-1 h-px bg-[#dddbff]"></div>
                            </div>

                            {/* Trust badges */}
                            <div className="flex items-center justify-center gap-6 text-[11px] font-semibold text-[#2f27ce]/60">
                                <span className="flex items-center gap-1.5">
                                    <iconify-icon icon="solar:shield-check-linear" class="text-sm text-[#443dff]"></iconify-icon>
                                    Koneksi aman SSL 256-bit
                                </span>
                            </div>

                            <div className="flex items-center justify-center gap-5 text-[11px] font-semibold text-[#2f27ce]/60">
                                <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#443dff] transition-colors">
                                    <iconify-icon icon="solar:question-circle-linear" class="text-sm"></iconify-icon>
                                    Bantuan
                                </span>
                                <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#443dff] transition-colors">
                                    <iconify-icon icon="solar:global-linear" class="text-sm"></iconify-icon>
                                    Bahasa Indonesia
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-[#dddbff] text-center space-y-2">
                        <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-[#2f27ce]/60">
                            <a href="#" className="hover:text-[#443dff] transition-colors">Syarat & Ketentuan</a>
                            <span className="text-[#dddbff]">•</span>
                            <a href="#" className="hover:text-[#443dff] transition-colors">Kebijakan Privasi</a>
                            <span className="text-[#dddbff]">•</span>
                            <a href="#" className="hover:text-[#443dff] transition-colors">Hubungi Kami</a>
                        </div>
                        <p className="text-[10px] font-bold text-[#2f27ce]/40 capitalize tracking-widest">
                            © {new Date().getFullYear()} Cafinity POS
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}