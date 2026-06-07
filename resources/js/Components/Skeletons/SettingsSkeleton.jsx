import React from 'react';

export default function SettingsSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8 animate-pulse">
            <div className="max-w-[1450px] mx-auto space-y-6">
                
                {/* Header */}
                <div className="space-y-2 text-left">
                    <div className="w-64 h-8 rounded-lg bg-brand-light" />
                    <div className="w-96 h-4 rounded-md bg-brand-light/60" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* ── LEFT COLUMN: SIDEBAR NAVIGATION TABS ── */}
                    <div className="lg:col-span-3 space-y-3 bg-white p-4 rounded-2xl border border-brand-light/80 shadow-sm text-left">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border ${
                                    i === 0 ? 'bg-brand-primary/10 border-brand-primary/20' : 'border-transparent'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded ${i === 0 ? 'bg-brand-primary' : 'bg-brand-light'} shrink-0`} />
                                <div className={`h-4 rounded ${i === 0 ? 'w-24 bg-brand-primary' : 'w-28 bg-brand-light'} `} />
                            </div>
                        ))}
                    </div>

                    {/* ── RIGHT COLUMN: SETTINGS CONTENT CARDS ── */}
                    <div className="lg:col-span-9 space-y-6">
                        
                        {/* TAB 1: PROFIL TOKO SKELETON */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-6 text-left">
                            
                            {/* Card Header */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-brand-primary shrink-0" />
                                    <div className="w-48 h-5 rounded bg-brand-light" />
                                </div>
                                <div className="w-80 h-3.5 rounded bg-brand-light/60" />
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-24 h-3.5 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-28 h-3.5 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                                </div>
                            </div>

                            {/* Full width Address Input */}
                            <div className="space-y-2">
                                <div className="w-28 h-3.5 rounded bg-brand-light" />
                                <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                            </div>

                            {/* Phone & Email Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <div className="w-28 h-3.5 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-28 h-3.5 rounded bg-brand-light" />
                                    <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                                </div>
                            </div>
                        </div>

                        {/* Save Actions Placeholder */}
                        <div className="flex justify-end gap-3">
                            <div className="w-20 h-10 rounded-xl bg-brand-light/60" />
                            <div className="w-36 h-10 rounded-xl bg-brand-primary/80" />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
