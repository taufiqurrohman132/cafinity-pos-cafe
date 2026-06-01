import { useState, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';

export default function Register({ errors: serverErrors }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Pendaftaran Akun — Cafinity POS" />
            <div className="min-h-screen flex bg-[#fbfbfe] font-inter">

                {/* ====== KIRI: HERO ====== */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#050316] via-[#2f27ce]/80 to-[#443dff]/60"></div>
                    <div className="absolute inset-0 bg-[#050316]/50"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                    <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Icon icon="solar:cup-hot-linear" className="text-xl text-white" />
                            </div>
                            <span className="text-white font-extrabold text-lg tracking-tight">Cafinity POS</span>
                        </div>

                        {/* Konten tengah */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-white/90 text-xs font-bold tracking-wide">Uji Coba Demo POS Cafe</span>
                            </div>

                            <div>
                                <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                                    Mulai Kelola<br />Kafe Anda
                                </h1>
                                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mt-1" style={{ color: '#dddbff' }}>
                                    Sekarang Juga.
                                </h1>
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                                Daftar sekarang untuk mendapatkan akses instan sebagai Owner ke seluruh dasbor POS, kontrol inventori, analisis target harian, dan manajemen pegawai.
                            </p>
                        </div>

                        <p className="text-white/40 text-xs font-medium italic">
                            "Efisiensi adalah kunci dari pertumbuhan kafe yang berkelanjutan."
                        </p>
                    </div>
                </div>

                {/* ====== KANAN: FORM ====== */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white">
                    <div className="flex-1 flex items-center justify-center px-8 py-10">
                        <div className="w-full max-w-sm space-y-6">

                            {/* Logo */}
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] shadow-lg shadow-[#443dff]/30">
                                    <Icon icon="solar:user-plus-rounded-linear" className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-[#050316] tracking-tight">Daftar Akun Baru</h2>
                                    <p className="text-sm font-medium text-[#2f27ce]/70 mt-1">
                                        Buat akun Owner Anda untuk mulai mencoba fitur demo.
                                    </p>
                                </div>
                            </div>

                            {/* Error */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                    <Icon icon="solar:danger-triangle-linear" className="text-rose-500 text-lg flex-shrink-0 mt-0.5" />
                                    <div>
                                        {Object.values(errors).map((error, i) => (
                                            <p key={i} className="text-xs font-semibold text-rose-600">{error}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-4">

                                {/* Nama Lengkap */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <Icon icon="solar:user-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none" />
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Nama Lengkap Anda"
                                            required autoFocus autoComplete="name"
                                            className={`w-full h-11 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-4 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.name ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <Icon icon="solar:letter-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="nama@email.com"
                                            required autoComplete="username"
                                            className={`w-full h-11 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-4 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                        Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <Icon icon="solar:lock-password-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Min. 8 karakter"
                                            required autoComplete="new-password"
                                            className={`w-full h-11 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-12 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.password ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                        <button type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                            <Icon icon={showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-lg" />
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold text-[#2f27ce] capitalize tracking-wide">
                                        Ulangi Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <Icon icon="solar:lock-password-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg pointer-events-none" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi kata sandi"
                                            required autoComplete="new-password"
                                            className={`w-full h-11 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-12 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.password_confirmation ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={processing}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-extrabold tracking-wide transition-all duration-200 shadow-lg shadow-[#443dff]/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed pt-1">
                                    {processing ? 'Mendaftar...' : 'Daftar Sebagai Owner'}
                                    {!processing && <Icon icon="solar:arrow-right-linear" className="text-base" />}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <p className="text-xs text-center text-[#050316]/70 font-semibold mt-3">
                                Sudah memiliki akun?{' '}
                                <a href="/login" className="text-[#443dff] hover:underline font-extrabold">
                                    Masuk ke Dashboard
                                </a>
                            </p>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 border-t border-[#dddbff] text-center space-y-2">
                        <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-[#2f27ce]/60">
                            <a href="#" className="hover:text-[#443dff] transition-colors">Syarat & Ketentuan</a>
                            <span className="text-[#dddbff]">•</span>
                            <a href="#" className="hover:text-[#443dff] transition-colors">Kebijakan Privasi</a>
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
