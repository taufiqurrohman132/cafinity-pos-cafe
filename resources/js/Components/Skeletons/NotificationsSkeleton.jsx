import React from 'react';

export default function NotificationsSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg font-inter text-brand-dark p-4 md:p-6 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/40 pb-4 animate-pulse">
                <div className="space-y-1.5">
                    <div className="w-36 h-7 rounded-xl bg-brand-light" />
                    <div className="w-80 h-3.5 rounded bg-brand-light/60" />
                </div>
                <div className="w-44 h-10 rounded-xl bg-brand-light" />
            </div>

            {/* 4-column stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex items-center justify-between">
                        <div className="space-y-1.5">
                            <div className="w-16 h-3 rounded bg-brand-light/40" />
                            <div className="w-24 h-6 rounded bg-brand-light" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-brand-light/50" />
                    </div>
                ))}
            </div>

            {/* Tabs bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
                <div className="bg-white border border-brand-light p-1 rounded-xl flex items-center shadow-sm w-96 h-10" />
                <div className="w-24 h-9 rounded-xl bg-brand-light" />
            </div>

            {/* Notifications Stack (separate cards) */}
            <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex gap-4">
                        {/* Avatar placeholder */}
                        <div className="w-12 h-12 rounded-xl bg-brand-light shrink-0" />
                        
                        {/* Content block */}
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div className="space-y-1.5 flex-1">
                                    <div className="w-48 h-4 rounded bg-brand-light" />
                                    <div className="w-full h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-3/4 h-3.5 rounded bg-brand-light/40" />
                                </div>
                                <div className="w-20 h-3 rounded bg-brand-light/50 shrink-0" />
                            </div>
                            <div className="flex justify-between items-center gap-4 pt-1">
                                <div className="w-28 h-8 rounded-xl bg-brand-light/60" />
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-brand-light/45" />
                                    <div className="w-8 h-8 rounded-xl bg-brand-light/45" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2 bottom widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-brand-light/40 animate-pulse">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm space-y-3">
                        <div className="w-44 h-4.5 rounded bg-brand-light" />
                        <div className="w-full h-12 rounded-xl bg-gray-50 border border-brand-light/50" />
                    </div>
                ))}
            </div>

        </div>
    );
}
