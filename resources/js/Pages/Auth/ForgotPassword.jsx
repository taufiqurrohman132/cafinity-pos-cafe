import { useForm, Head } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Lupa Kata Sandi — Cafinity POS" />
            <div className="min-h-screen flex bg-[#fbfbfe]">

                {/* Kiri: Hero — sama persis dengan Login */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#050316] via-[#2f27ce]/80 to-[#443dff]/60"></div>
                    <div className="absolute inset-0 bg-[#050316]/50"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                <iconify-icon icon="solar:cup-hot-bold" class="text-xl text-white"></iconify-icon>
                            </div>
                            <span className="text-white font-extrabold text-lg tracking-tight">Cafinity POS</span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                                    Lupa Kata<br />Sandi Anda?
                                </h1>
                                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mt-1" style={{ color: '#dddbff' }}>
                                    Kami Bantu.
                                </h1>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                                Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                            </p>
                        </div>
                        <p className="text-white/40 text-xs font-medium italic">
                            "Keamanan akun adalah prioritas kami."
                        </p>
                    </div>
                </div>

                {/* Kanan: Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white">
                    <div className="flex-1 flex items-center justify-center px-8 py-12">
                        <div className="w-full max-w-sm space-y-7">

                            {/* Logo */}
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] shadow-lg shadow-[#443dff]/30">
                                    <iconify-icon icon="solar:lock-password-bold" class="text-2xl text-white"></iconify-icon>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-[#050316] tracking-tight">Reset Kata Sandi</h2>
                                    <p className="text-sm font-medium text-[#2f27ce]/70 mt-1">
                                        Masukkan email Anda untuk menerima tautan reset kata sandi.
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            {status && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                                    <p className="text-xs font-semibold text-emerald-700">{status}</p>
                                </div>
                            )}

                            {/* Error */}
                            {errors.email && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-start gap-2">
                                    <iconify-icon icon="solar:danger-triangle-bold-duotone" class="text-rose-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                                    <p className="text-xs font-semibold text-rose-600">{errors.email}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide">
                                        Alamat Email
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
                                            required autoFocus
                                            className={`w-full h-12 rounded-xl border bg-[#fbfbfe] text-sm pl-10 pr-4 text-[#050316] font-semibold placeholder:font-normal placeholder:text-[#2f27ce]/40 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] focus:bg-white transition-shadow ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-[#dddbff]'}`}
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-extrabold tracking-wide transition-all duration-200 shadow-lg shadow-[#443dff]/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                    {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
                                    {!processing && <iconify-icon icon="solar:arrow-right-bold" class="text-base"></iconify-icon>}
                                </button>

                                <div className="text-center">
                                    <a href="/login" className="text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors flex items-center justify-center gap-1.5">
                                        <iconify-icon icon="solar:arrow-left-linear" class="text-sm"></iconify-icon>
                                        Kembali ke halaman login
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-[#dddbff] text-center">
                        <p className="text-[10px] font-bold text-[#2f27ce]/40 uppercase tracking-widest">
                            © {new Date().getFullYear()} Cafinity POS
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}