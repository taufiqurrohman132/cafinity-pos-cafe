@extends('layouts.app')

@section('content')
<div class="min-h-screen font-inter bg-[#fbfbfe] text-[#050316]">
    <div class="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                Laporan Stok Barang
            </h1>
            <a href="{{ route('reports.export.excel') }}" class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150">
                <iconify-icon icon="solar:download-square-linear" class="text-lg"></iconify-icon>
                Ekspor Excel
            </a>
        </div>

        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-xs font-bold text-[#2f27ce]/70 border-b border-[#dddbff]">
                            <th class="pb-3">#</th>
                            <th class="pb-3">Nama Barang</th>
                            <th class="pb-3">Kategori</th>
                            <th class="pb-3">Supplier</th>
                            <th class="pb-3">Stok</th>
                            <th class="pb-3">Satuan</th>
                            <th class="pb-3">Harga Beli</th>
                            <th class="pb-3">Harga Jual</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#dddbff]/50">
                        @if($data->isEmpty())
                            <tr>
                                <td colspan="8" class="py-4 text-center text-[#2f27ce]/50">
                                    Tidak ada data inventaris.
                                </td>
                            </tr>
                        @else
                            @foreach($data as $index => $item)
                                <tr class="hover:bg-[#dddbff]/30 transition-colors duration-150">
                                    <td class="py-3 text-sm font-medium text-[#050316]">{{ $index + 1 }}</td>
                                    <td class="py-3 text-sm text-[#050316]">{{ $item->name }}</td>
                                    <td class="py-3">
                                        <span class="px-2.5 py-1 rounded-md bg-[#dddbff]/50 text-[#2f27ce] text-xs font-bold">{{ $item->category?->name ?? '-' }}</span>
                                    </td>
                                    <td class="py-3">
                                        <span class="px-2.5 py-1 rounded-md bg-[#dddbff]/50 text-[#2f27ce] text-xs font-bold">{{ $item->supplier?->name ?? '-' }}</span>
                                    </td>
                                    <td class="py-3 text-sm font-medium text-[#050316]">{{ $item->stock }}</td>
                                    <td class="py-3 text-sm text-[#050316]">{{ $item->unit }}</td>
                                    <td class="py-3 text-sm text-[#050316]">Rp {{ number_format($item->purchase_price, 0, ',', '.') }}</td>
                                    <td class="py-3 text-sm text-[#050316]">Rp {{ number_format($item->selling_price, 0, ',', '.') }}</td>
                                </tr>
                            @endforeach
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection