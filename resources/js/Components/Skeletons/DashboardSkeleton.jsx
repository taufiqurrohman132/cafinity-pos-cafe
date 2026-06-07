import React from 'react';

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen animate-pulse">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                <div className="space-y-2">
                    <div className="w-56 h-7 rounded-xl bg-brand-light" />
                    <div className="w-72 h-4 rounded-lg bg-brand-light/60" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-44 h-10 rounded-xl bg-brand-light/50" />
                    <div className="w-32 h-10 rounded-xl bg-brand-light" />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="w-11 h-11 rounded-xl bg-brand-light" />
                            <div className="w-16 h-5 bg-brand-light rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3.5 bg-brand-light/60 rounded w-24" />
                            <div className="h-6.5 bg-brand-light rounded w-36" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Content (Charts/Table) */}
                <div className="xl:col-span-9 space-y-6">
                    {/* Large Chart Container */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="w-40 h-4.5 rounded bg-brand-light" />
                                <div className="w-64 h-3.5 rounded bg-brand-light/60" />
                            </div>
                            <div className="w-24 h-7 rounded bg-brand-light/50" />
                        </div>
                        <div className="h-64 rounded-xl bg-gray-50 border border-brand-light/40" />
                    </div>

                    {/* Secondary list/table row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, j) => (
                            <div key={j} className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="w-32 h-4.5 rounded bg-brand-light" />
                                <div className="space-y-3 pt-2">
                                    {[...Array(3)].map((_, k) => (
                                        <div key={k} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-brand-light" />
                                                <div className="space-y-1">
                                                    <div className="w-24 h-3 rounded bg-brand-light" />
                                                    <div className="w-16 h-2 rounded bg-brand-light/60" />
                                                </div>
                                            </div>
                                            <div className="w-12 h-4 rounded bg-brand-light" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="w-24 h-3 rounded bg-brand-light" />
                        <div className="space-y-3">
                            <div className="w-full h-11 rounded-xl bg-brand-light" />
                            <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                            <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                        <div className="w-28 h-3 rounded bg-brand-light" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-3 h-3 rounded-full bg-brand-light shrink-0 mt-1" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="w-full h-3 rounded bg-brand-light" />
                                        <div className="w-20 h-2 rounded bg-brand-light/60" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
