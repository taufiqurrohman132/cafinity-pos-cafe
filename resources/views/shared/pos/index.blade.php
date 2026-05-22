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
        class="h-[calc(100vh-72px)] bg-gradient-to-br from-[#fbfbfe] via-white to-[#dddbff]/30 flex overflow-hidden">

        {{-- PRODUCT AREA --}}
        <div class="flex-1 flex h-[calc(100vh-72px)] overflow-hidden">

            <div class="flex-1 p-5 flex flex-col overflow-hidden">

                <div class="flex items-center justify-between mb-6 flex-shrink-0">
                    <div>
                        <h1 class="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">POS Transaksi</h1>
                        <p class="text-[12px] font-medium text-[#2f27ce] mt-0.5">Kasir: <span class="text-[#050316] font-bold">{{ $cashierName }}</span></p>
                    </div>

                    <div class="relative w-[330px]">
                        <iconify-icon icon="solar:magnifer-linear"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-[#2f27ce] text-[18px]"></iconify-icon>
                        <input type="text" x-model="search" placeholder="Cari menu..."
                            class="w-full h-[46px] rounded-xl bg-white border border-[#dddbff] pl-11 pr-4 text-[13px] outline-none focus:border-[#443dff] focus:ring-2 focus:ring-[#dddbff] transition-all font-semibold text-[#050316] placeholder-[#2f27ce]/50 shadow-sm">
                    </div>
                </div>

                <div class="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">

                    {{-- Categories --}}
                    <div class="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0 scrollbar-auto pb-4">
                        <button type="button" @click="selectedCategory = null"
                            :class="selectedCategory === null
                                ? 'bg-gradient-to-b from-[#443dff] to-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30 border-none'
                                : 'bg-white text-[#2f27ce] border border-[#dddbff] hover:bg-gradient-to-br hover:from-white hover:to-[#dddbff]/50 hover:text-[#050316] hover:border-[#443dff] hover:shadow-sm'"
                            class="rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all duration-300">
                            <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                                :class="selectedCategory === null ? 'bg-white/20' : 'bg-[#dddbff]/50'">
                                <iconify-icon icon="solar:widget-bold" class="text-[18px]"></iconify-icon>
                            </div>
                            <span class="text-[11px] font-extrabold tracking-wide">Semua</span>
                        </button>

                        <template x-for="cat in categories" :key="cat.id">
                            <button type="button" @click="selectedCategory = cat.id"
                                :class="selectedCategory === cat.id
                                    ? 'bg-gradient-to-b from-[#443dff] to-[#2f27ce] text-white shadow-lg shadow-[#2f27ce]/30 border-none'
                                    : 'bg-white text-[#2f27ce] border border-[#dddbff] hover:bg-gradient-to-br hover:from-white hover:to-[#dddbff]/50 hover:text-[#050316] hover:border-[#443dff] hover:shadow-sm'"
                                class="rounded-2xl h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all duration-300">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                                    :class="selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#dddbff]/50'">
                                    <iconify-icon :icon="cat.icon" class="text-[18px]"></iconify-icon>
                                </div>
                                <span class="text-[11px] font-bold text-center leading-tight px-1"
                                    x-text="cat.name"></span>
                            </button>
                        </template>
                    </div>

                   {{-- Menu grid --}}
                    <div class="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-auto p-1">
                        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            <template x-for="menu in filteredMenus" :key="menu.id">
                                <button type="button" @click="addToCart(menu)"
                                    class="text-left bg-white rounded-2xl border-2 border-transparent shadow-sm hover:shadow-md hover:shadow-[#443dff]/20 hover:border-[#dddbff] focus:outline-none focus:ring-4 focus:ring-[#dddbff]/80 focus:border-[#443dff] active:scale-[0.97] transition-all duration-150 overflow-hidden flex flex-col group relative">
                                    
                                    <div class="absolute inset-0 bg-[#443dff]/5 opacity-0 group-active:opacity-100 transition-opacity duration-75 z-10 pointer-events-none"></div>

                                    <div class="relative overflow-hidden h-[120px]">
                                        <img :src="menu.image_url" :alt="menu.name"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200">
                                        <div class="absolute inset-0 bg-gradient-to-t from-[#050316]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
                                    </div>
                                    
                                    <div class="p-3.5 flex flex-col flex-1 bg-white z-20">
                                        <div class="space-y-1 mb-3 flex-1">
                                            <h3 class="text-[13px] font-extrabold text-[#050316] leading-snug line-clamp-2" x-text="menu.name"></h3>
                                            <p class="text-[11px] font-medium text-gray-600 line-clamp-1"
                                                x-text=" menu.description || menu.category_name "></p>
                                        </div>
                                        <div class="flex items-center justify-between mt-auto">
                                            <span class="text-[#443dff] font-black text-[14px]"
                                                x-text="formatRupiah(menu.price)"></span>
                                            
                                            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#dddbff]/50 to-[#dddbff]/30 text-[#2f27ce] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#443dff] group-hover:to-[#2f27ce] group-hover:text-white group-focus:from-[#443dff] group-focus:to-[#2f27ce] group-focus:text-white transition-all duration-150 shadow-sm group-hover:shadow-[#443dff]/30">
                                                <iconify-icon icon="solar:add-circle-bold" class="text-[20px]"></iconify-icon>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </template>
                        </div>

                        <p x-show="filteredMenus.length === 0"
                            class="text-center text-[#2f27ce] text-sm py-20 font-medium italic">
                            Tidak ada menu ditemukan.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {{-- CART --}}
        <div class="w-[380px] bg-white border-l border-[#dddbff] shadow-[-10px_0_30px_rgba(47,39,206,0.08)] flex flex-col h-[calc(100vh-72px)] relative z-10">

            <div class="h-[76px] border-b border-[#dddbff] px-5 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dddbff] to-white border border-[#dddbff]/50 flex items-center justify-center">
                        <iconify-icon icon="solar:cart-large-2-bold-duotone" class="text-[#443dff] text-[18px]"></iconify-icon>
                    </div>
                    <h3 class="font-extrabold text-[15px] text-[#050316] tracking-tight">Pesanan Aktif</h3>
                </div>
                <span class="text-[11px] font-black bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white px-2.5 py-1 rounded-md shadow-sm"
                    x-text="cartItemCount + ' Item'"></span>
            </div>

            {{-- Held orders --}}
            <div x-show="heldOrders.length > 0" class="px-5 py-3 border-b border-[#dddbff] flex-shrink-0 bg-gradient-to-b from-[#dddbff]/30 to-transparent">
                <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2.5 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#443dff] animate-pulse"></span> Tertahan
                </p>
                <div class="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide">
                    <template x-for="held in heldOrders" :key="held.id">
                        <form :action="urls.resume.replace('__ID__', held.id)" method="POST" class="flex-shrink-0">
                            @csrf
                            <button type="submit"
                                class="text-left px-3 py-2 rounded-xl bg-white border border-[#dddbff] shadow-sm hover:border-[#443dff] hover:shadow-[#dddbff]/40 transition-all">
                                <p class="text-[11px] font-extrabold text-[#050316]" x-text="held.label"></p>
                                <p class="text-[10px] font-medium text-[#443dff] mt-0.5"
                                    x-text="held.items_count + ' item · ' + formatRupiah(held.total)"></p>
                            </button>
                        </form>
                    </template>
                </div>
            </div>

            {{-- Cart items --}}
            <div class="flex-1 overflow-y-auto px-5 py-4 scrollbar-auto">
                <template x-if="cart.length === 0">
                    <div class="h-full flex flex-col items-center justify-center text-center px-4">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#dddbff]/50 to-white border border-[#dddbff] flex items-center justify-center mb-4 shadow-inner">
                            <iconify-icon icon="solar:cookie-bold-duotone" class="text-[38px] text-[#443dff]"></iconify-icon>
                        </div>
                        <h4 class="text-[14px] font-bold text-[#2f27ce]">Keranjang masih kosong</h4>
                        <p class="text-[11px] text-[#2f27ce] mt-1">Pilih menu di sebelah kiri untuk menambahkan.</p>
                    </div>
                </template>

                <div class="space-y-4">
                    <template x-for="(item, index) in cart" :key="item.menu_id + '-' + index">
                        <div class="flex gap-3 items-start pb-4 border-b border-[#dddbff]/50 last:border-0 last:pb-0">
                            <div class="flex-1 min-w-0 pt-0.5">
                                <p class="text-[13px] font-bold text-[#050316] truncate" x-text="item.name"></p>
                                <p class="text-[11px] font-medium text-[#2f27ce] mt-0.5" x-text="formatRupiah(item.price) + ' / item'"></p>
                            </div>
                            <div class="flex items-center gap-1 flex-shrink-0 bg-gradient-to-br from-[#dddbff]/40 to-[#dddbff]/10 rounded-lg p-1 border border-[#dddbff]">
                                <button type="button" @click="decreaseQty(index)"
                                    class="w-6 h-6 rounded-md bg-white border border-[#dddbff] text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">&minus;</button>
                                <span class="text-[12px] font-extrabold w-6 text-center text-[#050316]" x-text="item.qty"></span>
                                <button type="button" @click="increaseQty(index)"
                                    class="w-6 h-6 rounded-md bg-gradient-to-br from-[#443dff] to-[#2f27ce] border-none text-white text-sm font-bold hover:from-[#2f27ce] hover:to-[#050316] transition-colors shadow-sm">+</button>
                            </div>
                            <div class="text-right flex-shrink-0 flex flex-col items-end pt-0.5 ml-2">
                                <p class="text-[13px] font-black text-[#443dff]"
                                    x-text="formatRupiah(item.price * item.qty)"></p>
                                <button type="button" @click="removeFromCart(index)"
                                    class="text-[10px] font-bold text-red-400 hover:text-red-600 mt-1.5 transition-colors uppercase tracking-wider">Hapus</button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            {{-- Footer --}}
            <div class="border-t border-[#dddbff] p-5 flex-shrink-0 bg-gradient-to-t from-[#dddbff]/30 to-transparent">
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between text-[13px] font-medium text-[#2f27ce]">
                        <span>Subtotal</span>
                        <span class="font-bold text-[#050316]" x-text="formatRupiah(subtotal)"></span>
                    </div>
                    <div class="flex items-center justify-between text-[13px] font-medium text-[#2f27ce]">
                        <span x-text="'Pajak (' + taxPercent + '%)'"></span>
                        <span class="font-bold text-[#050316]" x-text="formatRupiah(tax)"></span>
                    </div>
                    <div x-show="discount > 0" class="flex items-center justify-between text-[13px] font-extrabold text-[#443dff]">
                        <span>Diskon</span>
                        <span x-text="'- ' + formatRupiah(discount)"></span>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4 mb-5 pt-4 border-t border-[#dddbff] border-dashed">
                    <span class="font-extrabold text-[#050316] uppercase tracking-wide text-sm">Total Tagihan</span>
                    <span class="font-black text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#2f27ce] to-[#443dff] drop-shadow-sm" x-text="formatRupiah(total)"></span>
                </div>

                <p x-show="errorMessage" class="text-[11px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 mb-3 text-center" x-text="errorMessage"></p>

                <div class="flex gap-3">
                    <button type="button" @click="holdOrder()" :disabled="cart.length === 0 || loading"
                        class="flex-1 h-[52px] rounded-xl border border-[#2f27ce] text-[#2f27ce] font-bold text-[13px] hover:bg-gradient-to-br hover:from-[#dddbff] hover:to-white disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-1.5 bg-white">
                        <iconify-icon icon="solar:pause-circle-linear" class="text-lg"></iconify-icon> Tahan
                    </button>
                    <button type="button" @click="showPayment = true" :disabled="cart.length === 0 || loading"
                        class="flex-[2] h-[52px] rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] disabled:opacity-50 transition-all text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                        <span x-show="!loading" class="text-[14px]">Bayar Sekarang</span>
                        <span x-show="loading" class="text-[14px]">Memproses...</span>
                        <iconify-icon x-show="!loading" icon="solar:arrow-right-linear" class="text-[20px]"></iconify-icon>
                    </button>
                </div>
            </div>
        </div>

        {{-- Payment modal --}}
        <div x-show="showPayment" x-cloak
            class="fixed inset-0 z-50 flex items-center justify-center bg-[#050316]/60 backdrop-blur-sm p-4 transition-opacity"
            @keydown.escape.window="showPayment = false">
            <div @click.outside="showPayment = false"
                class="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl border border-[#dddbff] transform transition-all">
                
                <div class="mb-6 border-b border-[#dddbff] pb-5">
                    <h3 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">Selesaikan Pembayaran</h3>
                    <div class="mt-2 flex justify-between items-end">
                        <p class="text-sm font-medium text-[#2f27ce]">Total Tagihan</p>
                        <p class="font-black text-2xl text-[#2f27ce]" x-text="formatRupiah(total)"></p>
                    </div>
                </div>

                <label class="block text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">Metode Pembayaran</label>
                <select x-model="paymentMethod"
                    class="w-full mb-5 h-12 rounded-xl border border-[#dddbff] bg-gradient-to-r from-[#dddbff]/30 to-[#fbfbfe] text-sm font-bold text-[#050316] px-4 focus:outline-none focus:ring-2 focus:ring-[#443dff] focus:bg-white focus:border-[#443dff] transition-all cursor-pointer">
                    <option value="cash">💵 Tunai (Cash)</option>
                    <option value="qris">📱 QRIS</option>
                    <option value="transfer">🏦 Transfer Bank</option>
                    <option value="debit">💳 Kartu Debit/Kredit</option>
                </select>

                <label class="block text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">Jumlah Dibayar</label>
                <div class="relative mb-5">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#2f27ce]">Rp</span>
                    <input type="number" x-model.number="paidAmount" min="0" step="1000"
                        class="w-full h-12 rounded-xl border border-[#dddbff] bg-[#dddbff]/10 text-lg font-black text-[#050316] pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#443dff] focus:bg-white focus:border-[#443dff] transition-all placeholder-[#2f27ce]/40">
                </div>

                <div class="bg-gradient-to-r from-[#dddbff]/50 to-[#dddbff]/20 p-4 rounded-xl border border-[#dddbff] mb-6 flex justify-between items-center">
                    <p class="text-xs font-bold text-[#2f27ce] uppercase tracking-wide">Kembalian</p>
                    <p class="text-lg font-black"
                        :class="changeAmount >= 0 ? 'text-[#443dff]' : 'text-red-500'"
                        x-text="changeAmount >= 0 ? formatRupiah(changeAmount) : 'Kurang ' + formatRupiah(Math.abs(changeAmount))">
                    </p>
                </div>

                <div class="flex gap-3 mt-2">
                    <button type="button" @click="showPayment = false"
                        class="flex-1 h-12 rounded-xl border border-[#dddbff] bg-white text-sm font-bold text-[#2f27ce] hover:bg-gradient-to-r hover:from-white hover:to-[#dddbff]/50 hover:text-[#050316] transition-colors">Batal</button>
                    <button type="button" @click="checkout()"
                        :disabled="loading || paidAmount < total"
                        class="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white text-sm font-extrabold shadow-lg shadow-[#443dff]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
                        <iconify-icon icon="solar:check-circle-bold" class="text-[18px]"></iconify-icon> Konfirmasi
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