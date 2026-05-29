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
    activePromotions,
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
    const discount      = 0;
    const total         = Math.max(0, subtotal + tax - discount);
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
        discount,
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

            <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-[#fbfbfe] via-white to-[#dddbff]/30 flex overflow-hidden">

                {/* ── PRODUCT AREA ── */}
                <div className="flex-1 flex h-[calc(100vh-72px)] overflow-hidden">
                    <div className="flex-1 p-5 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 flex-shrink-0">
                            <div>
                                <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                                    POS Transaksi
                                </h1>
                                <p className="text-[12px] font-medium text-[#2f27ce] mt-0.5">
                                    Kasir: <span className="text-[#050316] font-bold">{cashierName}</span>
                                </p>
                            </div>
                            <div className="relative w-[330px]">
                                <iconify-icon icon="solar:magnifer-linear"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-[#2f27ce] text-[18px]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari menu..."
                                    className="w-full h-[46px] rounded-xl bg-white border border-[#dddbff] pl-11 pr-4 text-[13px] outline-none focus:border-[#443dff] focus:ring-2 focus:ring-[#dddbff] transition-all font-semibold text-[#050316] placeholder-[#2f27ce]/50 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">

                            {/* Categories */}
                            <div className="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0 pb-4">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                                        selectedCategory === null
                                            ? 'bg-gradient-to-b from-[#443dff] to-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30 border-none'
                                            : 'bg-white text-[#2f27ce] border border-[#dddbff] hover:bg-gradient-to-br hover:from-white hover:to-[#dddbff]/50 hover:text-[#050316] hover:border-[#443dff] hover:shadow-sm'
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${selectedCategory === null ? 'bg-white/20' : 'bg-[#dddbff]/50'}`}>
                                        <iconify-icon icon="solar:widget-bold" class="text-[18px]" />
                                    </div>
                                    <span className="text-[11px] font-extrabold tracking-wide">Semua</span>
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                                            selectedCategory === cat.id
                                                ? 'bg-gradient-to-b from-[#443dff] to-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30 border-none'
                                                : 'bg-white text-[#2f27ce] border border-[#dddbff] hover:bg-gradient-to-br hover:from-white hover:to-[#dddbff]/50 hover:text-[#050316] hover:border-[#443dff] hover:shadow-sm'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#dddbff]/50'}`}>
                                            <iconify-icon icon={cat.icon} class="text-[18px]" />
                                        </div>
                                        <span className="text-[11px] font-bold text-center leading-tight px-1">{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Menu Grid */}
                            <div className="flex-1 overflow-y-auto pr-2 pb-4 p-1">
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredMenus.map(menu => (
                                        <button
                                            key={menu.id}
                                            onClick={() => addToCart(menu)}
                                            className="text-left bg-white rounded-2xl border-2 border-[#dddbff] shadow-sm hover:shadow-md hover:shadow-[#443dff]/20 hover:border-[#dddbff] focus:outline-none focus:ring-4 focus:ring-[#dddbff]/80 active:scale-[0.97] transition-all duration-150 overflow-hidden flex flex-col group relative"
                                        >
                                            <div className="absolute inset-0 bg-[#443dff]/5 opacity-0 group-active:opacity-100 transition-opacity duration-75 z-10 pointer-events-none" />
                                            <div className="relative overflow-hidden h-[120px]">
                                                <img src={menu.image_url} alt={menu.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#050316]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                            </div>
                                            <div className="p-3.5 flex flex-col flex-1 bg-white z-20">
                                                <div className="space-y-1 mb-3 flex-1">
                                                    <h3 className="text-[13px] font-extrabold text-[#050316] leading-snug line-clamp-2">{menu.name}</h3>
                                                    <p className="text-[11px] font-medium text-gray-600 line-clamp-1">{menu.description || menu.category_name}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-[#443dff] font-black text-[14px]">{formatRupiah(menu.price)}</span>
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#dddbff]/50 to-[#dddbff]/30 text-[#2f27ce] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#443dff] group-hover:to-[#2f27ce] group-hover:text-white transition-all duration-150 shadow-sm">
                                                        <iconify-icon icon="solar:add-circle-bold" class="text-[20px]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {filteredMenus.length === 0 && (
                                    <p className="text-center text-[#2f27ce] text-sm py-20 font-medium italic">
                                        Tidak ada menu ditemukan.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CART ── */}
                <div className="w-[380px] bg-white border-l border-[#dddbff] shadow-[-10px_0_30px_rgba(47,39,206,0.08)] flex flex-col h-[calc(100vh-72px)] relative z-10 flex-shrink-0">

                    {/* Cart header */}
                    <div className="h-[76px] border-b border-[#dddbff] px-5 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dddbff] to-white border border-[#dddbff]/50 flex items-center justify-center">
                                <iconify-icon icon="solar:cart-large-2-bold-duotone" class="text-[#443dff] text-[18px]" />
                            </div>
                            <h3 className="font-extrabold text-[15px] text-[#050316] tracking-tight">Pesanan Aktif</h3>
                        </div>
                        <span className="text-[11px] font-black bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white px-2.5 py-1 rounded-md shadow-sm">
                            {cartItemCount} Item
                        </span>
                    </div>

                    {/* Held orders */}
                    {heldOrders.length > 0 && (
                        <div className="px-5 py-3 border-b border-[#dddbff] flex-shrink-0 bg-gradient-to-b from-[#dddbff]/30 to-transparent">
                            <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#443dff] animate-pulse" /> Tertahan
                            </p>
                            <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                                {heldOrders.map(held => (
                                    <button
                                        key={held.id}
                                        onClick={() => resumeOrder(held.id)}
                                        className="text-left px-3 py-2 rounded-xl bg-white border border-[#dddbff] shadow-sm hover:border-[#443dff] transition-all flex-shrink-0"
                                    >
                                        <p className="text-[11px] font-extrabold text-[#050316]">{held.label}</p>
                                        <p className="text-[10px] font-medium text-[#443dff] mt-0.5">
                                            {held.items_count} item · {formatRupiah(held.total)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#dddbff]/50 to-white border border-[#dddbff] flex items-center justify-center mb-4 shadow-inner">
                                    <iconify-icon icon="solar:cookie-bold-duotone" class="text-[38px] text-[#443dff]" />
                                </div>
                                <h4 className="text-[14px] font-bold text-[#2f27ce]">Keranjang masih kosong</h4>
                                <p className="text-[11px] text-[#2f27ce] mt-1">Pilih menu di sebelah kiri untuk menambahkan.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <div key={`${item.menu_id}-${index}`} className="flex gap-3 items-start pb-4 border-b border-[#dddbff]/50 last:border-0 last:pb-0">
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <p className="text-[13px] font-bold text-[#050316] truncate">{item.name}</p>
                                            <p className="text-[11px] font-medium text-[#2f27ce] mt-0.5">{formatRupiah(item.price)} / item</p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0 bg-gradient-to-br from-[#dddbff]/40 to-[#dddbff]/10 rounded-lg p-1 border border-[#dddbff]">
                                            <button onClick={() => decreaseQty(index)}
                                                className="w-6 h-6 rounded-md bg-white border border-[#dddbff] text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm flex items-center justify-center">
                                                &minus;
                                            </button>
                                            <span className="text-[12px] font-extrabold w-6 text-center text-[#050316]">{item.qty}</span>
                                            <button onClick={() => increaseQty(index)}
                                                className="w-6 h-6 rounded-md bg-gradient-to-br from-[#443dff] to-[#2f27ce] text-white text-sm font-bold hover:from-[#2f27ce] hover:to-[#050316] transition-colors shadow-sm flex items-center justify-center">
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right flex-shrink-0 flex flex-col items-end pt-0.5 ml-2">
                                            <p className="text-[13px] font-black text-[#443dff]">{formatRupiah(item.price * item.qty)}</p>
                                            <button onClick={() => removeFromCart(index)}
                                                className="text-[10px] font-bold text-red-400 hover:text-red-600 mt-1.5 transition-colors uppercase tracking-wider">
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-[#dddbff] p-5 flex-shrink-0 bg-gradient-to-t from-[#dddbff]/30 to-transparent">
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-[13px] font-medium text-[#2f27ce]">
                                <span>Subtotal</span>
                                <span className="font-bold text-[#050316]">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px] font-medium text-[#2f27ce]">
                                <span>Pajak ({taxPercent}%)</span>
                                <span className="font-bold text-[#050316]">{formatRupiah(tax)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex items-center justify-between text-[13px] font-extrabold text-[#443dff]">
                                    <span>Diskon</span>
                                    <span>- {formatRupiah(discount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-4 mb-5 pt-4 border-t border-[#dddbff] border-dashed">
                            <span className="font-extrabold text-[#050316] uppercase tracking-wide text-sm">Total Tagihan</span>
                            <span className="font-black text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#2f27ce] to-[#443dff]">
                                {formatRupiah(total)}
                            </span>
                        </div>

                        {errorMessage && (
                            <p className="text-[11px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 mb-3 text-center">
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={holdOrder}
                                disabled={!cart.length || loading}
                                className="flex-1 h-[52px] rounded-xl border border-[#2f27ce] text-[#2f27ce] font-bold text-[13px] hover:bg-gradient-to-br hover:from-[#dddbff] hover:to-white disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-1.5 bg-white"
                            >
                                <iconify-icon icon="solar:pause-circle-linear" class="text-lg" /> Tahan
                            </button>
                            <button
                                onClick={() => setShowPayment(true)}
                                disabled={!cart.length || loading}
                                className="flex-[2] h-[52px] rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] disabled:opacity-50 transition-all text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]"
                            >
                                <span className="text-[14px]">{loading ? 'Memproses...' : 'Bayar Sekarang'}</span>
                                {!loading && <iconify-icon icon="solar:arrow-right-linear" class="text-[20px]" />}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── PAYMENT MODAL ── */}
            {showPayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#050316]/60 backdrop-blur-sm p-4"
                    onClick={() => setShowPayment(false)}
                    onKeyDown={e => e.key === 'Escape' && setShowPayment(false)}
                >
                    <div className="bg-white rounded-2xl w-[450px] max-w-full p-7 shadow-2xl border border-[#dddbff]"
                        onClick={e => e.stopPropagation()}>

                        <div className="mb-6 border-b border-[#dddbff] pb-5">
                            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                                Selesaikan Pembayaran
                            </h3>
                            <div className="mt-2 flex justify-between items-end">
                                <p className="text-sm font-medium text-[#2f27ce]">Total Tagihan</p>
                                <p className="font-black text-2xl text-[#2f27ce]">{formatRupiah(total)}</p>
                            </div>
                        </div>

                        <label className="block text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">
                            Metode Pembayaran
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="w-full mb-5 h-12 rounded-xl border border-[#dddbff] bg-gradient-to-r from-[#dddbff]/30 to-[#fbfbfe] text-sm font-bold text-[#050316] px-4 focus:outline-none focus:ring-2 focus:ring-[#443dff] focus:bg-white focus:border-[#443dff] transition-all cursor-pointer"
                        >
                            <option value="cash">💵 Tunai (Cash)</option>
                            <option value="qris">📱 QRIS</option>
                            <option value="transfer">🏦 Transfer Bank</option>
                            <option value="debit">💳 Kartu Debit/Kredit</option>
                        </select>

                        <label className="block text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">
                            Jumlah Dibayar
                        </label>
                        <div className="relative mb-5">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#2f27ce]">Rp</span>
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={e => setPaidAmount(Number(e.target.value))}
                                min={0}
                                step={1000}
                                className="w-full h-12 rounded-xl border border-[#dddbff] bg-[#dddbff]/10 text-lg font-black text-[#050316] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#443dff] focus:bg-white focus:border-[#443dff] transition-all"
                            />
                        </div>

                        <div className="bg-gradient-to-r from-[#dddbff]/50 to-[#dddbff]/20 p-4 rounded-xl border border-[#dddbff] mb-6 flex justify-between items-center">
                            <p className="text-xs font-bold text-[#2f27ce] uppercase tracking-wide">Kembalian</p>
                            <p className={`text-lg font-black ${changeAmount >= 0 ? 'text-[#443dff]' : 'text-red-500'}`}>
                                {changeAmount >= 0
                                    ? formatRupiah(changeAmount)
                                    : `Kurang ${formatRupiah(Math.abs(changeAmount))}`}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowPayment(false)}
                                className="flex-1 h-12 rounded-xl border border-[#dddbff] bg-white text-sm font-bold text-[#2f27ce] hover:bg-gradient-to-r hover:from-white hover:to-[#dddbff]/50 hover:text-[#050316] transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={checkout}
                                disabled={loading || paidAmount < total}
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white text-sm font-extrabold shadow-lg shadow-[#443dff]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
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