import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';
import InventoriesDetailSkeleton from '@/Components/Skeletons/InventoriesDetailSkeleton';

export default function InventoriesShow() {
    const { id } = useParams();
    const [inventory, setInventory] = useState(null);
    const [adjustQty, setAdjustQty] = useState('');
    const [adjustType, setAdjustType] = useState('restock');
    const [adjustDirection, setAdjustDirection] = useState('in');
    const [adjustNotes, setAdjustNotes] = useState('');
    const [processingAdjust, setProcessingAdjust] = useState(false);
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

    useEffect(() => {
        if (adjustType === 'waste') {
            setAdjustDirection('out');
        } else if (adjustType === 'restock') {
            setAdjustDirection('in');
        }
    }, [adjustType]);

    async function handleAdjust(e) {
        e.preventDefault();
        if (!adjustQty || parseFloat(adjustQty) <= 0) {
            alert('Jumlah penyesuaian harus lebih besar dari 0.');
            return;
        }
        setProcessingAdjust(true);
        try {
            await client.post(`/inventories/${id}/adjust`, {
                qty: parseFloat(adjustQty),
                type: adjustType,
                direction: adjustDirection,
                notes: adjustNotes
            });
            setAdjustQty('');
            setAdjustNotes('');
            setAdjustType('restock');
            setAdjustDirection('in');
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Gagal menyesuaikan stok:", err);
            alert("Gagal melakukan penyesuaian stok.");
        } finally {
            setProcessingAdjust(false);
        }
    }

    if (loading && !inventory) {
        return (
            <>
                <Head title="Detail Bahan Baku" />
                <InventoriesDetailSkeleton />
            </>
        );
    }

    if (error && !inventory) {
        return (
            <>
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
            </>
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
        <>
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
                                        { 
                                            label: 'Supplier',  
                                            value: inventory.supplier ? (
                                                <Link to={`/suppliers/${inventory.supplier_id}`} className="text-brand-primary hover:underline hover:text-brand-secondary font-semibold">
                                                    {inventory.supplier.name}
                                                </Link>
                                            ) : '-' 
                                        },
                                        { label: 'Harga/Satuan', value: `Rp ${Number(inventory.price_per_unit).toLocaleString('id-ID')}` },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                            <div className="font-semibold text-brand-dark mt-0.5">{item.value}</div>
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

                            {/* Stock Adjustment Widget */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-brand-dark flex items-center gap-2">
                                    <iconify-icon icon="solar:settings-minimalistic-linear" class="text-brand-secondary text-lg"></iconify-icon>
                                    Penyesuaian Stok
                                </h3>
                                <form onSubmit={handleAdjust} className="space-y-4">
                                    {/* Type Selection */}
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-brand-primary/60 uppercase tracking-wider mb-1.5">Jenis Penyesuaian</label>
                                        <div className="grid grid-cols-3 gap-1 bg-brand-bg border border-brand-light rounded-xl p-1">
                                            {[
                                                { label: 'Restock', value: 'restock' },
                                                { label: 'Koreksi', value: 'adjustment' },
                                                { label: 'Waste', value: 'waste' }
                                            ].map(item => (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    onClick={() => setAdjustType(item.value)}
                                                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                                        adjustType === item.value 
                                                            ? 'bg-white text-brand-primary shadow-sm border border-brand-light' 
                                                            : 'text-brand-primary/60 hover:text-brand-primary'
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Direction Selection */}
                                    {adjustType !== 'waste' && (
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-brand-primary/60 uppercase tracking-wider mb-1.5">Arah Stok</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustDirection('in')}
                                                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                                                        adjustDirection === 'in'
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                                                            : 'bg-white border-brand-light text-brand-primary/60 hover:bg-brand-bg'
                                                    }`}
                                                >
                                                    <iconify-icon icon="solar:arrow-left-down-linear"></iconify-icon>
                                                    Masuk (+)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustDirection('out')}
                                                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                                                        adjustDirection === 'out'
                                                            ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                                                            : 'bg-white border-brand-light text-brand-primary/60 hover:bg-brand-bg'
                                                    }`}
                                                >
                                                    <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                                                    Keluar (-)
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity Input */}
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-brand-primary/60 uppercase tracking-wider mb-1.5">Jumlah ({inventory.unit})</label>
                                        <input
                                            type="number"
                                            value={adjustQty}
                                            onChange={e => setAdjustQty(e.target.value)}
                                            placeholder="Masukkan kuantitas..."
                                            min="0.01" step="0.01" required
                                            className="w-full h-11 px-4 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary font-semibold text-brand-dark"
                                        />
                                    </div>

                                    {/* Notes Input */}
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-brand-primary/60 uppercase tracking-wider mb-1.5">Keterangan</label>
                                        <textarea
                                            value={adjustNotes}
                                            onChange={e => setAdjustNotes(e.target.value)}
                                            placeholder={adjustType === 'waste' ? 'Susu tumpah, sayur layu, dll...' : 'Keterangan tambahan...'}
                                            rows="2"
                                            className="w-full p-3 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none font-medium text-brand-dark"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processingAdjust}
                                        className={`w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-60 bg-gradient-to-r ${
                                            adjustDirection === 'in' 
                                                ? 'from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary' 
                                                : 'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
                                        }`}
                                    >
                                        {processingAdjust ? 'Memproses...' : 'Simpan Penyesuaian'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// InventoriesShow.layout = (page) => <>{page}</>;