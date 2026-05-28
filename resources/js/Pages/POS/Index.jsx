import { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function formatRupiah(amount) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

export default function POS({
    menus,
    categories,
    heldOrders,
    initialCart,
    resumedTransactionId,
    taxPercent,
    cashierName,
    urls,
}) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cart, setCart] = useState(initialCart ?? []);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const filteredMenus = useMemo(() => {
        const q = search.trim().toLowerCase();
        return menus.filter((m) => {
            if (selectedCategory !== null && m.category_id !== selectedCategory) return false;
            if (!q) return true;
            return m.name.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q));
        });
    }, [menus, search, selectedCategory]);

    const cartItemCount = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal      = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax           = Math.round(subtotal * taxPercent / 100);
    const total         = Math.max(0, subtotal + tax);
    const changeAmount  = paidAmount - total;

    useEffect(() => {
        if (paidAmount < total) setPaidAmount(total);
    }, [total]);

    const addToCart = (menu) => {
        setCart(prev => {
            const idx = prev.findIndex(i => i.menu_id === menu.id);
            if (idx > -1) {
                const next = [...prev];
                next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
                return next;
            }
            return [...prev, { menu_id: menu.id, name: menu.name, price: menu.price, qty: 1, notes: '' }];
        });
        setErrorMessage('');
    };

    const increaseQty = (index) => setCart(prev => {
        const next = [...prev];
        next[index] = { ...next[index], qty: next[index].qty + 1 };
        return next;
    });

    const decreaseQty = (index) => setCart(prev => {
        if (prev[index].qty > 1) {
            const next = [...prev];
            next[index] = { ...next[index], qty: next[index].qty - 1 };
            return next;
        }
        return prev.filter((_, i) => i !== index);
    });

    const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));

    const buildPayload = () => ({
        items: cart.map(i => ({ menu_id: i.menu_id, qty: i.qty, notes: i.notes || null })),
        discount: 0,
        tax,
        payment_method: paymentMethod,
        paid_amount: paidAmount,
        held_transaction_id: resumedTransactionId,
    });

    const checkout = async () => {
        if (!cart.length) return;
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch(urls.checkout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(buildPayload()),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Checkout gagal');
            window.location.href = data.redirect;
        } catch (e) {
            setErrorMessage(e.message || 'Terjadi kesalahan saat checkout.');
        } finally {
            setLoading(false);
        }
    };

    const holdOrder = async () => {
        if (!cart.length) return;
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch(urls.hold, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ items: buildPayload().items }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Gagal menahan pesanan');
            }
            window.location.reload();
        } catch (e) {
            setErrorMessage(e.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    const resumeOrder = async (heldId) => {
        const url = urls.resume.replace('__ID__', heldId);
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
        });
        if (res.ok) window.location.reload();
    };

    return (
        <>
            <Head title="POS Transaksi" />

            <div className="h-[calc(100vh-72px)] bg-gray-100 flex overflow-hidden">

                {/* ── PRODUCT AREA ── */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 p-5 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-5 flex-shrink-0">
                            <div>
                                <h1 className="text-[28px] font-bold text-gray-800">POS Transaksi</h1>
                                <p className="text-[12px] text-gray-400 mt-0.5">
                                    Kasir: <span className="font-semibold text-gray-600">{cashierName}</span>
                                </p>
                            </div>
                            <div className="relative w-[330px]">
                                <iconify-icon icon="solar:magnifer-linear"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari menu..."
                                    className="w-full h-[44px] rounded-xl bg-white border border-gray-200 pl-11 pr-4 text-[13px] outline-none focus:ring-0 focus:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Held orders */}
                        {heldOrders.length > 0 && (
                            <div className="mb-4 flex-shrink-0">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                    Pesanan Tertahan
                                </p>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {heldOrders.map(held => (
                                        <button
                                            key={held.id}
                                            onClick={() => resumeOrder(held.id)}
                                            className="text-left px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-emerald-400 transition-all flex-shrink-0"
                                        >
                                            <p className="text-[11px] font-semibold text-gray-700">{held.label}</p>
                                            <p className="text-[10px] text-emerald-500 mt-0.5">
                                                {held.items_count} item · {formatRupiah(held.total)}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Left content */}
                        <div className="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">

                            {/* Category */}
                            <div className="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0">
                                {/* Semua */}
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition ${
                                        selectedCategory === null
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'bg-white text-gray-500 hover:bg-emerald-50'
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedCategory === null ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                        <iconify-icon icon="solar:widget-bold" class="text-[18px]" />
                                    </div>
                                    <span className="text-[11px] font-medium">Semua</span>
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition ${
                                            selectedCategory === cat.id
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'bg-white text-gray-500 hover:bg-emerald-50'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                            <iconify-icon icon={cat.icon} class="text-[18px]" />
                                        </div>
                                        <span className="text-[11px] font-medium text-center leading-tight px-1">{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Products */}
                            <div className="flex-1 overflow-y-auto pr-1">
                                {filteredMenus.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <p className="text-4xl mb-3">☕</p>
                                        <p className="text-sm text-gray-400 italic">Tidak ada menu ditemukan.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-4">
                                        {filteredMenus.map(menu => (
                                            <div
                                                key={menu.id}
                                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                                            >
                                                <img
                                                    src={menu.image_url}
                                                    alt={menu.name}
                                                    className="w-full h-[120px] object-cover"
                                                />
                                                <div className="p-3 flex flex-col flex-1">
                                                    <div className="space-y-1">
                                                        <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2">{menu.name}</h3>
                                                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-1">{menu.description || menu.category_name}</p>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-emerald-500 font-bold text-[13px]">{formatRupiah(menu.price)}</span>
                                                        <button
                                                            onClick={() => addToCart(menu)}
                                                            className="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition"
                                                        >
                                                            <iconify-icon icon="solar:add-circle-linear" class="text-[18px]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CART ── */}
                <div className="w-[370px] bg-white border-l border-gray-100 shadow-xl flex flex-col h-[calc(100vh-72px)] flex-shrink-0">

                    {/* Header */}
                    <div className="h-[72px] border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <iconify-icon icon="solar:cart-large-2-linear" class="text-emerald-500 text-[18px]" />
                            <h3 className="font-semibold text-[14px] text-gray-800">Pesanan Aktif</h3>
                        </div>
                        <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                            {cartItemCount} Item
                        </span>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-8">
                                <div className="w-20 h-20 rounded-full bg-[#f5f6f8] flex items-center justify-center mb-4">
                                    <iconify-icon icon="solar:cookie-linear" class="text-[34px] text-gray-300" />
                                </div>
                                <h4 className="text-[14px] font-medium text-gray-500">Keranjang masih kosong</h4>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <div key={`${item.menu_id}-${index}`} className="flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{formatRupiah(item.price)} / item</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button onClick={() => decreaseQty(index)}
                                                className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-sm font-bold hover:bg-gray-200 transition flex items-center justify-center">
                                                &minus;
                                            </button>
                                            <span className="text-[13px] font-bold w-5 text-center text-gray-800">{item.qty}</span>
                                            <button onClick={() => increaseQty(index)}
                                                className="w-6 h-6 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition flex items-center justify-center">
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right flex-shrink-0 flex flex-col items-end">
                                            <p className="text-[13px] font-bold text-gray-800">{formatRupiah(item.price * item.qty)}</p>
                                            <button onClick={() => removeFromCart(index)}
                                                className="text-[10px] text-red-400 hover:text-red-600 mt-1 transition">
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-5 flex-shrink-0">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[13px] text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px] text-gray-500">
                                <span>Pajak ({taxPercent}%)</span>
                                <span>{formatRupiah(tax)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 mb-5">
                            <span className="font-bold text-gray-800">Total Tagihan</span>
                            <span className="font-bold text-[22px] text-emerald-500">{formatRupiah(total)}</span>
                        </div>

                        {errorMessage && (
                            <p className="text-[11px] text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 mb-3 text-center">
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={holdOrder}
                                disabled={!cart.length || loading}
                                className="flex-1 h-[52px] rounded-xl border border-gray-200 text-gray-600 font-semibold text-[13px] hover:bg-gray-50 disabled:opacity-40 transition flex items-center justify-center gap-1.5 bg-white"
                            >
                                <iconify-icon icon="solar:pause-circle-linear" class="text-base" />
                                Tahan
                            </button>
                            <button
                                onClick={() => setShowPayment(true)}
                                disabled={!cart.length || loading}
                                className="flex-[2] h-[52px] rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.98] text-[13px]"
                            >
                                {loading ? 'Memproses...' : 'Bayar Sekarang'}
                                {!loading && <iconify-icon icon="solar:arrow-right-linear" class="text-[18px]" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PAYMENT MODAL ── */}
            {showPayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setShowPayment(false)}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl border border-gray-100"
                        onClick={e => e.stopPropagation()}>

                        <div className="mb-5 pb-5 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Selesaikan Pembayaran</h3>
                            <div className="mt-2 flex justify-between items-end">
                                <p className="text-sm text-gray-400">Total Tagihan</p>
                                <p className="font-bold text-2xl text-emerald-500">{formatRupiah(total)}</p>
                            </div>
                        </div>

                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Metode Pembayaran
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="w-full mb-4 h-12 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        >
                            <option value="cash">💵 Tunai (Cash)</option>
                            <option value="qris">📱 QRIS</option>
                            <option value="transfer">🏦 Transfer Bank</option>
                            <option value="debit">💳 Kartu Debit/Kredit</option>
                        </select>

                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Jumlah Dibayar
                        </label>
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400 text-sm">Rp</span>
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={e => setPaidAmount(Number(e.target.value))}
                                min={0}
                                step={1000}
                                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 text-lg font-bold text-gray-800 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition"
                            />
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-5 flex justify-between items-center">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Kembalian</p>
                            <p className={`text-lg font-bold ${changeAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {changeAmount >= 0
                                    ? formatRupiah(changeAmount)
                                    : `Kurang ${formatRupiah(Math.abs(changeAmount))}`}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowPayment(false)}
                                className="flex-1 h-12 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                Batal
                            </button>
                            <button
                                onClick={checkout}
                                disabled={loading || paidAmount < total}
                                className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition flex justify-center items-center gap-2 active:scale-[0.98]"
                            >
                                <iconify-icon icon="solar:check-circle-bold" class="text-[18px]" />
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

POS.layout = (page) => <AppLayout>{page}</AppLayout>;