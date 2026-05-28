import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function UsersIndex({ users, stats, logs, filters, can }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole]     = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('users.index'), { search, role, status }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleReset() {
        setSearch(''); setRole(''); setStatus('');
        router.get(route('users.index'));
    }

    function handleToggleStatus(id) {
        router.post(route('users.toggle-status', id), {}, { preserveScroll: true });
    }

    function handleResetPassword(id) {
        router.post(route('users.reset-password', id), {}, { preserveScroll: true });
    }

    function handleDelete(id, name) {
        if (!confirm(`Hapus pengguna ${name}?`)) return;
        router.delete(route('users.destroy', id), { preserveScroll: true });
    }

    const roleStyles = {
        owner:   'bg-[#443dff] text-white',
        admin:   'bg-[#dddbff]/50 text-[#2f27ce]',
        cashier: 'bg-[#dddbff]/50 text-[#2f27ce]',
    };
    const roleLabels = { owner: 'Owner', admin: 'Admin', cashier: 'Kasir' };

    const statusStyles = {
        active:      { bg: 'bg-[#ecfdf5]',  dot: 'bg-[#10b981]', text: 'text-[#10b981]', label: 'Active' },
        inactive:    { bg: 'bg-[#f3f4f6]',  dot: 'bg-[#6b7280]', text: 'text-[#6b7280]', label: 'Inactive' },
        pending:     { bg: 'bg-[#fef3c7]',  dot: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', label: 'Pending' },
        deactivated: { bg: 'bg-[#fef2f2]',  dot: 'bg-[#ef4444]', text: 'text-[#ef4444]', label: 'Deactivated' },
    };

    return (
        <>
            <Head title="Daftar Pengguna" />
            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ── MAIN ── */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                                    Daftar Pengguna
                                </h1>
                                <p className="text-xs md:text-sm text-[#2f27ce]/70 font-medium mt-1">
                                    Kelola hak akses dan peran personel cafe Anda.
                                </p>
                            </div>
                            {can.manage_users && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href={route('users.index', { export: 'csv', search, role, status })}
                                        className="flex items-center gap-2 px-4 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] rounded-xl transition-all"
                                    >
                                        <iconify-icon icon="solar:download-square-linear" class="text-lg"></iconify-icon>
                                        Export CSV
                                    </a>
                                    <Link
                                        href={route('users.create')}
                                        className="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all"
                                    >
                                        <iconify-icon icon="solar:user-plus-rounded-linear" class="text-lg"></iconify-icon>
                                        Tambah Pengguna
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Kasir Aktif',       value: stats.totalKasir,   sub: 'Aktif bertugas',     subColor: 'text-emerald-500', icon: 'solar:users-group-rounded-linear',  iconBg: 'bg-[#dddbff]/50 text-[#2f27ce]' },
                                { label: 'Admin Sistem',      value: stats.totalAdmin,   sub: 'Pengguna aktif',     subColor: 'text-[#443dff]',   icon: 'solar:shield-keyhole-linear',       iconBg: 'bg-[#dddbff]/50 text-[#2f27ce]' },
                                { label: 'Menunggu Akses',    value: stats.totalPending, sub: 'Perlu persetujuan',  subColor: 'text-amber-500',   icon: 'solar:clock-circle-linear',         iconBg: 'bg-[#dddbff]/50 text-[#2f27ce]' },
                            ].map(card => (
                                <div key={card.label} className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs md:text-sm text-[#2f27ce]/70 font-medium">{card.label}</p>
                                            <h2 className="text-2xl font-black text-[#443dff] mt-2">{card.value}</h2>
                                            <p className={`text-xs font-bold mt-3 ${card.subColor}`}>{card.sub}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${card.iconBg}`}>
                                            <iconify-icon icon={card.icon}></iconify-icon>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Card */}
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                            {/* Toolbar */}
                            <form onSubmit={handleFilter}>
                                <div className="px-5 py-4 border-b border-[#dddbff] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#fbfbfe]/50">
                                    <div className="relative flex-1 max-w-sm">
                                        <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg"></iconify-icon>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Nama, email, atau ID..."
                                            className="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-11 pr-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select value={role} onChange={e => setRole(e.target.value)}
                                            className="h-11 px-4 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold rounded-xl outline-none">
                                            <option value="">Semua Role</option>
                                            <option value="owner">Owner</option>
                                            <option value="admin">Admin</option>
                                            <option value="cashier">Kasir</option>
                                        </select>
                                        <select value={status} onChange={e => setStatus(e.target.value)}
                                            className="h-11 px-4 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold rounded-xl outline-none">
                                            <option value="">Semua Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                            <option value="deactivated">Deactivated</option>
                                        </select>
                                        <button type="submit"
                                            className="flex items-center gap-2 h-11 px-4 bg-[#2f27ce] text-white text-sm font-bold rounded-xl">
                                            <iconify-icon icon="solar:filter-linear" class="text-lg"></iconify-icon>
                                            Filter
                                        </button>
                                        <button type="button" onClick={handleReset}
                                            className="h-11 px-4 border border-transparent bg-[#fbfbfe] text-[#2f27ce]/70 text-sm font-bold hover:bg-[#dddbff] rounded-xl">
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[640px]">
                                    <thead>
                                        <tr className="border-b border-[#dddbff] bg-white">
                                            {['Nama Pengguna', 'Role', 'Bergabung', 'Status', 'Aksi'].map(h => (
                                                <th key={h} className="px-5 py-4 text-xs font-bold text-[#2f27ce]/70">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#dddbff]/50 text-sm bg-white">
                                        {users.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-14 h-14 rounded-2xl bg-[#dddbff]/30 flex items-center justify-center text-[#2f27ce]/30 text-3xl">
                                                            <iconify-icon icon="solar:users-group-rounded-linear"></iconify-icon>
                                                        </div>
                                                        <p className="font-bold text-[#050316]">Tidak ada pengguna ditemukan</p>
                                                        <p className="text-sm text-[#2f27ce]/50">Coba ubah filter atau tambah pengguna baru.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : users.data.map(user => {
                                            const s = statusStyles[user.status] ?? statusStyles.inactive;
                                            return (
                                                <tr key={user.id} className="hover:bg-[#dddbff]/20 transition-colors group">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                                                {user.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#050316]">{user.name}</p>
                                                                <p className="text-xs text-[#2f27ce]/70 font-medium">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${roleStyles[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                                                            {roleLabels[user.role] ?? user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm font-medium text-[#2f27ce]/70">
                                                        {user.created_at_diff}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold ${s.bg} ${s.text}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                                                            {s.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <UserActions
                                                            user={user}
                                                            canManage={can.manage_users}
                                                            onToggle={handleToggleStatus}
                                                            onReset={handleResetPassword}
                                                            onDelete={handleDelete}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-[#dddbff] bg-[#fbfbfe]/50 gap-4">
                                <p className="text-xs font-medium text-[#2f27ce]/70">
                                    Menampilkan <span className="font-bold text-[#050316]">{users.from ?? 0}</span>–<span className="font-bold text-[#050316]">{users.to ?? 0}</span> dari <span className="font-bold text-[#050316]">{users.total}</span> pengguna
                                </p>
                                <div className="flex items-center gap-1.5">
                                    {users.links?.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? '#'}
                                            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white border-[#2f27ce]'
                                                    : 'border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff]'
                                            } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* Ringkasan Tim */}
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                            <h3 className="font-extrabold text-[#050316]">Ringkasan Tim</h3>
                            <p className="text-xs text-[#2f27ce]/70 font-medium mt-0.5 mb-5">Status personel saat ini.</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Total Pengguna', value: stats.totalUser,    bg: 'bg-[#dddbff]/30 border-[#dddbff]',         text: 'text-[#443dff]',  icon: 'solar:users-group-two-rounded-linear' },
                                    { label: 'Status Aktif',   value: stats.totalActive,  bg: 'bg-[#ecfdf5] border-[#10b981]/20',          text: 'text-[#050316]',  icon: 'solar:check-circle-linear' },
                                    { label: 'Menunggu Akses', value: stats.totalPending, bg: 'bg-[#fef3c7] border-[#f59e0b]/20',          text: 'text-[#050316]',  icon: 'solar:clock-square-linear' },
                                ].map(item => (
                                    <div key={item.label} className={`border rounded-xl p-4 flex items-center justify-between ${item.bg}`}>
                                        <div>
                                            <p className="text-[10px] font-bold text-[#2f27ce]/70 uppercase tracking-widest">{item.label}</p>
                                            <p className={`text-2xl font-black mt-1 ${item.text}`}>{item.value}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <iconify-icon icon={item.icon} class="text-xl text-[#443dff]"></iconify-icon>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Aktivitas Terakhir */}
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                            <h3 className="font-extrabold text-[#050316] mb-5">Aktivitas Terakhir</h3>
                            {logs.length === 0 ? (
                                <p className="text-sm text-[#2f27ce]/50 text-center py-4">Belum ada aktivitas.</p>
                            ) : (
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#dddbff] before:to-transparent">
                                    {logs.map(log => (
                                        <div key={log.id} className="relative flex items-start gap-4">
                                            <div className="w-3 h-3 rounded-full bg-[#443dff] mt-1.5 flex-shrink-0 shadow-[0_0_0_4px_#fbfbfe] z-10"></div>
                                            <div className="bg-[#fbfbfe] border border-[#dddbff] p-3 rounded-xl w-full">
                                                <p className="text-xs font-bold text-[#050316]">{log.user_name}</p>
                                                <p className="text-[13px] text-[#2f27ce]/70 font-medium mt-0.5">{log.action}</p>
                                                <p className="text-[10px] font-bold text-[#443dff] mt-1.5">{log.created_at}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = (page) => <AppLayout>{page}</AppLayout>;

// ── Dropdown Aksi ────────────────────────────────────────────────
function UserActions({ user, canManage, onToggle, onReset, onDelete }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className="p-2 text-[#2f27ce]/50 hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-xl transition-all"
            >
                <iconify-icon icon="solar:menu-dots-bold" class="text-lg"></iconify-icon>
            </button>
            {open && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-[#dddbff] rounded-xl shadow-xl z-20 overflow-hidden">
                    <Link href={route('users.show', user.id)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30">
                        <iconify-icon icon="solar:eye-linear" class="text-[#2f27ce]"></iconify-icon>
                        Lihat Detail
                    </Link>
                    {canManage && <>
                        <Link href={route('users.edit', user.id)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30">
                            <iconify-icon icon="solar:pen-linear" class="text-[#2f27ce]"></iconify-icon>
                            Edit Pengguna
                        </Link>
                        <button onClick={() => onToggle(user.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30">
                            <iconify-icon icon="solar:shield-warning-linear" class="text-amber-500"></iconify-icon>
                            {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button onClick={() => onReset(user.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30">
                            <iconify-icon icon="solar:key-linear" class="text-[#2f27ce]"></iconify-icon>
                            Reset Password
                        </button>
                        <button onClick={() => onDelete(user.id, user.name)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 font-semibold hover:bg-[#fef2f2] border-t border-[#dddbff]">
                            <iconify-icon icon="solar:trash-bin-trash-linear" class="text-red-500"></iconify-icon>
                            Hapus
                        </button>
                    </>}
                </div>
            )}
        </div>
    );
}