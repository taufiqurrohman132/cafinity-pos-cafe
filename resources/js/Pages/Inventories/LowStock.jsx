import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function InventoriesLowStock({ inventories }) {
    return (
        <>
            <Head title="Stok Menipis" />
            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href={route('inventories.index')}
                            className="w-9 h-9 rounded-xl border border-[#dddbff] bg-white flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition">
                            <iconify-icon icon="mdi:arrow-left"></iconify-icon>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-[#050316]">Stok Menipis</h1>
                            <p className="text-gray-500 text-sm mt-0.5">{inventories.length} item perlu direstok</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
                        {inventories.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-4xl mb-3">✅</p>
                                <p className="font-bold text-[#050316]">Semua stok aman</p>
                                <p className="text-sm text-gray-400 mt-1">Tidak ada item yang perlu direstok.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-[#dddbff] bg-[#fbfbfe]">
                                            {['Nama Bahan', 'Kategori', 'Stok', 'Minimum', 'Supplier', 'Aksi'].map(h => (
                                                <th key={h} className="px-5 py-3 text-xs font-bold text-[#2f27ce]/70">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#dddbff]/50">
                                        {inventories.map(item => (
                                            <tr key={item.id} className="hover:bg-[#fbfbfe] transition">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-[#050316]">{item.name}</p>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500">
                                                    {item.category?.name ?? '-'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="font-bold text-red-500">{item.stock}</span>
                                                    <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{item.min_stock} {item.unit}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{item.supplier?.name ?? '-'}</td>
                                                <td className="px-5 py-4">
                                                    <Link href={route('inventories.show', item.id)}
                                                        className="text-xs font-bold text-[#2f27ce] hover:underline">
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

InventoriesLowStock.layout = (page) => <AppLayout>{page}</AppLayout>;