@extends('layouts.app')

@section('content')
    <div class="h-full flex flex-col overflow-hidden">


        <div class="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-0">

            {{-- Main Content (Left) --}}
            <div class="xl:col-span-9 min-h-0 overflow-y-auto space-y-6 p-4 md:py-6 md:pl-6 bg-gray-50 scrollbar-auto">

                {{-- Top Header --}}
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                        <p class="text-gray-500 mt-1">Selamat datang kembali, Alex. Berikut ringkasan performa cafe Anda hari
                            ini.
                        </p>
                    </div>

                </div>

                {{-- 3. Top Stats Cards (4 items) --}}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {{-- Stok Rendah --}}
                    <x-stat-card title="Stok Rendah" value="12 Item" trend="-8%" trend-type="down"
                        icon="heroicon-o-exclamation-triangle" icon-bg="bg-red-100" icon-color="text-red-600"
                        note="Segera Restock!" note-color="text-red-500" />

                    {{-- PO Menunggu --}}
                    <x-stat-card title="PO Menunggu" value="5 Berkas" trend="+3" trend-type="up"
                        icon="heroicon-o-document-duplicate" icon-bg="bg-blue-100" icon-color="text-blue-600"
                        note="3 perlu persetujuan" note-color="text-blue-500" />

                    {{-- Total SKU --}}
                    <x-stat-card title="Total SKU" value="142 Item" trend="+4" trend-type="up"
                        icon="heroicon-o-cube-transparent" icon-bg="bg-green-100" icon-color="text-green-600"
                        note="+4 item bulan ini" note-color="text-green-600" />

                    {{-- Nilai Inventaris --}}
                    <x-stat-card title="Nilai Inventaris" value="Rp 42.5M" trend="" trend-type="up"
                        icon="heroicon-o-presentation-chart-line" icon-bg="bg-emerald-100" icon-color="text-emerald-600" />
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

                    {{-- Stock Movement Chart --}}
                    <div class="xl:col-span-8">
                        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="font-bold text-gray-800">Pergerakan Stok</h3>
                                <div class="flex gap-2">
                                    <select class="text-xs border-gray-200 rounded-lg py-1 px-3 focus:ring-green-500">
                                        <option>7 Hari Terakhir</option>
                                    </select>
                                </div>
                            </div>
                            {{-- Mock Chart Bars --}}
                            <div class="flex flex-1 items-end justify-between h-48 gap-2 pt-4 border-b">
                                @foreach ([40, 30, 50, 45, 60, 80, 55] as $val)
                                    <div class="flex-1 flex flex-col items-center gap-1 group">
                                        <div class="w-full flex gap-1 items-end h-full">
                                            <div class="flex-1 bg-green-500 rounded-t-sm"
                                                style="height: {{ $val }}%">
                                            </div>
                                            <div class="flex-1 bg-green-100 rounded-t-sm"
                                                style="height: {{ $val - 15 }}%">
                                            </div>
                                        </div>
                                        <span class="text-[10px] text-gray-400 mt-2">Sen</span>
                                    </div>
                                @endforeach
                            </div>
                            <div class="flex gap-4 mt-4 text-[10px] font-medium justify-center">
                                <span class="flex items-center gap-1"><span
                                        class="w-2 h-2 rounded-full bg-green-500"></span>
                                    Stok
                                    Masuk</span>
                                <span class="flex items-center gap-1"><span
                                        class="w-2 h-2 rounded-full bg-green-100"></span>
                                    Stok
                                    Keluar</span>
                            </div>
                        </div>
                    </div>

                    {{-- Ringkasan Menu --}}
                    <div class="xl:col-span-4">

                        <div class="bg-[#FEFEFD] rounded-3xl border border-[#ECEEE7] shadow-sm p-6 h-full">

                            {{-- Header --}}
                            <div class="mb-6">
                                <h3 class=" font-bold text-gray-900">
                                    Ringkasan Menu
                                </h3>

                                <p class="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Status ketersediaan katalog menu
                                </p>
                            </div>

                            {{-- Menu Items --}}
                            <div class="space-y-5">

                                {{-- Item --}}
                                <div class="flex items-center justify-between">

                                    <div class="flex items-center gap-4">

                                        {{-- Icon --}}
                                        <div
                                            class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                            <iconify-icon icon="solar:cup-hot-linear" class="text-2xl"></iconify-icon>
                                        </div>

                                        {{-- Content --}}
                                        <div>
                                            <h4 class="text-sm font-bold text-gray-800 leading-tight">
                                                Minuman
                                                <br>
                                                (Coffee/Non)
                                            </h4>

                                            <p class="text-xs text-gray-500 mt-1">
                                                48 Item Aktif
                                            </p>
                                        </div>
                                    </div>

                                    {{-- Status --}}
                                    <span class="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                                        Ready
                                    </span>
                                </div>

                                {{-- Item --}}
                                <div class="flex items-center justify-between">

                                    <div class="flex items-center gap-4">

                                        {{-- Icon --}}
                                        <div
                                            class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center">
                                            <iconify-icon icon="solar:chef-hat-linear" class="text-2xl"></iconify-icon>
                                        </div>

                                        {{-- Content --}}
                                        <div>
                                            <h4 class="text-sm font-bold text-gray-800 leading-tight">
                                                Makanan
                                                <br>
                                                Utama
                                            </h4>

                                            <p class="text-xs text-gray-500 mt-1">
                                                12 Item Aktif
                                            </p>
                                        </div>
                                    </div>

                                    {{-- Status --}}
                                    <span class="px-2 py-1 rounded-full bg-orange-100 text-orange-500 text-[10px] font-bold">
                                        Limited
                                    </span>
                                </div>

                                {{-- Item --}}
                                <div class="flex items-center justify-between">

                                    <div class="flex items-center gap-4">

                                        {{-- Icon --}}
                                        <div
                                            class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                            <iconify-icon icon="solar:cookie-linear" class="text-2xl"></iconify-icon>
                                        </div>

                                        {{-- Content --}}
                                        <div>
                                            <h4 class="text-sm font-bold text-gray-800 leading-tight">
                                                Snack &
                                                <br>
                                                Pastry
                                            </h4>

                                            <p class="text-xs text-gray-500 mt-1">
                                                24 Item Aktif
                                            </p>
                                        </div>
                                    </div>

                                    {{-- Status --}}
                                    <span class="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                                        Ready
                                    </span>
                                </div>
                            </div>

                            {{-- Button --}}
                            <button
                                class="w-full mt-7 border border-gray-200 hover:bg-gray-50 transition py-2 rounded-2xl text-xs font-semibold text-gray-700">
                                Kelola Menu Catalog
                            </button>

                        </div>
                    </div>
                </div>

                {{-- Analisis HPP Recipe --}}
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-6 flex justify-between items-center border-b border-gray-50">
                        <div>
                            <h3 class="font-bold text-gray-800">Analisis HPP Resep</h3>
                            <p class="text-xs text-gray-400">Menu dengan margin kritis atau keuntungan tinggi</p>
                        </div>
                        <button
                            class="text-xs border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-600 flex items-center gap-2">
                            <x-heroicon-o-document-magnifying-glass class="w-4 h-4" /> Detail Recipe Costing
                        </button>
                    </div>
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-[10px] uppercase text-gray-400 tracking-wider">
                            <tr>
                                <th class="px-6 py-4 font-semibold">Nama Menu</th>
                                <th class="px-4 py-4 font-semibold">HPP (Estimasi)</th>
                                <th class="px-4 py-4 font-semibold">Harga Jual</th>
                                <th class="px-4 py-4 font-semibold text-center">Margin (%)</th>
                                <th class="px-6 py-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-gray-50">
                            <tr class="hover:bg-gray-50/50 transition">
                                <td class="px-6 py-4 font-bold text-gray-700">Caramel Macchiato</td>
                                <td class="px-4 py-4 text-gray-500">Rp 12.500</td>
                                <td class="px-4 py-4 text-gray-500">Rp 35.000</td>
                                <td class="px-4 py-4 text-center text-green-600 font-bold">64%</td>
                                <td class="px-6 py-4 text-right"><span
                                        class="px-2 py-1 bg-gray-100 text-[10px] rounded-full text-gray-500 font-bold">Normal</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-bold text-gray-700">Beef Croissant</td>
                                <td class="px-4 py-4 text-gray-500">Rp 18.000</td>
                                <td class="px-4 py-4 text-gray-500">Rp 28.000</td>
                                <td class="px-4 py-4 text-center text-red-500 font-bold">35%</td>
                                <td class="px-6 py-4 text-right"><span
                                        class="px-2 py-1 bg-red-100 text-[10px] rounded-full text-red-600 font-bold">Low
                                        Margin</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            {{-- Sidebar (Right) --}}
            <div class="xl:col-span-3 min-h-0 overflow-y-auto space-y-6 p-4 md:p-6 md:pl-0">
                {{-- Quick Action --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <x-heroicon-o-bolt class="w-4 h-4" /> Aksi Cepat
                    </h4>
                    <div class="space-y-3">
                        <button
                            class="w-full bg-[#10B981] hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition">
                            <span>+</span> Input Stok Masuk
                        </button>
                        <button
                            class="w-full border border-gray-100 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                            <x-heroicon-o-clipboard-document-check class="w-4 h-4" /> Stock Opname
                        </button>
                        <button
                            class="w-full border border-gray-100 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                            <x-heroicon-o-document-chart-bar class="w-4 h-4" /> Laporan Bulanan
                        </button>
                    </div>
                </div>

                {{-- Activity Log --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                        <x-heroicon-o-clock class="w-4 h-4" /> Log Aktivitas
                    </h4>
                    <div
                        class="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                        <div class="relative pl-8">
                            <span
                                class="absolute left-0 top-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></span>
                            <div class="flex justify-between text-[10px] mb-1">
                                <span class="font-bold text-gray-800">Stock In</span>
                                <span class="text-gray-400">10 Menit lalu</span>
                            </div>
                            <p class="text-[11px] text-gray-500 leading-relaxed">
                                <span class="font-bold">Biji Kopi Arabika</span> berjumlah 10kg oleh <span
                                    class="text-green-600">Dian (Admin)</span>
                            </p>
                        </div>
                    </div>
                    <a href="#"
                        class="block text-center text-green-600 font-bold text-xs mt-6 hover:underline">Lihat
                        semua
                        log →</a>
                </div>
            </div>
        </div>

    </div>
@endsection
