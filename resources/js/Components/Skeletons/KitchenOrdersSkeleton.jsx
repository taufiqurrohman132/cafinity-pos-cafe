import React from 'react';

export default function KitchenOrdersSkeleton() {
    return (
        <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen animate-pulse">
            
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                <div className="space-y-2">
                    <div className="w-48 h-7 rounded-xl bg-brand-light" />
                    <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-36 h-10 rounded-xl bg-brand-light/40" />
                    <div className="w-32 h-10 rounded-xl bg-brand-light" />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-brand-light" />
                        <div className="space-y-2">
                            <div className="h-3 bg-brand-light/60 rounded w-24" />
                            <div className="h-6 bg-brand-light rounded w-12" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl border border-brand-light shadow-sm px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-16 h-8 rounded-lg bg-brand-light/60" />
                    ))}
                </div>
                <div className="w-56 h-4 bg-brand-light/40 rounded" />
            </div>

            {/* Order Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-light shadow-sm flex flex-col overflow-hidden">
                        <div className="p-5 flex flex-col gap-3 flex-1">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="w-24 h-5 bg-brand-light rounded" />
                                <div className="w-20 h-5 bg-brand-light/60 rounded-lg" />
                            </div>
                            {/* Second Row */}
                            <div className="flex justify-between">
                                <div className="w-28 h-3.5 bg-brand-light/60 rounded" />
                                <div className="w-24 h-3.5 bg-brand-light/60 rounded" />
                            </div>

                            {/* Optional notes block for visual variety */}
                            {i % 3 === 0 && (
                                <div className="h-8 bg-brand-light/20 rounded-xl w-full" />
                            )}

                            {/* Items divider & list */}
                            <div className="border-t border-black/5 pt-3 space-y-2.5">
                                {[...Array(i % 2 === 0 ? 3 : 2)].map((_, j) => (
                                    <div key={j} className="flex items-start gap-2.5">
                                        <div className="w-6 h-4 bg-brand-light rounded" />
                                        <div className="flex-1 h-4 bg-brand-light/60 rounded w-36" />
                                        <div className="w-4 h-4 bg-brand-light rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="px-5 pb-5 flex gap-2.5">
                            <div className="flex-1 h-10 bg-brand-light rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Banner */}
            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-2 flex-1">
                    <div className="w-36 h-4 bg-brand-light rounded" />
                    <div className="w-5/6 h-3 bg-brand-light/60 rounded" />
                    <div className="w-2/3 h-3 bg-brand-light/60 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="w-36 h-10 bg-brand-light rounded-xl" />
                    <div className="w-36 h-10 bg-brand-light rounded-xl" />
                </div>
            </div>

        </div>
    );
}
