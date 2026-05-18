@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">

    {{-- HEADER --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Antrean Dapur</h1>
            <p class="text-gray-500 mt-1">Kelola persiapan makanan dan minuman secara real-time.</p>
        </div>
        <div class="flex items-center gap-3">
            <button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <iconify-icon icon="mdi:information-outline" class="text-base"></iconify-icon>
                Status Sistem
            </button>
            <button class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition shadow-sm">
                <iconify-icon icon="mdi:plus" class="text-base"></iconify-icon>
                Buat Pesanan Stok
            </button>
        </div>
    </div>

    {{-- STAT CARDS --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl flex-shrink-0">
                <iconify-icon icon="mdi:chef-hat"></iconify-icon>
            </div>
            <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Aktif</p>
                <p class="text-2xl font-bold text-gray-900 mt-0.5">12</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 text-xl flex-shrink-0">
                <iconify-icon icon="mdi:clock-outline"></iconify-icon>
            </div>
            <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rata-rata Masak</p>
                <p class="text-2xl font-bold text-gray-900 mt-0.5">8.5m</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-xl flex-shrink-0">
                <iconify-icon icon="mdi:alert-circle-outline"></iconify-icon>
            </div>
            <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Terlambat</p>
                <p class="text-2xl font-bold text-gray-900 mt-0.5">2</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl flex-shrink-0">
                <iconify-icon icon="mdi:check-circle-outline"></iconify-icon>
            </div>
            <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Selesai (Hari Ini)</p>
                <p class="text-2xl font-bold text-gray-900 mt-0.5">142</p>
            </div>
        </div>

    </div>

    {{-- TABS --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex items-center justify-between">
        <div class="flex items-center gap-1">
            @foreach (['Semua', 'Menunggu', 'Memasak', 'Siap'] as $tab)
                <button @class([
                    'px-4 py-2 text-sm font-semibold rounded-xl transition',
                    'bg-gray-900 text-white' => $tab === 'Semua',
                    'text-gray-500 hover:bg-gray-50' => $tab !== 'Semua',
                ])>{{ $tab }}</button>
            @endforeach
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-400">
            <iconify-icon icon="mdi:refresh" class="text-sm"></iconify-icon>
            Diperbarui otomatis setiap 30 detik
        </div>
    </div>

    {{-- ORDER CARDS GRID --}}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        @php
            $orders = [
                [
                    'id'     => '#TRX-9903',
                    'waktu'  => '2m yang lalu',
                    'tipe'   => 'Dine-in',
                    'meja'   => 'Meja 08',
                    'status' => 'Memasak',
                    'done'   => false,
                    'items'  => [
                        ['qty' => '2x', 'nama' => 'Nasi Goreng Spesial', 'note' => 'Kurangi cabai, telur dadar matang', 'type' => 'food', 'done' => false],
                        ['qty' => '1x', 'nama' => 'Matcha Latte Ice',    'note' => 'Less sugar',                         'type' => 'drink','done' => true],
                    ],
                    'actions' => ['Batalkan', 'Siap Diambil'],
                ],
                [
                    'id'     => '#TRX-9904',
                    'waktu'  => '5m yang lalu',
                    'tipe'   => 'Takeaway',
                    'meja'   => null,
                    'status' => 'Menunggu',
                    'done'   => false,
                    'items'  => [
                        ['qty' => '1x', 'nama' => 'Beef Burger Combo', 'note' => null, 'type' => 'food', 'done' => false],
                        ['qty' => '1x', 'nama' => 'Ice Lemon Tea',     'note' => null, 'type' => 'drink','done' => false],
                        ['qty' => '1x', 'nama' => 'French Fries',      'note' => null, 'type' => 'food', 'done' => false],
                    ],
                    'actions' => ['Mulai Memasak'],
                ],
                [
                    'id'     => '#TRX-9905',
                    'waktu'  => '8m yang lalu',
                    'tipe'   => 'Dine-in',
                    'meja'   => 'Meja 12',
                    'status' => 'Menunggu',
                    'done'   => false,
                    'items'  => [
                        ['qty' => '1x', 'nama' => 'Spaghetti Carbonara', 'note' => null, 'type' => 'food', 'done' => false],
                        ['qty' => '2x', 'nama' => 'Avocado Juice',       'note' => null, 'type' => 'drink','done' => false],
                    ],
                    'actions' => ['Mulai Memasak'],
                ],
                [
                    'id'     => '#TRX-9902',
                    'waktu'  => '15m yang lalu',
                    'tipe'   => 'Delivery',
                    'meja'   => null,
                    'status' => 'Siap',
                    'done'   => true,
                    'items'  => [
                        ['qty' => '3x', 'nama' => 'Croissant Almond', 'note' => null, 'type' => 'food', 'done' => true],
                        ['qty' => '2x', 'nama' => 'Cappuccino Hot',   'note' => null, 'type' => 'drink','done' => true],
                    ],
                    'actions' => ['Telah Diambil'],
                ],
            ];

            $statusStyles = [
                'Memasak'  => 'bg-green-600 text-white',
                'Menunggu' => 'bg-gray-100 text-gray-600',
                'Siap'     => 'bg-green-600 text-white',
            ];
        @endphp

        @foreach ($orders as $order)
            <div @class([
                'rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition',
                'bg-white border-green-400 ring-2 ring-green-100' => $order['status'] === 'Memasak',
                'bg-white border-gray-100' => $order['status'] === 'Menunggu',
                'bg-gray-800 border-gray-700' => $order['done'],
            ])>

                {{-- Card Header --}}
                <div class="flex items-center justify-between">
                    <span @class([
                        'text-sm font-bold',
                        'text-gray-900' => !$order['done'],
                        'text-gray-300' => $order['done'],
                    ])>{{ $order['id'] }}</span>
                    <span @class([
                        'flex items-center gap-1 text-xs',
                        'text-gray-400' => !$order['done'],
                        'text-gray-500' => $order['done'],
                    ])>
                        <iconify-icon icon="mdi:clock-outline" class="text-sm"></iconify-icon>
                        {{ $order['waktu'] }}
                    </span>
                </div>

                {{-- Tipe & Status --}}
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span @class([
                            'text-sm font-semibold',
                            'text-gray-700' => !$order['done'],
                            'text-gray-400' => $order['done'],
                        ])>{{ $order['tipe'] }}</span>
                        @if ($order['meja'])
                            <span class="text-sm font-bold text-green-500">• {{ $order['meja'] }}</span>
                        @endif
                    </div>
                    <span class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold {{ $statusStyles[$order['status']] }}">
                        <iconify-icon icon="{{ $order['status'] === 'Memasak' ? 'mdi:fire' : ($order['status'] === 'Siap' ? 'mdi:check-circle-outline' : 'mdi:clock-outline') }}" class="text-sm"></iconify-icon>
                        {{ $order['status'] }}
                    </span>
                </div>

                {{-- Items --}}
                <div class="space-y-3">
                    @foreach ($order['items'] as $item)
                        <div>
                            <div class="flex items-center justify-between">
                                <span @class([
                                    'text-sm',
                                    'font-semibold text-gray-900' => !$item['done'] && !$order['done'],
                                    'line-through text-gray-400'  => $item['done'] || $order['done'],
                                ])>
                                    <span class="text-gray-400 mr-1">{{ $item['qty'] }}</span>
                                    {{ $item['nama'] }}
                                </span>
                                <iconify-icon
                                    icon="{{ $item['type'] === 'food' ? 'mdi:fire' : 'mdi:cup-outline' }}"
                                    class="text-base {{ $item['type'] === 'food' ? 'text-orange-400' : 'text-blue-400' }}">
                                </iconify-icon>
                            </div>
                            @if ($item['note'])
                                <div class="flex items-center gap-1.5 mt-1">
                                    <iconify-icon icon="mdi:comment-text-outline" class="text-xs text-gray-300"></iconify-icon>
                                    <span class="text-xs text-gray-400 italic">{{ $item['note'] }}</span>
                                </div>
                            @endif
                        </div>
                        @if (!$loop->last)
                            <div @class(['border-t', 'border-gray-100' => !$order['done'], 'border-gray-700' => $order['done']])></div>
                        @endif
                    @endforeach
                </div>

                {{-- Actions --}}
                <div @class([
                    'flex gap-2 pt-1',
                    'border-t border-gray-100' => !$order['done'],
                    'border-t border-gray-700' => $order['done'],
                ])>
                    @if (count($order['actions']) === 2 && !empty($order['actions'][1]))
                        <button class="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            {{ $order['actions'][0] }}
                        </button>
                        <button class="flex-1 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition">
                            {{ $order['actions'][1] }}
                        </button>
                    @else
                        <button @class([
                            'w-full py-2.5 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2',
                            'text-white bg-green-600 hover:bg-green-700' => !$order['done'],
                            'text-gray-500 bg-gray-700 cursor-default'   => $order['done'],
                        ])>
                            @if ($order['done'])
                                <iconify-icon icon="mdi:check-circle-outline" class="text-base"></iconify-icon>
                            @endif
                            {{ $order['actions'][0] }}
                        </button>
                    @endif
                </div>

            </div>
        @endforeach

    </div>

    {{-- TIPS BANNER --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-2">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
                <iconify-icon icon="mdi:fire" class="text-green-500"></iconify-icon>
                Tips Dapur Hari Ini
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed max-w-xl">
                Ingat untuk menandai item yang sudah selesai secepat mungkin agar pelayan
                dapat segera mengantarkannya ke pelanggan. Waktu pelayanan rata-rata kita hari
                ini meningkat sebesar <span class="font-bold text-green-600">+12%</span> dibandingkan kemarin.
            </p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
            <button class="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition whitespace-nowrap">
                Lihat Target Harian
            </button>
            <button class="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition whitespace-nowrap">
                Laporan Performa
            </button>
        </div>
    </div>

</div>
@endsection