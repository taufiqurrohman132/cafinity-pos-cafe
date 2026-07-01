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
                setErrors(error.response.data.errors || {});
            } else if (error.response && error.response.status === 403) {
                setErrors({ email: [error.response.data.message] });
            } else {
                setErrors({ email: ['Terjadi kesalahan saat masuk. Silakan coba lagi.'] });
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-bg">
            {/* ====== KIRI: HERO PREMIUM ====== */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-6">
                <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        @keyframes float2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
        }
        @keyframes float3 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        @keyframes float4 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
        .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .float-1 { animation: float1 4s ease-in-out infinite; }
        .float-2 { animation: float2 5.5s ease-in-out infinite 1.8s; }
        .float-3 { animation: float3 6s ease-in-out infinite 0.6s; }
        .float-4 { animation: float4 4.8s ease-in-out infinite 2.5s; }
    `}</style>

                <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl p-6">

                    {/* Background foto interior kafe */}
                    <img
                        src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1600&auto=format&fit=crop"
                        alt="Cafinity Coffee Shop"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay sonar */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img
                            src="/image/sonar-bg.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />
                    </div>

                    {/* Fade bawah */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* ===== Layout utama ===== */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-7">

                        {/* ---------- TOP ---------- */}
                        {/* Pesanan card (kiri) + Avatars (kanan) — seperti referensi */}
                        <div className="flex items-start justify-between fade-in-up" style={{ animationDelay: '0.1s' }}>

                            {/* Pesanan Baru card — float-1 (paling aktif) */}
                            <div className="float-1">
                                <div className="bg-[#BFFF00] rounded-2xl px-4 py-3 shadow-lg shadow-black/30 w-[210px]">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[13px] font-extrabold text-black leading-tight">Pesanan Baru Masuk</p>
                                        <span className="w-2 h-2 rounded-full bg-black/60 flex-shrink-0 animate-pulse"></span>
                                    </div>
                                    <p className="text-[11px] font-bold text-black/70">Meja 04 — 2 menit lalu</p>
                                    <p className="text-[10px] font-semibold text-black/50 mt-0.5">3 item • Dine-in</p>
                                </div>
                            </div>

                            {/* Avatars — scatter bebas, ukuran beda, gerak tidak beraturan */}
                            <div className="relative w-28 h-28 ">

                                {/* Avatar 1 — besar, pojok kanan atas */}
                                <img
                                    src="https://i.pravatar.cc/80?img=47"
                                    className="absolute w-14 h-14 rounded-full border-2 border-white shadow-md"
                                    style={{
                                        top: '0px',
                                        right: '0px',
                                        animation: 'float1 4.2s ease-in-out infinite 0s'
                                    }}
                                    alt=""
                                />

                                {/* Avatar 2 — kecil, kiri bawah */}
                                <img
                                    src="https://i.pravatar.cc/80?img=12"
                                    className="absolute w-9 h-9 rounded-full border-2 border-white shadow-md"
                                    style={{
                                        bottom: '8px',
                                        left: '0px',
                                        animation: 'float3 5.8s ease-in-out infinite 1.3s'
                                    }}
                                    alt=""
                                />

                                {/* Avatar 3 — sedang, tengah agak bawah */}
                                <img
                                    src="https://i.pravatar.cc/80?img=32"
                                    className="absolute w-11 h-11 rounded-full border-2 border-white shadow-md"
                                    style={{
                                        bottom: '0px',
                                        right: '12px',
                                        animation: 'float2 6.5s ease-in-out infinite 2.7s'
                                    }}
                                    alt=""
                                />

                            </div>

                        </div>

                        {/* ---------- MIDDLE: HEADLINE ---------- */}
                        <div className="fade-in-up" style={{ animationDelay: '0.35s' }}>
                            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                                Kelola Bisnis Kafe<br />
                                <span className="text-[#BFFF00]">Lebih Efisien.</span>
                            </h1>
                        </div>

                        {/* ---------- BOTTOM AREA ---------- */}
                        <div className="flex flex-col gap-10">

                            {/* Jam Operasional Strip — float-3 (paling lambat, delay tengah) */}
                            <div className="float-3 fade-in-up" style={{ animationDelay: '0.5s' }}>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-4 py-3 flex justify-between">
                                    {[
                                        { d: 'Sen', n: 22 }, { d: 'Sel', n: 23 }, { d: 'Rab', n: 24 },
                                        { d: 'Kam', n: 25, active: true }, { d: 'Jum', n: 26 }, { d: 'Sab', n: 27 }, { d: 'Min', n: 28 },
                                    ].map((item) => (
                                        <div key={item.n} className="flex flex-col items-center gap-1">
                                            <span className={`text-[10px] font-bold ${item.active ? 'text-[#BFFF00]' : 'text-white/60'}`}>{item.d}</span>
                                            <span className={`text-sm font-extrabold ${item.active ? 'text-white' : 'text-white/80'}`}>{item.n}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Briefing Shift card — float-4 (delay paling lama, kecepatan sedang) */}
                            <div className="float-4 fade-in-up" style={{ animationDelay: '0.65s' }}>
                                <div className="bg-white rounded-2xl px-5 py-4 shadow-xl shadow-black/40 w-[260px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[13px] font-extrabold text-gray-800">Briefing Shift Pagi</p>
                                        <span className="w-2 h-2 rounded-full bg-[#BFFF00]"></span>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-500 mb-3">07:00 — 07:30</p>
                                    <div className="flex -space-x-2">
                                        <img src="https://i.pravatar.cc/60?img=15" className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                                        <img src="https://i.pravatar.cc/60?img=22" className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                                        <img src="https://i.pravatar.cc/60?img=8" className="w-7 h-7 rounded-full border-2 border-white" alt="" />
                                        <div className="w-7 h-7 rounded-full border-2 border-white bg-[#4d3227] flex items-center justify-center">
                                            <span className="text-[9px] font-extrabold text-white">+3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* ====== KANAN: FORM ====== */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white">
                <div className="flex-1 flex items-center justify-center px-8 py-6">
                    <div className="w-full max-w-sm space-y-5">

                        {/* Logo */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-14 h-14 overflow-hidden">
                                <img
                                    src="/image/logo.png"
                                    alt="Logo Cafinity"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-[28px] font-extrabold text-black tracking-tight leading-[40px]">Selamat Datang</h2>
                                <p className="text-sm font-normal text-[#666666] mt-1 leading-5">
                                    Silakan masuk ke akun Anda untuk mengelola operasional kafe.
                                </p>
                            </div>
                        </div>

                        {/* Error */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-600 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                                <div>
                                    {Object.values(errors).map((errorArray, i) => (
                                        errorArray.map((error, j) => (
                                            <p key={`${i}-${j}`} className="text-xs font-semibold text-rose-700">{error}</p>
                                        ))
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-5">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-black tracking-wide">
                                    Email atau Nama Pengguna
                                </label>
                                <div className="relative">
                                    <iconify-icon icon="solar:letter-linear"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] text-lg pointer-events-none">
                                    </iconify-icon>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="nama@kafeanda.com"
                                        required autoFocus autoComplete="email"
                                        className={`w-full h-12 rounded-xl border bg-white text-sm pl-10 pr-4 text-black font-medium placeholder:font-normal placeholder:italic placeholder:text-[#999999] focus:outline-none transition-all duration-150 ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-[#D0D0D0]'} hover:border-[#999999] focus:border-[#BFFF00] focus:ring-[3px] focus:ring-[rgba(191,255,0,0.1)]`}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-semibold text-black tracking-wide">
                                        Kata Sandi
                                    </label>
                                    <a href="/forgot-password"
                                        className="text-xs font-semibold text-black border-b border-[#D0D0D0] hover:border-black transition-colors">
                                        Lupa kata sandi?
                                    </a>
                                </div>
                                <div className="relative">
                                    <iconify-icon icon="solar:lock-password-linear"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] text-lg pointer-events-none">
                                    </iconify-icon>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required autoComplete="current-password"
                                        className={`w-full h-12 rounded-xl border bg-white text-sm pl-10 pr-12 text-black font-medium placeholder:font-normal placeholder:text-[#999999] focus:outline-none transition-all duration-150 ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-[#D0D0D0]'} hover:border-[#999999] focus:border-[#BFFF00] focus:ring-[3px] focus:ring-[rgba(191,255,0,0.1)]`}
                                    />
                                    <button type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-black transition-colors active:scale-[0.97]">
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
                                    className="w-4 h-4 rounded border-[#D0D0D0] accent-[#BFFF00] cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs font-medium text-[#666666] cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={processing}
                                className="w-full h-12 rounded-xl bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] active:scale-[0.98] text-black text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] flex items-center justify-center gap-2 disabled:bg-[#999999] disabled:text-[#666666] disabled:cursor-not-allowed disabled:shadow-none">
                                {processing ? 'Memproses...' : 'Masuk ke Dashboard'}
                                {!processing && <iconify-icon icon="solar:arrow-right-linear" class="text-base"></iconify-icon>}
                            </button>
                        </form>

                        {/* Pendaftaran Akun */}
                        <p className="text-xs text-center text-[#666666] font-medium mt-3">
                            Belum memiliki akun?{' '}
                            <a href="/register" className="text-black font-semibold border-b border-[#BFFF00] hover:bg-[#BFFF00]/10 transition-colors">
                                Daftar Akun Baru
                            </a>
                        </p>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-[#E6E6E6]"></div>
                            <span className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest">Aman & Terenkripsi</span>
                            <div className="flex-1 h-px bg-[#E6E6E6]"></div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 text-[11px] font-medium text-[#999999]">
                            <span className="flex items-center gap-1.5">
                                <iconify-icon icon="solar:shield-check-linear" class="text-sm text-black"></iconify-icon>
                                Koneksi aman SSL 256-bit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[#E6E6E6] text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-[#999999]">
                        <a href="#" className="hover:text-black transition-colors">Syarat & Ketentuan</a>
                        <span className="text-[#D0D0D0]">•</span>
                        <a href="#" className="hover:text-black transition-colors">Kebijakan Privasi</a>
                        <span className="text-[#D0D0D0]">•</span>
                        <a href="#" className="hover:text-black transition-colors">Hubungi Kami</a>
                    </div>
                    <p className="text-[10px] font-medium text-[#999999] uppercase tracking-widest">
                        © {new Date().getFullYear()} Cafinity POS
                    </p>
                </div>
            </div>
        </div>
    );
}