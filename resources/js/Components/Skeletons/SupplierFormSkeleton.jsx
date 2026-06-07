import React from 'react';

export default function SupplierFormSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
                
                {/* Breadcrumbs & Header */}
                <div className="space-y-2 animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-3 rounded bg-brand-light" />
                        <div className="w-3 h-3 rounded-full bg-brand-light/40" />
                        <div className="w-20 h-3 rounded bg-brand-light/60" />
                    </div>
                    <div className="w-64 h-8 rounded-xl bg-brand-light mt-1" />
                    <div className="w-96 h-4 rounded-lg bg-brand-light/60" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: FORM FIELDS */}
                    <div className="lg:col-span-8 space-y-6 animate-pulse">
                        
                        {/* Card 1: Identitas Perusahaan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-48 h-5 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light" />
                                    <div className="w-32 h-6 rounded bg-brand-light/40" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Informasi Kontak Utama */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-48 h-5 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="space-y-2">
                                <div className="w-36 h-3 rounded bg-brand-light" />
                                <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                            </div>
                            <div className="w-44 h-9 rounded-xl bg-brand-light/50" />
                        </div>

                        {/* Card 3: Detail Logistik & Operasional */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-56 h-5 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="space-y-2">
                                <div className="w-48 h-3 rounded bg-brand-light" />
                                <div className="w-full h-20 rounded-xl bg-brand-light/40" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-16 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-20 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Dokumen & Lampiran */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                            <div className="w-48 h-5 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="space-y-2">
                                <div className="w-36 h-3 rounded bg-brand-light" />
                                <div className="w-full h-20 rounded-xl bg-brand-light/40" />
                            </div>
                            <div className="space-y-3">
                                <div className="w-64 h-3 rounded bg-brand-light" />
                                <div className="w-full h-28 rounded-2xl bg-gray-50/50 border-2 border-dashed border-brand-light flex items-center justify-center" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR SUMMARY & CHECKLIST */}
                    <div className="lg:col-span-4 space-y-6 animate-pulse">
                        
                        {/* Live Preview Summary Card */}
                        <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm overflow-hidden flex flex-col">
                            <div className="h-1.5 bg-brand-light/80" />
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="w-16 h-5 rounded bg-brand-light/60" />
                                    <div className="w-28 h-4 rounded bg-brand-light/40" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-44 h-6 rounded bg-brand-light" />
                                    <div className="flex gap-1">
                                        <div className="w-16 h-4 rounded bg-brand-light/50" />
                                        <div className="w-16 h-4 rounded bg-brand-light/50" />
                                    </div>
                                </div>
                                <div className="space-y-3 border-t border-brand-light/50 pt-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-light/40 shrink-0" />
                                            <div className="space-y-1 flex-1">
                                                <div className="w-8 h-2.5 rounded bg-brand-light/40" />
                                                <div className="w-24 h-3.5 rounded bg-brand-light" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t border-brand-light/50 pt-4">
                                    <div className="h-12 rounded-xl bg-gray-50/50 border border-brand-light/50" />
                                    <div className="h-12 rounded-xl bg-gray-50/50 border border-brand-light/50" />
                                </div>
                                <div className="space-y-2 border-t border-brand-light/50 pt-4">
                                    <div className="w-full h-11 rounded-xl bg-brand-light" />
                                    <div className="w-full h-9 rounded-xl bg-brand-light/50" />
                                </div>
                            </div>
                        </div>

                        {/* Checklist Criteria Widget */}
                        <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                            <div className="w-36 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-2" />
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className="w-4 h-4 rounded-full bg-brand-light shrink-0" />
                                        <div className="w-36 h-3.5 rounded bg-brand-light/60" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help Banner Widget */}
                        <div className="bg-brand-primary/5 rounded-2xl border border-brand-primary/10 p-5 flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-brand-light shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="w-20 h-3 rounded bg-brand-light" />
                                <div className="w-full h-3 rounded bg-brand-light/50" />
                                <div className="w-3/4 h-3 rounded bg-brand-light/50" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
