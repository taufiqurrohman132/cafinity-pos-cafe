import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login — Cafinity POS";
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await login(email, password);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            setProcessing(false);
            if (error.response && error.response.status === 422) {
                // Validation error from Laravel
                setErrors(error.response.data.errors || {});
            } else if (error.response && error.response.status === 403) {
                // Inactive user
                setErrors({ email: [error.response.data.message] });
            } else {
                setErrors({ email: ['Terjadi kesalahan saat masuk. Silakan coba lagi.'] });
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-bg">
            {/* ====== KIRI: HERO ====== */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b15] via-[#4d3227]/80 to-[#78503f]/60"></div>
                <div className="absolute inset-0 bg-black/50"></div>
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
                            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mt-1 text-orange-200">
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
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4d3227] to-[#78503f] shadow-lg shadow-amber-950/30">
                                <iconify-icon icon="solar:cup-hot-linear" class="text-2xl text-white"></iconify-icon>
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Selamat Datang</h2>
                                <p className="text-sm font-medium text-gray-500 mt-1">
                                    Silakan masuk ke akun Anda untuk mengelola operasional kafe.
                                </p>
                            </div>
                        </div>

                        {/* Error */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                                <div>
                                    {Object.values(errors).map((errorArray, i) => (
                                        errorArray.map((error, j) => (
                                            <p key={`${i}-${j}`} className="text-xs font-bold text-rose-600">{error}</p>
                                        ))
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-5">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-extrabold text-gray-700 capitalize tracking-wide">
                                    Email atau Nama Pengguna
                                </label>
                                <div className="relative">
                                    <iconify-icon icon="solar:letter-linear"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                                    </iconify-icon>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="nama@kafeanda.com"
                                        required autoFocus autoComplete="email"
                                        className={`w-full h-12 rounded-xl border bg-gray-55 text-sm pl-10 pr-4 text-gray-800 font-bold placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 focus:bg-white transition-shadow ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-extrabold text-gray-700 capitalize tracking-wide">
                                        Kata Sandi
                                    </label>
                                    <a href="/forgot-password"
                                        className="text-xs font-extrabold text-amber-700 hover:text-amber-900 transition-colors">
                                        Lupa kata sandi?
                                    </a>
                                </div>
                                <div className="relative">
                                    <iconify-icon icon="solar:lock-password-linear"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                                    </iconify-icon>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required autoComplete="current-password"
                                        className={`w-full h-12 rounded-xl border bg-gray-55 text-sm pl-10 pr-12 text-gray-800 font-bold placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 focus:bg-white transition-shadow ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-gray-200'}`}
                                    />
                                    <button type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
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
                                    checked={remember}
                                    onChange={e => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 accent-amber-600 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs font-bold text-gray-600 cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={processing}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4d3227] to-[#78503f] hover:from-[#3a251d] hover:to-[#5e3e31] text-white text-sm font-extrabold tracking-wide transition-all duration-200 shadow-lg shadow-amber-950/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                {processing ? 'Memproses...' : 'Masuk ke Dashboard'}
                                {!processing && <iconify-icon icon="solar:arrow-right-linear" class="text-base"></iconify-icon>}
                            </button>
                        </form>

                        {/* Pendaftaran Akun */}
                        <p className="text-xs text-center text-gray-600 font-bold mt-3">
                            Belum memiliki akun?{' '}
                            <a href="/register" className="text-amber-700 hover:text-amber-900 font-extrabold transition-colors">
                                Daftar Akun Baru
                            </a>
                        </p>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-100"></div>
                            <span className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">Aman & Terenkripsi</span>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 text-[11px] font-bold text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <iconify-icon icon="solar:shield-check-linear" class="text-sm text-amber-700"></iconify-icon>
                                Koneksi aman SSL 256-bit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400">
                        <a href="#" className="hover:text-amber-700 transition-colors">Syarat & Ketentuan</a>
                        <span className="text-gray-200">•</span>
                        <a href="#" className="hover:text-amber-700 transition-colors">Kebijakan Privasi</a>
                        <span className="text-gray-200">•</span>
                        <a href="#" className="hover:text-amber-700 transition-colors">Hubungi Kami</a>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">
                        © {new Date().getFullYear()} Cafinity POS
                    </p>
                </div>
            </div>
        </div>
    );
}
