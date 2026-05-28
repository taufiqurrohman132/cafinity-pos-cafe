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
            return m.name.toLowerCase().includes(q) ||
                (m.description && m.description.toLowerCase().includes(q));
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

            {/* Wrapper: sisa tinggi setelah navbar 72px */}
            <div className="flex overflow-hidden bg-[#f8f8fc]" style={{ height: 'calc(100vh - 72px)' }}>

                {/* ── KIRI: CATEGORY ── */}
                <div className="w-[90px] bg-white border-r border-[#dddbff] flex flex-col items-center py-4 gap-2 overflow-y-auto flex-shrink-0">
                    {/* Semua */}
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-[70px] h-[70px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 flex-shrink-0 ${
                            selectedCategory === null
                                ? 'bg-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30'
                                : 'bg-[#f8f8fc] text-[#2f27ce] hover:bg-[#dddbff]/50'
                        }`}
                    >
                        <iconify-icon icon="solar:widget-bold" class="text-[20px]" />
                        <span className="text-[10px] font-extrabold">Semua</span>
                    </button>

                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-[70px] h-[70px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 flex-shrink-0 ${
                                selectedCategory === cat.id
                                    ? 'bg-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30'
                                    : 'bg-[#f8f8fc] text-[#2f27ce] hover:bg-[#dddbff]/50'
                            }`}
                        >
                            <iconify-icon icon={cat.icon} class="text-[20px]" />
                            <span className="text-[10px] font-bold text-center leading-tight px-1">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* ── TENGAH: MENU GRID ── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-shrink-0 bg-[#f8f8fc]">
                        <div>
                            <h1 className="text-[22px] font-extrabold text-[#050316] tracking-tight">POS Transaksi</h1>
                            <p className="text-[12px] font-medium text-[#2f27ce] mt-0.5">
                                Kasir: <span className="text-[#050316] font-bold">{cashierName}</span>
                            </p>
                        </div>
                        <div className="relative w-[280px]">
                            <iconify-icon icon="solar:magnifer-linear"
                                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/60 text-[17px]" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari menu..."
                                className="w-full h-[42px] rounded-xl bg-white border border-[#dddbff] pl-10 pr-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/40 outline-none focus:border-[#443dff] focus:ring-2 focus:ring-[#dddbff] transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Held orders */}
                    {heldOrders.length > 0 && (
                        <div className="px-6 pb-3 flex-shrink-0">
                            <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#443dff] animate-pulse" /> Pesanan Tertahan
                            </p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
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

                    {/* Menu Grid — scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {filteredMenus.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-4xl mb-3">☕</p>
                                <p className="text-sm font-medium text-[#2f27ce]/60 italic">Tidak ada menu ditemukan.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredMenus.map(menu => (
                                    <button
                                        key={menu.id}
                                        onClick={() => addToCart(menu)}
                                        className="text-left bg-white rounded-2xl border border-[#dddbff] shadow-sm hover:shadow-md hover:shadow-[#443dff]/10 hover:border-[#443dff]/40 active:scale-[0.97] transition-all duration-150 overflow-hidden flex flex-col group"
                                    >
                                        <div className="relative overflow-hidden h-[110px]">
                                            <img src={menu.image_url} alt={menu.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="p-3 flex flex-col flex-1">
                                            <h3 className="text-[12px] font-extrabold text-[#050316] leading-snug line-clamp-2 mb-1">{menu.name}</h3>
                                            <p className="text-[11px] text-gray-400 line-clamp-1 mb-2">{menu.description || menu.category_name}</p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[#2f27ce] font-black text-[13px]">{formatRupiah(menu.price)}</span>
                                                <div className="w-7 h-7 rounded-lg bg-[#2f27ce] text-white flex items-center justify-center group-hover:bg-[#443dff] transition-colors shadow-sm">
                                                    <iconify-icon icon="solar:add-circle-bold" class="text-[16px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── KANAN: CART ── */}
                <div className="w-[340px] bg-white border-l border-[#dddbff] flex flex-col flex-shrink-0 shadow-[-8px_0_24px_rgba(47,39,206,0.06)]">

                    {/* Cart header */}
                    <div className="px-5 py-4 border-b border-[#dddbff] flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <iconify-icon icon="solar:cart-large-2-bold-duotone" class="text-[#2f27ce] text-[22px]" />
                            <h3 className="font-extrabold text-[15px] text-[#050316]">Pesanan Aktif</h3>
                        </div>
                        <span className="text-[11px] font-black bg-[#2f27ce] text-white px-2.5 py-1 rounded-lg">
                            {cartItemCount} Item
                        </span>
                    </div>

                    {/* Cart items — scrollable */}
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#dddbff]/30 flex items-center justify-center mb-3">
                                    <iconify-icon icon="solar:cookie-bold-duotone" class="text-[32px] text-[#2f27ce]/40" />
                                </div>
                                <p className="text-[13px] font-bold text-[#2f27ce]/60">Keranjang masih kosong</p>
                                <p className="text-[11px] text-[#2f27ce]/40 mt-1">Pilih menu di sebelah kiri untuk menambahkan.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item, index) => (
                                    <div key={`${item.menu_id}-${index}`} className="flex gap-3 items-start pb-3 border-b border-[#dddbff]/50 last:border-0 last:pb-0">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-bold text-[#050316] truncate">{item.name}</p>
                                            <p className="text-[11px] text-[#2f27ce] mt-0.5">{formatRupiah(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => decreaseQty(index)}
                                                className="w-6 h-6 rounded-lg bg-[#f8f8fc] border border-[#dddbff] text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] transition-colors">
                                                &minus;
                                            </button>
                                            <span className="text-[12px] font-extrabold w-6 text-center text-[#050316]">{item.qty}</span>
                                            <button onClick={() => increaseQty(index)}
                                                className="w-6 h-6 rounded-lg bg-[#2f27ce] text-white text-sm font-bold hover:bg-[#443dff] transition-colors">
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right flex-shrink-0 flex flex-col items-end">
                                            <p className="text-[12px] font-black text-[#2f27ce]">{formatRupiah(item.price * item.qty)}</p>
                                            <button onClick={() => removeFromCart(index)}
                                                className="text-[10px] font-bold text-red-400 hover:text-red-600 mt-1 transition-colors">
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-[#dddbff] p-5 flex-shrink-0">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-[13px] text-[#2f27ce]">
                                <span>Subtotal</span>
                                <span className="font-bold text-[#050316]">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-[13px] text-[#2f27ce]">
                                <span>Pajak ({taxPercent}%)</span>
                                <span className="font-bold text-[#050316]">{formatRupiah(tax)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-[13px] font-bold text-[#443dff]">
                                    <span>Diskon</span>
                                    <span>- {formatRupiah(discount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-[#dddbff] mb-4">
                            <span className="font-extrabold text-[#050316] text-sm">Total Tagihan</span>
                            <span className="font-black text-[20px] text-[#2f27ce]">{formatRupiah(total)}</span>
                        </div>

                        {errorMessage && (
                            <p className="text-[11px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 mb-3 text-center">
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={holdOrder}
                                disabled={!cart.length || loading}
                                className="flex-1 h-[46px] rounded-xl border border-[#dddbff] text-[#2f27ce] font-bold text-[13px] hover:bg-[#dddbff]/30 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 bg-white"
                            >
                                <iconify-icon icon="solar:pause-circle-linear" class="text-base" />
                                Tahan
                            </button>
                            <button
                                onClick={() => setShowPayment(true)}
                                disabled={!cart.length || loading}
                                className="flex-[2] h-[46px] rounded-xl bg-[#2f27ce] hover:bg-[#443dff] disabled:opacity-50 transition-all text-white font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#2f27ce]/20 active:scale-[0.98] text-[13px]"
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#050316]/50 backdrop-blur-sm p-4"
                    onClick={() => setShowPayment(false)}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl border border-[#dddbff]"
                        onClick={e => e.stopPropagation()}>

                        <div className="mb-5 pb-5 border-b border-[#dddbff]">
                            <h3 className="text-xl font-extrabold text-[#050316] tracking-tight">Selesaikan Pembayaran</h3>
                            <div className="mt-2 flex justify-between items-end">
                                <p className="text-sm text-[#2f27ce]">Total Tagihan</p>
                                <p className="font-black text-2xl text-[#2f27ce]">{formatRupiah(total)}</p>
                            </div>
                        </div>

                        <label className="block text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">
                            Metode Pembayaran
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="w-full mb-4 h-12 rounded-xl border border-[#dddbff] bg-[#f8f8fc] text-sm font-bold text-[#050316] px-4 focus:outline-none focus:ring-2 focus:ring-[#443dff] transition-all"
                        >
                            <option value="cash">💵 Tunai (Cash)</option>
                            <option value="qris">📱 QRIS</option>
                            <option value="transfer">🏦 Transfer Bank</option>
                            <option value="debit">💳 Kartu Debit/Kredit</option>
                        </select>

                        <label className="block text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">
                            Jumlah Dibayar
                        </label>
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#2f27ce] text-sm">Rp</span>
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={e => setPaidAmount(Number(e.target.value))}
                                min={0}
                                step={1000}
                                className="w-full h-12 rounded-xl border border-[#dddbff] bg-[#f8f8fc] text-lg font-black text-[#050316] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#443dff] focus:bg-white transition-all"
                            />
                        </div>

                        <div className="bg-[#dddbff]/30 p-4 rounded-xl border border-[#dddbff] mb-5 flex justify-between items-center">
                            <p className="text-xs font-bold text-[#2f27ce] uppercase tracking-wide">Kembalian</p>
                            <p className={`text-lg font-black ${changeAmount >= 0 ? 'text-[#2f27ce]' : 'text-red-500'}`}>
                                {changeAmount >= 0
                                    ? formatRupiah(changeAmount)
                                    : `Kurang ${formatRupiah(Math.abs(changeAmount))}`}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowPayment(false)}
                                className="flex-1 h-12 rounded-xl border border-[#dddbff] bg-white text-sm font-bold text-[#2f27ce] hover:bg-[#dddbff]/30 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={checkout}
                                disabled={loading || paidAmount < total}
                                className="flex-1 h-12 rounded-xl bg-[#2f27ce] hover:bg-[#443dff] text-white text-sm font-extrabold shadow-md shadow-[#2f27ce]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
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