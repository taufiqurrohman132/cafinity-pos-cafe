import React from 'react';

export default function MenusSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-pulse">
            <div className="space-y-6 max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="w-48 h-7 rounded-xl bg-brand-light" />
                        <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-10 rounded-xl bg-brand-light/40" />
                        <div className="w-36 h-10 rounded-xl bg-brand-light" />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-brand-light shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-64 h-10 bg-brand-light/60 rounded-xl" />
                            <div className="w-32 h-10 bg-brand-light/50 rounded-xl" />
                            <div className="w-20 h-10 bg-brand-light rounded-xl" />
                        </div>
                        
                        {/* Category pills */}
                        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx} className="w-16 h-8 rounded-full bg-brand-light/60" />
                            ))}
                        </div>
                    </div>
                    
                    {/* View toggle mockup */}
                    <div className="w-20 h-10 bg-brand-light/40 rounded-xl shrink-0" />
                </div>

                {/* Table Block */}
                <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-brand-bg/50 border-b border-brand-light">
                                    {['Foto', 'Nama Menu', 'Kategori', 'Harga Jual', 'HPP', 'Margin', 'Status', 'Aksi'].map((h, idx) => (
                                        <th key={idx} className="px-6 py-3">
                                            <div className="h-3.5 bg-brand-light rounded w-16" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-light/50">
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="bg-white">
                                        {/* Foto */}
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 bg-brand-light rounded-xl" />
                                        </td>
                                        {/* Nama */}
                                        <td className="px-6 py-4 space-y-1.5">
                                            <div className="h-3.5 bg-brand-light rounded w-36" />
                                            <div className="h-2.5 bg-brand-light/60 rounded w-24" />
                                        </td>
                                        {/* Kategori */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-brand-light/60 rounded w-20" />
                                        </td>
                                        {/* Harga */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-brand-light rounded w-16" />
                                        </td>
                                        {/* HPP */}
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-brand-light/60 rounded w-16" />
                                        </td>
                                        {/* Margin */}
                                        <td className="px-6 py-4">
                                            <div className="h-5 bg-brand-light rounded-full w-12" />
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="h-5 bg-brand-light rounded-full w-16" />
                                        </td>
                                        {/* Aksi */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <div className="w-8 h-8 rounded-xl bg-brand-light/40" />
                                                <div className="w-8 h-8 rounded-xl bg-brand-light/40" />
                                                <div className="w-8 h-8 rounded-xl bg-brand-light/40" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-brand-light/50 bg-brand-bg/30">
                        <div className="h-3.5 bg-brand-light/60 rounded w-44" />
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-9 bg-brand-light rounded-xl" />
                            <div className="w-9 h-9 rounded-xl bg-brand-light/50" />
                            <div className="w-9 h-9 rounded-xl bg-brand-light/50" />
                            <div className="w-24 h-9 bg-brand-light rounded-xl" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
