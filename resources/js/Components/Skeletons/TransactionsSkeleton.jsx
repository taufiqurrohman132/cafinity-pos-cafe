import React from 'react';

export default function TransactionsSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-6 md:p-8 animate-pulse">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="w-56 h-7 rounded-xl bg-brand-light" />
                        <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-36 h-10 rounded-xl bg-brand-light" />
                        <div className="w-44 h-10 rounded-xl bg-brand-light/60" />
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl bg-brand-light" />
                                <div className="w-14 h-5 bg-brand-light rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-3.5 bg-brand-light/60 rounded w-24" />
                                <div className="h-6.5 bg-brand-light rounded w-36" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                    {/* Table Controls (Filters) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-brand-light/50">
                        <div className="w-32 h-5 rounded bg-brand-light" />
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="w-[200px] h-[38px] rounded-xl bg-brand-light/60" />
                            <div className="w-32 h-[38px] rounded-xl bg-brand-light/50" />
                            <div className="w-32 h-[38px] rounded-xl bg-brand-light/50" />
                            <div className="w-16 h-[38px] rounded-xl bg-brand-light" />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-brand-light bg-gradient-to-r from-brand-bg to-brand-light/20">
                                    {['Invoice', 'Waktu', 'Kasir', 'Item', 'Total', 'Metode', 'Status'].map((h, idx) => (
                                        <th key={idx} className="px-6 py-4">
                                            <div className="h-3 bg-brand-light rounded w-16" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-light/50">
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="bg-white">
                                        <td className="px-6 py-4"><div className="h-4 bg-brand-light rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-3.5 bg-brand-light/60 rounded w-12" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-brand-light rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-brand-light/60 rounded w-14" /></td>
                                        <td className="px-6 py-4"><div className="h-4.5 bg-brand-light rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-brand-light/60 rounded w-12" /></td>
                                        <td className="px-6 py-4"><div className="h-5 bg-brand-light rounded-full w-16" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-brand-light/50 bg-gradient-to-r from-brand-bg to-brand-light/10">
                        <div className="h-4 bg-brand-light/60 rounded w-44" />
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-8 bg-brand-light rounded-xl" />
                            <div className="w-24 h-8 bg-brand-light rounded-xl" />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
