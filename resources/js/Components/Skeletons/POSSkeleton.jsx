import React from 'react';

export default function POSSkeleton() {
    return (
        <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-brand-bg via-white to-brand-light/30 flex overflow-hidden animate-pulse">
            
            {/* ── LEFT PRODUCT AREA SKELETON ── */}
            <div className="flex-1 p-5 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="space-y-2">
                        <div className="w-44 h-7 rounded-xl bg-brand-light" />
                        <div className="w-28 h-3.5 rounded-lg bg-brand-light/60" />
                    </div>
                    {/* Search Input Mock */}
                    <div className="w-[330px] h-[46px] rounded-xl bg-brand-light" />
                </div>

                <div className="flex flex-row gap-6 flex-1 overflow-hidden min-h-0">
                    {/* Categories Column */}
                    <div className="w-[92px] overflow-y-auto flex flex-col gap-4 flex-shrink-0 pb-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl h-[82px] flex-shrink-0 bg-brand-light/50 border border-brand-light/20 flex flex-col items-center justify-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-brand-light" />
                                <div className="w-12 h-2.5 rounded bg-brand-light/60" />
                            </div>
                        ))}
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 pb-4 p-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border-2 border-brand-light shadow-sm overflow-hidden flex flex-col">
                                    {/* Image block */}
                                    <div className="h-[120px] bg-brand-light/60" />
                                    {/* Detail block */}
                                    <div className="p-3.5 flex flex-col flex-1 space-y-3">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3.5 bg-brand-light rounded w-5/6" />
                                            <div className="h-2.5 bg-brand-light/60 rounded w-2/3" />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="h-4 bg-brand-light rounded w-16" />
                                            <div className="w-8 h-8 rounded-xl bg-brand-light/80" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT CART AREA SKELETON ── */}
            <div className="w-[340px] bg-white border-l border-brand-light flex flex-col h-[calc(100vh-72px)] flex-shrink-0">
                {/* Cart Header */}
                <div className="h-[76px] border-b border-brand-light px-5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-light" />
                        <div className="w-24 h-4 rounded bg-brand-light" />
                    </div>
                    <div className="w-14 h-5 rounded-md bg-brand-light/60" />
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3 items-start pb-4 border-b border-brand-light/50 last:border-0 last:pb-0">
                            <div className="flex-1 space-y-2 pt-0.5">
                                <div className="h-3.5 bg-brand-light rounded w-3/4" />
                                <div className="h-2.5 bg-brand-light/60 rounded w-1/3" />
                            </div>
                            <div className="w-20 h-7 bg-brand-light/40 rounded-lg flex-shrink-0" />
                            <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5 pt-0.5">
                                <div className="h-3.5 bg-brand-light rounded w-16" />
                                <div className="h-2.5 bg-brand-light/60 rounded w-8" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Footer */}
                <div className="border-t border-brand-light p-5 flex-shrink-0 bg-gradient-to-t from-brand-light/20 to-transparent space-y-4">
                    <div className="space-y-2.5">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-3 bg-brand-light/60 rounded w-16" />
                                <div className="h-3 bg-brand-light rounded w-20" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-brand-light border-dashed">
                        <div className="h-4 bg-brand-light rounded w-24" />
                        <div className="h-7 bg-brand-light rounded w-32" />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 h-[52px] rounded-xl bg-brand-light/40" />
                        <div className="flex-[2] h-[52px] rounded-xl bg-brand-light" />
                    </div>
                </div>
            </div>

        </div>
    );
}
