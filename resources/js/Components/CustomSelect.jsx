import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Pilih Opsi',
    className = '',
    buttonClassName = '',
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState(null); // null = belum dihitung
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const normalizedOptions = options.map(opt => {
        if (typeof opt === 'object' && opt !== null) return opt;
        return { value: opt, label: opt };
    });

    const selectedOption = normalizedOptions.find(opt => {
        if (value === null || value === undefined) return opt.value === value;
        return String(opt.value) === String(value);
    });

    // Hitung posisi SEBELUM dropdown di-render, bukan sesudahnya
    const openDropdown = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const dropdownEstimatedHeight = 240;
        const openUpward = spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight;

        setCoords({
            top: openUpward ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: rect.width,
            openUpward,
        });
        setIsOpen(true);
    };

    const closeDropdown = () => {
        setIsOpen(false);
        setCoords(null);
    };

    // Tutup dropdown pas scroll — bukan ngikutin posisi
    useEffect(() => {
        if (!isOpen) return;
        function handleScroll(e) {
            // Kalau scroll terjadi DI DALAM dropdown, biarkan — jangan tutup
            if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
                return;
            }
            closeDropdown();
        }
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', closeDropdown);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', closeDropdown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            const clickedTrigger = containerRef.current && containerRef.current.contains(event.target);
            const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
            if (!clickedTrigger && !clickedDropdown) {
                closeDropdown();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (onChange) onChange(val);
        closeDropdown();
    };

    const hasHeight = className.split(' ').some(c => c.startsWith('h-') || c.startsWith('lg:h-') || c.startsWith('md:h-') || c.startsWith('sm:h-'));

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && (isOpen ? closeDropdown() : openDropdown())}
                className={`w-full ${hasHeight ? 'h-full' : 'h-[40px]'} bg-white border border-[#D0D0D0] rounded-xl px-3.5 flex items-center justify-between text-sm font-normal text-black outline-none transition-all duration-150 cursor-pointer select-none hover:border-[#999999] focus:border-[#BFFF00] focus:ring-4 focus:ring-[#BFFF00]/10 disabled:opacity-50 disabled:bg-neutral-50 disabled:cursor-not-allowed ${isOpen ? 'border-[#BFFF00] ring-4 ring-[#BFFF00]/10' : ''
                    } ${buttonClassName}`}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <Icon
                    icon="solar:alt-arrow-down-linear"
                    className={`text-xs text-[#999999] transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`}
                />
            </button>

            {isOpen && coords && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: coords.openUpward ? undefined : coords.top,
                        bottom: coords.openUpward ? window.innerHeight - coords.top : undefined,
                        left: coords.left,
                        width: coords.width,
                        zIndex: 9999,
                    }}
                    className={`max-h-60 overflow-y-auto bg-white border border-[#E6E6E6] rounded-xl shadow-lg py-1.5 animate-in fade-in duration-100 focus:outline-none ${coords.openUpward ? 'slide-in-from-bottom-1' : 'slide-in-from-top-1'
                        }`}
                >
                    {normalizedOptions.length === 0 ? (
                        <div className="px-3.5 py-2 text-xs text-neutral-400 text-center">Tidak ada opsi</div>
                    ) : (
                        normalizedOptions.map((opt) => {
                            const isSelected = (value !== null && value !== undefined) && String(opt.value) === String(value);
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`px-3.5 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${isSelected ? 'bg-[#BFFF00]/20 text-black font-semibold' : 'text-black hover:bg-neutral-50'
                                        }`}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && (
                                        <Icon icon="solar:check-read-linear" className="text-xs text-black ml-2 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}