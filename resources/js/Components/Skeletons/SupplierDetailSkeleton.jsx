import React from 'react';

export default function SupplierDetailSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-5">
                
                {/* Top Breadcrumb & Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/40 pb-4 animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-3 rounded bg-brand-light" />
                        <div className="w-3 h-3 rounded-full bg-brand-light/40" />
                        <div className="w-20 h-3 rounded bg-brand-light/60" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="w-16 h-8 rounded-xl bg-brand-light" />
                        <div className="w-24 h-8 rounded-xl bg-brand-light" />
                        <div className="w-24 h-8 rounded-xl bg-brand-light" />
                        <div className="w-20 h-8 rounded-xl bg-brand-light" />
                    </div>
                </div>

                {/* Title Header */}
                <div className="space-y-1.5 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-64 h-8 rounded-xl bg-brand-light" />
                        <div className="w-16 h-5 rounded-full bg-brand-light/60" />
                    </div>
                    <div className="w-72 h-3.5 rounded bg-brand-light/40" />
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: DETAILS & DIRECTORY */}
                    <div className="lg:col-span-8 space-y-6 animate-pulse">
                        
                        {/* Identitas Perusahaan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-44 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="w-20 h-2.5 rounded bg-brand-light/40" />
                                        <div className="w-24 h-3.5 rounded bg-brand-light" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Direktori Kontak */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
                                <div className="w-40 h-4 rounded bg-brand-light" />
                                <div className="w-20 h-3 rounded bg-brand-light/60" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="p-4 border border-brand-light/60 rounded-2xl bg-gray-50/20 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-light shrink-0" />
                                            <div className="space-y-1">
                                                <div className="w-24 h-3.5 rounded bg-brand-light" />
                                                <div className="w-16 h-2.5 rounded bg-brand-light/60" />
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-7 h-7 rounded-full bg-brand-light" />
                                            <div className="w-7 h-7 rounded-full bg-brand-light" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Alamat Kantor & Logistik */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-48 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-16 h-2.5 rounded bg-brand-light/40" />
                                    <div className="w-48 h-3.5 rounded bg-brand-light" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-20 h-2.5 rounded bg-brand-light/40" />
                                    <div className="w-56 h-3.5 rounded bg-brand-light" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-brand-light/40">
                                <div className="w-28 h-2.5 rounded bg-brand-light/40" />
                                <div className="w-full h-10 rounded bg-brand-light/50" />
                            </div>
                        </div>

                        {/* Minimum Order & Ketentuan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-56 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="w-20 h-2.5 rounded bg-brand-light/40" />
                                        <div className="w-24 h-3.5 rounded bg-brand-light" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lampiran Dokumen */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-40 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="p-3 border border-brand-light/80 rounded-xl bg-white flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded bg-brand-light" />
                                            <div className="space-y-1">
                                                <div className="w-32 h-3 rounded bg-brand-light" />
                                                <div className="w-12 h-2 rounded bg-brand-light/60" />
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 rounded bg-brand-light" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR CONTENT */}
                    <div className="lg:col-span-4 space-y-6 animate-pulse">
                        
                        {/* Nilai Performa Card */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-center flex flex-col items-center">
                            <div className="w-32 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-2 self-stretch" />
                            <div className="w-32 h-32 rounded-full border-[10px] border-brand-light flex items-center justify-center my-3">
                                <div className="space-y-1">
                                    <div className="w-12 h-6 rounded bg-brand-light" />
                                    <div className="w-16 h-3 rounded bg-brand-light/60" />
                                </div>
                            </div>
                            <div className="w-28 h-5 rounded-full bg-brand-light/60 mt-1" />
                            <div className="w-48 h-3.5 rounded bg-brand-light/40 mt-2" />
                            <div className="w-full border-t border-brand-light/50 pt-4 space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <div className="w-20 h-3 rounded bg-brand-light" />
                                            <div className="w-8 h-3 rounded bg-brand-light/80" />
                                        </div>
                                        <div className="w-full h-2 rounded bg-brand-light/40" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Riwayat Purchase Orders */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-48 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-2" />
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex justify-between items-start border-b border-brand-light/30 pb-3 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <div className="w-24 h-3.5 rounded bg-brand-light" />
                                            <div className="w-20 h-2.5 rounded bg-brand-light/60" />
                                        </div>
                                        <div className="w-16 h-5 rounded-full bg-brand-light/50" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Log Aktivitas */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4">
                            <div className="w-32 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-2" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-brand-light/60 shrink-0 mt-1.5" />
                                        <div className="space-y-1 flex-1">
                                            <div className="w-full h-3 rounded bg-brand-light/60" />
                                            <div className="w-24 h-2.5 rounded bg-brand-light/40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Note */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4">
                            <div className="w-24 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-2" />
                            <div className="w-full h-20 rounded-xl bg-gray-50/50 border border-brand-light" />
                            <div className="w-20 h-8 rounded-xl bg-brand-light/60 ml-auto" />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
