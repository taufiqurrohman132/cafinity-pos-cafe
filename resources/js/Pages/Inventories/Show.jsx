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
                <div className="min-h-screen flex items-center justify-center bg-white p-4">
                    <div className="bg-white p-8 rounded-2xl border border-[#E6E6E6] max-w-md w-full shadow-level-3 text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-heading text-black mb-2">Terjadi Kesalahan</h3>
                        <p className="text-body-compact text-black/60 mb-6">
                            Gagal memuat data detail bahan baku dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black py-2.5 rounded-xl font-semibold transition-all active:scale-[0.97]">
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

    let badgeCls = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    let barCls = 'bg-emerald-500';
    let stockLabel = 'Aman';

    if (inventory.stock === 0) {
        badgeCls = 'bg-rose-50 text-rose-700 border-rose-100';
        barCls = 'bg-rose-500';
        stockLabel = 'Habis';
    } else if (inventory.stock <= inventory.min_stock) {
        badgeCls = 'bg-amber-50 text-amber-700 border-amber-100';
        barCls = 'bg-amber-500';
        stockLabel = 'Kritis';
    } else if (percent <= 75) {
        badgeCls = 'bg-amber-50 text-amber-700 border-amber-100';
        barCls = 'bg-amber-400';
        stockLabel = 'Menipis';
    } else {
        badgeCls = 'bg-emerald-50 text-emerald-700 border-emerald-100';
        barCls = 'bg-[#BFFF00]';
        stockLabel = 'Aman';
    }

    return (
        <>
            <Head title={`Detail — ${inventory.name}`} />
            <div className="min-h-screen bg-white p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Header */}
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
                                    <span className="text-black font-semibold">Detail {inventory.name}</span>
                                </nav>
                                <h1 className="text-2xl sm:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight pt-1">
                                    {inventory.name}
                                </h1>
                            </div>
                        </div>
                        <Link to={`/inventories/${inventory.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition shadow-sm active:scale-95">
                            <iconify-icon icon="solar:pen-linear"></iconify-icon>
                            Edit
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Info Utama */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-6 space-y-4">
                                <h3 className="font-semibold text-black text-sm">Informasi Bahan</h3>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    {[
                                        { label: 'Kategori', value: inventory.category?.name ?? '-' },
                                        { label: 'Satuan', value: inventory.unit },
                                        {
                                            label: 'Supplier',
                                            value: inventory.supplier ? (
                                                <Link to={`/suppliers/${inventory.supplier_id}`} className="text-black hover:text-black transition-colors font-semibold border-b border-[#D0D0D0] hover:border-black transition-all pb-0.5">
                                                    {inventory.supplier.name}
                                                </Link>
                                            ) : '-'
                                        },
                                        { label: 'Harga / Satuan', value: `Rp ${Number(inventory.price_per_unit).toLocaleString('id-ID')}` },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <p className="text-[10px] text-black/60 font-semibold uppercase tracking-wider">{item.label}</p>
                                            <div className="font-semibold text-black mt-1 text-sm">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Log Aktivitas */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-6">
                                <h3 className="font-semibold text-black text-sm mb-4">Log Aktivitas</h3>
                                {inventory.logs?.length === 0 ? (
                                    <p className="text-xs text-black/60 italic font-medium">Belum ada log aktivitas.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {inventory.logs?.map(log => (
                                            <div key={log.id} className="flex items-start justify-between gap-4 py-2 px-2 -mx-2 hover:bg-[#E6E6E6]/40 transition-all rounded-xl border-b border-[#E6E6E6]/60 last:border-0">
                                                <div>
                                                    <p className="text-xs font-semibold text-black capitalize">{log.type}</p>
                                                    <p className="text-[11px] text-black/60 mt-0.5 font-medium">{log.notes ?? '-'} — {log.user?.name ?? 'Sistem'}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className={`text-xs font-semibold ${log.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                        {log.quantity > 0 ? '+' : ''}{log.quantity}
                                                    </p>
                                                    <p className="text-[10px] text-black/40 mt-0.5 font-medium">{log.created_at_diff}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Stok */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-6 space-y-4">
                                <h3 className="font-semibold text-black text-sm">Status Stok</h3>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-black">{inventory.stock}</p>
                                    <p className="text-xs text-black/60 mt-1 font-semibold">{inventory.unit}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-black/60">
                                        <span>Stok / Minimum</span>
                                        <span className="text-black">{inventory.stock} / {inventory.min_stock}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#E6E6E6] overflow-hidden">
                                        <div className={`h-full rounded-full ${barCls}`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${badgeCls}`}>
                                        {stockLabel}
                                    </span>
                                </div>
                            </div>

                            {/* Stock Adjustment Widget */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-6 space-y-4">
                                <h3 className="font-semibold text-black text-sm flex items-center gap-2">
                                    <iconify-icon icon="solar:settings-minimalistic-linear" class="text-black text-lg"></iconify-icon>
                                    Penyesuaian Stok
                                </h3>
                                <form onSubmit={handleAdjust} className="space-y-4">
                                    {/* Type Selection */}
                                    <div>
                                        <label className="block text-[10px] font-semibold text-black/60 capitalize tracking-wider mb-1.5">Jenis Penyesuaian</label>
                                        <div className="grid grid-cols-3 gap-1 bg-[#E6E6E6]/30 border border-[#E6E6E6] rounded-xl p-1">
                                            {[
                                                { label: 'Restock', value: 'restock' },
                                                { label: 'Koreksi', value: 'adjustment' },
                                                { label: 'Waste', value: 'waste' }
                                            ].map(item => (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    onClick={() => setAdjustType(item.value)}
                                                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${adjustType === item.value ? 'bg-white text-black shadow-sm border border-[#E6E6E6]' : 'text-black/60 hover:text-black' } active:scale-[0.97]`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Direction Selection */}
                                    {adjustType !== 'waste' && (
                                        <div>
                                            <label className="block text-[10px] font-semibold text-black/60 capitalize tracking-wider mb-1.5">Arah Stok</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustDirection('in')}
                                                    className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${adjustDirection === 'in' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-[#D0D0D0] text-black/60 hover:bg-[#E6E6E6]' } active:scale-[0.97]`}
                                                >
                                                    <iconify-icon icon="solar:arrow-left-down-linear"></iconify-icon>
                                                    Masuk (+)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdjustDirection('out')}
                                                    className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${adjustDirection === 'out' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' : 'bg-white border-[#D0D0D0] text-black/60 hover:bg-[#E6E6E6]' } active:scale-[0.97]`}
                                                >
                                                    <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                                                    Keluar (-)
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity Input */}
                                    <div>
                                        <label className="block text-[10px] font-semibold text-black/60 capitalize tracking-wider mb-1.5">Jumlah ({inventory.unit})</label>
                                        <input
                                            type="number"
                                            value={adjustQty}
                                            onChange={e => setAdjustQty(e.target.value)}
                                            placeholder="Masukkan kuantitas..."
                                            min="0.01" step="0.01" required
                                            className="w-full h-10 px-3 text-xs bg-white border border-[#D0D0D0] hover:border-[#999999] rounded-xl focus:outline-none font-medium text-black transition-all focus:border-[#BFFF00]"
                                        />
                                    </div>

                                    {/* Notes Input */}
                                    <div>
                                        <label className="block text-[10px] font-semibold text-black/60 capitalize tracking-wider mb-1.5">Keterangan</label>
                                        <textarea
                                            value={adjustNotes}
                                            onChange={e => setAdjustNotes(e.target.value)}
                                            placeholder={adjustType === 'waste' ? 'Susu tumpah, sayur layu, dll...' : 'Keterangan tambahan...'}
                                            rows="2"
                                            className="w-full p-3 text-xs bg-white border border-[#D0D0D0] hover:border-[#999999] rounded-xl focus:outline-none resize-none font-medium text-black transition-all focus:border-[#BFFF00]"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processingAdjust}
                                        className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all shadow-level-1 active:scale-[0.98] disabled:opacity-60 ${adjustDirection === 'in' ? 'bg-[#BFFF00] hover:bg-[#C8FF5E] text-black active:bg-[#AFEE00]' : 'bg-[#1A1A1A] hover:bg-black text-white active:bg-[#0E0E0E]'}`}
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
