@extends('layouts.app')

@section('content')
<div class="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

    {{-- ====== TOP HEADER ====== --}}
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
        <div>
            <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                Target &amp; Performa
            </h1>
            <p class="text-[#2f27ce] mt-1 text-sm font-medium">
                Pantau pencapaian KPI harian dan riwayat pertumbuhan outlet Anda.
            </p>
        </div>
        <div class="flex items-center gap-2">
            <a href="{{ route('targets-goals.index', ['period' => 'harian']) }}"
                class="px-5 py-2.5 text-xs font-bold rounded-xl border transition-all
                    {{ $period === 'harian' ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm' : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50' }}">
                Harian
            </a>
            <a href="{{ route('targets-goals.index', ['period' => 'bulanan']) }}"
                class="px-5 py-2.5 text-xs font-bold rounded-xl border transition-all
                    {{ $period === 'bulanan' ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm' : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50' }}">
                Bulanan
            </a>
        </div>
    </div>

    {{-- ====== TARGET HARI INI — HERO CARD ====== --}}
    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-[#dddbff]/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div class="relative z-10">

            {{-- Label --}}
            <div class="flex items-center gap-2 mb-4">
                <iconify-icon icon="solar:target-bold-duotone" class="text-xl text-[#443dff]"></iconify-icon>
                <span class="text-sm font-extrabold text-[#443dff] uppercase tracking-widest">Target Hari Ini</span>
                @if ($target?->label)
                    <span class="text-[10px] font-bold text-[#2f27ce]/60 bg-[#dddbff]/50 px-2 py-0.5 rounded-md border border-[#dddbff]">
                        {{ $target->label }}
                    </span>
                @endif
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                {{-- Kolom 1: Target --}}
                <div>
                    <p class="text-3xl font-extrabold text-[#050316] tracking-tight">
                        Rp {{ number_format($targetValue, 0, ',', '.') }}
                    </p>
                    <p class="text-xs font-medium text-[#2f27ce]/70 mt-1.5">
                        Status pembaruan terakhir: {{ $lastUpdated }}
                    </p>
                </div>

                {{-- Kolom 2: Progress bar + Tercapai --}}
                <div class="md:col-span-2 space-y-3">
                    <div class="flex items-end justify-between gap-4">
                        <div>
                            <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-1">Tercapai</p>
                            <p class="text-2xl font-extrabold text-[#443dff]">
                                Rp {{ number_format($currentValue, 0, ',', '.') }}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-1">Progress</p>
                            <p class="text-2xl font-extrabold text-[#050316]">{{ $progress }}%</p>
                        </div>
                    </div>

                    {{-- Progress Bar --}}
                    <div class="w-full bg-[#dddbff]/50 h-3 rounded-full overflow-hidden shadow-inner">
                        <div class="h-full rounded-full transition-all duration-700 ease-out
                            {{ $progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#2f27ce] to-[#443dff]' }}"
                            style="width: {{ $progress }}%">
                        </div>
                    </div>

                    <div class="flex justify-between text-[10px] font-bold text-[#2f27ce]/60">
                        <span>Mulai: {{ today()->setTime(8,0)->format('H:i') }} WIB</span>
                        <span>Sisa: Rp {{ number_format($remaining, 0, ',', '.') }}</span>
                        <span>Target: Rp {{ number_format($targetValue, 0, ',', '.') }}</span>
                    </div>
                </div>
            </div>

            {{-- Buttons --}}
            <div class="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-[#dddbff]/60">
                <button type="button" onclick="document.getElementById('target-modal').showModal()"
                    class="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                    <iconify-icon icon="solar:pen-bold" class="text-sm"></iconify-icon>
                    {{ $target ? 'Ubah Target' : 'Set Target' }}
                </button>
                <a href="{{ route('dashboard') }}"
                    class="px-5 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/50 hover:text-[#050316] transition-colors">
                    Lihat Detail AOV
                </a>
            </div>
        </div>
    </div>

    {{-- ====== STAT CARDS ====== --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
                <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest leading-tight">Sisa Target</p>
                <div class="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:wallet-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                </div>
            </div>
            <p class="text-xl font-extrabold text-[#050316] leading-tight">
                Rp {{ number_format($remaining, 0, ',', '.') }}
            </p>
            <p class="text-[11px] font-medium text-[#2f27ce]/70 mt-1.5">Perlu dicapai hari ini</p>
        </div>

        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
                <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest leading-tight">Estimasi Penutupan</p>
                <div class="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:graph-up-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                </div>
            </div>
            <p class="text-xl font-extrabold text-[#050316] leading-tight">
                Rp {{ number_format($estimasi, 0, ',', '.') }}
            </p>
            <p class="text-[11px] font-medium mt-1.5 {{ $trendEstimasi >= 0 ? 'text-emerald-600' : 'text-rose-500' }}">
                {{ $trendEstimasi >= 0 ? '↑' : '↓' }} {{ abs($trendEstimasi) }}%
                <span class="text-[#2f27ce]/60 font-normal">Berdasarkan tren saat ini</span>
            </p>
        </div>

        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
                <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest leading-tight">Rata-rata Harian</p>
                <div class="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:chart-2-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                </div>
            </div>
            <p class="text-xl font-extrabold text-[#050316] leading-tight">
                Rp {{ number_format($avgHarian, 0, ',', '.') }}
            </p>
            <p class="text-[11px] font-medium text-emerald-600 mt-1.5">30 hari terakhir</p>
        </div>

        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
                <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest leading-tight">Update Terakhir</p>
                <div class="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:calendar-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                </div>
            </div>
            <p class="text-xl font-extrabold text-[#050316] leading-tight">{{ now()->format('H:i') }} WIB</p>
            <p class="text-[11px] font-medium text-[#2f27ce]/70 mt-1.5 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Sinkronisasi otomatis aktif
            </p>
        </div>
    </div>

    {{-- ====== MAIN GRID: Chart + Sidebar ====== --}}
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {{-- ===== CHART RIWAYAT ===== --}}
        <div class="xl:col-span-8 bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                    <h3 class="text-base font-extrabold text-[#050316] tracking-tight">Riwayat Pencapaian (30 Hari Terakhir)</h3>
                    <p class="text-xs text-[#2f27ce] font-medium mt-0.5">Perbandingan antara target harian vs realisasi penjualan</p>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] font-bold text-[#050316] bg-[#dddbff]/50 border border-[#dddbff] px-3 py-1.5 rounded-lg flex-shrink-0">
                    <span class="w-2 h-2 bg-[#443dff] rounded-full"></span> Penjualan Real
                </div>
            </div>

            {{-- Chart area --}}
            <div class="relative w-full" style="height: 260px;">
                <canvas id="historyChart"></canvas>
            </div>

            {{-- Legend --}}
            <div class="flex items-center gap-6 mt-5 text-[11px] font-bold text-[#2f27ce] justify-center">
                <span class="flex items-center gap-2">
                    <span class="w-3 h-0.5 bg-[#443dff] rounded-full inline-block"></span>
                    Pencapaian Riil
                </span>
                <span class="flex items-center gap-2">
                    <span class="w-3 h-0.5 bg-[#050316] rounded-full inline-block" style="border-top: 2px dashed #050316; background:transparent;"></span>
                    Target Penjualan
                </span>
            </div>
        </div>

        {{-- ===== SIDEBAR ===== --}}
        <div class="xl:col-span-4 space-y-5">

            {{-- Wawasan Performa --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                <h3 class="font-extrabold text-[#050316] tracking-tight mb-4 flex items-center gap-2 text-sm">
                    <iconify-icon icon="solar:graph-up-bold-duotone" class="text-[#443dff] text-lg"></iconify-icon>
                    Wawasan Performa
                </h3>

                {{-- Jam sibuk --}}
                <div class="mb-4 pb-4 border-b border-[#dddbff]">
                    <p class="text-xs font-extrabold text-[#050316] mb-1">Jam Sibuk Diprediksi</p>
                    <p class="text-[11px] font-medium text-[#2f27ce] leading-relaxed">
                        Pukul <span class="font-extrabold text-[#050316]">{{ $peakLabel }}</span> biasanya menjadi jam tersibuk berdasarkan data 7 hari terakhir.
                    </p>
                    @if ($promoAktif !== '-')
                        <div class="mt-2 flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] font-extrabold text-[#443dff] bg-[#dddbff] px-2 py-0.5 rounded-md border border-[#c4c0ff]">Promo Aktif</span>
                            <span class="text-[10px] font-bold text-[#2f27ce]">"{{ $promoAktif }}"</span>
                        </div>
                    @endif
                </div>

                {{-- Pencapaian Staf --}}
                <div>
                    <p class="text-xs font-extrabold text-[#050316] mb-3">Pencapaian Staf</p>
                    <div class="space-y-3">
                        @forelse ($staffPerformance as $staff)
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[11px] font-bold text-[#050316]">
                                        {{ $staff['name'] }}
                                        @if ($staff['role'])
                                            <span class="font-normal text-[#2f27ce]/60">({{ $staff['role'] }})</span>
                                        @endif
                                    </span>
                                    <span class="text-[11px] font-extrabold text-[#050316]">
                                        Rp {{ number_format($staff['total'] / 1000, 0, ',', '.') }}k
                                    </span>
                                </div>
                                <div class="w-full bg-[#dddbff]/50 h-2 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-[#2f27ce] to-[#443dff] rounded-full transition-all duration-500"
                                        style="width: {{ round(($staff['total'] / $maxStaff) * 100) }}%">
                                    </div>
                                </div>
                            </div>
                        @empty
                            <p class="text-[11px] text-[#2f27ce]/60 italic">Belum ada data staf hari ini.</p>
                        @endforelse
                    </div>
                    <a href="{{ route('dashboard') }}"
                        class="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] text-center transition-colors flex items-center justify-center gap-1.5">
                        Lihat Laporan Lengkap
                        <iconify-icon icon="solar:arrow-right-linear" class="text-sm"></iconify-icon>
                    </a>
                </div>
            </div>

            {{-- Metode Pembayaran --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <iconify-icon icon="solar:card-bold-duotone" class="text-xl text-[#443dff]"></iconify-icon>
                </div>
                <div>
                    <p class="text-xs font-extrabold text-[#050316] mb-1">Metode Pembayaran Terpopuler</p>
                    <p class="text-[11px] font-medium text-[#2f27ce] leading-relaxed">
                        {{ $paymentSummary ?: 'Belum ada transaksi hari ini.' }}
                    </p>
                </div>
            </div>

        </div>
    </div>

</div>

{{-- ====== SET TARGET MODAL ====== --}}
<dialog id="target-modal" class="backdrop:bg-[#050316]/60 backdrop:backdrop-blur-sm">
    <div class="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl mx-4 sm:mx-auto border border-[#dddbff]">
        <div class="flex items-center justify-between mb-6 border-b border-[#dddbff]/50 pb-4">
            <div>
                <h2 class="text-xl font-extrabold text-[#050316] tracking-tight">
                    {{ $target ? 'Ubah Target' : 'Set Target Harian' }}
                </h2>
                <p class="text-xs font-medium text-[#2f27ce] mt-1">
                    {{ $today->translatedFormat('d F Y') }}
                </p>
            </div>
            <button type="button" onclick="document.getElementById('target-modal').close()"
                class="w-8 h-8 rounded-xl bg-[#dddbff]/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-[#2f27ce] transition-colors">
                <iconify-icon icon="solar:close-circle-bold" class="text-xl"></iconify-icon>
            </button>
        </div>

        <form method="POST"
            action="{{ $target ? route('targets-goals.update', $target->id) : route('targets-goals.store') }}"
            class="space-y-5">
            @csrf
            @if ($target)
                @method('PUT')
            @endif
            <input type="hidden" name="type"   value="revenue">
            <input type="hidden" name="period" value="daily">

            <div>
                <label class="block text-xs font-extrabold text-[#2f27ce] mb-1.5 uppercase tracking-wide">
                    Label Target <span class="text-rose-500">*</span>
                </label>
                <input type="text" name="label" required
                    value="{{ $target?->label ?? 'Target Pendapatan Harian' }}"
                    placeholder="cth: Target Shift Pagi"
                    class="w-full h-11 rounded-xl border border-[#dddbff] text-sm px-4 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] bg-[#fbfbfe] focus:bg-white text-[#050316] font-semibold transition-shadow">
            </div>

            <div>
                <label class="block text-xs font-extrabold text-[#2f27ce] mb-1.5 uppercase tracking-wide">
                    Target Pendapatan (Rp) <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#2f27ce] text-sm pointer-events-none">Rp</span>
                    <input type="number" name="target_value" min="1" step="1000" required
                        value="{{ $target?->target_value ?? '' }}"
                        placeholder="14000000"
                        class="w-full h-11 rounded-xl border border-[#dddbff] text-sm pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] bg-[#fbfbfe] focus:bg-white text-[#050316] font-extrabold transition-shadow">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-extrabold text-[#2f27ce] mb-1.5 uppercase tracking-wide">Mulai</label>
                    <input type="date" name="start_date"
                        value="{{ $target?->start_date?->format('Y-m-d') ?? $today->format('Y-m-d') }}"
                        class="w-full h-11 rounded-xl border border-[#dddbff] text-sm px-4 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] bg-[#fbfbfe] focus:bg-white text-[#050316] font-semibold cursor-pointer">
                </div>
                <div>
                    <label class="block text-xs font-extrabold text-[#2f27ce] mb-1.5 uppercase tracking-wide">Selesai</label>
                    <input type="date" name="end_date"
                        value="{{ $target?->end_date?->format('Y-m-d') ?? $today->format('Y-m-d') }}"
                        class="w-full h-11 rounded-xl border border-[#dddbff] text-sm px-4 focus:outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] bg-[#fbfbfe] focus:bg-white text-[#050316] font-semibold cursor-pointer">
                </div>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-[#dddbff]/50">
                <button type="submit"
                    class="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#443dff]/30 active:scale-[0.98]">
                    <iconify-icon icon="solar:star-bold" class="text-[18px]"></iconify-icon>
                    Simpan Target
                </button>
                <button type="button" onclick="document.getElementById('target-modal').close()"
                    class="h-12 px-6 rounded-xl border border-[#dddbff] text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
                    Batal
                </button>
            </div>
        </form>
    </div>
</dialog>

{{-- ====== CHART.JS ====== --}}
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
    const labels  = @json($history['labels']);
    const actuals = @json($history['actuals']);
    const targets = @json($history['targets']);

    const ctx = document.getElementById('historyChart').getContext('2d');

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(68, 61, 255, 0.18)');
    gradient.addColorStop(1, 'rgba(68, 61, 255, 0.00)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Pencapaian Riil',
                    data: actuals,
                    borderColor: '#443dff',
                    backgroundColor: gradient,
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#443dff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1.5,
                    tension: 0.45,
                    fill: true,
                },
                {
                    label: 'Target Penjualan',
                    data: targets,
                    borderColor: '#050316',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    tension: 0,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#050316',
                    titleColor: '#dddbff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 10,
                    callbacks: {
                        label: ctx => ' Rp ' + ctx.parsed.y.toLocaleString('id-ID'),
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#2f27ce',
                        font: { size: 10, weight: '700' },
                        maxRotation: 0,
                        maxTicksLimit: 10,
                    },
                },
                y: {
                    grid: { color: '#dddbff55', drawBorder: false },
                    ticks: {
                        color: '#2f27ce',
                        font: { size: 10, weight: '700' },
                        callback: val => 'Rp ' + (val / 1_000_000).toFixed(0) + 'jt',
                    },
                },
            },
        },
    });
</script>

@endsection