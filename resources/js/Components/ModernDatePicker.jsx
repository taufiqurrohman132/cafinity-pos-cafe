import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function ModernDatePicker({ 
    value, 
    onChange, 
    placeholder = 'Pilih Tanggal',
    variant = 'outline' // 'outline' or 'gradient'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const initialDate = value ? new Date(value) : new Date();
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (dropdownRef.current) {
                    dropdownRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setCurrentMonth(d.getMonth());
            setCurrentYear(d.getFullYear());
        }
    }, [value]);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayOfWeek = date.getDay();
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthDaysCount = new Date(prevYear, prevMonth + 1, 0).getDate();
        
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDaysCount - i,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false
            });
        }

        const daysCount = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysCount; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true
            });
        }

        const totalCells = Math.ceil(days.length / 7) * 7;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        let nextDay = 1;
        while (days.length < totalCells) {
            days.push({
                day: nextDay++,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false
            });
        }

        return days;
    };

    const calendarDays = getDaysInMonth(currentMonth, currentYear);

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleSelectDay = (dayObj, e) => {
        e.stopPropagation();
        const d = dayObj.day.toString().padStart(2, '0');
        const m = (dayObj.month + 1).toString().padStart(2, '0');
        const y = dayObj.year;
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const getFormattedValue = () => {
        if (!value) return placeholder;
        const d = new Date(value);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const isToday = (dayObj) => {
        const today = new Date();
        return today.getDate() === dayObj.day && today.getMonth() === dayObj.month && today.getFullYear() === dayObj.year;
    };

    const isSelected = (dayObj) => {
        if (!value) return false;
        const d = new Date(value);
        return d.getDate() === dayObj.day && d.getMonth() === dayObj.month && d.getFullYear() === dayObj.year;
    };

    return (
        <div className="relative" ref={containerRef}>
            {variant === 'gradient' ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2.5 pl-4 pr-4 py-2.5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl text-sm font-bold cursor-pointer transition-all shadow-lg shadow-[#443dff]/30 active:scale-[0.98] select-none"
                >
                    <Icon icon="solar:calendar-linear" className="text-base" />
                    <span>{getFormattedValue()}</span>
                    <Icon icon="solar:alt-arrow-down-linear" className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between border border-[#dddbff] rounded-xl px-3 py-2.5 text-sm text-[#050316] bg-white hover:border-[#443dff] transition-all cursor-pointer select-none"
                >
                    <span className={value ? "text-[#050316] font-bold" : "text-[#2f27ce]/50 font-medium"}>
                        {getFormattedValue()}
                    </span>
                    <Icon icon="solar:calendar-linear" className="text-[#443dff] text-base" />
                </button>
            )}

            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className={`absolute ${variant === 'gradient' ? 'right-0' : 'left-0'} mt-2 w-[290px] bg-white border border-[#dddbff] rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
                >
                    <div className="flex items-center justify-between mb-3.5">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-8 h-8 rounded-lg border border-[#dddbff] flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff]/30 hover:text-[#050316] transition-all"
                        >
                            <Icon icon="solar:alt-arrow-left-linear" className="text-xs" />
                        </button>
                        <span className="font-extrabold text-[12px] text-[#050316]">
                            {months[currentMonth]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-lg border border-[#dddbff] flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff]/30 hover:text-[#050316] transition-all"
                        >
                            <Icon icon="solar:alt-arrow-right-linear" className="text-xs" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                        {daysOfWeek.map((day) => (
                            <span key={day} className="text-[10px] font-extrabold text-[#2f27ce]/60 py-0.5">
                                {day}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((dayObj, index) => {
                            const selected = isSelected(dayObj);
                            const today = isToday(dayObj);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => handleSelectDay(dayObj, e)}
                                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                        selected
                                            ? 'bg-gradient-to-br from-[#443dff] to-[#2f27ce] text-white shadow-md shadow-[#443dff]/20'
                                            : today
                                            ? 'bg-[#dddbff]/60 text-[#2f27ce] border border-[#2f27ce]/20'
                                            : dayObj.isCurrentMonth
                                            ? 'text-[#050316] hover:bg-[#dddbff]/30 hover:text-[#2f27ce]'
                                            : 'text-[#2f27ce]/30 hover:bg-[#dddbff]/10'
                                    }`}
                                >
                                    {dayObj.day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#dddbff] mt-3.5 pt-3">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                const today = new Date();
                                const y = today.getFullYear();
                                const m = (today.getMonth() + 1).toString().padStart(2, '0');
                                const d = today.getDate().toString().padStart(2, '0');
                                onChange(`${y}-${m}-${d}`);
                                setIsOpen(false);
                            }}
                            className="text-[10px] font-extrabold text-[#443dff] hover:text-[#2f27ce] transition-colors"
                        >
                            Hari Ini
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="text-[10px] font-extrabold text-rose-500 hover:text-rose-700 transition-colors"
                            >
                                Hapus Filter
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
