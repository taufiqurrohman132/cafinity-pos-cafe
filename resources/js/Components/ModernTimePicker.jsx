import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function ModernTimePicker({
    value = '08:00',
    onChange,
    placeholder = '08:00'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const hourScrollRef = useRef(null);
    const minuteScrollRef = useRef(null);

    // Parse current value
    const [hour, setHour] = useState('08');
    const [minute, setMinute] = useState('00');

    useEffect(() => {
        if (value && value.includes(':')) {
            const [h, m] = value.split(':');
            setHour(h.padStart(2, '0'));
            setMinute(m.padStart(2, '0'));
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dropdownRef = useRef(null);

    // Scroll selected elements into view and scroll the dropdown itself into view when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (dropdownRef.current) {
                    dropdownRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
                if (hourScrollRef.current) {
                    const selectedHourElem = hourScrollRef.current.querySelector('[data-selected="true"]');
                    if (selectedHourElem) {
                        hourScrollRef.current.scrollTop = selectedHourElem.offsetTop - 80;
                    }
                }
                if (minuteScrollRef.current) {
                    const selectedMinuteElem = minuteScrollRef.current.querySelector('[data-selected="true"]');
                    if (selectedMinuteElem) {
                        minuteScrollRef.current.scrollTop = selectedMinuteElem.offsetTop - 80;
                    }
                }
            }, 100);
        }
    }, [isOpen]);

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const handleHourSelect = (selectedHour) => {
        setHour(selectedHour);
        if (onChange) {
            onChange(`${selectedHour}:${minute}`);
        }
    };

    const handleMinuteSelect = (selectedMinute) => {
        setMinute(selectedMinute);
        if (onChange) {
            onChange(`${hour}:${selectedMinute}`);
        }
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-[#dddbff] rounded-xl px-3 py-2.5 text-sm text-[#050316] bg-white hover:border-[#443dff] transition-all cursor-pointer select-none"
            >
                <span className="font-bold text-[#050316]">
                    {hour}:{minute}
                </span>
                <Icon icon="solar:clock-circle-linear" className="text-[#443dff] text-base" />
            </button>

            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-[180px] bg-white border border-[#dddbff] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="text-[10px] font-extrabold text-[#2f27ce]/60 tracking-wider mb-2 text-center border-b border-[#dddbff]/50 pb-1.5 flex justify-around">
                        <span>JAM</span>
                        <span>MENIT</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 h-44">
                        {/* Hours List */}
                        <div 
                            ref={hourScrollRef}
                            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1 space-y-0.5"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {hours.map((h) => {
                                const isSelected = h === hour;
                                return (
                                    <button
                                        key={h}
                                        type="button"
                                        data-selected={isSelected}
                                        onClick={() => handleHourSelect(h)}
                                        className={`w-full py-1 text-xs font-bold rounded-lg transition-all text-center block ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-[#443dff] to-[#2f27ce] text-white shadow-sm'
                                                : 'text-[#050316] hover:bg-[#dddbff]/30 hover:text-[#443dff]'
                                        }`}
                                    >
                                        {h}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Minutes List */}
                        <div 
                            ref={minuteScrollRef}
                            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1 space-y-0.5"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {minutes.map((m) => {
                                const isSelected = m === minute;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        data-selected={isSelected}
                                        onClick={() => handleMinuteSelect(m)}
                                        className={`w-full py-1 text-xs font-bold rounded-lg transition-all text-center block ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-[#443dff] to-[#2f27ce] text-white shadow-sm'
                                                : 'text-[#050316] hover:bg-[#dddbff]/30 hover:text-[#443dff]'
                                        }`}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-[#dddbff] mt-2 pt-2 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center py-1 text-[10px] font-extrabold bg-[#443dff] text-white rounded-lg hover:bg-[#2f27ce] transition-colors"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
