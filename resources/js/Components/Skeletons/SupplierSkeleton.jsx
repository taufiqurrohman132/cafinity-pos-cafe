import React from 'react';

export default function SupplierSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg">
            <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* ── MAIN AREA ── */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                            <div className="space-y-2">
                                <div className="w-48 h-8 rounded-xl bg-brand-light" />
                                <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                            </div>
                            <div className="w-36 h-10 rounded-xl bg-brand-light" />
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex justify-between items-start">
                                    <div className="space-y-3 flex-1">
                                        <div className="w-24 h-3 rounded bg-brand-light" />
                                        <div className="w-16 h-7 rounded bg-brand-light" />
                                        <div className="w-28 h-3 rounded bg-brand-light/60" />
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-brand-light shrink-0" />
                                </div>
                            ))}
                        </div>

                        {/* Table Control and Table Card */}
                        <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm overflow-hidden animate-pulse">
                            
                            {/* Toolbar */}
                            <div className="p-4 md:p-5 border-b border-brand-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                                    <div className="w-full sm:max-w-xs h-10 rounded-xl bg-brand-light" />
                                    <div className="w-24 h-10 rounded-xl bg-brand-light" />
                                </div>
                                <div className="w-28 h-10 rounded-xl bg-brand-light" />
                            </div>

                            {/* Supplier Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-brand-light/60">
                                            <th className="px-6 py-4 w-12 text-center">
                                                <div className="w-4 h-4 rounded bg-brand-light mx-auto" />
                                            </th>
                                            {['Nama Supplier', 'Kategori', 'Kontak Utama', 'Lead Time', 'Rating', 'Status', 'Aksi'].map((h, i) => (
                                                <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400">
                                                    <div className="w-16 h-3 rounded bg-brand-light" />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-light/45 bg-white">
                                        {[...Array(5)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="w-4 h-4 rounded bg-brand-light mx-auto" />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1.5">
                                                        <div className="w-32 h-4.5 rounded bg-brand-light" />
                                                        <div className="w-20 h-3 rounded bg-brand-light/60" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-24 h-4 rounded bg-brand-light" />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1.5">
                                                        <div className="w-28 h-4 rounded bg-brand-light" />
                                                        <div className="w-16 h-3 rounded bg-brand-light/60" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-4 rounded bg-brand-light" />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-20 h-4 rounded bg-brand-light" />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-6 rounded-full bg-brand-light/60" />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-brand-light" />
                                                        <div className="w-8 h-8 rounded-lg bg-brand-light" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-brand-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="w-44 h-4 rounded bg-brand-light" />
                                <div className="flex gap-1.5">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-xl bg-brand-light" />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── SIDEBAR AREA ── */}
                    <div className="lg:col-span-3 space-y-6 animate-pulse">
                        
                        {/* Aktivitas Terbaru */}
                        <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-28 h-4 rounded bg-brand-light" />
                                <div className="w-16 h-3 rounded bg-brand-light/50" />
                            </div>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-brand-light shrink-0" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="w-full h-3.5 rounded bg-brand-light" />
                                            <div className="w-16 h-2 rounded bg-brand-light/60" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips Admin Widget */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex gap-3.5">
                            <div className="w-6 h-6 rounded bg-brand-light shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="w-20 h-3.5 rounded bg-brand-light" />
                                <div className="w-full h-3 rounded bg-brand-light/50" />
                                <div className="w-5/6 h-3 rounded bg-brand-light/50" />
                            </div>
                        </div>

                        {/* Aksi Cepat */}
                        <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                            <div className="w-24 h-4 rounded bg-brand-light" />
                            <div className="space-y-2.5">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-11 rounded-xl border border-brand-light bg-white" />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
