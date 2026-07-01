import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import client from '../api/client';

export const PageDataContext = React.createContext(null);

export default function PageLoader({ component: Component, apiPath, skeleton: SkeletonComponent }) {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Resolve API URL by replacing params (e.g. /menus/:id -> /menus/5)
    let resolvedPath = apiPath;
    if (resolvedPath) {
        Object.entries(params).forEach(([key, val]) => {
            resolvedPath = resolvedPath.replace(`:${key}`, val);
        });
    } else {
        // Fallback to location pathname if apiPath is not provided
        resolvedPath = location.pathname;
    }

    // Reset page loader state when resolved path changes during transition
    const [prevPath, setPrevPath] = useState(resolvedPath);
    if (resolvedPath !== prevPath) {
        setPrevPath(resolvedPath);
        setLoading(true);
        setData(null);
        setError(null);
    }

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await client.get(resolvedPath + location.search);
            setData(res.data);
            setError(null);
        } catch (e) {
            console.error('Failed to load page data', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [resolvedPath, location.search]);

    // Expose reload and navigate to global window for mock-inertia routing integrations
    useEffect(() => {
        window.routerReload = loadData;
        window.routerNavigate = (url) => {
            navigate(url);
        };
        return () => {
            window.routerReload = undefined;
            window.routerNavigate = undefined;
        };
    }, [resolvedPath, location.search, navigate]);

    if (loading) {
        if (SkeletonComponent) {
            return <SkeletonComponent />;
        }
        return (
            <div className="p-4 md:p-6 space-y-6">
                {/* Header skeleton */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="w-48 h-7 rounded-xl bg-brand-light animate-pulse" />
                        <div className="w-72 h-4 rounded-lg bg-brand-light/60 animate-pulse" />
                    </div>
                    <div className="w-32 h-10 rounded-xl bg-brand-light animate-pulse" />
                </div>

                {/* Stat cards skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-brand-light p-5 space-y-3 animate-pulse">
                            <div className="flex justify-between">
                                <div className="w-11 h-11 rounded-xl bg-brand-light" />
                                <div className="w-12 h-5 rounded-full bg-brand-light" />
                            </div>
                            <div className="w-24 h-3 rounded bg-brand-light" />
                            <div className="w-32 h-6 rounded bg-brand-light" />
                        </div>
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-9 bg-white rounded-2xl border border-brand-light p-6 animate-pulse space-y-4">
                        <div className="w-40 h-5 rounded bg-brand-light" />
                        <div className="w-full h-48 rounded-xl bg-brand-light/60" />
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full h-10 rounded-xl bg-brand-light/40" />
                            ))}
                        </div>
                    </div>
                    <div className="xl:col-span-3 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-brand-light p-5 animate-pulse space-y-3">
                                <div className="w-28 h-4 rounded bg-brand-light" />
                                <div className="w-full h-20 rounded-xl bg-brand-light/60" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                    <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4"></iconify-icon>
                    <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                    <p className="text-sm text-brand-primary/70 mb-6">
                        Gagal memuat data dari server. Silakan coba lagi.
                    </p>
                    <button onClick={loadData} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PageDataContext.Provider value={{ data, reload: loadData, resolvedPath }}>
            <Component {...data} />
        </PageDataContext.Provider>
    );
}
