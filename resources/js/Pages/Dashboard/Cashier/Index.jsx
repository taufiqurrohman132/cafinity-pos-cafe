import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import AppLayout from '@/Layouts/AppLayout';

export default function CashierDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const res = await client.get('/dashboard');
            setDashboardData(res.data);
        } catch (e) {
            console.error('Failed to fetch cashier dashboard data', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const stats = dashboardData?.stats || {
        total_orders: '0 Pesanan',
        total_cash: 'Rp 0',
        avg_time: '—',
    };
    const recentTransactions = dashboardData?.recentTransactions || [];
    const lowStockItems = dashboardData?.lowStockItems || [];
    const shiftInfo = dashboardData?.shiftInfo || {
        shift: 'Pagi',
        start: '08:00',
        duration: '0 Menit',
        balance: 'Rp 500.000',
    };

    const pageLoading = loading;

    return (
        <AppLayout>
            <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen">

                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Kasir POS
                        </h1>
                        <p className="text-brand-primary mt-1 text-sm font-medium">
                            Selamat bertugas, <span className="font-extrabold text-brand-dark">{user?.name}</span>. Shift Anda hari ini berjalan dengan lancar.
                        </p>
                    </div>
                    <Link to="/pos"
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.98] w-fit">
                        <iconify-icon icon="solar:card-2-linear" class="text-[18px]"></iconify-icon>
                        Buka Layar Transaksi (POS)
                    </Link>
                </div>

                {/* Grid Info Utama */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left: Stats & History */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { title: 'Hari Ini (Pesanan)', value: stats.total_orders, icon: 'solar:bag-5-linear', iconBg: 'bg-brand-light', iconColor: 'text-brand-secondary' },
                                { title: 'Hari Ini (Omset Tunai)', value: stats.total_cash, icon: 'solar:wallet-money-linear', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
                                { title: 'Rata-rata Waktu Dapur', value: stats.avg_time, icon: 'solar:clock-circle-linear', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                        <iconify-icon icon={card.icon} class={`text-2xl ${card.iconColor}`}></iconify-icon>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 capitalize tracking-wide">{card.title}</p>
                                        <p className="text-lg font-extrabold text-brand-dark mt-0.5">{card.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Riwayat Transaksi Shift */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                            <div className="p-6 flex justify-between items-center border-b border-brand-light">
                                <div>
                                    <h3 className="font-extrabold text-brand-dark tracking-tight">Riwayat Transaksi Shift Ini</h3>
                                    <p className="text-xs text-brand-primary/70 mt-0.5">Daftar transaksi penjualan tunai & cashless Anda hari ini</p>
                                </div>
                                <Link to="/transactions" className="text-xs border border-brand-light px-4 py-2 rounded-xl font-bold text-brand-primary hover:bg-brand-light transition">
                                    Semua Riwayat
                                </Link>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-brand-bg text-[10px] capitalize text-brand-primary/60 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-extrabold">No. TRX</th>
                                        <th className="px-4 py-4 font-extrabold">Waktu</th>
                                        <th className="px-4 py-4 font-extrabold">Item Belanja</th>
                                        <th className="px-4 py-4 font-extrabold">Total Pembayaran</th>
                                        <th className="px-6 py-4 font-extrabold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-brand-light/50">
                                    {pageLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4"><div className="h-4 bg-brand-light rounded w-16"></div></td>
                                                <td className="px-4 py-4"><div className="h-4 bg-brand-light/60 rounded w-12"></div></td>
                                                <td className="px-4 py-4"><div className="h-4 bg-brand-light rounded w-40"></div></td>
                                                <td className="px-4 py-4"><div className="h-4 bg-brand-light rounded w-20"></div></td>
                                                <td className="px-6 py-4"><div className="h-5 bg-brand-light rounded w-16 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : recentTransactions.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-primary italic">Belum ada transaksi shift ini.</td></tr>
                                    ) : recentTransactions.map((row, i) => {
                                        const isCompleted = row.status === 'completed';
                                        return (
                                            <tr key={i} className="hover:bg-brand-light/10 transition">
                                                <td className="px-6 py-4 font-extrabold text-brand-dark">{row.id}</td>
                                                <td className="px-4 py-4 text-brand-dark/60">{row.time}</td>
                                                <td className="px-4 py-4 text-brand-dark/60 max-w-xs truncate">{row.items}</td>
                                                <td className="px-4 py-4 text-brand-dark font-extrabold">{row.total}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`px-2 py-1 text-[10px] rounded-full font-bold ${
                                                        isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {isCompleted ? 'Selesai' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Shift & Inventory Alert */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Shift Informasi */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <h3 className="font-extrabold text-brand-dark tracking-tight">Sesi Aktif & Shift</h3>
                            <div className="space-y-3.5 divide-y divide-brand-light/50">
                                <div className="flex justify-between items-center pt-3 first:pt-0">
                                    <span className="text-xs font-semibold text-brand-primary/80">Sesi Shift</span>
                                    <span className="text-xs font-extrabold text-brand-dark bg-brand-light/50 border px-3 py-1 rounded-lg">Shift {shiftInfo.shift}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-xs font-semibold text-brand-primary/80">Mulai Shift</span>
                                    <span className="text-xs font-bold text-brand-dark">{shiftInfo.start} WIB</span>
                                </div>
                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-xs font-semibold text-brand-primary/80">Durasi Bekerja</span>
                                    <span className="text-xs font-bold text-brand-dark">{shiftInfo.duration}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-xs font-semibold text-brand-primary/80">Saldo Awal Kas</span>
                                    <span className="text-xs font-extrabold text-brand-dark">{shiftInfo.balance}</span>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Stok Tipis */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-extrabold text-brand-dark tracking-tight">Alert Stok Tipis</h3>
                                <span className="bg-rose-50 text-rose-600 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-rose-100 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                                    {lowStockItems.length} Item
                                </span>
                            </div>
                            <div className="space-y-3">
                                {pageLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="p-3 border border-brand-light rounded-xl animate-pulse space-y-2">
                                            <div className="flex justify-between">
                                                <div className="h-3 bg-brand-light rounded w-24"></div>
                                                <div className="h-3 bg-brand-light rounded w-12"></div>
                                            </div>
                                            <div className="h-3 bg-brand-light/60 rounded w-32"></div>
                                        </div>
                                    ))
                                ) : lowStockItems.length === 0 ? (
                                    <p className="text-xs text-brand-primary italic text-center py-2">Semua stok bahan aman.</p>
                                ) : lowStockItems.map((item, i) => (
                                    <div key={i} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-brand-dark">{item.name}</p>
                                                <p className="text-[10px] font-medium text-rose-500 mt-0.5">
                                                    Sisa <span className="font-bold">{item.stock} {item.unit}</span> (min {item.min_stock})
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}