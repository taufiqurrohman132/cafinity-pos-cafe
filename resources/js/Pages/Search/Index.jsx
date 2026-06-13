import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';

export default function SearchIndex() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryParam = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchResults = async (q) => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.get(`/search/results?q=${encodeURIComponent(q)}`);
            setResults(response.data.results || []);
        } catch (err) {
            console.error("Gagal memuat hasil pencarian:", err);
            setError("Gagal mengambil data dari server. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSearchQuery(queryParam);
        fetchResults(queryParam);
    }, [queryParam]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchQuery });
    };

    return (
        <>
            <Head title={`Hasil Pencarian: "${queryParam}"`} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="space-y-6 max-w-7xl mx-auto">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Pencarian Global
                        </h1>
                        <p className="text-brand-primary font-medium text-sm mt-1">
                            Temukan item menu hidangan, minuman, dan kategori yang terdaftar dalam sistem.
                        </p>
                    </div>

                    {/* Search Form Card */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                        <form onSubmit={handleSearchSubmit} className="flex gap-3">
                            <div className="relative flex-1">
                                <iconify-icon icon="solar:magnifer-linear" class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary text-[20px]"></iconify-icon>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ketik nama hidangan atau menu..."
                                    className="w-full h-12 bg-brand-bg border border-brand-light rounded-xl pl-12 pr-4 py-2.5 text-sm font-bold text-brand-dark placeholder-brand-primary/50 focus:outline-none focus:bg-white transition-all hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-12 px-8 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-extrabold shadow-lg shadow-brand-primary/20 hover:from-brand-dark hover:to-brand-primary transition-all active:scale-[0.97]"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden p-6">
                        <div className="flex justify-between items-center pb-4 border-b border-brand-light/60 mb-6">
                            <h3 className="text-sm font-extrabold text-brand-dark">
                                Hasil Pencarian untuk <span className="text-brand-secondary">"{queryParam}"</span>
                            </h3>
                            <span className="text-xs font-bold text-brand-primary/80">
                                {results.length} menu ditemukan
                            </span>
                        </div>

                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3">
                                <iconify-icon icon="line-md:loading-twotone-loop" class="text-4xl text-brand-secondary"></iconify-icon>
                                <p className="text-sm font-extrabold text-brand-primary">Sedang memuat data...</p>
                            </div>
                        ) : error ? (
                            <div className="py-20 text-center">
                                <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-3"></iconify-icon>
                                <p className="text-sm font-extrabold text-brand-dark">{error}</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-brand-light/40 flex items-center justify-center text-brand-primary/60 mb-4">
                                    <iconify-icon icon="solar:magnifer-zoom-out-linear" class="text-3xl"></iconify-icon>
                                </div>
                                <h4 className="text-base font-extrabold text-brand-dark">Hasil Tidak Ditemukan</h4>
                                <p className="text-xs text-brand-primary/70 max-w-sm mt-1">
                                    Kami tidak dapat menemukan menu dengan nama "{queryParam}". Coba kata kunci lain atau periksa ejaan Anda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {results.map((menu) => (
                                    <div
                                        key={menu.id}
                                        onClick={() => navigate(`/menus/${menu.id}`)}
                                        className="group bg-brand-bg border border-brand-light rounded-2xl overflow-hidden hover:border-brand-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Photo Placeholder / Image */}
                                            <div className="relative aspect-video overflow-hidden bg-brand-light/30 border-b border-brand-light flex items-center justify-center text-brand-secondary">
                                                {menu.image_url ? (
                                                    <img
                                                        src={menu.image_url}
                                                        alt={menu.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <iconify-icon icon="solar:cup-hot-linear" class="text-[36px]"></iconify-icon>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                                                        menu.is_active
                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                            : 'bg-rose-100 text-rose-700 border-rose-200'
                                                    }`}>
                                                        {menu.is_active ? 'Tersedia' : 'Habis'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <span className="flex items-center gap-1 text-[10px] font-extrabold text-brand-primary/60 capitalize tracking-wider mb-1">
                                                    <iconify-icon icon="solar:tag-linear" class="text-xs text-brand-secondary"></iconify-icon>
                                                    {menu.category?.name || 'Menu'}
                                                </span>
                                                <h4 className="font-extrabold text-brand-dark text-[13px] line-clamp-1 group-hover:text-brand-secondary transition-colors">
                                                    {menu.name}
                                                </h4>
                                                {menu.description && (
                                                    <p className="text-[11px] text-brand-primary/60 font-medium mt-1 line-clamp-2 leading-relaxed">
                                                        {menu.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 pt-0">
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-light/50">
                                                <div>
                                                    <p className="text-[9px] font-bold text-brand-primary/50 capitalize">Harga Jual</p>
                                                    <p className="text-[13px] font-black text-brand-secondary">
                                                        Rp {Number(menu.price).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/menus/${menu.id}`}
                                                    className="px-3.5 py-1.5 bg-brand-light/50 text-[11px] font-extrabold text-brand-primary hover:bg-brand-secondary hover:text-white rounded-lg transition-all"
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
