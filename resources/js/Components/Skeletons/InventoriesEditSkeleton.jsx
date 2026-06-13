import React from 'react';

export default function InventoriesEditSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 pb-48 animate-pulse">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Top Breadcrumb & Title Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-light shrink-0" />
                        <div className="space-y-2">
                            <div className="w-28 h-3 rounded bg-brand-light/40" />
                            <div className="w-56 h-7 rounded-lg bg-brand-light" />
                            <div className="w-80 h-3.5 rounded bg-brand-light/30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 h-10 rounded-xl bg-brand-light/60" />
                        <div className="w-32 h-10 rounded-xl bg-brand-light" />
                    </div>
                </div>

                {/* Form & Sidebar Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: Form Cards Skeletons */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Card 1: Informasi Dasar */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-32 h-4 rounded bg-brand-light mb-2" />
                            
                            <div className="space-y-4">
                                {/* Nama Bahan */}
                                <div className="space-y-2">
                                    <div className="w-24 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                </div>

                                {/* Kategori & Satuan */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="w-20 h-3.5 rounded bg-brand-light/60" />
                                        <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-20 h-3.5 rounded bg-brand-light/60" />
                                        <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Manajemen Stok & Harga */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-48 h-4 rounded bg-brand-light mb-2" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                {/* Stok Awal */}
                                <div className="space-y-2">
                                    <div className="w-24 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                    <div className="w-48 h-3 rounded bg-brand-light/20" />
                                </div>

                                {/* Minimum Stock Alert */}
                                <div className="space-y-2">
                                    <div className="w-32 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                    <div className="w-48 h-3 rounded bg-brand-light/20" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Harga Rata-rata */}
                                <div className="space-y-2">
                                    <div className="w-32 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                </div>

                                {/* Lokasi Penyimpanan */}
                                <div className="space-y-2">
                                    <div className="w-28 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Supplier & Keterangan */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-36 h-4 rounded bg-brand-light mb-2" />
                            
                            <div className="space-y-4">
                                {/* Supplier Utama */}
                                <div className="space-y-2">
                                    <div className="w-24 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-10 rounded-xl bg-brand-light/40" />
                                </div>

                                {/* Keterangan Tambahan */}
                                <div className="space-y-2">
                                    <div className="w-28 h-3.5 rounded bg-brand-light/60" />
                                    <div className="w-full h-24 rounded-xl bg-brand-light/30" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar Summary Skeletons */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Card 1: Ringkasan Input */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <div className="w-28 h-3.5 rounded bg-brand-light" />
                            
                            <div className="space-y-3.5 mt-2">
                                <div className="flex justify-between items-center border-b border-brand-light pb-3">
                                    <div className="w-20 h-3.5 rounded bg-brand-light/50" />
                                    <div className="w-24 h-3.5 rounded bg-brand-light/60" />
                                </div>
                                <div className="flex justify-between items-center border-b border-brand-light pb-3">
                                    <div className="w-24 h-3.5 rounded bg-brand-light/50" />
                                    <div className="w-16 h-3.5 rounded bg-brand-light/60" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="w-20 h-3.5 rounded bg-brand-light/50" />
                                    <div className="w-12 h-3.5 rounded bg-brand-light/60" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Saran Restock */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-3">
                            <div className="w-28 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-16 rounded-xl bg-brand-light/20" />
                        </div>

                        {/* Card 3: Quick Help */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-3">
                            <div className="w-20 h-3.5 rounded bg-brand-light" />
                            <div className="space-y-2">
                                <div className="w-full h-3 rounded bg-brand-light/35" />
                                <div className="w-5/6 h-3 rounded bg-brand-light/35" />
                            </div>
                        </div>

                    </div>

                </div>

                {/* Spacer matching main layout */}
                <div className="h-36" />

            </div>

            {/* STICKY BOTTOM FOOTER BANNER SKELETON */}
            <div className="fixed bottom-0 left-[260px] right-0 z-40 bg-white border-t border-brand-light py-4 px-6 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-light shrink-0" />
                    <div className="w-32 h-3.5 rounded bg-brand-light/40" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-20 h-10 rounded-xl bg-brand-light/60" />
                    <div className="w-32 h-10 rounded-xl bg-brand-light" />
                </div>
            </div>
        </div>
    );
}
