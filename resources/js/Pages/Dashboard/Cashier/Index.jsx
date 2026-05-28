import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CashierDashboard({ user, stats, recentTransactions, lowStockItems, shiftInfo }) {
    return (
        <>
            <Head title="Dashboard Kasir" />
            <div className="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Main Content */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Header */}
                        <div>
                            <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                                Dashboard Kasir
                            </h1>
                            <p className="text-sm font-medium text-[#2f27ce]">Pantau performa harian dan kelola transaksi dengan cepat.</p>
                        </div>

                        {/* Welcome Banner */}
                        <div className="relative bg-gradient-to-r from-[#2f27ce] to-[#443dff] rounded-3xl p-8 text-white overflow-hidden shadow-lg">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-extrabold">Selamat Datang, {user?.name}!</h2>
                                    <p className="text-white/70 text-sm">
                                        {shiftInfo?.duration ? `Shift Anda telah berjalan selama ${shiftInfo.duration}.` : 'Siap untuk melayani pelanggan hari ini?'}
                                    </p>
                                </div>
                                <Link href="/pos"
                                    className="bg-white text-[#2f27ce] px-6 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:bg-[#dddbff] transition-all shadow-sm whitespace-nowrap text-sm">
                                    <iconify-icon icon="solar:play-circle-bold" class="text-lg"></iconify-icon>
                                    BUKA POS SEKARANG
                                </Link>
                            </div>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Total Transaksi', value: stats?.total_orders    ?? '0 Pesanan',  note: 'Transaksi hari ini',     icon: 'solar:bill-list-bold',   iconBg: 'bg-[#dddbff]',    iconColor: 'text-[#443dff]' },
                                { title: 'Total Pendapatan', value: stats?.total_cash     ?? 'Rp 0',       note: 'Pendapatan hari ini',    icon: 'solar:wallet-bold',      iconBg: 'bg-emerald-50',   iconColor: 'text-emerald-600' },
                                { title: 'Waktu Rata-Rata', value: stats?.avg_time        ?? '0 Menit',    note: 'Kecepatan layanan',      icon: 'solar:clock-circle-bold',iconBg: 'bg-orange-50',    iconColor: 'text-orange-500' },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border border-[#dddbff] shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor}`}>
                                            <iconify-icon icon={card.icon} class="text-xl"></iconify-icon>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 bg-[#fbfbfe] rounded-lg border border-[#dddbff] text-[#2f27ce]">Hari Ini</span>
                                    </div>
                                    <p className="text-[#2f27ce]/70 text-xs font-extrabold uppercase tracking-wider">{card.title}</p>
                                    <h3 className="text-2xl font-extrabold text-[#050316] mt-1">{card.value}</h3>
                                    <p className="text-[10px] text-[#2f27ce]/50 mt-3 font-medium">{card.note}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-3xl border border-[#dddbff] shadow-sm overflow-hidden">
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="font-extrabold text-[#050316] tracking-tight">Transaksi Terakhir</h3>
                                <Link href="/transactions" className="text-[#443dff] font-extrabold text-xs flex items-center gap-1 hover:underline">
                                    Lihat Semua <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
                                </Link>
                            </div>
                            <div className="overflow-x-auto text-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-[#fbfbfe] text-[#2f27ce]/60 text-[11px] font-extrabold uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Waktu</th>
                                            <th className="px-6 py-3">Pesanan</th>
                                            <th className="px-6 py-3">Total</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#dddbff]/50">
                                        {(recentTransactions ?? []).length === 0 ? (
                                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[#2f27ce] italic">Belum ada transaksi hari ini.</td></tr>
                                        ) : (recentTransactions ?? []).map((trx, i) => (
                                            <tr key={i} className="hover:bg-[#dddbff]/10 transition">
                                                <td className="px-6 py-4 font-bold text-[#2f27ce]">{trx.id}</td>
                                                <td className="px-6 py-4 text-[#050316]/60">{trx.time}</td>
                                                <td className="px-6 py-4 text-[#050316]/80">{trx.items}</td>
                                                <td className="px-6 py-4 font-extrabold text-[#050316]">{trx.total}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${trx.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                        {trx.status === 'completed' ? 'Sukses' : 'Gagal'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-3 text-[#2f27ce]/40">
                                                        <button className="hover:text-[#443dff]">
                                                            <iconify-icon icon="solar:printer-minimalistic-linear" class="text-lg"></iconify-icon>
                                                        </button>
                                                        <button className="hover:text-[#443dff]">
                                                            <iconify-icon icon="solar:restart-linear" class="text-lg"></iconify-icon>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* Profile */}
                        <div className="bg-white p-4 rounded-3xl border border-[#dddbff] shadow-sm flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#443dff] to-[#2f27ce] flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-[#050316] text-sm">{user?.name}</h4>
                                <p className="text-[11px] text-[#2f27ce]">Cashier • {shiftInfo?.shift ?? 'Shift Aktif'}</p>
                            </div>
                        </div>

                        {/* Shift Info */}
                        <div className="bg-white p-6 rounded-3xl border border-[#dddbff] shadow-sm space-y-4">
                            <h4 className="text-[10px] font-extrabold text-[#2f27ce]/60 uppercase tracking-widest">Informasi Shift</h4>
                            <div className="space-y-3 text-sm">
                                {[
                                    { label: 'Mulai Shift',  value: shiftInfo?.start    ?? '-' },
                                    { label: 'Durasi',       value: shiftInfo?.duration ?? '-' },
                                    { label: 'Saldo Awal',   value: shiftInfo?.balance  ?? '-' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-[#2f27ce]/70">{row.label}</span>
                                        <span className="font-extrabold text-[#050316]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full border border-[#dddbff] py-2.5 rounded-xl text-[11px] font-bold text-[#2f27ce] hover:bg-[#dddbff]/30 transition">
                                Lihat Laporan Shift
                            </button>
                        </div>

                        {/* Low Stock */}
                        <div className="bg-white p-6 rounded-3xl border border-[#dddbff] shadow-sm">
                            <h4 className="text-[10px] font-extrabold text-[#2f27ce]/60 uppercase tracking-widest mb-4">Stok Menipis</h4>
                            <div className="space-y-4">
                                {(lowStockItems ?? []).length === 0 ? (
                                    <p className="text-xs text-[#2f27ce] italic">Semua stok aman.</p>
                                ) : (lowStockItems ?? []).map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></div>
                                        <div>
                                            <h5 className="text-sm font-extrabold text-[#050316]">{item.name}</h5>
                                            <p className="text-[11px] text-[#2f27ce]/60">Sisa {item.stock} {item.unit} (Min. {item.min_stock})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/inventories" className="block text-[#443dff] font-extrabold text-[11px] mt-6 hover:underline">
                                Kelola Inventaris →
                            </Link>
                        </div>

                        {/* Memo */}
                        <div className="bg-[#dddbff]/20 p-6 rounded-3xl border border-[#dddbff]">
                            <h4 className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest mb-3">📌 Internal Memo</h4>
                            <p className="text-xs text-[#050316]/70 italic leading-relaxed">
                                Informasikan promo dan penawaran aktif kepada pelanggan saat melayani.
                            </p>
                            <p className="text-[10px] text-[#2f27ce]/50 mt-4 font-bold">— Management</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


CashierDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;