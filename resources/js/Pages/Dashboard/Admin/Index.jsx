import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminDashboard({ user, stats, stockMovement, menuSummary, hppAnalysis, activityLog }) {
    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="h-full flex flex-col overflow-hidden">
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-0">

                    {/* Main Content */}
                    <div className="xl:col-span-9 min-h-0 overflow-y-auto space-y-6 p-4 md:py-6 md:pl-6 bg-[#fbfbfe]">

                        {/* Header */}
                        <div>
                            <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                                Dashboard Admin
                            </h1>
                            <p className="text-[#2f27ce] mt-1 text-sm font-medium">
                                Selamat datang kembali, <span className="font-extrabold text-[#050316]">{user?.name}</span>.
                            </p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Stok Rendah',      value: stats?.low_stock     ?? '0 Item',   icon: 'solar:box-minimalistic-bold-duotone',          iconBg: 'bg-rose-100',    iconColor: 'text-rose-600',    note: 'Segera Restock!',          noteColor: 'text-rose-500' },
                                { title: 'PO Menunggu',      value: stats?.pending_po    ?? '0 Berkas', icon: 'solar:document-text-bold-duotone',             iconBg: 'bg-blue-100',    iconColor: 'text-blue-600',    note: 'Perlu persetujuan',        noteColor: 'text-blue-500' },
                                { title: 'Total SKU',        value: stats?.total_sku     ?? '0 Item',   icon: 'solar:box-bold-duotone',                       iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', note: 'Item aktif di inventaris', noteColor: 'text-emerald-600' },
                                { title: 'Nilai Inventaris', value: stats?.inventory_val ?? 'Rp 0',     icon: 'solar:chart-2-bold-duotone',                   iconBg: 'bg-[#dddbff]',   iconColor: 'text-[#443dff]',   note: null,                       noteColor: null },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                                        <iconify-icon icon={card.icon} class={`text-2xl ${card.iconColor}`}></iconify-icon>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wide">{card.title}</p>
                                        <p className="text-xl font-extrabold text-[#050316] mt-0.5">{card.value}</p>
                                        {card.note && <p className={`text-[11px] font-bold mt-0.5 ${card.noteColor}`}>{card.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stock Movement + Menu Summary */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

                            {/* Stock Movement Chart */}
                            <div className="xl:col-span-8">
                                <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-extrabold text-[#050316] tracking-tight">Pergerakan Stok</h3>
                                        <span className="text-xs font-bold text-[#2f27ce] bg-[#dddbff]/50 border border-[#dddbff] px-3 py-1 rounded-lg">
                                            7 Hari Terakhir
                                        </span>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between h-48 gap-2 pt-4 border-b border-[#dddbff]">
                                        {(stockMovement ?? [40,30,50,45,60,80,55].map((v,i) => ({ in: v, out: v-15, label: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i] }))).map((slot, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="w-full flex gap-1 items-end h-full">
                                                    <div className="flex-1 bg-[#443dff] rounded-t-sm transition-all group-hover:bg-[#2f27ce]" style={{ height: `${slot.in}%` }}></div>
                                                    <div className="flex-1 bg-[#dddbff] rounded-t-sm" style={{ height: `${slot.out}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-[#2f27ce]/50 font-bold mt-2">{slot.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-4 text-[10px] font-bold text-[#2f27ce] justify-center">
                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#443dff]"></span> Stok Masuk</span>
                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#dddbff]"></span> Stok Keluar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Summary */}
                            <div className="xl:col-span-4">
                                <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm h-full flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="font-extrabold text-[#050316] tracking-tight">Ringkasan Menu</h3>
                                        <p className="text-xs text-[#2f27ce]/70 mt-1">Status ketersediaan katalog menu</p>
                                    </div>
                                    <div className="space-y-5 flex-1">
                                        {(menuSummary ?? [
                                            { icon: 'solar:cup-hot-linear',  iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', name: 'Minuman',      sub: '(Coffee/Non)', count: '0 Item Aktif', status: 'Ready',   statusBg: 'bg-emerald-100', statusColor: 'text-emerald-600' },
                                            { icon: 'solar:chef-hat-linear', iconBg: 'bg-orange-50',  iconColor: 'text-orange-400',  name: 'Makanan',      sub: 'Utama',        count: '0 Item Aktif', status: 'Limited', statusBg: 'bg-orange-100',  statusColor: 'text-orange-500' },
                                            { icon: 'solar:cookie-linear',   iconBg: 'bg-rose-50',    iconColor: 'text-rose-500',    name: 'Snack &',      sub: 'Pastry',       count: '0 Item Aktif', status: 'Ready',   statusBg: 'bg-emerald-100', statusColor: 'text-emerald-600' },
                                        ]).map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
                                                        <iconify-icon icon={item.icon} class="text-2xl"></iconify-icon>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-extrabold text-[#050316] leading-tight">{item.name}<br />{item.sub}</h4>
                                                        <p className="text-xs text-[#2f27ce]/70 mt-1">{item.count}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full ${item.statusBg} ${item.statusColor} text-[10px] font-bold`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/menus"
                                        className="w-full mt-7 border border-[#dddbff] hover:bg-[#dddbff]/30 transition py-2.5 rounded-xl text-xs font-bold text-[#2f27ce] text-center block">
                                        Kelola Menu Catalog
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* HPP Analysis */}
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
                            <div className="p-6 flex justify-between items-center border-b border-[#dddbff]">
                                <div>
                                    <h3 className="font-extrabold text-[#050316] tracking-tight">Analisis HPP Resep</h3>
                                    <p className="text-xs text-[#2f27ce]/70">Menu dengan margin kritis atau keuntungan tinggi</p>
                                </div>
                                <Link href="/recipe-costing"
                                    className="text-xs border border-[#dddbff] px-4 py-2 rounded-xl font-bold text-[#2f27ce] hover:bg-[#dddbff] transition">
                                    Detail Recipe Costing
                                </Link>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#fbfbfe] text-[10px] uppercase text-[#2f27ce]/60 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-extrabold">Nama Menu</th>
                                        <th className="px-4 py-4 font-extrabold">HPP (Estimasi)</th>
                                        <th className="px-4 py-4 font-extrabold">Harga Jual</th>
                                        <th className="px-4 py-4 font-extrabold text-center">Margin (%)</th>
                                        <th className="px-6 py-4 font-extrabold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-[#dddbff]/50">
                                    {(hppAnalysis ?? []).length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-[#2f27ce] italic">Belum ada data HPP.</td></tr>
                                    ) : (hppAnalysis ?? []).map((row, i) => {
                                        const isLow = row.margin_pct < 40;
                                        return (
                                            <tr key={i} className="hover:bg-[#dddbff]/10 transition">
                                                <td className="px-6 py-4 font-extrabold text-[#050316]">{row.name}</td>
                                                <td className="px-4 py-4 text-[#050316]/60">{row.hpp}</td>
                                                <td className="px-4 py-4 text-[#050316]/60">{row.price}</td>
                                                <td className={`px-4 py-4 text-center font-extrabold ${isLow ? 'text-rose-500' : 'text-emerald-600'}`}>{row.margin}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`px-2 py-1 text-[10px] rounded-full font-bold ${isLow ? 'bg-rose-100 text-rose-600' : 'bg-[#dddbff] text-[#2f27ce]'}`}>
                                                        {isLow ? 'Low Margin' : 'Normal'}
                                                    </span>
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
                        <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                            <h4 className="text-[10px] font-extrabold text-[#2f27ce]/60 tracking-widest uppercase mb-4">
                                ⚡ Aksi Cepat
                            </h4>
                            <div className="space-y-3">
                                <Link href="/inventories/create"
                                    className="w-full bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition">
                                    <iconify-icon icon="solar:add-circle-bold" class="text-lg"></iconify-icon>
                                    Input Stok Masuk
                                </Link>
                                <Link href="/inventories"
                                    className="w-full border border-[#dddbff] hover:bg-[#dddbff]/30 text-[#2f27ce] py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                                    <iconify-icon icon="solar:clipboard-list-linear" class="text-lg"></iconify-icon>
                                    Stock Opname
                                </Link>
                                <Link href="/reports"
                                    className="w-full border border-[#dddbff] hover:bg-[#dddbff]/30 text-[#2f27ce] py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                                    <iconify-icon icon="solar:chart-2-linear" class="text-lg"></iconify-icon>
                                    Laporan Bulanan
                                </Link>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                            <h4 className="text-[10px] font-extrabold text-[#2f27ce]/60 tracking-widest uppercase mb-6">
                                🕐 Log Aktivitas
                            </h4>
                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#dddbff]">
                                {(activityLog ?? []).length === 0 ? (
                                    <p className="text-xs text-[#2f27ce] italic pl-8">Belum ada aktivitas hari ini.</p>
                                ) : (activityLog ?? []).map((log, i) => (
                                    <div key={i} className="relative pl-8">
                                        <span className={`absolute left-0 top-1 w-4 h-4 ${log.type === 'in' ? 'bg-emerald-500' : 'bg-rose-400'} border-4 border-white rounded-full`}></span>
                                        <div className="flex justify-between text-[10px] mb-1">
                                            <span className="font-extrabold text-[#050316]">{log.action}</span>
                                            <span className="text-[#2f27ce]/50">{log.time_ago}</span>
                                        </div>
                                        <p className="text-[11px] text-[#2f27ce]/70 leading-relaxed">{log.description}</p>
                                    </div>
                                ))}
                            </div>
                            <a href="#" className="block text-center text-[#443dff] font-extrabold text-xs mt-6 hover:underline">
                                Lihat semua log →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


AdminDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;