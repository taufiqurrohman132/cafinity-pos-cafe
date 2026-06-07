import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import client from '../api/client';

export const PageDataContext = React.createContext(null);

export default function PageLoader({ component: Component, apiPath }) {
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-brand-primary">Memuat Data...</p>
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
