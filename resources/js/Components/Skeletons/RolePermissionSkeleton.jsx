import React from 'react';

export default function RolePermissionSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg font-inter text-brand-dark p-4 md:p-6 space-y-6">

            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                <div className="space-y-2">
                    <div className="w-56 h-7 rounded-xl bg-brand-light" />
                    <div className="w-80 h-4 rounded-lg bg-brand-light/60" />
                </div>
                <div className="w-44 h-10 rounded-xl bg-brand-light" />
            </div>

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left side: Roles List */}
                <div className="xl:col-span-4 space-y-3 animate-pulse">
                    <div className="flex justify-between items-center mb-1">
                        <div className="w-24 h-4 rounded bg-brand-light" />
                        <div className="w-8 h-5 rounded-full bg-brand-light" />
                    </div>
                    
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-brand-light p-4 space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-light shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="w-24 h-4 rounded bg-brand-light" />
                                        <div className="w-16 h-3 rounded bg-brand-light/50" />
                                    </div>
                                </div>
                                <div className="w-3/4 h-4 rounded bg-brand-light/40 ml-5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side: Detail & Permission Matrix */}
                <div className="xl:col-span-8 space-y-5 animate-pulse">
                    
                    {/* Role Header Detail card */}
                    <div className="bg-white rounded-2xl border border-brand-light p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-light/40 shrink-0" />
                                <div className="space-y-1.5">
                                    <div className="w-32 h-5 rounded bg-brand-light" />
                                    <div className="w-56 h-4 rounded bg-brand-light/60" />
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <div className="w-20 h-8 rounded-xl bg-brand-light" />
                                <div className="w-24 h-8 rounded-xl bg-brand-light" />
                            </div>
                        </div>
                        
                        {/* Preset Cepat */}
                        <div className="border-t border-brand-light pt-4 flex gap-2 items-center flex-wrap">
                            <div className="w-20 h-4 rounded bg-brand-light" />
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-28 h-7 rounded-lg bg-brand-light/60" />
                            ))}
                        </div>
                    </div>

                    {/* Permission Matrix Table */}
                    <div className="bg-white rounded-2xl border border-brand-light overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px]">
                                <thead>
                                    <tr className="border-b border-brand-light bg-brand-bg/60">
                                        <th className="px-5 py-4 text-left">
                                            <div className="w-24 h-4 rounded bg-brand-light" />
                                        </th>
                                        {[...Array(5)].map((_, i) => (
                                            <th key={i} className="px-3 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1.5 mx-auto w-10">
                                                    <div className="w-4 h-4 rounded-full bg-brand-light" />
                                                    <div className="w-8 h-2.5 rounded bg-brand-light/60" />
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-3 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1.5 mx-auto w-10">
                                                <div className="w-4 h-4 rounded-full bg-brand-light" />
                                                <div className="w-6 h-2.5 rounded bg-brand-light/60" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light/50 bg-white">
                                    {[...Array(8)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-5 py-4">
                                                <div className="w-32 h-4 rounded bg-brand-light" />
                                            </td>
                                            {[...Array(5)].map((_, j) => (
                                                <td key={j} className="px-3 py-4 text-center">
                                                    <div className="w-10 h-6 rounded-full bg-brand-light/60 mx-auto" />
                                                </td>
                                            ))}
                                            <td className="px-3 py-4 text-center">
                                                <div className="w-6 h-6 rounded-md bg-brand-light mx-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Save Button Bar */}
                        <div className="px-5 py-4 border-t border-brand-light bg-brand-bg/50 flex justify-end">
                            <div className="w-36 h-10 rounded-xl bg-brand-light" />
                        </div>
                    </div>

                    {/* History Audit Log */}
                    <div className="bg-white rounded-2xl border border-brand-light p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-brand-light shrink-0" />
                            <div className="w-44 h-4 rounded bg-brand-light" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center pb-2 border-b border-brand-light/30 last:border-b-0 last:pb-0">
                                    <div className="space-y-1.5">
                                        <div className="w-48 h-3.5 rounded bg-brand-light" />
                                        <div className="w-32 h-3 rounded bg-brand-light/60" />
                                    </div>
                                    <div className="w-16 h-3 rounded bg-brand-light/40 shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
