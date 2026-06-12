import React, { useState } from 'react';
import Head from '@/Components/Head';
import { useAuth } from '@/context/AuthContext';
import client from '@/api/client';

export default function ProfileEdit() {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        const payload = {
            name,
            email,
        };

        if (password) {
            payload.current_password = currentPassword;
            payload.password = password;
            payload.password_confirmation = passwordConfirmation;
        }

        try {
            const response = await client.put('/profile', payload);
            if (response.data.success) {
                updateUser(response.data.user);
                setSuccessMessage(response.data.message || 'Profil berhasil diperbarui.');
                // Clear password fields
                setCurrentPassword('');
                setPassword('');
                setPasswordConfirmation('');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.errors) {
                const formattedErrors = {};
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formattedErrors[k] = Array.isArray(v) ? v[0] : v;
                });
                setErrors(formattedErrors);
            } else if (err.response && err.response.data && err.response.data.message) {
                setErrors({ global: err.response.data.message });
            } else {
                setErrors({ global: 'Terjadi kesalahan. Silakan coba lagi.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Profil Pengguna" />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Pengaturan Profil
                        </h1>
                        <p className="text-brand-primary font-medium text-sm mt-1">
                            Perbarui informasi akun pribadi Anda dan ubah kata sandi secara berkala.
                        </p>
                    </div>

                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
                            <iconify-icon icon="solar:check-circle-linear" class="text-xl text-emerald-600"></iconify-icon>
                            <span className="text-xs font-bold">{successMessage}</span>
                        </div>
                    )}

                    {errors.global && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
                            <iconify-icon icon="solar:danger-triangle-linear" class="text-xl text-rose-600"></iconify-icon>
                            <span className="text-xs font-bold">{errors.global}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl border border-brand-light shadow-sm overflow-hidden p-6 md:p-8 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-light/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {/* Section 1: Info Dasar */}
                            <div>
                                <h3 className="text-sm font-extrabold text-brand-dark mb-4 pb-2 border-b border-brand-light flex items-center gap-2">
                                    <iconify-icon icon="solar:user-id-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                    Informasi Dasar
                                </h3>

                                <div className="space-y-4">
                                    {/* Nama */}
                                    <div className="grid grid-cols-12 gap-x-4 items-center">
                                        <label className="col-span-12 md:col-span-4 text-left md:text-right md:pr-6 text-xs font-bold text-brand-dark capitalize tracking-wider">
                                            Nama Lengkap
                                        </label>
                                        <div className="col-span-12 md:col-span-8 mt-1 md:mt-0">
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-11 px-4 py-2 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-4 focus:ring-brand-light/30 transition-all font-semibold text-brand-dark"
                                            />
                                            {errors.name && (
                                                <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="grid grid-cols-12 gap-x-4 items-center">
                                        <label className="col-span-12 md:col-span-4 text-left md:text-right md:pr-6 text-xs font-bold text-brand-dark capitalize tracking-wider">
                                            Alamat Email
                                        </label>
                                        <div className="col-span-12 md:col-span-8 mt-1 md:mt-0">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-11 px-4 py-2 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-4 focus:ring-brand-light/30 transition-all font-semibold text-brand-dark"
                                            />
                                            {errors.email && (
                                                <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Keamanan / Ubah Password */}
                            <div>
                                <h3 className="text-sm font-extrabold text-brand-dark mb-4 pb-2 border-b border-brand-light flex items-center gap-2">
                                    <iconify-icon icon="solar:lock-password-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                    Ubah Kata Sandi
                                </h3>
                                <p className="text-[11px] text-brand-primary/60 font-medium mb-4 leading-normal">
                                    *Kosongkan kolom di bawah jika Anda tidak ingin mengubah kata sandi akun Anda.
                                </p>

                                <div className="space-y-4">
                                    {/* Current Password */}
                                    <div className="grid grid-cols-12 gap-x-4 items-center">
                                        <label className="col-span-12 md:col-span-4 text-left md:text-right md:pr-6 text-xs font-bold text-brand-dark capitalize tracking-wider">
                                            Kata Sandi Saat Ini
                                        </label>
                                        <div className="col-span-12 md:col-span-8 mt-1 md:mt-0">
                                            <input
                                                type="password"
                                                required={!!password}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder={password ? "Wajib diisi untuk mengubah sandi" : "••••••••"}
                                                className="w-full h-11 px-4 py-2 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-4 focus:ring-brand-light/30 transition-all font-semibold text-brand-dark"
                                            />
                                            {errors.current_password && (
                                                <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                    {errors.current_password}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="grid grid-cols-12 gap-x-4 items-center">
                                        <label className="col-span-12 md:col-span-4 text-left md:text-right md:pr-6 text-xs font-bold text-brand-dark capitalize tracking-wider">
                                            Kata Sandi Baru
                                        </label>
                                        <div className="col-span-12 md:col-span-8 mt-1 md:mt-0">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                className="w-full h-11 px-4 py-2 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-4 focus:ring-brand-light/30 transition-all font-semibold text-brand-dark"
                                            />
                                            {errors.password && (
                                                <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="grid grid-cols-12 gap-x-4 items-center">
                                        <label className="col-span-12 md:col-span-4 text-left md:text-right md:pr-6 text-xs font-bold text-brand-dark capitalize tracking-wider">
                                            Konfirmasi Sandi Baru
                                        </label>
                                        <div className="col-span-12 md:col-span-8 mt-1 md:mt-0">
                                            <input
                                                type="password"
                                                required={!!password}
                                                value={passwordConfirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                placeholder="Ketik ulang sandi baru"
                                                className="w-full h-11 px-4 py-2 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary focus:ring-4 focus:ring-brand-light/30 transition-all font-semibold text-brand-dark"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-[11px] text-rose-500 font-bold mt-1">
                                                    {errors.password_confirmation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t border-brand-light/30">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/20 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Profil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
