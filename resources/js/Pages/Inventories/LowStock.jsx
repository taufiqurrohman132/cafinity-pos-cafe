import React from 'react';
import { Link } from 'react-router-dom';
import Head from '@/Components/Head';

export default function InventoriesLowStock({ inventories = [] }) {
    return (
        <>
            <Head title="Stok Menipis" />
            <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-in fade-in duration-200">
                <div className="max-w-4xl mx-auto space-y-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/inventories" 
                                className="w-10 h-10 rounded-full bg-white border border-brand-light flex items-center justify-center text-brand-primary/60 hover:text-brand-primary hover:border-brand-primary transition shadow-sm shrink-0"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div className="space-y-1">
                                <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-primary/60 font-medium">
                                    <Link to="/inventories" className="hover:text-brand-primary transition-colors">
                                        Inventori
                                    </Link>
                                    <span className="text-brand-primary/40">›</span>
                                    <span className="text-brand-dark font-bold">Stok Menipis</span>
                                </nav>
                                <h1 className="text-2xl sm:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight pt-1">
                                    Stok Menipis
                                </h1>
                                <p className="text-gray-500 text-xs mt-1">
                                    {inventories.length} item perlu direstok
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                        {inventories.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-4xl mb-3">✅</p>
                                <p className="font-bold text-brand-dark">Semua stok aman</p>
                                <p className="text-sm text-gray-400 mt-1">Tidak ada item yang perlu direstok.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-brand-light bg-brand-bg">
                                            {['Nama Bahan', 'Kategori', 'Stok', 'Minimum', 'Supplier', 'Aksi'].map(h => (
                                                <th key={h} className="px-5 py-3 text-xs font-bold text-brand-primary/70">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-light/50">
                                        {inventories.map(item => (
                                            <tr key={item.id} className="hover:bg-brand-bg transition">
                                                <td className="px-5 py-4">
                                                    <p className="font-bold text-brand-dark">{item.name}</p>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500">
                                                    {item.category?.name ?? '-'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="font-bold text-red-500">{item.stock}</span>
                                                    <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{item.min_stock} {item.unit}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500">
                                                    {item.supplier ? (
                                                        <Link to={`/suppliers/${item.supplier.id}`} className="text-brand-primary hover:text-brand-secondary transition-colors font-medium">
                                                            {item.supplier.name}
                                                        </Link>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Link to={`/inventories/${item.id}`}
                                                        className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors">
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
