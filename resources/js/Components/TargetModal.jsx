import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import ModernDatePicker from '@/Components/ModernDatePicker';
import ModernTimePicker from '@/Components/ModernTimePicker';

export default function TargetModal({
    isOpen,
    onClose,
    currentTarget = null,
    currentValue = 11130000, // Default fallback if not passed
    avgHarian = 15000000,
    onSaveSuccess = null,
    defaultPeriod = 'daily'
}) {
    if (!isOpen) return null;

    const periodMap = {
        harian: 'daily',
        mingguan: 'weekly',
        bulanan: 'monthly',
        daily: 'daily',
        weekly: 'weekly',
        monthly: 'monthly'
    };

    // Form setup using Inertia useForm
    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        label: '',
        type: 'revenue',
        period: 'daily',
        target_value: 15000000,
        current_value: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
    });

    const [selectedOutlet, setSelectedOutlet] = useState('Jakarta Selatan');
    const [executionTime, setExecutionTime] = useState('08:00');
    const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);

    // List of outlets for the premium custom dropdown
    const outlets = [
        { id: 'jakarta-pusat', name: 'Jakarta Pusat' },
        { id: 'jakarta-selatan', name: 'Jakarta Selatan' },
        { id: 'bandung', name: 'Bandung' },
        { id: 'surabaya', name: 'Surabaya' }
    ];

    // Format Rupiah helper
    const formatRp = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    // Parse formatted string back to number
    const parseNumber = (str) => {
        const cleaned = str.replace(/[^0-9]/g, '');
        return cleaned ? parseInt(cleaned, 10) : 0;
    };

    // Update form when currentTarget or defaultPeriod changes on open
    useEffect(() => {
        if (isOpen) {
            if (currentTarget) {
                setData({
                    label: currentTarget.label || '',
                    type: currentTarget.type || 'revenue',
                    period: currentTarget.period || 'daily',
                    target_value: currentTarget.target_value || 0,
                    current_value: currentTarget.current_value || 0,
                    start_date: new Date(currentTarget.start_date).toISOString().split('T')[0],
                    end_date: new Date(currentTarget.end_date).toISOString().split('T')[0],
                });
                // Try to extract outlet from label
                const outletMatch = currentTarget.label?.replace('Target ', '');
                if (outletMatch && outlets.some(o => o.name === outletMatch)) {
                    setSelectedOutlet(outletMatch);
                }
            } else {
                const mappedPeriod = periodMap[defaultPeriod] || 'daily';
                const start = new Date();
                const end = new Date(start);
                let daysToAdd = 0;
                if (mappedPeriod === 'weekly') daysToAdd = 6;
                else if (mappedPeriod === 'monthly') daysToAdd = 30;
                end.setDate(start.getDate() + daysToAdd);

                setData({
                    label: '',
                    type: 'revenue',
                    period: mappedPeriod,
                    target_value: 15000000,
                    current_value: 0,
                    start_date: start.toISOString().split('T')[0],
                    end_date: end.toISOString().split('T')[0],
                });
                setSelectedOutlet('Jakarta Selatan');
            }
        }
    }, [isOpen, currentTarget, defaultPeriod]);

    // Handle quick addition buttons
    const handleQuickAdd = (amount) => {
        const currentVal = data.target_value || 0;
        setData('target_value', currentVal + amount);
    };

    // Handle Period changes (daily, weekly, monthly)
    const handlePeriodChange = (period) => {
        let dbPeriod = 'daily';
        let daysToAdd = 0;

        if (period === 'Harian') {
            dbPeriod = 'daily';
            daysToAdd = 0;
        } else if (period === 'Mingguan') {
            dbPeriod = 'weekly';
            daysToAdd = 6;
        } else if (period === 'Bulanan') {
            dbPeriod = 'monthly';
            daysToAdd = 30; // Approx
        }

        const start = new Date(data.start_date);
        const end = new Date(start);
        end.setDate(start.getDate() + daysToAdd);

        setData(prev => ({
            ...prev,
            period: dbPeriod,
            end_date: end.toISOString().split('T')[0]
        }));
    };

    // Handle start date changes to automatically calculate end date based on period
    const handleStartDateChange = (dateVal) => {
        const start = new Date(dateVal);
        const end = new Date(start);
        let daysToAdd = 0;

        if (data.period === 'weekly') {
            daysToAdd = 6;
        } else if (data.period === 'monthly') {
            daysToAdd = 30;
        }

        end.setDate(start.getDate() + daysToAdd);

        setData(prev => ({
            ...prev,
            start_date: dateVal,
            end_date: end.toISOString().split('T')[0]
        }));
    };

    // Submit form (Save & Apply)
    const handleSubmit = (e, isDraft = false) => {
        e.preventDefault();
        
        // Dynamically set label based on selected outlet if empty
        const finalLabel = data.label || `Target ${selectedOutlet}`;
        
        transform((data) => ({
            ...data,
            label: finalLabel,
            current_value: data.current_value || 0,
        }));

        const options = {
            onSuccess: (page) => {
                if (onSaveSuccess) {
                    onSaveSuccess(finalLabel);
                }
                onClose();
            },
            preserveScroll: true
        };

        if (currentTarget?.id) {
            put(route('targets-goals.update', currentTarget.id), options);
        } else {
            post(route('targets-goals.store'), options);
        }
    };

    // Calculated values for the preview card
    const targetVal = data.target_value || 1; // Prevent division by zero
    const probability = Math.min(100, Math.round((currentValue / targetVal) * 100 * 10) / 10);
    const progressPercent = Math.min(100, Math.round((currentValue / targetVal) * 100));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with slide blur */}
            <div 
                className="absolute inset-0 bg-[#050316]/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Body */}
            <div className="relative bg-white rounded-3xl border border-[#dddbff] shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[92vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="px-8 pt-6 pb-4 flex items-start justify-between flex-shrink-0">
                    <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#443dff] mt-1 flex-shrink-0">
                            <Icon icon="solar:target-linear" className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-[#050316] tracking-tight">Atur Target Performa</h3>
                            <p className="text-xs text-[#2f27ce]/70 mt-1 font-medium">
                                Tentukan objektif pendapatan untuk memaksimalkan ROI bisnis Anda.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-xl text-[#2f27ce]/50 hover:bg-[#dddbff]/50 hover:text-[#443dff] transition flex items-center justify-center border border-[#dddbff]/30 active:scale-95"
                    >
                        <Icon icon="solar:close-circle-linear" className="text-lg" />
                    </button>
                </div>

                {/* Modal Form Scroll Area */}
                <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-y-auto px-8 py-2 space-y-5 flex-1">
                        
                        {/* Target Period Tab Switcher */}
                        <div>
                            <label className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest block mb-2">
                                Periode Target
                            </label>
                            <div className="inline-flex bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-1 w-full sm:w-auto">
                                {['Harian', 'Mingguan', 'Bulanan'].map((p) => {
                                    const mapped = p === 'Harian' ? 'daily' : p === 'Mingguan' ? 'weekly' : 'monthly';
                                    const isActive = data.period === mapped;
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => handlePeriodChange(p)}
                                            className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                                                isActive
                                                    ? 'bg-white text-[#2f27ce] shadow-sm border border-[#dddbff]'
                                                    : 'text-[#2f27ce]/60 hover:text-[#2f27ce]'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Nominal Input Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest">
                                    Target Nominal Pendapatan
                                </label>
                                <span className="text-[9px] font-extrabold text-[#443dff] bg-[#dddbff]/40 border border-[#c4c0ff] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Premium Feature
                                </span>
                            </div>

                            <div className="flex items-center bg-white border-2 border-[#dddbff] focus-within:border-[#443dff] rounded-2xl px-5 py-3 transition-all">
                                <span className="text-lg font-extrabold text-[#2f27ce]/60 mr-3">Rp</span>
                                <input
                                    type="text"
                                    value={formatRp(data.target_value)}
                                    onChange={(e) => setData('target_value', parseNumber(e.target.value))}
                                    required
                                    className="w-full text-2xl font-extrabold text-[#050316] placeholder-[#dddbff] focus:outline-none bg-transparent"
                                />
                            </div>

                            {/* Quick Add Buttons */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {[5000000, 10000000, 25000000, 50000000].map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handleQuickAdd(amount)}
                                        className="px-3.5 py-2 text-[11px] font-bold text-[#2f27ce] bg-[#fbfbfe] border border-[#dddbff] hover:border-[#443dff] hover:bg-[#dddbff]/20 rounded-xl transition"
                                    >
                                        +{formatRp(amount)}
                                    </button>
                                ))}
                            </div>
                            {errors.target_value && (
                                <p className="text-xs text-rose-500 font-medium">{errors.target_value}</p>
                            )}
                        </div>

                        {/* Grid fields: Outlet & Date/Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Outlet Selection */}
                            <div className="relative">
                                <label className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest block mb-2">
                                    Pilih Outlet
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-[#fbfbfe] border border-[#dddbff] hover:border-[#443dff] rounded-xl text-left text-sm font-semibold text-[#050316] transition-all"
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon icon="solar:shop-linear" className="text-base text-[#2f27ce]/70" />
                                        {selectedOutlet}
                                    </span>
                                    <Icon icon="solar:alt-arrow-down-linear" className={`transition-transform duration-200 text-[#2f27ce]/70 ${isOutletDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isOutletDropdownOpen && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white border border-[#dddbff] rounded-2xl shadow-xl z-20 py-1 max-h-48 overflow-y-auto">
                                        {outlets.map((outlet) => (
                                            <button
                                                key={outlet.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedOutlet(outlet.name);
                                                    setIsOutletDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold text-[#050316] hover:bg-[#dddbff]/30 transition"
                                            >
                                                <Icon icon="solar:shop-linear" className="text-sm text-[#2f27ce]/70" />
                                                {outlet.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Execution Date & Time */}
                            <div>
                                <label className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest block mb-2">
                                    Waktu Pelaksanaan
                                </label>
                                <div className="grid grid-cols-12 gap-2">
                                    {/* Date Picker */}
                                    <div className="col-span-8">
                                        <ModernDatePicker
                                            value={data.start_date}
                                            onChange={handleStartDateChange}
                                            placeholder="Pilih Tanggal Mulai"
                                        />
                                    </div>
                                    {/* Time Picker */}
                                    <div className="col-span-4">
                                        <ModernTimePicker
                                            value={executionTime}
                                            onChange={setExecutionTime}
                                        />
                                    </div>
                                </div>
                                {errors.start_date && (
                                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.start_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Estimasi Pencapaian Card (Premium View) */}
                        <div className="bg-[#fbfbfe] border border-[#dddbff] rounded-3xl pt-5 px-5 pb-16 relative overflow-hidden">
                            
                            {/* Card Content Row 1 */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h4 className="text-sm font-extrabold text-[#050316]">Estimasi Pencapaian</h4>
                                    <p className="text-[10px] text-[#2f27ce]/60 font-semibold mt-0.5">
                                        Berdasarkan tren transaksi 30 hari terakhir
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-[#050316] tracking-tight">{probability}%</p>
                                    <p className="text-[8px] font-extrabold text-[#2f27ce]/60 tracking-wider mt-0.5">
                                        KEMUNGKINAN TERCAPAI
                                    </p>
                                </div>
                            </div>

                            {/* Card Progress Row 2 */}
                            <div className="space-y-3 relative z-10">
                                <div className="w-full bg-[#dddbff]/40 h-3 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#050316] to-gray-700 rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                
                                {/* Clean Flex Labels under Progress Bar (Prevents text overlap) */}
                                <div className="flex justify-between items-center text-[9px] font-extrabold text-[#2f27ce]/60 tracking-wider">
                                    <span>RP 0</span>
                                    <div className="flex items-center gap-1.5 bg-[#443dff]/10 border border-[#c4c0ff] px-2.5 py-1 rounded-lg text-[#050316] font-black">
                                        <span className={`w-1.5 h-1.5 rounded-full ${progressPercent >= 100 ? 'bg-emerald-500 animate-pulse' : 'bg-[#443dff]'}`}></span>
                                        <span>RP {formatRp(currentValue)} TERCAPAI</span>
                                    </div>
                                    <span>TARGET: RP {formatRp(data.target_value)}</span>
                                </div>
                            </div>

                            {/* Card SVG Graph Curve (Matches image style) */}
                            <div className="absolute left-0 right-0 bottom-0 h-12 w-full pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 500 50" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="modalTargetAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#443dff" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#443dff" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0,42 C100,38 180,45 250,28 C320,10 400,22 500,14 L500,50 L0,50 Z"
                                        fill="url(#modalTargetAreaGradient)"
                                    />
                                    <path
                                        d="M0,42 C100,38 180,45 250,28 C320,10 400,22 500,14"
                                        fill="none"
                                        stroke="#050316"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-8 py-5 border-t border-[#dddbff] bg-[#fbfbfe]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#2f27ce]/70">
                            <Icon icon="solar:info-circle-linear" className="text-sm" />
                            <span>Target akan aktif segera setelah disimpan.</span>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-xs font-bold text-[#050316] hover:bg-[#dddbff]/50 rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                className="px-4 py-2.5 text-xs font-bold text-[#050316] border border-[#dddbff] hover:bg-[#dddbff]/30 rounded-xl transition"
                            >
                                Simpan Draft
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] rounded-xl transition shadow-lg shadow-[#2f27ce]/25 active:scale-95 disabled:opacity-50"
                            >
                                Simpan & Terapkan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
