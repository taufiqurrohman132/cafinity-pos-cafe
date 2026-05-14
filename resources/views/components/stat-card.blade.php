<div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
    {{-- Trend Badge (Pojok Kanan Atas) --}}
    <div
        class="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold {{ $trendType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600' }}">

        {{-- Ikon Trending --}}
        <span>
            @if ($trendType === 'up')
                @svg('heroicon-o-arrow-trending-up', 'w-3 h-3')
            @else
                @svg('heroicon-o-arrow-trending-down', 'w-3 h-3')
            @endif
        </span>

        {{-- Teks Persentase --}}
        {{ $trend }}
    </div>

    {{-- Icon Circle --}}
    <div class="{{ $iconBg }} {{ $iconColor }} w-10 h-10 rounded-xl flex items-center justify-center mb-4">
        {{-- Contoh memanggil ikon secara dinamis --}}
        @svg($icon, 'w-6 h-6')
    </div>

    {{-- Text Content --}}
    <div>
        <p class="text-xs font-medium text-gray-400 mb-1">{{ $title }}</p>
        <h3 class="text-xl font-bold text-gray-900">{{ $value }}</h3>
    </div>
</div>
