import React from 'react';

export default function PurchaseOrderShowSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-pulse">
            <div className="max-w-[1280px] mx-auto space-y-6">
                
                {/* Top Header Actions Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-light shrink-0" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-48 h-7 rounded-lg bg-brand-light" />
                                <div className="w-24 h-5 rounded-full bg-brand-light/60" />
                            </div>
                            <div className="w-64 h-3.5 rounded bg-brand-light/40" />
                        </div>
                    </div>

                    {/* Top Actions */}
                    <div className="flex items-center gap-2.5 self-start md:self-center">
                        <div className="w-24 h-10 rounded-xl bg-brand-light" />
                        <div className="w-24 h-10 rounded-xl bg-brand-light" />
                        <div className="w-16 h-10 rounded-xl bg-brand-light/60" />
                        <div className="w-28 h-10 rounded-xl bg-brand-light/80" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* ── LEFT COLUMN SKELETON ── */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. Informasi Pengiriman & Supplier Card */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                            <div className="w-64 h-4 rounded bg-brand-light" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Supplier Card */}
                                <div className="bg-brand-bg border border-brand-light rounded-xl p-4 flex gap-3.5">
                                    <div className="w-10 h-10 rounded-lg bg-brand-light shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="w-16 h-2.5 rounded bg-brand-light/60" />
                                        <div className="w-36 h-3.5 rounded bg-brand-light" />
                                        <div className="w-full h-3 rounded bg-brand-light/40" />
                                    </div>
                                </div>

                                {/* Shipping Address Card */}
                                <div className="bg-brand-bg border border-brand-light rounded-xl p-4 flex gap-3.5">
                                    <div className="w-10 h-10 rounded-lg bg-brand-light shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="w-36 h-2.5 rounded bg-brand-light/60" />
                                        <div className="w-48 h-3.5 rounded bg-brand-light" />
                                        <div className="w-full h-3 rounded bg-brand-light/40" />
                                    </div>
                                </div>
                            </div>

                            {/* Metadata metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-brand-light/50">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="w-24 h-2.5 rounded bg-brand-light/40" />
                                        <div className="w-28 h-3.5 rounded bg-brand-light/80" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Rincian Barang & Jasa Table */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
                                <div className="w-48 h-4 rounded bg-brand-light" />
                                <div className="w-32 h-9 rounded-xl bg-brand-light/60" />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-brand-light">
                                            {[...Array(7)].map((_, i) => (
                                                <th key={i} className="px-4 py-3">
                                                    <div className="w-16 h-3 rounded bg-brand-light" />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-light/50">
                                        {[...Array(3)].map((_, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td className="px-4 py-4">
                                                    <div className="w-32 h-4 rounded-lg bg-brand-light" />
                                                    <div className="w-16 h-3 rounded bg-brand-light/40 mt-1" />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="w-8 h-4 rounded bg-brand-light ml-auto mr-auto" />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="w-12 h-6 rounded bg-brand-light/40 ml-auto mr-auto" />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="w-10 h-4 rounded bg-brand-light/40" />
                                                </td>
                                                <td className="px-3 py-4 text-right">
                                                    <div className="w-20 h-4 rounded bg-brand-light ml-auto" />
                                                </td>
                                                <td className="px-3 py-4 text-right">
                                                    <div className="w-16 h-4 rounded bg-brand-light/40 ml-auto" />
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="w-24 h-4 rounded bg-brand-light ml-auto" />
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Cost Calculations */}
                                        <tr className="border-t border-brand-light">
                                            <td colSpan="6" className="px-6 py-4 text-right">
                                                <div className="w-48 h-3 rounded bg-brand-light/60 ml-auto" />
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="w-24 h-4 rounded bg-brand-light/80 ml-auto" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-right">
                                                <div className="w-28 h-3 rounded bg-brand-light/60 ml-auto" />
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="w-24 h-4 rounded bg-brand-light/80 ml-auto" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-right">
                                                <div className="w-44 h-3.5 rounded bg-brand-light/60 ml-auto" />
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="w-28 h-5 rounded-lg bg-brand-light ml-auto" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Terms & Notes under table */}
                            <div className="pt-4 border-t border-brand-light/50 space-y-2">
                                <div className="w-32 h-3 rounded bg-brand-light" />
                                <div className="w-full h-16 rounded-xl bg-gray-50/50 border border-brand-light" />
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN SKELETON ── */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 1. Status Persetujuan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                            <div className="w-36 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />

                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-brand-light">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="relative pl-8">
                                        <span className="absolute left-0 top-1.5 w-4 h-4 bg-brand-light border-4 border-white rounded-full"></span>
                                        <div className="space-y-2">
                                            <div className="w-24 h-3.5 rounded bg-brand-light" />
                                            <div className="w-40 h-3 rounded bg-brand-light/40" />
                                            <div className="w-16 h-5 rounded bg-brand-light/30" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Jejak Audit & Aktivitas */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                            <div className="w-44 h-4 rounded bg-brand-light border-b border-brand-light/40 pb-3" />

                            <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-brand-light">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="relative pl-8">
                                        <span className="absolute left-0 top-1.5 w-4 h-4 bg-brand-light border-4 border-white rounded-full"></span>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1.5 flex-1">
                                                <div className="w-36 h-3.5 rounded bg-brand-light/80" />
                                                <div className="w-24 h-3 rounded bg-brand-light/40" />
                                            </div>
                                            <div className="w-20 h-3 rounded bg-brand-light/30" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="w-36 h-4 rounded bg-brand-light/60 mx-auto" />
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
