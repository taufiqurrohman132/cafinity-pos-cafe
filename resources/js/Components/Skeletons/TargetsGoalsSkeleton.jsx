import React from 'react';

export default function TargetsGoalsSkeleton() {
    const isAov = window.location.pathname.includes('/aov');

    if (isAov) {
        return (
            <div className="flex flex-col gap-6 py-6 px-8 max-w-7xl mx-auto bg-brand-bg min-h-[calc(100vh-72px)]">
                
                {/* Back button to Targets & Goals */}
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-40 h-4 rounded bg-brand-light" />
                </div>

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-light/50 pb-5 animate-pulse">
                    <div className="space-y-2">
                        <div className="w-80 h-7 rounded-xl bg-brand-light" />
                        <div className="w-96 h-4 rounded-lg bg-brand-light/60" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-48 h-9 rounded-xl bg-brand-light" />
                        <div className="w-24 h-9 rounded-xl bg-brand-light" />
                    </div>
                </div>

                {/* STAT CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-brand-light p-5 space-y-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="w-9 h-9 rounded-xl bg-brand-light" />
                                <div className="w-16 h-5 rounded-full bg-brand-light/60" />
                            </div>
                            <div className="space-y-2">
                                <div className="w-36 h-3 rounded bg-brand-light/50" />
                                <div className="w-24 h-6 rounded bg-brand-light" />
                                <div className="w-40 h-3.5 rounded bg-brand-light/40" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* MIDDLE ROW: TIME CHART & CHANNEL COMPARISON */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
                    
                    {/* Line Chart card */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="w-48 h-4 rounded bg-brand-light" />
                                <div className="w-72 h-3.5 rounded bg-brand-light/60" />
                            </div>
                            <div className="w-24 h-6 rounded bg-brand-light/50" />
                        </div>
                        <div className="h-64 rounded-xl bg-gray-50 border border-brand-light/40" />
                    </div>

                    {/* Channel comparison card */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="w-32 h-4.5 rounded bg-brand-light" />
                                <div className="w-48 h-3.5 rounded bg-brand-light/60" />
                            </div>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="w-16 h-3 rounded bg-brand-light" />
                                            <div className="w-12 h-3 rounded bg-brand-light/80" />
                                        </div>
                                        <div className="w-full h-8 rounded-xl bg-brand-bg border border-brand-light/40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-brand-light pt-4 space-y-2.5">
                            <div className="w-28 h-3.5 rounded bg-brand-light" />
                            <div className="h-16 rounded-xl bg-brand-bg border border-brand-light/60" />
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW: KONTRIBUSI KATEGORI & PEAK HOUR HEATMAP */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                    
                    {/* Category Contribution Card */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-36 h-4 rounded bg-brand-light" />
                                <div className="w-20 h-4 rounded bg-brand-light/60" />
                            </div>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="w-24 h-3 rounded bg-brand-light" />
                                            <div className="w-8 h-3 rounded bg-brand-light/80" />
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-brand-bg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-16 rounded-xl bg-brand-bg border border-brand-light/60" />
                    </div>

                    {/* Peak Hour Heatmap Card */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="w-48 h-4.5 rounded bg-brand-light" />
                                <div className="w-56 h-3.5 rounded bg-brand-light/60" />
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-14 rounded-xl bg-brand-bg border border-brand-light/60" />
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-brand-light pt-4 flex gap-4">
                            <div className="w-32 h-3.5 rounded bg-brand-light" />
                            <div className="w-16 h-3.5 rounded bg-brand-light/60" />
                            <div className="w-16 h-3.5 rounded bg-brand-light/60" />
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    // Default TargetsGoalsIndex page skeleton
    return (
        <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen">
            
            {/* Top header layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                <div className="space-y-2">
                    <div className="w-48 h-7 rounded-xl bg-brand-light" />
                    <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                </div>
                <div className="w-48 h-9 rounded-xl bg-brand-light" />
            </div>

            {/* Large top Hero target progress card */}
            <div className="bg-white rounded-2xl border border-brand-light p-6 shadow-sm animate-pulse space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="w-56 h-4.5 rounded bg-brand-light" />
                        <div className="w-36 h-3.5 rounded bg-brand-light/60" />
                    </div>
                    <div className="w-32 h-5 rounded-full bg-brand-light/50" />
                </div>
                <div className="w-full h-4 bg-brand-bg rounded-full overflow-hidden" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="w-20 h-3 rounded bg-brand-light/50" />
                            <div className="w-32 h-5 rounded bg-brand-light" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 4-column Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-light p-5 space-y-4">
                        <div className="flex justify-between">
                            <div className="w-8 h-8 rounded-xl bg-brand-light" />
                            <div className="w-12 h-4 rounded bg-brand-light/60" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="w-20 h-3 rounded bg-brand-light/50" />
                            <div className="w-28 h-5.5 rounded bg-brand-light" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main grid layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-pulse">
                
                {/* Chart card */}
                <div className="xl:col-span-8 bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1.5">
                            <div className="w-48 h-4 rounded bg-brand-light" />
                            <div className="w-64 h-3.5 rounded bg-brand-light/60" />
                        </div>
                        <div className="w-20 h-7 rounded-lg bg-brand-light/50" />
                    </div>
                    <div className="h-64 rounded-xl bg-gray-50 border border-brand-light/40" />
                </div>

                {/* Staff performance sidebar card */}
                <div className="xl:col-span-4 bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-5">
                    <div className="w-36 h-4.5 rounded bg-brand-light border-b border-brand-light/40 pb-2 self-stretch" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2 border-b border-brand-light/30 pb-3 last:border-0 last:pb-0">
                                <div className="flex justify-between">
                                    <div className="w-24 h-3.5 rounded bg-brand-light" />
                                    <div className="w-12 h-3.5 rounded bg-brand-light/80" />
                                </div>
                                <div className="w-full h-2 rounded bg-brand-bg" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
