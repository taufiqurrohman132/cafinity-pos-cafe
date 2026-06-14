import React from 'react';
import { Link } from 'react-router-dom';
import Head from '@/Components/Head';

export default function InventoriesLowStock({ inventories = [] }) {
    return (
        <>
            <Head title="Stok Menipis" />
            <div className="min-h-screen bg-white p-4 md:p-6 animate-in fade-in duration-200">
                <div className="max-w-4xl mx-auto space-y-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/inventories" 
                                className="w-10 h-10 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-black/60 hover:text-black hover:bg-[#E6E6E6] hover:border-[#999999] transition shadow-sm shrink-0 active:scale-95"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div className="space-y-1">
                                <nav className="flex items-center gap-2 text-xs text-black/60 font-semibold">
                                    <Link to="/inventories" className="hover:text-black transition-colors">
                                        Inventori
                                    </Link>
                                    <span className="text-black/40">›</span>
                                    <span className="text-black font-semibold">Stok Menipis</span>
                                </nav>
                                <h1 className="text-2xl sm:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight pt-1">
                                    Stok Menipis
                                </h1>
                                <p className="text-black/60 text-xs mt-1 font-medium">
                                    {inventories.length} item perlu direstok
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 overflow-hidden">
                        {inventories.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-4xl mb-3">✅</p>
                                <p className="font-semibold text-black">Semua stok aman</p>
                                <p className="text-xs text-black/60 mt-1">Tidak ada item yang perlu direstok.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-[#E6E6E6] bg-[#E6E6E6]/20">
                                            {['Nama Bahan', 'Kategori', 'Stok', 'Minimum', 'Supplier', 'Aksi'].map(h => (
                                                <th key={h} className="px-6 py-3.5 text-caption font-semibold text-black/60">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E6E6]/60">
                                        {inventories.map(item => (
                                            <tr key={item.id} className="hover:bg-[#E6E6E6]/40 transition-all">
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-black">{item.name}</p>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-black/60">
                                                    {item.category?.name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide border ${item.stock <= 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                        {item.stock} {item.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-black/60">
                                                    {item.min_stock} {item.unit}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-black/60">
                                                    {item.supplier ? (
                                                        <Link to={`/suppliers/${item.supplier.id}`} className="text-black hover:text-black font-semibold border-b border-[#D0D0D0] hover:border-black transition-all pb-0.5">
                                                            {item.supplier.name}
                                                        </Link>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link to={`/inventories/${item.id}`}
                                                        className="text-xs font-semibold text-black hover:text-black transition-all border-b border-[#D0D0D0] hover:border-black pb-0.5">
                                                        Detail →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
