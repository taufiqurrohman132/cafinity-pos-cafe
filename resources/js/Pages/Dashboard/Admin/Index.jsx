import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import DashboardSkeleton from '@/Components/Skeletons/DashboardSkeleton';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const res = await client.get('/dashboard');
            setDashboardData(res.data);
        } catch (e) {
            console.error('Failed to fetch admin dashboard data', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    const stats = dashboardData?.stats || {
        low_stock: '0 Item',
        pending_po: '0 Berkas',
        total_sku: '0 Item',
        inventory_val: 'Rp 0',
    };
    const stockMovement = dashboardData?.stockMovement || [];
    const menuSummary = dashboardData?.menuSummary || [];
    const hppAnalysis = dashboardData?.hppAnalysis || [];
    const activityLog = dashboardData?.activityLog || [];

    const pageLoading = loading;

    return (
        <>
            <div className="h-full flex flex-col overflow-hidden min-h-screen">
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-0">

                    {/* Main Content */}
                    <div className="xl:col-span-9 min-h-0 overflow-y-auto space-y-6 p-4 md:py-6 md:pl-6 bg-brand-bg">

                        {/* Header */}
                        <div>
                            <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                                Dashboard Admin
                            </h1>
                            <p className="text-brand-primary mt-1 text-sm font-medium">
                                Selamat datang kembali, <span className="font-extrabold text-brand-dark">{user?.name}</span>.
                            </p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Stok Rendah',      value: stats.low_stock,     icon: 'solar:box-minimalistic-linear',          iconBg: 'bg-rose-100',    iconColor: 'text-rose-600',    note: 'Segera Restock!',          noteColor: 'text-rose-500' },
                                { title: 'PO Menunggu',      value: stats.pending_po,    icon: 'solar:document-text-linear',             iconBg: 'bg-blue-100',    iconColor: 'text-blue-600',    note: 'Perlu persetujuan',        noteColor: 'text-blue-500' },
                                { title: 'Total SKU',        value: stats.total_sku,     icon: 'solar:box-linear',                       iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', note: 'Item aktif di inventaris', noteColor: 'text-emerald-600' },
                                { title: 'Nilai Inventaris', value: stats.inventory_val, icon: 'solar:chart-2-linear',                   iconBg: 'bg-brand-light',   iconColor: 'text-brand-secondary',   note: null,                       noteColor: null },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                        <iconify-icon icon={card.icon} class={`text-2xl ${card.iconColor}`}></iconify-icon>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-brand-primary/70 capitalize tracking-wide">{card.title}</p>
                                        <p className="text-xl font-extrabold text-brand-dark mt-0.5">{card.value}</p>
                                        {card.note && <p className={`text-[11px] font-bold mt-0.5 ${card.noteColor}`}>{card.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stock Movement + Menu Summary */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

                            {/* Stock Movement Chart */}
                            <div className="xl:col-span-8">
                                <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-extrabold text-brand-dark tracking-tight">Pergerakan Stok</h3>
                                        <span className="text-xs font-bold text-brand-primary bg-brand-light/50 border border-brand-light px-3 py-1 rounded-lg">
                                            7 Hari Terakhir
                                        </span>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between h-48 gap-2 pt-4 border-b border-brand-light">
                                        {pageLoading ? (
                                            Array.from({ length: 7 }).map((_, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end animate-pulse">
                                                    <div className="w-full bg-brand-light rounded-t-sm" style={{ height: '40%' }}></div>
                                                    <span className="h-2 w-6 bg-brand-light/60 rounded mt-2"></span>
                                                </div>
                                            ))
                                        ) : stockMovement.length === 0 ? (
                                            <p className="w-full text-center text-brand-primary italic text-xs py-16">Belum ada data pergerakan stok</p>
                                        ) : stockMovement.map((slot, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="w-full flex gap-1 items-end h-full">
                                                    <div className="flex-1 bg-brand-secondary rounded-t-sm transition-all group-hover:bg-brand-primary" style={{ height: `${slot.in}%` }}></div>
                                                    <div className="flex-1 bg-brand-light rounded-t-sm" style={{ height: `${slot.out}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-brand-primary/50 font-bold mt-2">{slot.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-4 text-[10px] font-bold text-brand-primary justify-center">
                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-secondary"></span> Stok Masuk</span>
                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-light"></span> Stok Keluar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Summary */}
                            <div className="xl:col-span-4">
                                <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm h-full flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="font-extrabold text-brand-dark tracking-tight">Ringkasan Menu</h3>
                                        <p className="text-xs text-brand-primary/70 mt-1">Status ketersediaan katalog menu</p>
                                    </div>
                                    <div className="space-y-5 flex-1">
                                        {pageLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="flex items-center justify-between animate-pulse">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-brand-light"></div>
                                                        <div className="space-y-2">
                                                            <div className="h-4 bg-brand-light rounded w-20"></div>
                                                            <div className="h-3 bg-brand-light/60 rounded w-16"></div>
                                                        </div>
                                                    </div>
                                                    <div className="h-5 bg-brand-light rounded-full w-12"></div>
                                                </div>
                                            ))
                                        ) : menuSummary.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
                                                        <iconify-icon icon={item.icon} class="text-2xl"></iconify-icon>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-extrabold text-brand-dark leading-tight">{item.name}<br />{item.sub}</h4>
                                                        <p className="text-xs text-brand-primary/70 mt-1">{item.count}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full ${item.statusBg} ${item.statusColor} text-[10px] font-bold`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to="/menus"
                                        className="w-full mt-7 border border-brand-light hover:bg-brand-light/30 transition py-2.5 rounded-xl text-xs font-bold text-brand-primary text-center block">
                                        Kelola Menu Catalog
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* HPP Analysis */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                            <div className="p-6 flex justify-between items-center border-b border-brand-light">
                                <div>
                                    <h3 className="font-extrabold text-brand-dark tracking-tight">Analisis HPP Resep</h3>
                                    <p className="text-xs text-brand-primary/70">Menu dengan margin kritis atau keuntungan tinggi</p>
                                </div>
                                <Link to="/recipe-costing"
                                    className="text-xs border border-brand-light px-4 py-2 rounded-xl font-bold text-brand-primary hover:bg-brand-light transition">
                                    Detail Recipe Costing
                                </Link>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-brand-bg text-[10px] capitalize text-brand-primary/60 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-extrabold">Nama Menu</th>
                                        <th className="px-4 py-4 font-extrabold">HPP (Estimasi)</th>
                                        <th className="px-4 py-4 font-extrabold">Harga Jual</th>
                                        <th className="px-4 py-4 font-extrabold text-center">Margin (%)</th>
                                        <th className="px-6 py-4 font-extrabold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-brand-light/50">
                                    {pageLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4"><div className="h-4 bg-brand-light rounded w-32"></div></td>
                                                <td className="px-4 py-4"><div className="h-4 bg-brand-light/60 rounded w-16"></div></td>
                                                <td className="px-4 py-4"><div className="h-4 bg-brand-light rounded w-16"></div></td>
                                                <td className="px-4 py-4"><div className="h-4 bg-brand-light rounded w-10 mx-auto"></div></td>
                                                <td className="px-6 py-4"><div className="h-5 bg-brand-light rounded w-16 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : hppAnalysis.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-primary italic">Belum ada data HPP.</td></tr>
                                    ) : hppAnalysis.map((row, i) => {
                                        const isLow = row.margin_pct < 40;
                                        return (
                                            <tr 
                                                key={i} 
                                                className="hover:bg-brand-light/10 transition cursor-pointer"
                                            >
                                                <td className="p-0 font-extrabold text-brand-dark">
                                                    <Link to={`/menus/${row.id}`} className="block px-6 py-4 hover:text-brand-secondary transition-colors">
                                                        {row.name}
                                                    </Link>
                                                </td>
                                                <td className="p-0 text-brand-dark/60">
                                                    <Link to={`/menus/${row.id}`} className="block px-4 py-4">
                                                        {row.hpp}
                                                    </Link>
                                                </td>
                                                <td className="p-0 text-brand-dark/60">
                                                    <Link to={`/menus/${row.id}`} className="block px-4 py-4">
                                                        {row.price}
                                                    </Link>
                                                </td>
                                                <td className={`p-0 text-center font-extrabold ${isLow ? 'text-[#b91c1c]' : 'text-[#059669]'}`}>
                                                    <Link to={`/menus/${row.id}`} className="block px-4 py-4">
                                                        {row.margin}
                                                    </Link>
                                                </td>
                                                <td className="p-0 text-right">
                                                    <Link to={`/menus/${row.id}`} className="block px-6 py-4">
                                                        <span className={`px-2 py-1 text-[10px] rounded-full font-bold ${isLow ? 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]' : 'bg-brand-light text-brand-primary'}`}>
                                                            {isLow ? 'Low Margin' : 'Normal'}
                                                        </span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-3 min-h-0 overflow-y-auto space-y-6 p-4 md:p-6 md:pl-0">

                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                            <h4 className="text-[10px] font-extrabold text-brand-primary/60 tracking-widest capitalize mb-4">
                                ⚡ Aksi Cepat
                            </h4>
                            <div className="space-y-3">
                                <Link to="/inventories/create"
                                    className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition">
                                    <iconify-icon icon="solar:add-circle-linear" class="text-lg"></iconify-icon>
                                    Input Stok Masuk
                                </Link>
                                <Link to="/inventories"
                                    className="w-full border border-brand-light hover:bg-brand-light/30 text-brand-primary py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                                    <iconify-icon icon="solar:clipboard-list-linear" class="text-lg"></iconify-icon>
                                    Stock Opname
                                </Link>
                                <Link to="/reports"
                                    className="w-full border border-brand-light hover:bg-brand-light/30 text-brand-primary py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                                    <iconify-icon icon="solar:chart-2-linear" class="text-lg"></iconify-icon>
                                    Laporan Bulanan
                                </Link>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                            <h4 className="text-[10px] font-extrabold text-brand-primary/60 tracking-widest capitalize mb-6">
                                🕐 Log Aktivitas
                            </h4>
                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-brand-light">
                                {pageLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="relative pl-8 animate-pulse space-y-1">
                                            <span className="absolute left-0 top-1 w-4 h-4 bg-brand-light border-4 border-white rounded-full"></span>
                                            <div className="h-3 bg-brand-light rounded w-20"></div>
                                            <div className="h-3 bg-brand-light/60 rounded w-32"></div>
                                        </div>
                                    ))
                                ) : activityLog.length === 0 ? (
                                    <p className="text-xs text-brand-primary italic pl-8">Belum ada aktivitas hari ini.</p>
                                ) : activityLog.map((log, i) => (
                                    <div key={i} className="relative pl-8">
                                        <span className={`absolute left-0 top-1 w-4 h-4 ${log.type === 'in' ? 'bg-emerald-500' : 'bg-rose-400'} border-4 border-white rounded-full`}></span>
                                        <div className="flex justify-between text-[10px] mb-1">
                                            <span className="font-extrabold text-brand-dark">{log.action}</span>
                                            <span className="text-brand-primary/50">{log.time_ago}</span>
                                        </div>
                                        <p className="text-[11px] text-brand-primary/70 leading-relaxed">{log.description}</p>
                                    </div>
                                ))}
                            </div>
                            <a href="#" className="block text-center text-brand-secondary font-extrabold text-xs mt-6 hover:underline">
                                Lihat semua log →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}