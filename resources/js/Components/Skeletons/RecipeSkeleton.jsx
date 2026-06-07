import React from 'react';

export default function RecipeSkeleton() {
    return (
        <div className="flex h-[calc(100vh-72px)] bg-brand-bg overflow-hidden animate-pulse">
            
            {/* ── LEFT SIDEBAR SKELETON ── */}
            <div className="w-80 min-w-[280px] bg-white border-r border-brand-light flex flex-col z-10 shadow-[10px_0_30px_rgb(var(--color-brand-primary)/0.03)]">
                <div className="p-5 border-b border-brand-light/50 flex items-center justify-between bg-brand-bg/50">
                    <div className="w-32 h-5 rounded bg-brand-light" />
                    <div className="w-8 h-8 rounded-xl bg-brand-light" />
                </div>

                {/* Search mockup */}
                <div className="px-4 pt-5 pb-2">
                    <div className="w-full h-10 rounded-xl bg-brand-light/60" />
                </div>

                {/* List items */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    <div className="w-24 h-2.5 rounded bg-brand-light/60 pl-1 mb-2" />
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl border border-brand-light space-y-2.5">
                            <div className="flex justify-between items-start">
                                <div className="w-28 h-4 bg-brand-light rounded" />
                                <div className="w-10 h-4 bg-brand-light/60 rounded-full" />
                            </div>
                            <div className="w-14 h-3 bg-brand-light/40 rounded" />
                            <div className="flex justify-between items-center pt-2 border-t border-brand-light gap-2">
                                <div className="w-16 h-3 bg-brand-light/60 rounded" />
                                <div className="w-12 h-3.5 bg-brand-light rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT MAIN CONTENT SKELETON ── */}
            <div className="flex-1 overflow-y-auto flex flex-col bg-brand-bg">
                {/* Top Bar */}
                <div className="bg-white border-b border-brand-light px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="space-y-2">
                        <div className="w-44 h-7 rounded-xl bg-brand-light" />
                        <div className="w-64 h-3 bg-brand-light/60 rounded" />
                    </div>
                    <div className="w-28 h-10 bg-brand-light rounded-xl" />
                </div>

                {/* Inner Body */}
                <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm space-y-2">
                                <div className="w-20 h-3 bg-brand-light/60 rounded" />
                                <div className="w-28 h-6 bg-brand-light rounded" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Left split */}
                        <div className="xl:col-span-8 space-y-6">
                            {/* Ingredients Card */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="w-36 h-5 rounded bg-brand-light" />
                                    <div className="w-24 h-8 rounded-lg bg-brand-light/40" />
                                </div>
                                <div className="border-b border-brand-light/50 pb-3 flex justify-between">
                                    {[...Array(4)].map((_, idx) => (
                                        <div key={idx} className="w-16 h-3 bg-brand-light/60 rounded" />
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-brand-light/30 last:border-0">
                                            <div className="w-32 h-4.5 bg-brand-light rounded" />
                                            <div className="w-12 h-4 bg-brand-light/60 rounded" />
                                            <div className="w-16 h-4 bg-brand-light/50 rounded" />
                                            <div className="w-16 h-4 bg-brand-light rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price vs Cost structure */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                                <div className="w-44 h-4.5 bg-brand-light rounded" />
                                <div className="w-full h-3 rounded-full bg-brand-light/30" />
                                <div className="grid grid-cols-2 gap-4">
                                    {[...Array(2)].map((_, idx) => (
                                        <div key={idx} className="bg-brand-bg rounded-xl p-4 border border-brand-light space-y-2">
                                            <div className="w-20 h-3 bg-brand-light/60 rounded" />
                                            <div className="w-24 h-5.5 bg-brand-light rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right split */}
                        <div className="xl:col-span-4 space-y-6">
                            {/* What-If Simulator */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-4">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-brand-light" />
                                    <div className="w-28 h-4 rounded bg-brand-light" />
                                </div>
                                <div className="w-full h-2 rounded bg-brand-light/50" />
                                <div className="bg-brand-bg border border-brand-light p-4 rounded-xl space-y-3">
                                    {[...Array(3)].map((_, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <div className="w-20 h-3.5 bg-brand-light rounded" />
                                            <div className="w-14 h-3.5 bg-brand-light/60 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strategic Options */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 space-y-3">
                                <div className="w-28 h-4 rounded bg-brand-light" />
                                {[...Array(3)].map((_, idx) => (
                                    <div key={idx} className="w-full h-10 rounded-xl bg-brand-light/40 border border-brand-light/60" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
