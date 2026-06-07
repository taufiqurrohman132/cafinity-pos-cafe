import React from 'react';

export default function TransactionsDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 animate-pulse">
                    <div className="space-y-1">
                        <div className="w-44 h-7 rounded-xl bg-brand-light" />
                        <div className="w-32 h-4 rounded-lg bg-brand-light/60" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-24 h-10 rounded-xl bg-brand-light" />
                        <div className="w-24 h-10 rounded-xl bg-brand-light" />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                            <div className="space-y-1.5">
                                <div className="w-16 h-3 rounded bg-brand-light/40" />
                                <div className="w-36 h-4 rounded bg-brand-light" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="w-16 h-3 rounded bg-brand-light/40" />
                                <div className="w-32 h-4 rounded bg-brand-light" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Items Table Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="w-32 h-5 rounded bg-brand-light" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    {["Menu", "Qty", "Harga", "Subtotal", "Catatan"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left">
                                            <div className="w-12 h-3.5 rounded bg-brand-light/60" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[...Array(3)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="w-40 h-4 rounded bg-brand-light" /></td>
                                        <td className="px-6 py-4"><div className="w-8 h-4 rounded bg-brand-light/60" /></td>
                                        <td className="px-6 py-4"><div className="w-16 h-4 rounded bg-brand-light/60" /></td>
                                        <td className="px-6 py-4"><div className="w-20 h-4 rounded bg-brand-light" /></td>
                                        <td className="px-6 py-4"><div className="w-16 h-4 rounded bg-brand-light/40" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals + Kitchen */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
                    
                    {/* Ringkasan */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:col-span-2 space-y-4">
                        <div className="w-24 h-5 rounded bg-brand-light border-b border-gray-50 pb-2 self-stretch" />
                        <div className="space-y-2.5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="w-20 h-4 rounded bg-brand-light/50" />
                                    <div className="w-24 h-4 rounded bg-brand-light/60" />
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                                <div className="w-24 h-5 rounded bg-brand-light" />
                                <div className="w-28 h-5 rounded bg-brand-light" />
                            </div>
                        </div>
                    </div>

                    {/* Kitchen Order */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                        <div className="w-32 h-5 rounded bg-brand-light border-b border-gray-50 pb-2 self-stretch" />
                        <div className="space-y-1.5">
                            <div className="w-16 h-3 rounded bg-brand-light/40" />
                            <div className="w-24 h-4 rounded bg-brand-light/60" />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-gray-50">
                            <div className="w-16 h-3 rounded bg-brand-light/40" />
                            <div className="space-y-2">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="w-32 h-4 rounded bg-brand-light/50" />
                                        <div className="w-8 h-4 rounded bg-brand-light/60" />
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
