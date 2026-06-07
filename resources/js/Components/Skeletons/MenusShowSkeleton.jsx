import React from 'react';

export default function MenusShowSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-pulse">
            
            {/* Top Nav */}
            <div className="flex items-center justify-between mb-6">
                <div className="w-44 h-4 bg-brand-light rounded" />
                <div className="flex items-center gap-3">
                    <div className="w-28 h-9 bg-brand-light rounded-xl" />
                    <div className="w-32 h-9 bg-brand-light/60 rounded-xl" />
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 mb-6 flex flex-col lg:flex-row gap-8">
                {/* Left Image Mockup */}
                <div className="w-full lg:w-72 h-64 lg:h-72 bg-brand-light/60 rounded-2xl flex-shrink-0" />
                
                {/* Right Info Block */}
                <div className="flex-1 flex flex-col justify-between space-y-6 lg:space-y-0">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-5 rounded-full bg-brand-light/60" />
                            <div className="w-20 h-4 rounded bg-brand-light/40" />
                        </div>
                        <div className="w-64 h-8 rounded-xl bg-brand-light" />
                        <div className="w-5/6 h-4 rounded bg-brand-light/40" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-4 rounded-2xl border border-brand-light bg-brand-bg space-y-2">
                                <div className="w-20 h-3 bg-brand-light/60 rounded" />
                                <div className="flex items-center justify-between">
                                    <div className="w-28 h-6 bg-brand-light rounded" />
                                    <div className="w-9 h-9 rounded-xl bg-brand-light/80" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Navigator */}
            <div className="border-b border-brand-light mb-6 bg-white rounded-t-2xl px-6 pt-4 pb-3 flex gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-28 h-5 rounded bg-brand-light/60" />
                ))}
            </div>

            {/* Main Split Content */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left Column (Chart/Reciple mockup) */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="w-44 h-4.5 bg-brand-light rounded" />
                            <div className="w-28 h-8 bg-brand-light/40 rounded-xl" />
                        </div>
                        <div className="h-48 rounded-xl bg-gray-50 border border-brand-light/40" />
                        <div className="flex gap-4">
                            <div className="w-24 h-4 bg-brand-light rounded" />
                            <div className="w-32 h-4 bg-brand-light/60 rounded" />
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebars) */}
                <div className="xl:col-span-4 space-y-6">
                    
                    {/* Ingredients Status */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-brand-light" />
                            <div className="w-32 h-4 rounded bg-brand-light" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-brand-light">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-light" />
                                        <div className="space-y-1">
                                            <div className="w-20 h-3 bg-brand-light rounded" />
                                            <div className="w-14 h-2 rounded bg-brand-light/60" />
                                        </div>
                                    </div>
                                    <div className="w-12 h-5 rounded-full bg-brand-light/80" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Promo */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-light rounded-xl" />
                        <div className="space-y-1.5">
                            <div className="w-24 h-3.5 bg-brand-light rounded" />
                            <div className="w-40 h-2.5 bg-brand-light/60 rounded" />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
