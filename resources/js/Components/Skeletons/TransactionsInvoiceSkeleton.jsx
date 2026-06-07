import React from 'react';

export default function TransactionsInvoiceSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6 animate-pulse">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="w-24 h-7 rounded-xl bg-brand-light" />
                        <div className="w-56 h-4 rounded-lg bg-brand-light/60" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-28 h-10 rounded-xl bg-brand-light" />
                        <div className="w-24 h-10 rounded-xl bg-brand-light" />
                    </div>
                </div>

                {/* ── Invoice Card ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    
                    {/* Kasir & Metode */}
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between gap-4">
                        <div className="space-y-2">
                            <div className="w-12 h-3.5 rounded bg-brand-light" />
                            <div className="w-24 h-4 rounded bg-brand-light/60" />
                        </div>
                        <div className="space-y-2 text-right">
                            <div className="w-12 h-3.5 rounded bg-brand-light ml-auto" />
                            <div className="w-20 h-4 rounded bg-brand-light/60 ml-auto" />
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="px-6 py-5">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {['Item', 'Qty', 'Harga', 'Subtotal'].map((h, i) => (
                                            <th key={h} className={`py-3 text-[11px] font-bold text-gray-400 capitalize tracking-wider ${i === 3 ? 'text-right' : 'text-left'}`}>
                                                <div className={`w-12 h-3 rounded bg-brand-light ${i === 3 ? 'ml-auto' : ''}`} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="py-4 pr-3">
                                                <div className="w-32 h-4 rounded bg-brand-light" />
                                            </td>
                                            <td className="py-4">
                                                <div className="w-8 h-4 rounded bg-brand-light" />
                                            </td>
                                            <td className="py-4">
                                                <div className="w-16 h-4 rounded bg-brand-light" />
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="w-20 h-4 rounded bg-brand-light ml-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 w-full max-w-xs ml-auto">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="w-16 h-4 rounded bg-brand-light" />
                                    <div className="w-16 h-4 rounded bg-brand-light/60" />
                                </div>
                            ))}
                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                <div className="w-16 h-4 rounded bg-brand-light" />
                                <div className="w-20 h-5 rounded bg-brand-light" />
                            </div>
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="w-16 h-4 rounded bg-brand-light" />
                                    <div className="w-20 h-4 rounded bg-brand-light/60" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center">
                        <div className="w-32 h-4 rounded bg-brand-light" />
                    </div>

                </div>

            </div>
        </div>
    );
}
