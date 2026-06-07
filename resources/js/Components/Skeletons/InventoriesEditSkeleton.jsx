import React from 'react';

export default function InventoriesEditSkeleton() {
    return (
        <div className="min-h-screen bg-brand-bg p-4 md:p-6 animate-pulse">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Header Skeleton */}
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-light shrink-0" />
                    <div className="space-y-2">
                        <div className="w-48 h-6 rounded-lg bg-brand-light" />
                        <div className="w-64 h-4 rounded-md bg-brand-light/60" />
                    </div>
                </div>

                {/* Form Card Skeleton */}
                <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 space-y-5">
                    
                    {/* Nama Bahan */}
                    <div className="space-y-2">
                        <div className="w-24 h-3.5 rounded bg-brand-light" />
                        <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                    </div>

                    {/* Kategori & Satuan */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="w-20 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                        </div>
                        <div className="space-y-2">
                            <div className="w-20 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                        </div>
                    </div>

                    {/* Stok & Min Stok */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="w-24 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                        </div>
                        <div className="space-y-2">
                            <div className="w-24 h-3.5 rounded bg-brand-light" />
                            <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                            <div className="w-40 h-3 rounded bg-brand-light/30" />
                        </div>
                    </div>

                    {/* Harga per Satuan */}
                    <div className="space-y-2">
                        <div className="w-32 h-3.5 rounded bg-brand-light" />
                        <div className="w-full h-11 rounded-xl bg-brand-light/60" />
                    </div>

                    {/* Supplier */}
                    <div className="space-y-2">
                        <div className="w-20 h-3.5 rounded bg-brand-light" />
                        <div className="w-full h-11 rounded-xl bg-brand-light/40" />
                    </div>

                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3">
                    <div className="w-20 h-10 rounded-xl bg-brand-light" />
                    <div className="w-32 h-10 rounded-xl bg-brand-light/80" />
                </div>

            </div>
        </div>
    );
}
