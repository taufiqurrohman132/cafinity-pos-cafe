import React from 'react';

export default function ReportsSkeleton() {
    return (
        <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen animate-pulse">
            
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                <div className="space-y-2">
                    <div className="w-56 h-8 rounded-lg bg-brand-light" />
                    <div className="w-96 h-4 rounded-md bg-brand-light/60" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-36 h-10 rounded-xl bg-brand-light" />
                    <div className="w-24 h-10 rounded-xl bg-brand-light" />
                    <div className="w-36 h-10 rounded-xl bg-brand-light/80" />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="w-11 h-11 rounded-xl bg-brand-light" />
                            <div className="w-16 h-5 rounded-full bg-brand-light/40" />
                        </div>
                        <div className="space-y-2">
                            <div className="w-24 h-3 rounded bg-brand-light/80" />
                            <div className="w-36 h-6 rounded-lg bg-brand-light" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* ── LEFT CONTENT SKELETON ── */}
                <div className="xl:col-span-9 space-y-6">
                    
                    {/* Line Chart & Donut Chart Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        
                        {/* Line Chart box */}
                        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <div className="w-48 h-5 rounded bg-brand-light" />
                                    <div className="w-64 h-3.5 rounded bg-brand-light/40" />
                                </div>
                                <div className="w-24 h-6 rounded-full bg-brand-light/50" />
                            </div>
                            <div className="h-48 rounded-xl bg-brand-light/30 flex items-center justify-center">
                                <div className="w-3/4 h-24 border-b border-brand-light border-dashed flex items-end justify-between px-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-4 bg-brand-light/40 rounded-t-sm" style={{ height: `${20 + i * 12}%` }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center gap-5">
                                <div className="w-20 h-4 rounded bg-brand-light/60" />
                                <div className="w-20 h-4 rounded bg-brand-light/60" />
                            </div>
                        </div>

                        {/* Donut Chart box */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="w-36 h-5 rounded bg-brand-light" />
                                <div className="w-44 h-3.5 rounded bg-brand-light/40" />
                            </div>
                            <div className="my-6 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-8 border-brand-light flex items-center justify-center" />
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-light" />
                                            <div className="w-20 h-3 rounded bg-brand-light/60" />
                                        </div>
                                        <div className="w-8 h-3 rounded bg-brand-light" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Produk Terlaris Table */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="w-40 h-5 rounded bg-brand-light" />
                                <div className="w-72 h-3.5 rounded bg-brand-light/40" />
                            </div>
                            <div className="w-28 h-4 rounded bg-brand-light/80" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-brand-light">
                                        {[...Array(5)].map((_, i) => (
                                            <th key={i} className="pb-3">
                                                <div className="w-20 h-3.5 rounded bg-brand-light" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(3)].map((_, rowIndex) => (
                                        <tr key={rowIndex} className="border-b border-brand-light/50 last:border-0">
                                            <td className="py-4">
                                                <div className="w-32 h-4 rounded-lg bg-brand-light" />
                                            </td>
                                            <td className="py-4">
                                                <div className="w-16 h-5 rounded-lg bg-brand-light/50" />
                                            </td>
                                            <td className="py-4">
                                                <div className="w-10 h-4 rounded bg-brand-light/40 mx-auto" />
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="w-20 h-4 rounded bg-brand-light ml-auto" />
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="w-12 h-4 rounded bg-brand-light/60 ml-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Jam Sibuk & Target Bulanan Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Jam Sibuk */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="space-y-2">
                                <div className="w-48 h-5 rounded bg-brand-light" />
                                <div className="w-64 h-3.5 rounded bg-brand-light/40" />
                            </div>
                            <div className="h-40 flex items-end justify-between gap-2 px-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex-1 bg-brand-light/40 rounded-t-lg" style={{ height: `${20 + (i % 3) * 25}%` }} />
                                ))}
                            </div>
                        </div>

                        {/* Target Bulanan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between space-y-6">
                            <div className="space-y-2">
                                <div className="w-48 h-5 rounded bg-brand-light" />
                                <div className="w-64 h-3.5 rounded bg-brand-light/40" />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-28 h-28 rounded-full border-8 border-brand-light flex items-center justify-center" />
                                <div className="space-y-2 w-full text-center">
                                    <div className="w-48 h-4 rounded bg-brand-light mx-auto" />
                                    <div className="w-64 h-3.5 rounded bg-brand-light/40 mx-auto" />
                                </div>
                            </div>
                            <div className="w-full h-10 rounded-xl bg-brand-light/60" />
                        </div>

                    </div>

                </div>

                {/* ── RIGHT SIDEBAR SKELETON ── */}
                <div className="xl:col-span-3 space-y-6">
                    
                    {/* AI Insight */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-3">
                        <div className="w-28 h-4 rounded bg-brand-light" />
                        <div className="w-full h-16 rounded-xl bg-brand-light/40" />
                        <div className="w-32 h-3.5 rounded bg-brand-light/60" />
                    </div>

                    {/* Laporan Terbaru */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="w-36 h-4 rounded bg-brand-light" />
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-brand-light/80 bg-gray-50/50">
                                    <div className="w-9 h-9 rounded-xl bg-brand-light shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="w-28 h-3.5 rounded bg-brand-light" />
                                        <div className="w-16 h-3 rounded bg-brand-light/40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aksi Cepat */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="w-24 h-4 rounded bg-brand-light" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-16 rounded-xl bg-brand-light/40" />
                            <div className="h-16 rounded-xl bg-brand-light/40" />
                        </div>
                    </div>

                    {/* Navigasi Laporan */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="w-36 h-4 rounded bg-brand-light" />
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 rounded-xl bg-brand-light/40" />
                            ))}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
