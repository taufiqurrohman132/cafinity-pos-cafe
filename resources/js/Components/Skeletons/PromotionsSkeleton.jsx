import React from 'react';

export default function PromotionsSkeleton() {
    return (
        <div className="flex-1 overflow-y-auto bg-brand-bg min-h-screen px-6 py-6 space-y-6 animate-pulse">
            
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                <div className="space-y-2">
                    <div className="w-56 h-7 rounded-xl bg-brand-light" />
                    <div className="w-96 h-4 rounded-lg bg-brand-light/60" />
                </div>
                <div className="w-40 h-10 rounded-xl bg-brand-light" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white border border-brand-light p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-brand-light" />
                        <div className="space-y-2 flex-1">
                            <div className="w-24 h-3 bg-brand-light/60 rounded" />
                            <div className="w-20 h-6 bg-brand-light rounded" />
                            <div className="w-16 h-2.5 bg-brand-light/40 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Spotlight Campaign */}
            <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="w-32 h-4.5 bg-brand-light rounded" />
                    <div className="w-24 h-5 bg-brand-light/60 rounded-full" />
                </div>
                <div className="w-48 h-6 bg-brand-light rounded" />
                <div className="w-5/6 h-4 bg-brand-light/40 rounded" />
                
                <div className="grid grid-cols-3 gap-6 max-w-lg pt-5 border-t border-brand-light">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="w-16 h-2.5 bg-brand-light/40 rounded" />
                            <div className="w-24 h-5.5 bg-brand-light rounded" />
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-5">
                    <div className="w-28 h-9 bg-brand-light rounded-xl" />
                    <div className="w-28 h-9 bg-brand-light/60 rounded-xl" />
                </div>
            </div>

            {/* Campaigns Table Card */}
            <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="space-y-1.5">
                        <div className="w-36 h-4.5 bg-brand-light rounded" />
                        <div className="w-64 h-3.5 bg-brand-light/60 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-16 h-8 rounded-lg bg-brand-light/60" />
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-light">
                                {['Nama Promo', 'Potongan', 'Periode', 'Penebusan', 'Total Revenue', 'Status', 'Aksi'].map((h, idx) => (
                                    <th key={idx} className="pb-3">
                                        <div className="h-3.5 bg-brand-light rounded w-16" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-light/50">
                            {[...Array(4)].map((_, i) => (
                                <tr key={i} className="bg-white">
                                    <td className="py-4 space-y-1.5">
                                        <div className="h-4 bg-brand-light rounded w-36" />
                                        <div className="h-2.5 bg-brand-light/60 rounded w-24" />
                                    </td>
                                    <td className="py-4"><div className="h-4 bg-brand-light rounded w-16" /></td>
                                    <td className="py-4"><div className="h-4 bg-brand-light/60 rounded w-28" /></td>
                                    <td className="py-4 pr-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-4 bg-brand-light rounded" />
                                            <div className="flex-1 h-1.5 bg-brand-light/40 rounded-full" />
                                        </div>
                                    </td>
                                    <td className="py-4"><div className="h-4 bg-brand-light rounded w-20" /></td>
                                    <td className="py-4"><div className="h-5 bg-brand-light rounded-full w-14" /></td>
                                    <td className="py-4 text-right">
                                        <div className="w-8 h-8 rounded-lg bg-brand-light/40 ml-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-brand-light/50">
                    <div className="h-3.5 bg-brand-light/60 rounded w-44" />
                    <div className="flex gap-2">
                        <div className="w-24 h-9 bg-brand-light rounded-xl" />
                        <div className="w-24 h-9 bg-brand-light rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-light" />
                        <div className="space-y-1.5">
                            <div className="w-44 h-4 bg-brand-light rounded" />
                            <div className="w-72 h-3 bg-brand-light/60 rounded" />
                        </div>
                    </div>
                    <div className="w-16 h-5 bg-brand-light/60 rounded-full" />
                </div>
                <div className="h-56 rounded-xl bg-gray-50 border border-brand-light/40" />
            </div>

        </div>
    );
}
