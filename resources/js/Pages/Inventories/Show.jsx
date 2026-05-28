import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';

export default function InventoriesShow({ inventory }) {
    const [qty, setQty] = useState('');
    const [restocking, setRestocking] = useState(false);

    function handleRestock(e) {
        e.preventDefault();
        router.post(route('inventories.restock', inventory.id), { qty }, {
            preserveScroll: true,
            onSuccess: () => { setQty(''); setRestocking(false); },
        });
    }

    const percent = inventory.min_stock > 0
        ? Math.min(100, Math.round((inventory.stock / inventory.min_stock) * 100))
        : 100;

    const stockColor = inventory.stock === 0 ? 'red'
        : inventory.stock <= inventory.min_stock ? 'orange'
        : percent <= 75 ? 'yellow' : 'blue';

    const barCls = { blue: 'bg-[#2f27ce]', yellow: 'bg-yellow-400', orange: 'bg-orange-400', red: 'bg-red-400' }[stockColor];
    const badgeCls = {
        blue:   'bg-[#dddbff] text-[#2f27ce]',
        yellow: 'bg-yellow-100 text-yellow-700',
        orange: 'bg-orange-100 text-orange-600',
        red:    'bg-red-100 text-red-600',
    }[stockColor];
    const stockLabel = { blue: 'Aman', yellow: 'Menipis', orange: 'Kritis', red: 'Habis' }[stockColor];

    return (
        <>
            <Head title={`Detail — ${inventory.name}`} />
            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href={route('inventories.index')}
                                className="w-9 h-9 rounded-xl border border-[#dddbff] bg-white flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition">
                                <iconify-icon icon="mdi:arrow-left"></iconify-icon>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-[#050316]">{inventory.name}</h1>
                                <p className="text-gray-500 text-sm mt-0.5">Detail bahan baku</p>
                            </div>
                        </div>
                        <Link href={route('inventories.edit', inventory.id)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm">
                            <iconify-icon icon="solar:pen-linear"></iconify-icon>
                            Edit
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Info Utama */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-[#050316]">Informasi Bahan</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        { label: 'Kategori',  value: inventory.category?.name ?? '-' },
                                        { label: 'Satuan',    value: inventory.unit },
                                        { label: 'Supplier',  value: inventory.supplier?.name ?? '-' },
                                        { label: 'Harga/Satuan', value: `Rp ${Number(inventory.price_per_unit).toLocaleString('id-ID')}` },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                            <p className="font-semibold text-[#050316] mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Log Aktivitas */}
                            <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                <h3 className="font-bold text-[#050316] mb-4">Log Aktivitas</h3>
                                {inventory.logs?.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">Belum ada log.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {inventory.logs?.map(log => (
                                            <div key={log.id} className="flex items-start justify-between gap-4 py-2 border-b border-[#dddbff]/50 last:border-0">
                                                <div>
                                                    <p className="text-xs font-bold text-[#050316] capitalize">{log.type}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{log.notes ?? '-'} — {log.user?.name ?? 'Sistem'}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className={`text-xs font-bold ${log.quantity > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {log.quantity > 0 ? '+' : ''}{log.quantity}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">{log.created_at_diff}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Stok */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-[#050316]">Status Stok</h3>
                                <div className="text-center">
                                    <p className="text-4xl font-black text-[#050316]">{inventory.stock}</p>
                                    <p className="text-sm text-gray-400 mt-1">{inventory.unit}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Stok / Minimum</span>
                                        <span className="font-bold text-[#050316]">{inventory.stock} / {inventory.min_stock}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#dddbff] overflow-hidden">
                                        <div className={`h-full rounded-full ${barCls}`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeCls}`}>
                                    {stockLabel}
                                </span>
                            </div>

                            {/* Restock */}
                            <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 space-y-3">
                                <h3 className="font-bold text-[#050316]">Tambah Stok</h3>
                                {restocking ? (
                                    <form onSubmit={handleRestock} className="space-y-3">
                                        <input
                                            type="number"
                                            value={qty}
                                            onChange={e => setQty(e.target.value)}
                                            placeholder="Jumlah..."
                                            min="0.01" step="0.01"
                                            className="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce]"
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit"
                                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] rounded-xl hover:bg-[#443dff] transition">
                                                Tambah
                                            </button>
                                            <button type="button" onClick={() => setRestocking(false)}
                                                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setRestocking(true)}
                                        className="w-full py-2.5 text-sm font-semibold text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition">
                                        + Restock
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

InventoriesShow.layout = (page) => <AppLayout>{page}</AppLayout>;