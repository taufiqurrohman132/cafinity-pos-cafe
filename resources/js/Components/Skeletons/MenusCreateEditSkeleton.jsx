import React from 'react';

export default function MenusCreateEditSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 pb-48 animate-pulse">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/40 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-light shrink-0" />
                        <div className="space-y-2">
                            <div className="w-24 h-4.5 rounded bg-brand-light/40" />
                            <div className="w-48 h-6 rounded-lg bg-brand-light" />
                            <div className="w-72 h-3.5 rounded bg-brand-light/60" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 h-10 rounded-xl bg-brand-light" />
                        <div className="w-32 h-10 rounded-xl bg-brand-light/80" />
                    </div>
                </div>

                {/* Double-column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: FORM DETAILS */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Card 1: Foto Menu */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col sm:flex-row gap-5 items-center">
                            <div className="w-24 h-24 rounded-2xl bg-brand-light shrink-0" />
                            <div className="flex-1 space-y-2.5 w-full">
                                <div className="w-36 h-4 rounded bg-brand-light" />
                                <div className="w-full h-3.5 rounded bg-brand-light/60" />
                                <div className="w-3/4 h-3.5 rounded bg-brand-light/40" />
                                <div className="flex gap-2 pt-1.5">
                                    <div className="w-20 h-8 rounded-lg bg-brand-light/50" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Informasi Dasar */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-5">
                            <div className="w-32 h-4 rounded bg-brand-light" />
                            
                            {/* Menu Name */}
                            <div className="space-y-2">
                                <div className="w-20 h-3 rounded bg-brand-light/50" />
                                <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                            </div>

                            {/* Category & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light/50" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light/50" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <div className="w-20 h-3 rounded bg-brand-light/50" />
                                <div className="w-full h-24 rounded-xl bg-brand-light/60" />
                            </div>
                        </div>

                        {/* Card 3: Penjualan & Biaya */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-36 h-4 rounded bg-brand-light" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light/50" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-24 h-3 rounded bg-brand-light/50" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: PREVIEW & TAGS */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Live Preview Card */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden flex flex-col">
                            <div className="w-full aspect-video bg-brand-light" />
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="w-16 h-3 rounded bg-brand-light/40" />
                                    <div className="w-44 h-6 rounded-lg bg-brand-light" />
                                    <div className="w-28 h-5 rounded bg-brand-light/80" />
                                </div>
                                <div className="w-full h-12 rounded-xl bg-gray-50 border border-brand-light/50" />
                            </div>
                        </div>

                        {/* Tags Card */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-28 h-4 rounded bg-brand-light" />
                            <div className="flex flex-wrap gap-2">
                                <div className="w-20 h-7 rounded-full bg-brand-light/50" />
                                <div className="w-24 h-7 rounded-full bg-brand-light/50" />
                                <div className="w-16 h-7 rounded-full bg-brand-light/50" />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
