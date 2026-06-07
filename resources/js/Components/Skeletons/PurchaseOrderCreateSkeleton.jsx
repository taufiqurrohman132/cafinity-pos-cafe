import React from 'react';

export default function PurchaseOrderCreateSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-pulse">
            <div className="max-w-[1280px] mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-light shrink-0" />
                        <div className="space-y-2">
                            <div className="w-64 h-7 rounded-lg bg-brand-light" />
                            <div className="w-96 h-4 rounded-md bg-brand-light/60" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-6 rounded-full bg-brand-light/60" />
                        <div className="w-28 h-3.5 rounded bg-brand-light/40" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* ── LEFT COLUMN SKELETON ── */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Informasi Pemasok */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
                                <div className="w-36 h-4 rounded bg-brand-light" />
                                <div className="w-32 h-3.5 rounded bg-brand-light/60" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-6 space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="md:col-span-6 h-24 rounded-xl bg-gray-50/50 border border-brand-light border-dashed p-4 flex flex-col justify-center space-y-2">
                                    <div className="w-20 h-2.5 rounded bg-brand-light" />
                                    <div className="w-36 h-3 rounded bg-brand-light/40" />
                                    <div className="w-28 h-3 rounded bg-brand-light/40" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Detail Pesanan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-32 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="w-16 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-16 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-28 h-3 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {/* 3. Item Pesanan Table */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b border-brand-light/40 pb-3">
                                <div className="w-28 h-4 rounded bg-brand-light" />
                                <div className="w-32 h-8 rounded-lg bg-brand-light/40" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[750px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-brand-light">
                                            {[...Array(8)].map((_, i) => (
                                                <th key={i} className="px-4 py-3">
                                                    <div className="w-16 h-3 rounded bg-brand-light" />
                                                </th>
                                            ))}
                                            <th className="px-3 py-3 w-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-light/50">
                                        {[...Array(2)].map((_, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td className="px-4 py-3">
                                                    <div className="w-full h-9 rounded-lg bg-brand-light/60" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-full h-9 rounded-lg bg-brand-light/40" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-12 h-9 rounded-lg bg-brand-light/30" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-12 h-9 rounded-lg bg-brand-light/60" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-20 h-9 rounded-lg bg-brand-light/40" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-12 h-9 rounded-lg bg-brand-light/30" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-10 h-7 rounded-lg bg-brand-light/40" />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="w-16 h-4 rounded bg-brand-light ml-auto" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="w-6 h-6 rounded bg-brand-light/40" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-32 h-5 rounded bg-brand-light/80" />
                        </div>

                        {/* 4. Catatan & Ketentuan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-3">
                            <div className="w-36 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-24 rounded-xl bg-brand-light/40" />
                        </div>

                        {/* 5. Lampiran Pendukung */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-3">
                            <div className="w-36 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-32 rounded-2xl border-2 border-dashed border-brand-light bg-gray-50/50 flex flex-col items-center justify-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-brand-light/60" />
                                <div className="w-32 h-3.5 rounded bg-brand-light" />
                                <div className="w-24 h-3 rounded bg-brand-light/40" />
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN SKELETON ── */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* 1. Ringkasan Biaya */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden flex flex-col">
                            <div className="h-1.5 bg-brand-light" />
                            <div className="p-6 space-y-6">
                                <div className="w-32 h-4 rounded bg-brand-light" />
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-16 h-3.5 rounded bg-brand-light/60" />
                                        <div className="w-20 h-3.5 rounded bg-brand-light" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="w-28 h-3.5 rounded bg-brand-light/60" />
                                        <div className="w-16 h-8 rounded-lg bg-brand-light/40" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="w-24 h-3.5 rounded bg-brand-light/60" />
                                        <div className="w-20 h-3.5 rounded bg-brand-light" />
                                    </div>
                                    <div className="flex justify-between items-center border-b border-brand-light/40 pb-4">
                                        <div className="w-20 h-3.5 rounded bg-brand-light/60" />
                                        <div className="w-20 h-8 rounded-lg bg-brand-light/40" />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="w-24 h-4.5 rounded bg-brand-light" />
                                        <div className="w-28 h-6 rounded-lg bg-brand-light/80" />
                                    </div>
                                </div>
                                <div className="space-y-2.5 pt-2">
                                    <div className="w-full h-11 rounded-xl bg-brand-light" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-10 rounded-xl bg-brand-light/40" />
                                        <div className="h-10 rounded-xl bg-brand-light/40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Checklist Validasi */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-28 h-3.5 rounded bg-brand-light" />
                                <div className="w-4 h-4 rounded-full bg-brand-light/60" />
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-brand-light shrink-0" />
                                        <div className="w-44 h-3.5 rounded bg-brand-light/60" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
