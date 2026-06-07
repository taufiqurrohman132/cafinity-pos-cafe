import React from 'react';

export default function InventoriesSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg animate-pulse">
            <div className="grid grid-cols-1 xl:grid-cols-12">
                
                {/* ── MAIN CONTENT SKELETON ── */}
                <div className="xl:col-span-9 p-4 md:p-6 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="w-48 h-7 rounded-xl bg-brand-light" />
                            <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="w-32 h-10 rounded-xl bg-brand-light/60" />
                            <div className="w-36 h-10 rounded-xl bg-brand-light" />
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <div className="w-28 h-3.5 bg-brand-light/60 rounded" />
                                    <div className="w-24 h-6 bg-brand-light rounded" />
                                    <div className="w-20 h-3 bg-brand-light/40 rounded" />
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-brand-light/80" />
                            </div>
                        ))}
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-5 border-b border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="w-32 h-5 rounded bg-brand-light" />
                            <div className="w-64 h-10 rounded-xl bg-brand-light/60" />
                        </div>

                        {/* Table View */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-brand-light bg-brand-bg">
                                        {['Nama Bahan', 'Kategori', 'Stok Saat Ini', 'Satuan', 'Harga/Satuan', 'Status', 'Aksi'].map((h, idx) => (
                                            <th key={idx} className="px-6 py-3">
                                                <div className="h-3.5 bg-brand-light rounded w-16" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light/50">
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i} className="bg-white">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-brand-light/50" />
                                                    <div className="w-28 h-4 bg-brand-light rounded" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-5 rounded-full bg-brand-light/60" />
                                            </td>
                                            <td className="px-6 py-4 space-y-1.5">
                                                <div className="w-24 h-3 bg-brand-light rounded" />
                                                <div className="w-28 h-1.5 rounded-full bg-brand-light" />
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 bg-brand-light/60 rounded w-12" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-brand-light rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-5 bg-brand-light rounded-full w-14" /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-light/45" />
                                                    <div className="w-8 h-8 rounded-lg bg-brand-light/45" />
                                                    <div className="w-8 h-8 rounded-lg bg-brand-light/45" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 border-t border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                            <div className="h-3.5 bg-brand-light/60 rounded w-44" />
                            <div className="flex items-center gap-4">
                                <div className="w-28 h-4 bg-brand-light/60 rounded" />
                                <div className="flex gap-1">
                                    <div className="w-12 h-6 bg-brand-light rounded-lg" />
                                    <div className="w-12 h-6 bg-brand-light rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SIDEBAR SKELETON ── */}
                <div className="xl:col-span-3 border-l border-brand-light bg-white p-4 md:p-6 space-y-6">
                    {/* Quick Actions */}
                    <div className="space-y-3">
                        <div className="w-24 h-3.5 bg-brand-light rounded" />
                        <div className="w-full h-16 rounded-xl bg-brand-light" />
                        <div className="w-full h-16 rounded-xl bg-brand-light/60" />
                    </div>

                    {/* Activity Logs */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="w-24 h-3.5 bg-brand-light rounded" />
                            <div className="w-10 h-3 bg-brand-light/60 rounded" />
                        </div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="pl-3 border-l-2 border-brand-light space-y-1">
                                <div className="h-3 bg-brand-light rounded w-28" />
                                <div className="h-2.5 bg-brand-light/60 rounded w-36" />
                            </div>
                        ))}
                    </div>

                    {/* Tips Card */}
                    <div className="bg-brand-light border border-brand-light rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-light/80" />
                            <div className="w-28 h-4 bg-brand-light rounded" />
                        </div>
                        <div className="w-5/6 h-3 bg-brand-light/60 rounded" />
                        <div className="w-2/3 h-3 bg-brand-light/60 rounded" />
                    </div>
                </div>

            </div>
        </div>
    );
}
