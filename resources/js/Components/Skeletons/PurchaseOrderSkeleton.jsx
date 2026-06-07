import React from 'react';

export default function PurchaseOrderSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg animate-pulse">
            <div className="grid grid-cols-1 xl:grid-cols-12">
                
                {/* ── MAIN CONTENT SKELETON ── */}
                <div className="xl:col-span-9 p-4 md:p-6 space-y-6">
                    
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="w-56 h-7 rounded-lg bg-brand-light" />
                            <div className="w-96 h-4 rounded-md bg-brand-light/60" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="w-24 h-10 rounded-xl bg-brand-light" />
                            <div className="w-28 h-10 rounded-xl bg-brand-light" />
                            <div className="w-36 h-10 rounded-xl bg-brand-light/80" />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-brand-light shadow-sm p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3 flex-1">
                                        <div className="w-36 h-3 rounded bg-brand-light" />
                                        <div className="w-16 h-7 rounded-lg bg-brand-light/80" />
                                        <div className="w-28 h-3.5 rounded bg-brand-light/40" />
                                    </div>
                                    <div className="w-11 h-11 rounded-xl bg-brand-light shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                        
                        {/* Table Header Controls */}
                        <div className="px-6 py-5 border-b border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="w-full lg:w-96 h-10 rounded-xl bg-brand-light/60" />
                            <div className="w-36 h-10 rounded-xl bg-brand-light/40" />
                        </div>

                        {/* Table Element */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[900px]">
                                <thead>
                                    <tr className="bg-brand-bg border-b border-brand-light">
                                        <th className="pl-6 pr-3 py-3 w-4">
                                            <div className="w-4 h-4 rounded bg-brand-light" />
                                        </th>
                                        {[...Array(8)].map((_, i) => (
                                            <th key={i} className="px-6 py-4">
                                                <div className="w-20 h-3.5 rounded bg-brand-light" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light bg-white">
                                    {[...Array(5)].map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td className="pl-6 pr-3 py-4">
                                                <div className="w-4 h-4 rounded bg-brand-light/60" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-4 rounded-lg bg-brand-light" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-20 h-4 rounded bg-brand-light/40" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-28 h-4 rounded bg-brand-light" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-20 h-4 rounded bg-brand-light/80" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-20 h-4 rounded bg-brand-light/40" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-6 rounded-full bg-brand-light/60" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-4 rounded bg-brand-light/50" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-light/40" />
                                                    <div className="w-8 h-8 rounded-lg bg-brand-light/40" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 border-t border-brand-light flex items-center justify-between bg-white">
                            <div className="w-48 h-3.5 rounded bg-brand-light/60" />
                            <div className="flex items-center gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-7 h-7 rounded-lg bg-brand-light/40" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SIDEBAR SKELETON ── */}
                <div className="xl:col-span-3 border-l border-brand-light bg-white p-4 md:p-6 space-y-6">
                    
                    {/* Recent Activity Log */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="w-28 h-4 rounded bg-brand-light" />
                            <div className="w-16 h-3 rounded bg-brand-light/60" />
                        </div>
                        <div className="space-y-5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-4 h-4 rounded-full bg-brand-light shrink-0 mt-0.5" />
                                    <div className="space-y-2 flex-1">
                                        <div className="w-44 h-3.5 rounded bg-brand-light/80" />
                                        <div className="w-20 h-3 rounded bg-brand-light/40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Announcements */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="w-36 h-4 rounded bg-brand-light" />
                        <div className="h-16 rounded-xl bg-rose-50/50 border border-brand-light" />
                        <div className="w-full h-10 rounded-xl bg-brand-light" />
                    </div>

                </div>
            </div>
        </div>
    );
}
