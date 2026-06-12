import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function ModernDatePicker({ 
    value, 
    onChange, 
    placeholder = 'Pilih Tanggal',
    variant = 'outline', // 'outline' or 'gradient'
    disabled = false
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
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className="flex items-center gap-2.5 pl-4 pr-4 py-2.5 bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-primary hover:to-brand-dark text-white rounded-xl text-sm font-bold cursor-pointer transition-all shadow-lg shadow-brand-secondary/30 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none"
                >
                    <Icon icon="solar:calendar-linear" className="text-base" />
                    <span>{getFormattedValue()}</span>
                    <Icon icon="solar:alt-arrow-down-linear" className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between border border-brand-light rounded-xl px-3 py-2.5 text-sm text-brand-dark bg-white hover:border-brand-secondary transition-all cursor-pointer select-none disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                    <span className={value ? "text-brand-dark font-bold" : "text-brand-primary/50 font-medium"}>
                        {getFormattedValue()}
                    </span>
                    <Icon icon="solar:calendar-linear" className="text-brand-secondary text-base" />
                </button>
            )}

            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className={`absolute ${variant === 'gradient' ? 'right-0' : 'left-0'} mt-2 w-[290px] bg-white border border-brand-light rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
                >
                    <div className="flex items-center justify-between mb-3.5">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-8 h-8 rounded-lg border border-brand-light flex items-center justify-center text-brand-primary hover:bg-brand-light/30 hover:text-brand-dark transition-all"
                        >
                            <Icon icon="solar:alt-arrow-left-linear" className="text-xs" />
                        </button>
                        <span className="font-extrabold text-[12px] text-brand-dark">
                            {months[currentMonth]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-lg border border-brand-light flex items-center justify-center text-brand-primary hover:bg-brand-light/30 hover:text-brand-dark transition-all"
                        >
                            <Icon icon="solar:alt-arrow-right-linear" className="text-xs" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                        {daysOfWeek.map((day) => (
                            <span key={day} className="text-[10px] font-extrabold text-brand-primary/60 py-0.5">
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
                                            ? 'bg-gradient-to-br from-brand-secondary to-brand-primary text-white shadow-md shadow-brand-secondary/20'
                                            : today
                                            ? 'bg-brand-light/60 text-brand-primary border border-brand-primary/20'
                                            : dayObj.isCurrentMonth
                                            ? 'text-brand-dark hover:bg-brand-light/30 hover:text-brand-primary'
                                            : 'text-brand-primary/30 hover:bg-brand-light/10'
                                    }`}
                                >
                                    {dayObj.day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-light mt-3.5 pt-3">
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
                            className="text-[10px] font-extrabold text-brand-secondary hover:text-brand-primary transition-colors"
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
