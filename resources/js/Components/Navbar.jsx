import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef(null);

    // Debounced search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await client.get(`/search/results?q=${encodeURIComponent(searchQuery)}`);
                setSearchResults(response.data.results || []);
            } catch (error) {
                console.error("Gagal melakukan pencarian menu:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchQuery.trim()) {
                setShowDropdown(false);
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
        }
    };

    const handleSelectResult = (menuId) => {
        setSearchQuery('');
        setSearchResults([]);
        setShowDropdown(false);
        navigate(`/menus/${menuId}`);
    };

    return (
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-brand-light px-6 flex items-center justify-between sticky top-0 z-30">

            {/* Search Container */}
            <div className="relative w-[360px]" ref={containerRef}>
                <iconify-icon icon="solar:magnifer-linear"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary text-[18px] z-10"></iconify-icon>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search menu..."
                    className="w-full h-[42px] bg-brand-bg border border-brand-light rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-semibold text-brand-dark placeholder-brand-primary/50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all shadow-sm relative z-0"
                />

                {/* Dropdown Live Search */}
                {showDropdown && (searchQuery.trim() || loading) && (
                    <div className="absolute top-[48px] left-0 w-full bg-white/95 backdrop-blur-md border border-brand-light rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[300px]">
                        {loading ? (
                            <div className="p-4 text-center text-xs font-semibold text-brand-primary flex items-center justify-center gap-2">
                                <iconify-icon icon="line-md:loading-twotone-loop" class="text-lg text-brand-secondary"></iconify-icon>
                                Mencari menu...
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="p-4 text-center text-xs font-bold text-brand-primary/70">
                                Tidak ada menu ditemukan
                            </div>
                        ) : (
                            <div className="overflow-y-auto divide-y divide-brand-light/55">
                                {searchResults.map((menu) => (
                                    <div
                                        key={menu.id}
                                        onClick={() => handleSelectResult(menu.id)}
                                        className="p-3 hover:bg-brand-light/20 flex items-center justify-between cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-brand-light/30 border border-brand-light flex items-center justify-center text-brand-secondary flex-shrink-0">
                                                <iconify-icon icon="solar:cup-hot-linear" class="text-[18px]"></iconify-icon>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-extrabold text-brand-dark truncate group-hover:text-brand-secondary transition-colors">
                                                    {menu.name}
                                                </p>
                                                <p className="text-[10px] text-brand-primary/50 font-medium truncate">
                                                    {menu.category?.name || 'Menu'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 pl-2">
                                            <p className="text-xs font-black text-brand-secondary">
                                                Rp {Number(menu.price).toLocaleString('id-ID')}
                                            </p>
                                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                                                menu.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                                {menu.is_active ? 'Tersedia' : 'Habis'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {searchResults.length > 0 && (
                            <div
                                onClick={() => {
                                    setShowDropdown(false);
                                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                }}
                                className="bg-brand-bg/50 border-t border-brand-light p-2.5 text-center text-[10px] font-black text-brand-primary hover:text-brand-secondary hover:bg-brand-light/30 transition-all cursor-pointer"
                            >
                                Lihat Semua Hasil
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

                {/* Notifications */}
                <Link to="/notifications" className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-primary hover:bg-brand-light/50 hover:text-brand-secondary transition-all relative">
                    <iconify-icon icon="solar:bell-bing-linear" class="text-[22px]"></iconify-icon>
                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                </Link>

                {/* Settings */}
                <Link to="/settings" className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-primary hover:bg-brand-light/50 hover:text-brand-secondary transition-all">
                    <iconify-icon icon="solar:settings-linear" class="text-[22px]"></iconify-icon>
                </Link>

                {/* User Profile */}
                <Link to="/profile" className="flex items-center gap-3 pl-5 border-l border-brand-light ml-1 hover:text-brand-secondary transition-colors group">
                    <div className="text-right">
                        <p className="font-extrabold text-[13px] text-brand-dark group-hover:text-brand-secondary transition-colors">{user?.name}</p>
                        <p className="text-[11px] font-medium text-brand-primary">
                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-primary/20 border border-brand-primary group-hover:scale-105 transition-transform">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </Link>

            </div>
        </header>
    );
}