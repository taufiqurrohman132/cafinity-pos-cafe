@props([
    'currentTarget' => null,
    'estimasi' => 74.2,
])

{{-- ====== MODAL ATUR TARGET PERFORMA ====== --}}
<dialog id="goal-modal"
    class="backdrop:bg-[#050316]/60 backdrop:backdrop-blur-sm w-full max-w-2xl rounded-2xl p-0 border-0 shadow-2xl">
    <div class="bg-white rounded-2xl w-full border border-[#dddbff] overflow-hidden">

        {{-- Header --}}
        <div class="flex items-start justify-between p-6 border-b border-[#dddbff]/50">
            <div class="flex items-center gap-3">
                <div
                    class="w-11 h-11 rounded-xl bg-[#dddbff]/50 border border-[#dddbff] flex items-center justify-center">
                    <iconify-icon icon="solar:target-bold-duotone" class="text-[#443dff] text-2xl"></iconify-icon>
                </div>
                <div>
                    <h2 class="text-xl font-extrabold text-[#050316] tracking-tight">Atur Target Performa</h2>
                    <p class="text-xs font-medium text-[#2f27ce] mt-0.5">Tentukan objektif pendapatan untuk memaksimalkan
                        ROI bisnis Anda.</p>
                </div>
            </div>
            <button type="button" onclick="document.getElementById('goal-modal').close()"
                class="w-8 h-8 rounded-xl bg-[#dddbff]/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-[#2f27ce] transition-colors flex-shrink-0 mt-0.5">
                <iconify-icon icon="solar:close-circle-bold" class="text-xl"></iconify-icon>
            </button>
        </div>

        <form method="POST" action="{{ route('targets-goals.store') }}" class="p-6 space-y-6">
            @csrf

            {{-- Periode Target --}}
            <div class="flex items-center gap-4">
                <label class="text-sm font-extrabold text-[#050316] w-28 flex-shrink-0">Periode<br>Target</label>
                <div class="flex gap-2 flex-1">
                    @foreach (['daily' => 'Harian', 'weekly' => 'Mingguan', 'monthly' => 'Bulanan'] as $val => $label)
                        <label class="flex-1">
                            <input type="radio" name="period" value="{{ $val }}" class="sr-only peer"
                                {{ ($currentTarget?->period ?? 'daily') === $val ? 'checked' : '' }}>
                            <span
                                class="block text-center text-sm font-bold py-2.5 px-4 rounded-xl border border-[#dddbff] cursor-pointer transition-all
                                peer-checked:bg-[#050316] peer-checked:text-white peer-checked:border-[#050316]
                                hover:border-[#443dff] hover:text-[#443dff] text-[#2f27ce]">
                                {{ $label }}
                            </span>
                        </label>
                    @endforeach
                </div>
            </div>

            {{-- Hidden fields --}}
            <input type="hidden" name="type" value="revenue">
            <input type="hidden" name="end_date" id="end-date-input"
                value="{{ $currentTarget?->end_date?->format('Y-m-d') ?? now()->format('Y-m-d') }}">

            {{-- Target Nominal --}}
            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Target Nominal
                        Pendapatan</label>
                    <span
                        class="text-[11px] font-extrabold text-[#443dff] bg-[#dddbff]/50 border border-[#dddbff] px-3 py-1 rounded-lg">Premium
                        Feature</span>
                </div>
                <div
                    class="flex items-center gap-3 border-2 border-[#dddbff] focus-within:border-[#443dff] rounded-xl px-5 py-4 transition-all bg-[#fbfbfe] focus-within:bg-white">
                    <span class="text-2xl font-extrabold text-[#050316]">Rp</span>
                    <input type="number" name="target_value" id="target-input"
                        value="{{ $currentTarget?->target_value ?? 15000000 }}" min="1" step="1000" required
                        class="flex-1 text-2xl font-extrabold text-[#050316] bg-transparent border-none outline-none placeholder:text-[#dddbff]"
                        placeholder="15.000.000">
                </div>
                <div class="flex flex-wrap gap-2 mt-3">
                    @foreach ([5000000, 10000000, 25000000, 50000000] as $amount)
                        <button type="button" onclick="addToTarget({{ $amount }})"
                            class="text-xs font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] px-4 py-2 rounded-xl hover:bg-[#dddbff] hover:text-[#050316] hover:border-[#443dff] transition-all">
                            +{{ number_format($amount, 0, ',', '.') }}
                        </button>
                    @endforeach
                </div>
            </div>

            {{-- Outlet & Waktu --}}
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label
                        class="flex items-center gap-1.5 text-xs font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">
                        <iconify-icon icon="solar:shop-bold-duotone" class="text-[#443dff] text-base"></iconify-icon>
                        Pilih Outlet
                    </label>
                    <div class="relative">
                        <select name="label"
                            class="w-full h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] text-sm font-bold text-[#050316] px-4 pr-10 bg-[#fbfbfe] outline-none appearance-none transition-all">
                            <option value="">Semua Outlet</option>
                            <option value="Jakarta Selatan"
                                {{ ($currentTarget?->label ?? '') === 'Jakarta Selatan' ? 'selected' : '' }}>Jakarta
                                Selatan</option>
                            <option value="Jakarta Pusat"
                                {{ ($currentTarget?->label ?? '') === 'Jakarta Pusat' ? 'selected' : '' }}>Jakarta
                                Pusat</option>
                            <option value="Bandung"
                                {{ ($currentTarget?->label ?? '') === 'Bandung' ? 'selected' : '' }}>Bandung
                            </option>
                        </select>
                        <iconify-icon icon="solar:alt-arrow-down-bold"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f27ce] text-base pointer-events-none"></iconify-icon>
                    </div>
                </div>
                <div>
                    <label
                        class="flex items-center gap-1.5 text-xs font-extrabold text-[#2f27ce] uppercase tracking-widest mb-2">
                        <iconify-icon icon="solar:calendar-bold-duotone"
                            class="text-[#443dff] text-base"></iconify-icon>
                        Waktu Pelaksanaan
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="date" name="start_date"
                            value="{{ $currentTarget?->start_date?->format('Y-m-d') ?? now()->format('Y-m-d') }}"
                            class="h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] text-sm font-bold text-[#050316] px-3 bg-[#fbfbfe] outline-none transition-all cursor-pointer">
                        <input type="time" name="start_time" value="08:00"
                            class="h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] text-sm font-bold text-[#050316] px-3 bg-[#fbfbfe] outline-none transition-all cursor-pointer">
                    </div>
                </div>
            </div>

            {{-- Estimasi Pencapaian --}}
            <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-2xl p-5">
                <div class="flex items-start justify-between mb-1">
                    <div>
                        <h4 class="text-sm font-extrabold text-[#050316]">Estimasi Pencapaian</h4>
                        <p class="text-xs font-medium text-[#2f27ce] mt-0.5">Berdasarkan tren transaksi 30 hari terakhir
                        </p>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl font-extrabold text-[#050316]">{{ $estimasi }}%</span>
                        <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Kemungkinan
                            Tercapai</p>
                    </div>
                </div>
                @php
                    $pct = $estimasi;
                    $current = $currentTarget?->current_value ?? 0;
                    $tgt = $currentTarget?->target_value ?? 15000000;
                @endphp
                <div class="mt-4 mb-2">
                    <div class="w-full bg-[#dddbff]/50 h-3 rounded-full overflow-hidden">
                        <div class="bg-[#050316] h-full rounded-full transition-all duration-500"
                            style="width: {{ min($pct, 100) }}%"></div>
                    </div>
                    <div class="flex justify-between mt-1.5 text-[10px] font-bold text-[#2f27ce]">
                        <span>Rp 0</span>
                        <span>Rp {{ number_format($current, 0, ',', '.') }}</span>
                        <span>Target: Rp {{ number_format($tgt, 0, ',', '.') }}</span>
                    </div>
                </div>
                <div class="h-20 mt-3">
                    <canvas id="trend-chart-modal"></canvas>
                </div>
            </div>

            {{-- Footer Actions --}}
            <div class="flex items-center justify-between pt-2 border-t border-[#dddbff]/50">
                <p class="text-[11px] font-medium text-[#2f27ce] flex items-center gap-1.5">
                    <iconify-icon icon="solar:info-circle-bold-duotone"
                        class="text-[#443dff] text-base flex-shrink-0"></iconify-icon>
                    Target akan aktif segera setelah disimpan.
                </p>
                <div class="flex items-center gap-3">
                    <button type="button" onclick="document.getElementById('goal-modal').close()"
                        class="px-5 py-2.5 text-sm font-bold text-[#2f27ce] hover:text-[#050316] transition-colors">
                        Batal
                    </button>
                    <button type="submit" name="action" value="draft"
                        class="px-5 py-2.5 text-sm font-bold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-all">
                        Simpan Draft
                    </button>
                    <button type="submit" name="action" value="apply"
                        class="px-6 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] rounded-xl transition-all shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98] flex items-center gap-2">
                        <iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
                        Simpan & Terapkan
                    </button>
                </div>
            </div>
        </form>
    </div>
</dialog>

{{-- Toast --}}
@if (session('target_saved'))
    <div id="toast-target"
        class="fixed bottom-6 right-6 z-50 bg-white border border-[#dddbff] rounded-2xl shadow-xl p-4 flex items-start gap-3 max-w-xs">
        <div class="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <iconify-icon icon="solar:check-circle-bold-duotone" class="text-emerald-600 text-lg"></iconify-icon>
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-extrabold text-[#050316]">Target Berhasil Disimpan!</p>
            <p class="text-xs font-medium text-[#2f27ce] mt-0.5">{{ session('target_saved') }} telah aktif.</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
            <button onclick="document.getElementById('toast-target').remove()"
                class="w-6 h-6 rounded-lg hover:bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] transition-colors">
                <iconify-icon icon="solar:close-circle-bold" class="text-base"></iconify-icon>
            </button>
        </div>
    </div>
@endif

@once
    @push('scripts')
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        <script>
            function addToTarget(amount) {
                const input = document.getElementById('target-input');
                if (input) input.value = (parseInt(input.value || 0) + amount);
            }

            // Sinkron end_date berdasarkan period & start_date
            function syncEndDate() {
                const startVal = document.querySelector('input[name="start_date"]')?.value;
                const endInput = document.getElementById('end-date-input');
                const period = document.querySelector('input[name="period"]:checked')?.value;

                if (!startVal || !endInput) return;

                const start = new Date(startVal);

                if (period === 'daily') {
                    endInput.value = startVal;
                } else if (period === 'weekly') {
                    start.setDate(start.getDate() + 6);
                    endInput.value = start.toISOString().split('T')[0];
                } else if (period === 'monthly') {
                    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
                    endInput.value = end.toISOString().split('T')[0];
                }
            }

            // Trigger saat period berubah
            document.querySelectorAll('input[name="period"]').forEach(radio => {
                radio.addEventListener('change', syncEndDate);
            });

            // Trigger saat start_date berubah
            document.querySelector('input[name="start_date"]')?.addEventListener('change', syncEndDate);

            // Jalankan sekali saat load
            syncEndDate();
            
            document.addEventListener('DOMContentLoaded', function() {
                const ctx = document.getElementById('trend-chart-modal');
                if (!ctx) return;

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array.from({
                            length: 30
                        }, (_, i) => i + 1),
                        datasets: [{
                            data: [
                                4200000, 4500000, 3800000, 5100000, 4700000, 5600000, 4900000,
                                6200000, 5800000, 6700000, 6100000, 7200000, 6800000, 7500000,
                                7000000, 8100000, 7600000, 8500000, 8000000, 9200000, 8700000,
                                9800000, 9300000, 10200000, 9700000, 10800000, 10300000, 11100000,
                                10800000, 11130000
                            ],
                            borderColor: '#050316',
                            backgroundColor: 'rgba(5,3,22,0.05)',
                            borderWidth: 1.5,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                display: false
                            }
                        }
                    }
                });

                // tambah di dalam DOMContentLoaded
                const startInput = document.querySelector('input[name="start_date"]');
                const endInput = document.querySelector('input[name="end_date"]');
                if (startInput && endInput) {
                    startInput.addEventListener('change', function() {
                        endInput.value = this.value;
                    });
                }

                const toast = document.getElementById('toast-target');
                if (toast) setTimeout(() => toast.remove(), 5000);
            });
        </script>
    @endpush
@endonce
