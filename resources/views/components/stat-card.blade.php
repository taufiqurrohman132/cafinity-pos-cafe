<div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">

    {{-- Trend Badge --}}
    @if (!empty($trend))
        <div
            class="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold
            {{ $trendType === 'up'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600' }}">

            <span>
                @if ($trendType === 'up')
                    @svg('heroicon-o-arrow-trending-up', 'w-3 h-3')
                @else
                    @svg('heroicon-o-arrow-trending-down', 'w-3 h-3')
                @endif
            </span>

            {{ $trend }}
        </div>
    @endif

    {{-- Icon --}}
    <div class="{{ $iconBg }} {{ $iconColor }} w-10 h-10 rounded-2xl flex items-center justify-center mb-4">
        @svg($icon, 'w-5 h-5')
    </div>

    {{-- Content --}}
    <div>
        <p class="text-xs font-medium text-gray-400 mb-1">
            {{ $title }}
        </p>

        <h3 class="text-2xl font-bold text-gray-900 leading-tight">
            {{ $value }}
        </h3>

        {{-- Optional Alert / Description --}}
        @if (!empty($note))
            <p class="mt-2 text-[11px] font-semibold {{ $noteColor ?? 'text-gray-500' }}">
                {{ $note }}
            </p>
        @endif
    </div>
</div>