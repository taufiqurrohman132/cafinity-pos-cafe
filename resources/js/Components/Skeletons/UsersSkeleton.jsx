import React from 'react';

export default function UsersSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* ── MAIN ── */}
                <div className="xl:col-span-9 space-y-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                        <div className="space-y-2">
                            <div className="w-48 h-7 rounded-xl bg-brand-light" />
                            <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-28 h-10 rounded-xl bg-brand-light" />
                            <div className="w-40 h-10 rounded-xl bg-brand-light" />
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <div className="w-20 h-3.5 rounded bg-brand-light" />
                                    <div className="w-12 h-7 rounded bg-brand-light" />
                                    <div className="w-24 h-3 rounded bg-brand-light/60" />
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-brand-light flex-shrink-0" />
                            </div>
                        ))}
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden animate-pulse">
                        {/* Toolbar */}
                        <div className="px-5 py-4 border-b border-brand-light flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-brand-bg/50">
                            <div className="w-full sm:max-w-sm h-11 rounded-xl bg-brand-light" />
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="w-28 h-11 rounded-xl bg-brand-light" />
                                <div className="w-28 h-11 rounded-xl bg-brand-light" />
                                <div className="w-20 h-11 rounded-xl bg-brand-light" />
                                <div className="w-16 h-11 rounded-xl bg-brand-light/50" />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[640px]">
                                <thead>
                                    <tr className="border-b border-brand-light bg-white">
                                        {['Nama Pengguna', 'Role', 'Bergabung', 'Status', 'Aksi'].map((h, i) => (
                                            <th key={i} className="px-5 py-4 text-xs font-bold text-brand-primary/50">
                                                <div className="w-16 h-3 rounded bg-brand-light" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light/50 bg-white">
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i} className="hover:bg-brand-light/20 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-light flex-shrink-0" />
                                                    <div className="space-y-1.5">
                                                        <div className="w-32 h-4 rounded bg-brand-light" />
                                                        <div className="w-48 h-3 rounded bg-brand-light/60" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="w-20 h-6 rounded-lg bg-brand-light" />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="w-24 h-4 rounded bg-brand-light" />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="w-20 h-6 rounded-md bg-brand-light" />
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="w-8 h-8 rounded-xl bg-brand-light ml-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-brand-light bg-brand-bg/50 gap-4">
                            <div className="w-48 h-4 rounded bg-brand-light" />
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-lg bg-brand-light" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
                <div className="xl:col-span-3 space-y-6">

                    {/* Ringkasan Tim */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 animate-pulse">
                        <div className="w-32 h-5 rounded bg-brand-light mb-1" />
                        <div className="w-40 h-3 rounded bg-brand-light/60 mb-5" />
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border border-brand-light rounded-xl p-4 flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="w-16 h-2 rounded bg-brand-light/60" />
                                        <div className="w-8 h-6 rounded bg-brand-light" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-brand-light" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aktivitas Terakhir */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 animate-pulse">
                        <div className="w-36 h-5 rounded bg-brand-light mb-5" />
                        <div className="space-y-4 relative">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-3 h-3 rounded-full bg-brand-light mt-1.5 shrink-0" />
                                    <div className="bg-brand-bg border border-brand-light p-3 rounded-xl w-full space-y-2">
                                        <div className="w-24 h-3.5 rounded bg-brand-light" />
                                        <div className="w-44 h-3 rounded bg-brand-light/60" />
                                        <div className="w-16 h-2 rounded bg-brand-light/40 mt-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
