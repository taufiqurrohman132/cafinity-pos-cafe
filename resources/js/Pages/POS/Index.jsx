import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';
import { useNotifications } from '@/context/NotificationContext';
import POSSkeleton from '@/Components/Skeletons/POSSkeleton';
import CustomSelect from '@/Components/CustomSelect';

function formatRupiah(amount) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour} jam lalu`;
}

function isHeldOrderStale(timestamp) {
    if (!timestamp) return false;
    const diffMs = new Date() - new Date(timestamp);
    return diffMs > 15 * 60 * 1000; // > 15 menit dianggap stale
}

function getQuickCashSuggestions(totalAmount) {
    const suggestions = [totalAmount];
    const addIfGreater = (val) => {
        if (val > totalAmount && !suggestions.includes(val)) {
            suggestions.push(val);
        }
    };
    const denominations = [10000, 20000, 50000, 100000];
    denominations.forEach(d => addIfGreater(d));
    const roundedUp = Math.ceil(totalAmount / 10000) * 10000;
    addIfGreater(roundedUp);
    return suggestions.sort((a, b) => a - b).slice(0, 4);
}

function MenuImage({ src, name, categoryName }) {
    const [hasError, setHasError] = useState(false);

    const renderPlaceholder = () => {
        const lower = (categoryName || '').toLowerCase();
        let icon = 'solar:widget-linear';
        if (lower.includes('kopi') || lower.includes('coffee')) icon = 'solar:cup-hot-linear';
        else if (lower.includes('non')) icon = 'solar:cup-star-linear';
        else if (lower.includes('makanan') || lower.includes('main')) icon = 'solar:plate-linear';
        else if (lower.includes('snack') || lower.includes('cemilan')) icon = 'solar:donut-linear';

        return (
            <div className="w-full h-full bg-brand-light/30 flex items-center justify-center text-brand-secondary group-hover:scale-105 transition-transform duration-200">
                <iconify-icon icon={icon} class="text-[40px]"></iconify-icon>
            </div>
        );
    };

    if (!src || hasError) {
        return renderPlaceholder();
    }

    return (
        <img
            src={src}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setHasError(true)}
        />
    );
}


export default function POS() {
    const navigate = useNavigate();
    const { playChime } = useNotifications();

    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [heldOrders, setHeldOrders] = useState([]);
    const [localHeldOrders, setLocalHeldOrders] = useState([]);
    const [hasLoadedHeldOrders, setHasLoadedHeldOrders] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [resumedTransactionId, setResumedTransactionId] = useState(null);
    const [taxPercent, setTaxPercent] = useState(10);
    const [activePromotions, setActivePromotions] = useState([]);
    const [cashierName, setCashierName] = useState('');
    const [urls, setUrls] = useState({});

    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cart, setCart] = useState([]);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchPOSData = async () => {
        setLoadingData(true);
        try {
            setErrorData(null);
            const res = await client.get('/pos');
            setMenus(res.data.menus || []);
            setCategories(res.data.categories || []);
            setHeldOrders(res.data.heldOrders || []);
            setTaxPercent(res.data.taxPercent ?? 10);
            setActivePromotions(res.data.activePromotions || []);
            setCashierName(res.data.cashierName || '');
            setUrls(res.data.urls || {});

            if (!isInitialized) {
                if (res.data.initialCart && res.data.initialCart.length > 0) {
                    setCart(res.data.initialCart);
                }
                if (res.data.resumedTransactionId) {
                    setResumedTransactionId(res.data.resumedTransactionId);
                }
                setIsInitialized(true);
            }
        } catch (err) {
            console.error("Gagal memuat data POS:", err);
            setErrorData(err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchPOSData();
    }, [refreshTrigger]);

    useEffect(() => {
        if (!hasLoadedHeldOrders && heldOrders.length > 0) {
            setLocalHeldOrders(heldOrders.map(h => ({ ...h, isEntering: false, isExiting: false })));
            setHasLoadedHeldOrders(true);
            return;
        }
        if (heldOrders.length === 0 && localHeldOrders.length === 0) {
            return;
        }

        setLocalHeldOrders(prev => {
            const next = [];
            const heldMap = new Map(heldOrders.map(h => [h.id, h]));
            const prevMap = new Map(prev.map(p => [p.id, p]));
            const unionIds = new Set([
                ...prev.map(p => p.id),
                ...heldOrders.map(h => h.id)
            ]);

            for (const id of unionIds) {
                const isNew = heldMap.has(id);
                const wasOld = prevMap.has(id);

                if (isNew && !wasOld) {
                    const item = heldMap.get(id);
                    next.push({
                        ...item,
                        isEntering: true,
                        isExiting: false,
                    });
                } else if (!isNew && wasOld) {
                    const item = prevMap.get(id);
                    next.push({
                        ...item,
                        isExiting: true,
                    });
                } else if (isNew && wasOld) {
                    const item = heldMap.get(id);
                    const prevItem = prevMap.get(id);
                    next.push({
                        ...item,
                        isEntering: prevItem.isEntering,
                        isExiting: prevItem.isExiting,
                    });
                }
            }
            return next;
        });

        if (heldOrders.length > 0) {
            setHasLoadedHeldOrders(true);
        }

        const enterTimeout = setTimeout(() => {
            setLocalHeldOrders(prev =>
                prev.map(item => item.isEntering ? { ...item, isEntering: false } : item)
            );
        }, 50);

        const exitTimeout = setTimeout(() => {
            setLocalHeldOrders(prev =>
                prev.filter(item => !item.isExiting)
            );
        }, 300);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimeout);
        };
    }, [heldOrders]);

    // Cart is initialized once on mount inside fetchPOSData

    const filteredMenus = useMemo(() => {
        const q = search.trim().toLowerCase();
        return menus.filter((m) => {
            if (selectedCategory !== null && m.category_id !== selectedCategory) return false;
            if (!q) return true;
            return m.name.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q));
        });
    }, [menus, search, selectedCategory]);

    const cartItemCount = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * taxPercent / 100);
    const discount = 0;
    const total = Math.max(0, subtotal + tax - discount);
    const changeAmount = paidAmount - total;

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
            const endpoint = (urls.checkout || '/api/pos/checkout').replace(/^\/api/, '');
            const res = await client.post(endpoint, buildPayload());
            playChime('success');
            navigate(res.data.redirect);
        } catch (e) {
            playChime('error');
            setErrorMessage(e.response?.data?.message || e.message || 'Terjadi kesalahan saat checkout.');
        } finally {
            setLoading(false);
        }
    };

    const holdOrder = async () => {
        if (!cart.length) return;
        setLoading(true);
        setErrorMessage('');
        try {
            const endpoint = (urls.hold || '/api/pos/hold').replace(/^\/api/, '');
            await client.post(endpoint, { items: buildPayload().items });
            setCart([]);
            setShowPayment(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (e) {
            setErrorMessage(e.response?.data?.message || e.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    const resumeOrder = async (heldId) => {
        if (cart.length > 0) {
            const confirmResume = window.confirm(
                "Keranjang Anda saat ini tidak kosong. Melanjutkan transaksi tertahan ini akan menimpa keranjang saat ini. Apakah Anda ingin melanjutkan?"
            );
            if (!confirmResume) return;
        }
        setErrorMessage('');
        setLocalHeldOrders(prev =>
            prev.map(item => item.id === heldId ? { ...item, isExiting: true } : item)
        );
        await new Promise(resolve => setTimeout(resolve, 300));
        try {
            const url = (urls.resume || '/api/pos/resume/__ID__').replace('__ID__', heldId).replace(/^\/api/, '');
            const res = await client.post(url);
            if (res.data.transaction) {
                const formattedItems = (res.data.transaction.items || []).map(item => ({
                    menu_id: item.menu_id,
                    name: item.menu?.name ?? 'Menu',
                    price: item.price,
                    qty: item.qty,
                    notes: item.notes ?? '',
                }));
                setCart(formattedItems);
                setResumedTransactionId(res.data.transaction.id);
            }
            setRefreshTrigger(prev => prev + 1);
        } catch (e) {
            setErrorMessage(e.response?.data?.message || e.message || 'Terjadi kesalahan.');
            setRefreshTrigger(prev => prev + 1);
        }
    };

    const deleteHeldOrder = async (id) => {
        setLocalHeldOrders(prev =>
            prev.map(h => h.id === id ? { ...h, isExiting: true } : h)
        );
        // Delay sesuai durasi animasi exit sebelum benar-benar dihapus dari state
        setTimeout(async () => {
            setLocalHeldOrders(prev => prev.filter(h => h.id !== id));
            try {
                const url = (urls.cancel || '/api/pos/cancel/__ID__').replace('__ID__', id).replace(/^\/api/, '');
                await client.post(url);
                setRefreshTrigger(prev => prev + 1);
            } catch (e) {
                console.error("Gagal membatalkan transaksi tertahan:", e);
                setErrorMessage(e.response?.data?.message || e.message || 'Gagal membatalkan transaksi tertahan.');
            }
        }, 300);
    };

    if (loadingData && menus.length === 0) {
        return (
            <>
                <Head title="POS Transaksi" />
                <POSSkeleton />
            </>
        );
    }

    if (errorData && menus.length === 0) {
        return (
            <>
                <Head title="POS Transaksi" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data POS dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all active:scale-[0.97]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="POS Transaksi" />

            <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-brand-bg via-white to-brand-light/30 flex overflow-hidden">

                {/* ── PRODUCT AREA ── */}
                <div className="flex-1 flex h-[calc(100vh-72px)] overflow-hidden">
                    <div className="flex-1 p-5 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 flex-shrink-0">
                            <div>
                                <h1 className="text-2xl sm:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                                    POS Transaksi
                                </h1>
                                <p className="text-xs font-medium text-brand-dark/60 mt-0.5">
                                    Kasir: <span className="text-brand-dark font-semibold">{cashierName}</span>
                                </p>
                            </div>
                            <div className="relative w-[330px]">
                                <iconify-icon icon="solar:magnifer-linear"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary text-[18px]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari menu..."
                                    className="w-full h-[46px] rounded-xl bg-white border border-brand-light pl-11 pr-4 text-sm font-normal text-brand-dark placeholder-brand-dark/40 outline-none transition-colors shadow-sm hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">

                            {/* Categories */}
                            <div className="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0 pb-4">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${selectedCategory === null ? 'bg-black text-[#BFFF00] shadow-lg shadow-brand-primary/30 border-none' : 'bg-white text-brand-primary border border-brand-light hover:bg-gradient-to-br hover:from-white hover:to-brand-light/50 hover:text-brand-dark hover:border-brand-secondary hover:shadow-sm'} active:scale-[0.97]`}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${selectedCategory === null ? 'bg-[#BFFF00]/20' : 'bg-brand-light/50'}`}>
                                        <iconify-icon icon="solar:widget-linear" class="text-[18px]" />
                                    </div>
                                    <span className="text-xs font-bold tracking-wide">Semua</span>
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${selectedCategory === cat.id ? 'bg-black text-[#BFFF00] shadow-lg shadow-brand-primary/30 border-none' : 'bg-white text-brand-primary border border-brand-light hover:bg-gradient-to-br hover:from-white hover:to-brand-light/50 hover:text-brand-dark hover:border-brand-secondary hover:shadow-sm'} active:scale-[0.97]`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${selectedCategory === cat.id ? 'bg-[#BFFF00]/20' : 'bg-brand-light/50'}`}>
                                            <iconify-icon icon={cat.icon} class="text-[18px]" />
                                        </div>
                                        <span className="text-xs font-semibold text-center leading-tight px-1">{cat.name}</span>
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
                                            className="text-left bg-white rounded-2xl border-2 border-brand-light shadow-sm hover:shadow-md hover:shadow-brand-secondary/20 hover:border-brand-light focus:outline-none focus:ring-4 focus:ring-brand-light/80 active:scale-[0.97] transition-all duration-150 overflow-hidden flex flex-col group relative"
                                        >
                                            <div className="absolute inset-0 bg-brand-secondary/5 opacity-0 group-active:opacity-100 transition-opacity duration-75 z-10 pointer-events-none" />
                                            <div className="relative overflow-hidden h-[120px]">
                                                <MenuImage src={menu.image_url} name={menu.name} categoryName={menu.category_name} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                            </div>
                                            <div className="p-3.5 flex flex-col flex-1 bg-white z-20">
                                                <div className="space-y-1 mb-3 flex-1">
                                                    <h3 className="text-sm font-bold text-brand-dark leading-snug line-clamp-2">{menu.name}</h3>
                                                    <p className="text-xs font-normal text-brand-dark/50 line-clamp-1">{menu.description || menu.category_name}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-sm font-extrabold text-brand-dark">{formatRupiah(menu.price)}</span>
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-light/50 to-brand-light/30 text-brand-white flex items-center justify-center group-hover:bg-none group-hover:bg-black group-hover:text-white transition-all duration-150 shadow-sm">
                                                        <iconify-icon icon="solar:add-circle-linear" class="text-[20px]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {filteredMenus.length === 0 && (
                                    <p className="text-center text-brand-primary text-sm py-20 font-medium italic">
                                        Tidak ada menu ditemukan.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CART ── */}
                <div className="w-[340px] bg-white border-l border-brand-light shadow-[-10px_0_30px_rgb(var(--color-brand-primary)/0.08)] flex flex-col h-[calc(100dvh-72px)] relative z-10 flex-shrink-0">

                    {/* Cart header */}
                    <div className="h-[76px] border-b border-brand-light px-5 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-light to-white border border-brand-light/50 flex items-center justify-center">
                                <iconify-icon icon="solar:cart-large-2-linear" class="text-brand-secondary text-[18px]" />
                            </div>
                            <h3 className="text-sm font-bold text-brand-dark tracking-tight">Pesanan Aktif</h3>
                        </div>
                        <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg shadow-sm">
                            {cartItemCount} Item
                        </span>
                    </div>

                    {/* Held orders */}
                    {localHeldOrders.length > 0 && (
                        <div className={`px-5 py-3 border-b border-brand-light flex-shrink-0 bg-gradient-to-b from-brand-light/30 to-transparent held-order-container ${localHeldOrders.filter(h => !h.isExiting).length === 0 ? 'collapsed' : ''
                            }`}>
                            <p className="text-xs font-extrabold text-brand-dark/60 tracking-wider mb-2.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00] animate-pulse" />
                                Tertahan
                                <span className="text-brand-dark/40 font-semibold">({localHeldOrders.length})</span>
                            </p>
                            <div className="relative">
                                {/* pt-2 dikasih di sini biar tombol silang yang nongol ke atas ga kepotong sama overflow-x-auto */}
                                <div className="flex gap-2.5 overflow-x-auto pt-2 pb-1.5 scrollbar-hide">
                                    {localHeldOrders.map(held => (
                                        <div
                                            key={held.id}
                                            className={`group relative flex-shrink-0 held-order-item ${held.isEntering ? 'entering' : ''} ${held.isExiting ? 'exiting' : ''}`}
                                        >
                                            <button
                                                onClick={() => resumeOrder(held.id)}
                                                aria-label={`Lanjutkan pesanan ${held.label}, ${held.items_count} item, total ${formatRupiah(held.total)}`}
                                                className="text-left px-3 py-2 pr-6 rounded-xl bg-white border border-brand-light shadow-sm hover:border-brand-secondary transition-all duration-300 ease-in-out active:scale-[0.97] w-full"
                                            >
                                                <div className={`transition-all duration-300 ${held.isEntering || held.isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                                    <p className="text-xs font-bold text-brand-dark truncate max-w-[140px]">{held.label}</p>
                                                    <p className="text-xs font-normal text-brand-dark/50 mt-0.5 whitespace-nowrap">
                                                        {held.items_count} item · {formatRupiah(held.total)}
                                                    </p>
                                                    <p className={`text-[10px] font-medium mt-0.5 ${isHeldOrderStale(held.created_at) ? 'text-rose-500' : 'text-brand-dark/40'
                                                        }`}>
                                                        {formatRelativeTime(held.created_at)}
                                                    </p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteHeldOrder(held.id); }}
                                                aria-label={`Hapus pesanan tertahan ${held.label}`}
                                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm hover:bg-rose-600 active:scale-[0.9] transition-colors z-10"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {/* Fade dipertegas biar kelihatan jelas masih ada card berikutnya */}
                                <div className="absolute right-0 top-2 bottom-1.5 w-10 bg-gradient-to-l from-brand-light/60 via-brand-light/20 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Cart items */}
                    <div className="flex-1 min-h-0 relative flex flex-col">
                        <div className="flex-1 overflow-y-auto px-5 py-4 relative scrollbar-auto">
                            {/* Empty Cart Placeholder */}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-9 cart-empty-state ${cart.length === 0 ? '' : 'hidden-state hidden'
                                }`}>
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-light/50 to-white border border-brand-light flex items-center justify-center mb-4 shadow-inner">
                                    <iconify-icon icon="solar:cookie-linear" class="text-[38px] text-brand-secondary" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-dark">Keranjang masih kosong</h4>
                                <p className="text-xs font-normal text-brand-dark/50 mt-1">Pilih menu di sebelah kiri untuk menambahkan.</p>
                            </div>

                            {/* Active Cart Items */}
                            <div className={`space-y-4 cart-active-state ${cart.length > 0 ? '' : 'hidden-state hidden'
                                }`}>
                                {cart.map((item, index) => (
                                    <div key={`${item.menu_id}-${index}`} className="grid grid-cols-[1fr_92px_88px] gap-3 items-start pb-4 border-b border-brand-light last:border-0 last:pb-0">
                                        {/* Kolom 1: Nama + harga satuan */}
                                        <div className="min-w-0 pt-0.5">
                                            <p className="text-sm font-semibold text-brand-dark line-clamp-2">{item.name}</p>
                                            <p className="text-xs font-medium text-brand-dark/60 mt-0.5">{formatRupiah(item.price)} / item</p>
                                        </div>

                                        {/* Kolom 2: Stepper qty — kontras tombol minus dipertegas */}
                                        <div className="flex items-center justify-self-start gap-2">
                                            <button
                                                onClick={() => decreaseQty(index)}
                                                disabled={loading || item.qty <= 1}
                                                aria-label={`Kurangi jumlah ${item.name}`}
                                                className="w-7 h-7 rounded-full bg-neutral-100 border border-[#D0D0D0] text-brand-dark text-sm font-bold flex items-center justify-center hover:bg-brand-light hover:border-brand-secondary active:scale-[0.97] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:border-[#D0D0D0]"
                                            >
                                                &minus;
                                            </button>
                                            <span className="text-xs font-bold w-5 text-center text-brand-dark">{item.qty}</span>
                                            <button
                                                onClick={() => increaseQty(index)}
                                                disabled={loading || (item.stock !== undefined && item.qty >= item.stock)}
                                                aria-label={`Tambah jumlah ${item.name}`}
                                                className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary text-white text-sm font-bold flex items-center justify-center hover:from-brand-primary hover:to-brand-dark active:scale-[0.97] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-brand-secondary disabled:hover:to-brand-primary"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Kolom 3: Total + Hapus */}
                                        <div className="text-right flex flex-col items-end pt-0.5">
                                            <p className="text-sm font-bold text-black whitespace-nowrap">{formatRupiah(item.price * item.qty)}</p>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                disabled={loading}
                                                aria-label={`Hapus ${item.name} dari keranjang`}
                                                className="text-xs font-semibold text-rose-500 mt-1.5 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-600 focus:bg-rose-50 focus:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 transition-colors active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Fade indicator — nunjukkin area cart items masih bisa discroll */}
                        {cart.length > 0 && (
                            <div className="h-6 bg-gradient-to-t from-white to-transparent relative z-10 pointer-events-none flex-shrink-0 -mt-6" />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-brand-light p-5 flex-shrink-0 bg-gradient-to-t from-brand-light/30 to-transparent">
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-sm font-medium text-brand-dark/60">
                                <span>Subtotal</span>
                                <span className="font-semibold text-brand-dark">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-medium text-brand-dark/60">
                                <span>Pajak ({taxPercent}%)</span>
                                <span className="font-semibold text-brand-dark">{formatRupiah(tax)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex items-center justify-between text-sm font-semibold text-emerald-600">
                                    <span>Diskon</span>
                                    <span>- {formatRupiah(discount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-4 mb-5 pt-4 border-t border-brand-light border-dashed">
                            <span className="text-sm font-extrabold text-brand-dark">Total Tagihan</span>
                            <span className="text-2xl font-extrabold text-black">
                                {formatRupiah(total)}
                            </span>
                        </div>

                        {errorMessage && (
                            <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl mb-3 text-center">
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={holdOrder}
                                disabled={!cart.length || loading}
                                className="flex-1 h-[52px] rounded-xl border border-brand-primary text-brand-primary font-semibold text-sm hover:bg-gradient-to-br hover:from-brand-light hover:to-white disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-1.5 bg-white active:scale-[0.97]"
                            >
                                <iconify-icon icon="solar:pause-circle-linear" class="text-lg" /> Tahan
                            </button>
                            <button
                                onClick={() => setShowPayment(true)}
                                disabled={!cart.length || loading}
                                className="flex-[2] h-[52px] rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary disabled:opacity-50 transition-all text-white flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.97]"
                            >
                                <span className="text-sm font-semibold">{loading ? 'Memproses...' : 'Bayar Sekarang'}</span>
                                {!loading && <iconify-icon icon="solar:arrow-right-linear" class="text-[20px]" />}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── PAYMENT MODAL ── */}
            {showPayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm p-4"
                    onClick={() => setShowPayment(false)}
                    onKeyDown={e => e.key === 'Escape' && setShowPayment(false)}
                >
                    <div className="bg-white rounded-2xl w-[450px] max-w-full p-7 shadow-2xl border border-brand-light"
                        onClick={e => e.stopPropagation()}>

                        <div className="mb-6 border-b border-brand-light pb-5">
                            <h3 className="text-lg font-bold text-brand-dark tracking-tight">
                                Selesaikan Pembayaran
                            </h3>
                            <div className="mt-2 flex justify-between items-end">
                                <p className="text-sm font-medium text-brand-dark/60">Total Tagihan</p>
                                <p className="font-extrabold text-2xl text-black">{formatRupiah(total)}</p>
                            </div>
                        </div>

                        <label className="block text-xs font-extrabold text-brand-dark/60 tracking-wider mb-2">
                            Metode Pembayaran
                        </label>
                        <CustomSelect
                            value={paymentMethod}
                            onChange={val => setPaymentMethod(val)}
                            options={[
                                { value: 'cash', label: '💵 Tunai (Cash)' },
                                { value: 'qris', label: '📱 QRIS' },
                                { value: 'transfer', label: '🏦 Transfer Bank' },
                                { value: 'debit', label: '💳 Kartu Debit/Kredit' }
                            ]}
                            className="w-full mb-5 h-12"
                        />

                        <label className="block text-xs font-extrabold text-brand-dark/60 tracking-wider mb-2">
                            Jumlah Dibayar
                        </label>
                        <div className="relative mb-3">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-dark/50">Rp</span>
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={e => setPaidAmount(Number(e.target.value))}
                                min={0}
                                step={1000}
                                className="w-full h-12 rounded-xl border border-brand-light bg-brand-light/10 text-lg font-bold text-brand-dark pl-12 pr-4 focus:outline-none focus:bg-white transition-colors hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap mb-5">
                            {getQuickCashSuggestions(total).map((cash) => (
                                <button
                                    key={cash}
                                    type="button"
                                    onClick={() => setPaidAmount(cash)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all active:scale-[0.97] ${paidAmount === cash ? 'bg-brand-primary text-white border-brand-primary shadow-sm' : 'bg-brand-light/30 text-brand-primary border-brand-light hover:bg-brand-light/75'}`}
                                >
                                    {cash === total ? 'Pas' : formatRupiah(cash)}
                                </button>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-brand-light/50 to-brand-light/20 p-4 rounded-xl border border-brand-light mb-6 flex justify-between items-center">
                            <p className="text-xs font-semibold text-brand-dark/60 capitalize tracking-wide">Kembalian</p>
                            <p className={`text-lg font-bold ${changeAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {changeAmount >= 0
                                    ? formatRupiah(changeAmount)
                                    : `Kurang ${formatRupiah(Math.abs(changeAmount))}`}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowPayment(false)}
                                className="flex-1 h-12 rounded-xl border border-brand-light bg-white text-sm font-semibold text-brand-dark hover:bg-gradient-to-r hover:from-white hover:to-brand-light/50 hover:text-brand-dark transition-colors active:scale-[0.97]">
                                Batal
                            </button>
                            <button
                                onClick={checkout}
                                disabled={loading || paidAmount < total}
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-primary hover:to-brand-dark text-white text-sm font-semibold shadow-lg shadow-brand-secondary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 active:scale-[0.97]"
                            >
                                <iconify-icon icon="solar:check-circle-linear" class="text-[18px]" />
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// POS.layout = (page) => <>{page}</>;
