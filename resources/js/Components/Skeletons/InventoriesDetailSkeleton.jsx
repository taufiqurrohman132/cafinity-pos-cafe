import React from 'react';

export default function InventoriesDetailSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-pulse">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-brand-light" />
                        <div className="space-y-1.5">
                            <div className="w-36 h-6 bg-brand-light rounded" />
                            <div className="w-20 h-3.5 bg-brand-light/60 rounded" />
                        </div>
                    </div>
                    <div className="w-20 h-10 bg-brand-light rounded-xl" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Info Card */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                            <div className="w-32 h-5 rounded bg-brand-light" />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="w-16 h-3 bg-brand-light/60 rounded" />
                                        <div className="w-24 h-4 bg-brand-light rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity logs */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                            <div className="w-32 h-5 rounded bg-brand-light" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-brand-light/50 last:border-0">
                                        <div className="space-y-1.5">
                                            <div className="w-24 h-3.5 bg-brand-light rounded" />
                                            <div className="w-44 h-3 bg-brand-light/60 rounded" />
                                        </div>
                                        <div className="text-right flex-shrink-0 space-y-1">
                                            <div className="w-8 h-3.5 bg-brand-light rounded ml-auto" />
                                            <div className="w-12 h-2.5 bg-brand-light/60 rounded ml-auto" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        {/* Status Stok */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4 text-center flex flex-col items-center">
                            <div className="w-24 h-4 rounded bg-brand-light self-start" />
                            <div className="w-16 h-10 rounded bg-brand-light mt-3" />
                            <div className="w-8 h-3 rounded bg-brand-light/60 mt-1" />
                            <div className="space-y-1.5 w-full pt-4">
                                <div className="flex justify-between text-xs">
                                    <div className="w-20 h-3 bg-brand-light/60 rounded" />
                                    <div className="w-16 h-3 bg-brand-light rounded" />
                                </div>
                                <div className="w-full h-2 rounded bg-brand-light" />
                            </div>
                            <div className="w-16 h-5 rounded-full bg-brand-light/85 mt-3" />
                        </div>

                        {/* Restock Card */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-3">
                            <div className="w-24 h-4 rounded bg-brand-light" />
                            <div className="w-full h-10 rounded-xl bg-brand-light" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
