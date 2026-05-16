@extends('layouts.app')

@section('content')
    <div class="h-[calc(100vh-72px)] bg-gray-100 flex overflow-hidden">

        {{-- CONTENT --}}
        <div class="flex-1 flex h-[calc(100vh-72px)] overflow-hidden">

            {{-- PRODUCT AREA --}}
            <div class="flex-1 p-5 flex flex-col overflow-hidden">

                {{-- Header --}}
                <div class="flex items-center justify-between mb-5 flex-shrink-0">

                    <h1 class="text-[28px] font-bold text-gray-800">
                        POS Transaksi
                    </h1>

                    {{-- Search --}}
                    <div class="relative w-[330px]">

                        <iconify-icon icon="solar:magnifer-linear"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                        </iconify-icon>

                        <input type="text" placeholder="Cari menu..."
                            class="w-full h-[44px] rounded-xl bg-white border border-gray-200 pl-11 pr-4 text-[13px] outline-none focus:ring-0 focus:border-gray-300">

                    </div>

                </div>

                {{-- LEFT CONTENT --}}
                <div class="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">

                    {{-- CATEGORY --}}
                    <div class="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0">

                        {{-- ACTIVE --}}
                        <button
                            class="rounded-2xl bg-emerald-500 h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 text-white shadow-sm">

                            <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <iconify-icon icon="solar:cup-hot-bold" class="text-[18px]"></iconify-icon>
                            </div>

                            <span class="text-[11px] font-semibold">
                                Coffee
                            </span>

                        </button>

                        {{-- ITEM --}}
                        <button
                            class="rounded-2xl bg-white h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-green-100 transition">

                            <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <iconify-icon icon="solar:cup-star-linear" class="text-[18px]"></iconify-icon>
                            </div>

                            <span class="text-[11px] font-medium">
                                Non-Coffee
                            </span>

                        </button>

                        {{-- ITEM --}}
                        <button
                            class="rounded-2xl bg-white h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-green-100 transition">

                            <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <iconify-icon icon="solar:plate-linear" class="text-[18px]"></iconify-icon>
                            </div>

                            <span class="text-[11px] font-medium text-center leading-tight px-1">
                                Main Course
                            </span>

                        </button>

                        {{-- ITEM --}}
                        <button
                            class="rounded-2xl bg-white h-[82px] flex-shrink-0 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-green-100 transition">

                            <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <iconify-icon icon="solar:donut-linear" class="text-[18px]"></iconify-icon>
                            </div>

                            <span class="text-[11px] font-medium">
                                Snacks
                            </span>

                        </button>

                    </div>

                    {{-- PRODUCTS --}}
                    <div class="flex-1 overflow-y-auto pr-1">

                        <div class="grid grid-cols-4 gap-4">

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear" class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear" class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear" class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear" class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear" class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {{-- CARD --}}
                            <div
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                                <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop"
                                    class="w-full h-[120px] object-cover">

                                <div class="p-3 flex flex-col flex-1">

                                    <div class="space-y-1">
                                        <h3 class="text-[13px] font-semibold text-gray-800">
                                            Caramel Macchiato
                                        </h3>

                                        <p class="text-[11px] text-gray-400 leading-relaxed">
                                            Espresso with caramel
                                        </p>
                                    </div>

                                    <div class="mt-3 flex items-center justify-between">

                                        <span class="text-emerald-500 font-bold text-[13px]">
                                            Rp 38.000
                                        </span>

                                        <button
                                            class="w-7 h-7 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition">
                                            <iconify-icon icon="solar:add-circle-linear"
                                                class="text-[18px]"></iconify-icon>
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>


        {{-- RIGHT CART --}}
        {{-- RIGHT CART --}}
        <div class="w-[370px] bg-white border-l border-gray-100 shadow-xl flex flex-col h-[calc(100vh-72px)]">

            {{-- HEADER --}}
            <div class="h-[72px] border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">

                <div class="flex items-center gap-2">
                    <iconify-icon icon="solar:cart-large-2-linear" class="text-emerald-500 text-[18px]"></iconify-icon>

                    <h3 class="font-semibold text-[14px] text-gray-800">
                        Pesanan Aktif
                    </h3>
                </div>

                <span class="text-[11px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                    0 Items
                </span>

            </div>

            {{-- EMPTY --}}
            <div class="flex-1 flex flex-col items-center justify-center text-center px-8 overflow-y-auto">

                <div class="w-20 h-20 rounded-full bg-[#f5f6f8] flex items-center justify-center mb-4">
                    <iconify-icon icon="solar:cookie-linear" class="text-[34px] text-gray-300"></iconify-icon>
                </div>

                <h4 class="text-[14px] font-medium text-gray-500">
                    Keranjang masih kosong
                </h4>

            </div>

            {{-- FOOTER --}}
            <div class="border-t border-gray-100 p-5 flex-shrink-0">

                <div class="space-y-3">

                    <div class="flex items-center justify-between text-[13px] text-gray-500">
                        <span>Subtotal</span>
                        <span>Rp 0</span>
                    </div>

                    <div class="flex items-center justify-between text-[13px] text-gray-500">
                        <span>Pajak (10%)</span>
                        <span>Rp 0</span>
                    </div>

                </div>

                <div class="flex items-center justify-between mt-4 mb-5">

                    <span class="font-bold text-gray-800">
                        Total Tagihan
                    </span>

                    <span class="font-bold text-[22px] text-emerald-500">
                        Rp 0
                    </span>

                </div>

                <button
                    class="w-full h-[52px] rounded-xl bg-emerald-300 hover:bg-emerald-400 transition text-white font-semibold flex items-center justify-center gap-2">

                    Bayar Sekarang

                    <iconify-icon icon="solar:arrow-right-linear" class="text-[18px]"></iconify-icon>

                </button>

            </div>

        </div>
    </div>
@endsection
