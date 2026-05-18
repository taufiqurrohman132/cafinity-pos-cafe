@extends('layouts.app')

@section('content')
    <div
        x-data="posApp({
            menus: @js($menus),
            categories: @js($categories),
            heldOrders: @js($heldOrders),
            initialCart: @js($initialCart),
            resumedTransactionId: @js($resumedTransactionId),
            taxPercent: {{ $taxPercent }},
            promotions: @js($activePromotions),
            urls: {
                checkout: @js(route('pos.checkout')),
                hold: @js(route('pos.hold')),
                resume: @js(route('pos.resume', ['id' => '__ID__'])),
            },
            csrf: @js(csrf_token()),
        })"
        class="h-[calc(100vh-72px)] bg-gray-100 flex overflow-hidden">

        {{-- PRODUCT AREA --}}
        <div class="flex-1 flex h-[calc(100vh-72px)] overflow-hidden">

            <div class="flex-1 p-5 flex flex-col overflow-hidden">

                <div class="flex items-center justify-between mb-5 flex-shrink-0">
                    <div>
                        <h1 class="text-[28px] font-bold text-gray-800">POS Transaksi</h1>
                        <p class="text-[12px] text-gray-400 mt-0.5">Kasir: {{ $cashierName }}</p>
                    </div>

                    <div class="relative w-[330px]">
                        <iconify-icon icon="solar:magnifer-linear"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]"></iconify-icon>
                        <input type="text" x-model="search" placeholder="Cari menu..."
                            class="w-full h-[44px] rounded-xl bg-white border border-gray-200 pl-11 pr-4 text-[13px] outline-none focus:border-emerald-400">
                    </div>
                </div>

                <div class="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">

                    {{-- Categories --}}
                    <div class="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0 scrollbar-auto">
                        <button type="button" @click="selectedCategory = null"
                            :class="selectedCategory === null
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-white text-gray-500 hover:bg-green-100'"
                            class="rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition">
                            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                                :class="selectedCategory === null ? 'bg-white/20' : 'bg-white shadow-sm'">
                                <iconify-icon icon="solar:widget-bold" class="text-[18px]"></iconify-icon>
                            </div>
                            <span class="text-[11px] font-semibold">Semua</span>
                        </button>

                        <template x-for="cat in categories" :key="cat.id">
                            <button type="button" @click="selectedCategory = cat.id"
                                :class="selectedCategory === cat.id
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'bg-white text-gray-500 hover:bg-green-100'"
                                class="rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                                    :class="selectedCategory === cat.id ? 'bg-white/20' : 'bg-white shadow-sm'">
                                    <iconify-icon :icon="cat.icon" class="text-[18px]"></iconify-icon>
                                </div>
                                <span class="text-[11px] font-medium text-center leading-tight px-1"
                                    x-text="cat.name"></span>
                            </button>
                        </template>
                    </div>

                    {{-- Menu grid --}}
                    <div class="flex-1 overflow-y-auto pr-1 scrollbar-auto">
                        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            <template x-for="menu in filteredMenus" :key="menu.id">
                                <div
                                    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                    <img :src="menu.image_url" :alt="menu.name"
                                        class="w-full h-[120px] object-cover">
                                    <div class="p-3 flex flex-col flex-1">
                                        <div class="space-y-1">
                                            <h3 class="text-[13px] font-semibold text-gray-800" x-text="menu.name"></h3>
                                            <p class="text-[11px] text-gray-400 leading-relaxed line-clamp-2"
                                                x-text="menu.description || menu.category_name"></p>
                                        </div>
                                        <div class="mt-3 flex items-center justify-between">
                                            <span class="text-emerald-500 font-bold text-[13px]"
                                                x-text="formatRupiah(menu.price)"></span>
                                            <button type="button" @click="addToCart(menu)"
                                                class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                                <iconify-icon icon="solar:add-circle-linear"
                                                    class="text-[18px]"></iconify-icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <p x-show="filteredMenus.length === 0"
                            class="text-center text-gray-400 text-sm py-16 italic">
                            Tidak ada menu ditemukan.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {{-- CART --}}
        <div class="w-[370px] bg-white border-l border-gray-100 shadow-xl flex flex-col h-[calc(100vh-72px)]">

            <div class="h-[72px] border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2">
                    <iconify-icon icon="solar:cart-large-2-linear" class="text-emerald-500 text-[18px]"></iconify-icon>
                    <h3 class="font-semibold text-[14px] text-gray-800">Pesanan Aktif</h3>
                </div>
                <span class="text-[11px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full"
                    x-text="cartItemCount + ' Items'"></span>
            </div>

            {{-- Held orders --}}
            <div x-show="heldOrders.length > 0" class="px-4 py-2 border-b border-gray-50 flex-shrink-0">
                <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">Tertahan</p>
                <div class="flex gap-2 overflow-x-auto pb-1">
                    <template x-for="held in heldOrders" :key="held.id">
                        <form :action="urls.resume.replace('__ID__', held.id)" method="POST" class="flex-shrink-0">
                            @csrf
                            <button type="submit"
                                class="text-left px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition">
                                <p class="text-[11px] font-bold text-amber-800" x-text="held.label"></p>
                                <p class="text-[10px] text-amber-600"
                                    x-text="held.items_count + ' item · ' + formatRupiah(held.total)"></p>
                            </button>
                        </form>
                    </template>
                </div>
            </div>

            {{-- Cart items --}}
            <div class="flex-1 overflow-y-auto px-4 py-3 scrollbar-auto">
                <template x-if="cart.length === 0">
                    <div class="h-full flex flex-col items-center justify-center text-center px-4">
                        <div class="w-20 h-20 rounded-full bg-[#f5f6f8] flex items-center justify-center mb-4">
                            <iconify-icon icon="solar:cookie-linear" class="text-[34px] text-gray-300"></iconify-icon>
                        </div>
                        <h4 class="text-[14px] font-medium text-gray-500">Keranjang masih kosong</h4>
                    </div>
                </template>

                <div class="space-y-3">
                    <template x-for="(item, index) in cart" :key="item.menu_id + '-' + index">
                        <div class="flex gap-3 items-start border-b border-gray-50 pb-3">
                            <div class="flex-1 min-w-0">
                                <p class="text-[13px] font-semibold text-gray-800 truncate" x-text="item.name"></p>
                                <p class="text-[11px] text-gray-400" x-text="formatRupiah(item.price) + ' / item'"></p>
                            </div>
                            <div class="flex items-center gap-1.5 flex-shrink-0">
                                <button type="button" @click="decreaseQty(index)"
                                    class="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold">−</button>
                                <span class="text-[13px] font-semibold w-5 text-center" x-text="item.qty"></span>
                                <button type="button" @click="increaseQty(index)"
                                    class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">+</button>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-[13px] font-bold text-gray-800"
                                    x-text="formatRupiah(item.price * item.qty)"></p>
                                <button type="button" @click="removeFromCart(index)"
                                    class="text-[10px] text-red-400 hover:text-red-600">Hapus</button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            {{-- Footer --}}
            <div class="border-t border-gray-100 p-5 flex-shrink-0">
                <div class="space-y-3">
                    <div class="flex items-center justify-between text-[13px] text-gray-500">
                        <span>Subtotal</span>
                        <span x-text="formatRupiah(subtotal)"></span>
                    </div>
                    <div class="flex items-center justify-between text-[13px] text-gray-500">
                        <span x-text="'Pajak (' + taxPercent + '%)'"></span>
                        <span x-text="formatRupiah(tax)"></span>
                    </div>
                    <div x-show="discount > 0" class="flex items-center justify-between text-[13px] text-emerald-600">
                        <span>Diskon</span>
                        <span x-text="'- ' + formatRupiah(discount)"></span>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4 mb-4">
                    <span class="font-bold text-gray-800">Total Tagihan</span>
                    <span class="font-bold text-[22px] text-emerald-500" x-text="formatRupiah(total)"></span>
                </div>

                <p x-show="errorMessage" class="text-[11px] text-red-500 mb-2" x-text="errorMessage"></p>

                <div class="flex gap-2">
                    <button type="button" @click="holdOrder()" :disabled="cart.length === 0 || loading"
                        class="flex-1 h-[48px] rounded-xl border border-gray-200 text-gray-600 font-semibold text-[13px] hover:bg-gray-50 disabled:opacity-40 transition">
                        Tahan
                    </button>
                    <button type="button" @click="showPayment = true" :disabled="cart.length === 0 || loading"
                        class="flex-[2] h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 transition text-white font-semibold flex items-center justify-center gap-2">
                        <span x-show="!loading">Bayar Sekarang</span>
                        <span x-show="loading">Memproses...</span>
                        <iconify-icon x-show="!loading" icon="solar:arrow-right-linear" class="text-[18px]"></iconify-icon>
                    </button>
                </div>
            </div>
        </div>

        {{-- Payment modal --}}
        <div x-show="showPayment" x-cloak
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @keydown.escape.window="showPayment = false">
            <div @click.outside="showPayment = false"
                class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h3 class="text-lg font-bold text-gray-800 mb-1">Pembayaran</h3>
                <p class="text-sm text-gray-500 mb-4">Total: <span class="font-bold text-emerald-600"
                        x-text="formatRupiah(total)"></span></p>

                <label class="block text-xs font-semibold text-gray-500 mb-1">Metode Pembayaran</label>
                <select x-model="paymentMethod"
                    class="w-full mb-4 h-10 rounded-xl border border-gray-200 text-sm px-3">
                    <option value="cash">Tunai</option>
                    <option value="qris">QRIS</option>
                    <option value="transfer">Transfer</option>
                    <option value="debit">Debit</option>
                </select>

                <label class="block text-xs font-semibold text-gray-500 mb-1">Jumlah Dibayar</label>
                <input type="number" x-model.number="paidAmount" min="0" step="1000"
                    class="w-full mb-4 h-10 rounded-xl border border-gray-200 text-sm px-3">

                <p class="text-sm mb-4"
                    :class="changeAmount >= 0 ? 'text-gray-600' : 'text-red-500'">
                    Kembalian: <span class="font-bold" x-text="formatRupiah(Math.max(0, changeAmount))"></span>
                </p>

                <div class="flex gap-2">
                    <button type="button" @click="showPayment = false"
                        class="flex-1 h-10 rounded-xl border text-sm font-semibold text-gray-600">Batal</button>
                    <button type="button" @click="checkout()"
                        :disabled="loading || paidAmount < total"
                        class="flex-1 h-10 rounded-xl bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40">
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    </div>

    <style>[x-cloak] { display: none !important; }</style>
    <script>
            function posApp(config) {
                return {
                    menus: config.menus,
                    categories: config.categories,
                    heldOrders: config.heldOrders,
                    taxPercent: config.taxPercent,
                    promotions: config.promotions,
                    urls: config.urls,
                    csrf: config.csrf,
                    resumedTransactionId: config.resumedTransactionId,

                    search: '',
                    selectedCategory: null,
                    cart: config.initialCart ?? [],
                    showPayment: false,
                    paymentMethod: 'cash',
                    paidAmount: 0,
                    loading: false,
                    errorMessage: '',

                    init() {
                        this.$watch('total', (val) => {
                            if (this.paidAmount < val) this.paidAmount = val;
                        });
                    },

                    get filteredMenus() {
                        const q = this.search.trim().toLowerCase();
                        return this.menus.filter((m) => {
                            if (this.selectedCategory !== null && m.category_id !== this.selectedCategory) {
                                return false;
                            }
                            if (!q) return true;
                            return m.name.toLowerCase().includes(q) ||
                                (m.description && m.description.toLowerCase().includes(q));
                        });
                    },

                    get cartItemCount() {
                        return this.cart.reduce((s, i) => s + i.qty, 0);
                    },

                    get subtotal() {
                        return this.cart.reduce((s, i) => s + i.price * i.qty, 0);
                    },

                    get tax() {
                        return Math.round(this.subtotal * this.taxPercent / 100);
                    },

                    get discount() {
                        return 0;
                    },

                    get total() {
                        return Math.max(0, this.subtotal + this.tax - this.discount);
                    },

                    get changeAmount() {
                        return this.paidAmount - this.total;
                    },

                    formatRupiah(amount) {
                        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
                    },

                    addToCart(menu) {
                        const existing = this.cart.find((i) => i.menu_id === menu.id);
                        if (existing) {
                            existing.qty++;
                        } else {
                            this.cart.push({
                                menu_id: menu.id,
                                name: menu.name,
                                price: menu.price,
                                qty: 1,
                                notes: '',
                            });
                        }
                        this.errorMessage = '';
                    },

                    increaseQty(index) {
                        this.cart[index].qty++;
                    },

                    decreaseQty(index) {
                        if (this.cart[index].qty > 1) {
                            this.cart[index].qty--;
                        } else {
                            this.removeFromCart(index);
                        }
                    },

                    removeFromCart(index) {
                        this.cart.splice(index, 1);
                    },

                    buildPayload() {
                        return {
                            items: this.cart.map((i) => ({
                                menu_id: i.menu_id,
                                qty: i.qty,
                                notes: i.notes || null,
                            })),
                            discount: this.discount,
                            tax: this.tax,
                            payment_method: this.paymentMethod,
                            paid_amount: this.paidAmount,
                            held_transaction_id: this.resumedTransactionId,
                        };
                    },

                    async checkout() {
                        if (this.cart.length === 0) return;
                        this.loading = true;
                        this.errorMessage = '';

                        try {
                            const res = await fetch(this.urls.checkout, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'X-CSRF-TOKEN': this.csrf,
                                },
                                body: JSON.stringify(this.buildPayload()),
                            });

                            const data = await res.json();

                            if (!res.ok) {
                                throw new Error(data.message || 'Checkout gagal');
                            }

                            window.location.href = data.redirect;
                        } catch (e) {
                            this.errorMessage = e.message || 'Terjadi kesalahan saat checkout.';
                        } finally {
                            this.loading = false;
                        }
                    },

                    async holdOrder() {
                        if (this.cart.length === 0) return;
                        this.loading = true;
                        this.errorMessage = '';

                        try {
                            const res = await fetch(this.urls.hold, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'X-CSRF-TOKEN': this.csrf,
                                },
                                body: JSON.stringify({
                                    items: this.buildPayload().items,
                                }),
                            });

                            if (!res.ok) {
                                const data = await res.json();
                                throw new Error(data.message || 'Gagal menahan pesanan');
                            }

                            window.location.reload();
                        } catch (e) {
                            this.errorMessage = e.message || 'Terjadi kesalahan.';
                        } finally {
                            this.loading = false;
                        }
                    },
                };
            }
    </script>
@endsection
