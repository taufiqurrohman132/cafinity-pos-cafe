import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Head from '@/Components/Head';
import AppLayout from '@/Layouts/AppLayout';
import client from '@/api/client';

export default function InventoriesShow() {
    const { id } = useParams();
    const [inventory, setInventory] = useState(null);
    const [qty, setQty] = useState('');
    const [restocking, setRestocking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                setError(null);
                const res = await client.get(`/inventories/${id}`);
                setInventory(res.data.inventory);
            } catch (err) {
                console.error("Gagal mengambil data inventaris:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [id, refreshTrigger]);

    async function handleRestock(e) {
        e.preventDefault();
        try {
            await client.post(`/inventories/${id}/restock`, { qty });
            setQty('');
            setRestocking(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Gagal restock bahan baku:", err);
            alert("Gagal restock bahan baku.");
        }
    }

    if (loading && !inventory) {
        return (
            <AppLayout>
                <Head title="Detail Bahan Baku" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-brand-primary">Memuat Data...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error && !inventory) {
        return (
            <AppLayout>
                <Head title="Detail Bahan Baku" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data detail bahan baku dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!inventory) return null;

    const percent = inventory.min_stock > 0
        ? Math.min(100, Math.round((inventory.stock / inventory.min_stock) * 100))
        : 100;

    const stockColor = inventory.stock === 0 ? 'red'
        : inventory.stock <= inventory.min_stock ? 'orange'
        : percent <= 75 ? 'yellow' : 'blue';

    const barCls = { blue: 'bg-brand-primary', yellow: 'bg-yellow-400', orange: 'bg-orange-400', red: 'bg-red-400' }[stockColor];
    const badgeCls = {
        blue:   'bg-brand-light text-brand-primary',
        yellow: 'bg-yellow-100 text-yellow-700',
        orange: 'bg-orange-100 text-orange-600',
        red:    'bg-red-100 text-red-600',
    }[stockColor];
    const stockLabel = { blue: 'Aman', yellow: 'Menipis', orange: 'Kritis', red: 'Habis' }[stockColor];

    return (
        <AppLayout>
            <Head title={`Detail — ${inventory.name}`} />
            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link to="/inventories"
                                className="w-9 h-9 rounded-xl border border-brand-light bg-white flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition">
                                <iconify-icon icon="mdi:arrow-left"></iconify-icon>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-brand-dark">{inventory.name}</h1>
                                <p className="text-gray-500 text-sm mt-0.5">Detail bahan baku</p>
                            </div>
                        </div>
                        <Link to={`/inventories/${inventory.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition shadow-sm">
                            <iconify-icon icon="solar:pen-linear"></iconify-icon>
                            Edit
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Info Utama */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-brand-dark">Informasi Bahan</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        { label: 'Kategori',  value: inventory.category?.name ?? '-' },
                                        { label: 'Satuan',    value: inventory.unit },
                                        { label: 'Supplier',  value: inventory.supplier?.name ?? '-' },
                                        { label: 'Harga/Satuan', value: `Rp ${Number(inventory.price_per_unit).toLocaleString('id-ID')}` },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                            <p className="font-semibold text-brand-dark mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Log Aktivitas */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6">
                                <h3 className="font-bold text-brand-dark mb-4">Log Aktivitas</h3>
                                {inventory.logs?.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">Belum ada log.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {inventory.logs?.map(log => (
                                            <div key={log.id} className="flex items-start justify-between gap-4 py-2 border-b border-brand-light/50 last:border-0">
                                                <div>
                                                    <p className="text-xs font-bold text-brand-dark capitalize">{log.type}</p>
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
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-brand-dark">Status Stok</h3>
                                <div className="text-center">
                                    <p className="text-4xl font-black text-brand-dark">{inventory.stock}</p>
                                    <p className="text-sm text-gray-400 mt-1">{inventory.unit}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Stok / Minimum</span>
                                        <span className="font-bold text-brand-dark">{inventory.stock} / {inventory.min_stock}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-brand-light overflow-hidden">
                                        <div className={`h-full rounded-full ${barCls}`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeCls}`}>
                                    {stockLabel}
                                </span>
                            </div>

                            {/* Restock */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-3">
                                <h3 className="font-bold text-brand-dark">Tambah Stok</h3>
                                {restocking ? (
                                    <form onSubmit={handleRestock} className="space-y-3">
                                        <input
                                            type="number"
                                            value={qty}
                                            onChange={e => setQty(e.target.value)}
                                            placeholder="Jumlah..."
                                            min="0.01" step="0.01"
                                            className="w-full h-11 px-4 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit"
                                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-secondary transition">
                                                Tambah
                                            </button>
                                            <button type="button" onClick={() => setRestocking(false)}
                                                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition">
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setRestocking(true)}
                                        className="w-full py-2.5 text-sm font-semibold text-brand-primary border border-brand-light rounded-xl hover:bg-brand-light transition">
                                        + Restock
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// InventoriesShow.layout = (page) => <AppLayout>{page}</AppLayout>;