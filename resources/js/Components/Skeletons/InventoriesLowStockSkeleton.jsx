import React from 'react';

export default function InventoriesLowStockSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-9 h-9 rounded-xl border border-brand-light bg-white shrink-0" />
                    <div className="space-y-1.5">
                        <div className="w-48 h-6 rounded bg-brand-light" />
                        <div className="w-32 h-3.5 rounded bg-brand-light/60" />
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden animate-pulse">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="border-b border-brand-light bg-brand-bg">
                                    {['Nama Bahan', 'Kategori', 'Stok', 'Minimum', 'Supplier', 'Aksi'].map(h => (
                                        <th key={h} className="px-5 py-3">
                                            <div className="w-16 h-3 rounded bg-brand-light" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-light/50">
                                {[...Array(4)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-4"><div className="w-32 h-4.5 rounded bg-brand-light" /></td>
                                        <td className="px-5 py-4"><div className="w-20 h-4 rounded bg-brand-light/60" /></td>
                                        <td className="px-5 py-4"><div className="w-16 h-4.5 rounded bg-brand-light" /></td>
                                        <td className="px-5 py-4"><div className="w-20 h-4 rounded bg-brand-light/60" /></td>
                                        <td className="px-5 py-4"><div className="w-28 h-4 rounded bg-brand-light/60" /></td>
                                        <td className="px-5 py-4"><div className="w-12 h-3.5 rounded bg-brand-light/70" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
