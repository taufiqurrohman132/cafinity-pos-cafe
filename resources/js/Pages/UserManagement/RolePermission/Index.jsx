import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import AppLayout from '@/Layouts/AppLayout';

export default function RolePermissionIndex({ roles, logs }) {
    const { flash = {} } = usePage().props;

    // State untuk mendeteksi role aktif terpilih di panel kiri
    const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || null);

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // Cari entitas objek role terpilih
    const currentRole = roles.find(r => r.id === selectedRoleId) || null;

    // Definisikan peta struktur modul & aksi b-end Anda secara konsisten
    const modules = {
        'dashboard': 'Dashboard',
        'pos': 'Point of Sales (POS)',
        'transactions': 'Transactions',
        'menus': 'Menu Catalog',
        'recipe-costing': 'Recipe Costing',
        'inventories': 'Inventory',
        'reports': 'Reports',
        'users': 'User Management',
    };
    const actions = ['view', 'create', 'edit', 'delete', 'export'];

    // Gunakan useForm hook dari Inertia untuk memproses update matrix
    const { data, setData, put, processing } = useForm({
        permissions: []
    });

    // Perbarui isi form array internal React setiap kali user berpindah pilihan tipe role
    useEffect(() => {
        if (currentRole) {
            setData('permissions', currentRole.permissions.map(p => p.name));
        }
    }, [selectedRoleId, roles]);

    // Pewarnaan indikator dot list role
    const getDotColor = (name) => {
        const colors = {
            'owner': 'bg-[#443dff]',
            'admin': 'bg-[#3b82f6]',
            'cashier': 'bg-[#f59e0b]',
            'kitchen': 'bg-[#10b981]',
            'inventory': 'bg-[#8b5cf6]',
        };
        return colors[name.toLowerCase()] || 'bg-[#6b7280]';
    };

    // Handler interaksi checkbox individual item matrix
    const handleCheckboxChange = (permName) => {
        let updated = [...data.permissions];
        if (updated.includes(permName)) {
            updated = updated.filter(p => p !== permName);
        } else {
            updated.push(permName);
        }
        setData('permissions', updated);
    };

    // Handler klik aksi tombol toggle "ALL" per baris modul
    const handleToggleRowAll = (moduleKey) => {
        const rowPermissions = actions.map(act => `${moduleKey}.${act}`);
        const allChecked = rowPermissions.every(p => data.permissions.includes(p));

        let updated = [...data.permissions];
        if (allChecked) {
            // Jika semua menyala, hapus semua permission khusus baris modul ini
            updated = updated.filter(p => !rowPermissions.includes(p));
        } else {
            // Jika ada yang mati, nyalakan semua yang belum ada di array
            rowPermissions.forEach(p => {
                if (!updated.includes(p)) updated.push(p);
            });
        }
        setData('permissions', updated);
    };

    // Preset Cepat: Mengubah status permission secara massal di sisi client sebelum disave
    const isPresetActive = (type) => {
        let targetList = [];
        if (type === 'read-only') {
            targetList = Object.keys(modules).map(m => `${m}.view`);
        } else if (type === 'full') {
            Object.keys(modules).forEach(m => {
                actions.forEach(a => targetList.push(`${m}.${a}`));
            });
        } else if (type === 'pos') {
            targetList = ['pos.view', 'pos.create', 'pos.edit', 'transactions.view', 'transactions.create'];
        }

        const currentSorted = [...data.permissions].sort();
        const targetSorted = [...targetList].sort();
        return currentSorted.length === targetSorted.length && currentSorted.every((val, index) => val === targetSorted[index]);
    };

    const applyPreset = (type) => {
        let targetList = [];
        if (type === 'read-only') {
            targetList = Object.keys(modules).map(m => `${m}.view`);
        } else if (type === 'full') {
            Object.keys(modules).forEach(m => {
                actions.forEach(a => targetList.push(`${m}.${a}`));
            });
        } else if (type === 'pos') {
            targetList = ['pos.view', 'pos.create', 'pos.edit', 'transactions.view', 'transactions.create'];
        }

        if (isPresetActive(type)) {
            setData('permissions', []); // Kosongkan jika diklik kembali (toggle off)
        } else {
            setData('permissions', targetList); // Terapkan preset (toggle on)
        }
    };

    // Submit perubahan matrix ke backend lewat Inertia Route
    const submitPermissions = (e) => {
        e.preventDefault();
        put(route('user-management.role-permission.permissions.update', selectedRoleId), {
            preserveScroll: true,
        });
    };

    // Hapus role handler
    const handleDeleteRole = (id, name) => {
        if (confirm(`Hapus peran ${name}?`)) {
            router.delete(route('user-management.role-permission.destroy', id), {
                onSuccess: () => {
                    if (selectedRoleId === id) setSelectedRoleId(roles[0]?.id || null);
                }
            });
        }
    };

    // Duplikat role handler
    const handleDuplicateRole = (role) => {
        setSelectedRole(role);
        setShowCreateModal(true);
    };

    return (
        <>
            <Head title="Roles & Permissions" />

            <div className="min-h-screen bg-[#fbfbfe] font-inter text-[#050316] p-4 md:p-6 space-y-6">



                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Roles & Permissions
                        </h1>
                        <p className="text-sm text-[#2f27ce]/70 font-medium mt-1">
                            Kelola hak akses pengguna berdasarkan tanggung jawab kerja mereka.
                        </p>
                    </div>
                    <button
                        onClick={() => { setSelectedRole(null); setShowCreateModal(true); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150 whitespace-nowrap"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        + Buat Peran Baru
                    </button>
                </div>

                {/* MAIN GRID LAYOUT */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* PANELS LEFT: ROLES LIST */}
                    <div className="xl:col-span-4 space-y-3">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-sm font-black text-[#050316]">Daftar Peran</h2>
                            <span className="text-xs font-bold text-white bg-[#443dff] rounded-full px-2.5 py-0.5">
                                {roles.length}
                            </span>
                        </div>

                        <div className="space-y-3 xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto xl:pr-2 pb-2">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={`rounded-2xl border p-4 cursor-pointer transition-all duration-150 group ${selectedRoleId === role.id
                                            ? 'border-[#2f27ce] bg-white shadow-md shadow-[#2f27ce]/10 ring-1 ring-[#2f27ce]'
                                            : 'border-[#dddbff] bg-white hover:border-[#443dff]/50 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                            <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(role.name)} flex-shrink-0 mt-0.5`} />
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#050316] text-sm truncate">{role.name}</p>
                                                <p className="text-[11px] font-semibold text-[#2f27ce]/60 mt-0.5">
                                                    {role.users_count ?? 0} Users
                                                </p>
                                            </div>
                                        </div>

                                        {/* Don't show edit/delete triggers for default protected system roles */}
                                        {!['owner', 'admin', 'cashier'].includes(role.name.toLowerCase()) && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => { setSelectedRole(role); setShowEditModal(true); }}
                                                    className="p-1.5 text-[#2f27ce]/50 hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-lg transition-all"
                                                >
                                                    <Icon icon="solar:pen-linear" className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRole(role.id, role.name)}
                                                    className="p-1.5 text-[#ef4444]/50 hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-all"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-linear" className="text-sm" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#050316]/60 font-medium mt-2 ml-5 line-clamp-2">
                                        {role.description || 'Tidak ada deskripsi peran.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PANELS RIGHT: DETAIL & PERMISSION MATRIX */}
                    <div className="xl:col-span-8 space-y-5 xl:max-h-[calc(100vh-180px)] xl:overflow-y-auto xl:pr-2">
                        {selectedRoleId === null ? (
                            <div className="bg-white rounded-2xl border border-[#dddbff] p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#dddbff]/30 flex items-center justify-center text-[#2f27ce]/30 text-4xl mb-4">
                                    <Icon icon="solar:shield-keyhole-linear" />
                                </div>
                                <p className="font-bold text-[#050316]">Pilih peran untuk melihat detail</p>
                                <p className="text-sm text-[#2f27ce]/50 mt-1">Klik salah satu peran di sebelah kiri.</p>
                            </div>
                        ) : (
                            currentRole && (
                                <div className="space-y-5">

                                    {/* Header Detail Peran */}
                                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#dddbff]/40 flex items-center justify-center text-[#2f27ce] text-2xl">
                                                    <Icon icon="solar:shield-user-linear" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-extrabold text-[#050316]">{currentRole.name}</h2>
                                                    <p className="text-sm text-[#2f27ce]/60 font-medium mt-0.5">{currentRole.description || 'Tidak ada deskripsi peran.'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleDuplicateRole(currentRole)}
                                                    className="flex items-center gap-1.5 px-3 py-2 border border-[#dddbff] bg-white text-[#2f27ce] text-xs font-bold hover:bg-[#dddbff] rounded-xl transition-all active:scale-[0.98]"
                                                >
                                                    <Icon icon="solar:copy-linear" className="text-sm" /> Duplikat
                                                </button>
                                                {!['owner', 'admin', 'cashier'].includes(currentRole.name.toLowerCase()) && (
                                                    <button
                                                        onClick={() => { setSelectedRole(currentRole); setShowEditModal(true); }}
                                                        className="flex items-center gap-1.5 px-3 py-2 border border-[#dddbff] bg-white text-[#2f27ce] text-xs font-bold hover:bg-[#dddbff] rounded-xl transition-all active:scale-[0.98]"
                                                    >
                                                        <Icon icon="solar:pen-linear" className="text-sm" /> Edit Detail
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Preset Cepat */}
                                        <div className="mt-4 pt-4 border-t border-[#dddbff] flex items-center gap-3 flex-wrap">
                                            <p className="text-[10px] font-black text-[#2f27ce]/50 capitalize tracking-widest">Preset Cepat:</p>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset('read-only')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all active:scale-[0.98] text-xs font-bold ${
                                                    isPresetActive('read-only')
                                                        ? 'border-[#443dff] bg-[#443dff] text-white shadow-md shadow-[#443dff]/25'
                                                        : 'border-[#dddbff] bg-[#fbfbfe] text-[#050316] hover:bg-[#dddbff]/50'
                                                }`}
                                            >
                                                <Icon icon={isPresetActive('read-only') ? "solar:check-circle-linear" : "solar:lock-keyhole-linear"} className="text-sm" /> Read-Only
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset('full')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all active:scale-[0.98] text-xs font-bold ${
                                                    isPresetActive('full')
                                                        ? 'border-[#443dff] bg-[#443dff] text-white shadow-md shadow-[#443dff]/25'
                                                        : 'border-[#dddbff] bg-[#fbfbfe] text-[#050316] hover:bg-[#dddbff]/50'
                                                }`}
                                            >
                                                <Icon icon={isPresetActive('full') ? "solar:check-circle-linear" : "solar:lock-unlocked-linear"} className="text-sm" /> Full Access
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset('pos')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all active:scale-[0.98] text-xs font-bold ${
                                                    isPresetActive('pos')
                                                        ? 'border-[#443dff] bg-[#443dff] text-white shadow-md shadow-[#443dff]/25'
                                                        : 'border-[#dddbff] bg-[#fbfbfe] text-[#050316] hover:bg-[#dddbff]/50'
                                                }`}
                                            >
                                                <Icon icon={isPresetActive('pos') ? "solar:check-circle-linear" : "solar:monitor-smartphone-linear"} className="text-sm" /> POS-Only Access
                                            </button>
                                        </div>
                                    </div>

                                    {/* Permission Matrix Form */}
                                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
                                        <form onSubmit={submitPermissions}>
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[560px]">
                                                    <thead>
                                                        <tr className="border-b border-[#dddbff] bg-[#fbfbfe]/60">
                                                            <th className="px-5 py-4 text-xs font-black text-[#050316] text-left">Modul Sistem</th>
                                                            {actions.map(act => (
                                                                <th key={act} className="px-3 py-4 text-center">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <Icon icon={act === 'view' ? "solar:eye-linear" : act === 'create' ? "solar:add-circle-linear" : act === 'edit' ? "solar:pen-linear" : act === 'delete' ? "solar:trash-bin-trash-linear" : "solar:upload-square-linear"} className="text-[#2f27ce]/60 text-base" />
                                                                        <span className="text-[10px] font-black text-[#2f27ce]/60 capitalize tracking-wider">{act}</span>
                                                                    </div>
                                                                </th>
                                                            ))}
                                                            <th className="px-3 py-4 text-center">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Icon icon="solar:check-square-linear" className="text-[#2f27ce]/60 text-base" />
                                                                    <span className="text-[10px] font-black text-[#2f27ce]/60 capitalize tracking-wider">All</span>
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#dddbff]/50">
                                                        {Object.entries(modules).map(([modKey, modLabel]) => {
                                                            const rowPermissions = actions.map(a => `${modKey}.${a}`);
                                                            const isRowAllChecked = rowPermissions.every(p => data.permissions.includes(p));

                                                            return (
                                                                <tr key={modKey} className="hover:bg-[#dddbff]/10 transition-colors duration-100 group">
                                                                    <td className="px-5 py-4 text-sm font-semibold text-[#050316]">{modLabel}</td>

                                                                    {actions.map(action => {
                                                                        const permName = `${modKey}.${action}`;
                                                                        const isChecked = data.permissions.includes(permName);

                                                                        return (
                                                                            <td key={action} className="px-3 py-4 text-center">
                                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="sr-only peer"
                                                                                        checked={isChecked}
                                                                                        onChange={() => handleCheckboxChange(permName)}
                                                                                    />
                                                                                    <div className="w-10 h-6 bg-[#dddbff]/60 peer-checked:bg-[#443dff] rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
                                                                                </label>
                                                                            </td>
                                                                        );
                                                                    })}

                                                                    {/* Column ALL toggle indicator */}
                                                                    <td className="px-3 py-4 text-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleRowAll(modKey)}
                                                                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 mx-auto ${isRowAllChecked
                                                                                    ? 'border-[#443dff] bg-[#443dff] text-white'
                                                                                    : 'border-[#dddbff] text-transparent hover:border-[#443dff]'
                                                                                }`}
                                                                        >
                                                                            <Icon icon="solar:check-read-linear" className="text-xs" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="px-5 py-4 border-t border-[#dddbff] bg-[#fbfbfe]/50 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    <Icon icon="solar:diskette-linear" className="text-lg" />
                                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* History Audit Log */}
                                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Icon icon="solar:history-linear" className="text-[#2f27ce] text-lg" />
                                            <h3 className="font-extrabold text-[#050316]">Riwayat Perubahan Terakhir</h3>
                                        </div>
                                        {!logs || logs.length === 0 ? (
                                            <p className="text-sm text-[#2f27ce]/40 text-center py-4">Belum ada riwayat perubahan.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {logs.map((log) => (
                                                    <div key={log.id} className="flex items-center justify-between text-xs border-b border-[#dddbff]/50 pb-2.5 last:border-b-0 last:pb-0">
                                                        <div>
                                                            <p className="font-bold text-[#050316]">{log.action}</p>
                                                            <p className="text-[10px] text-[#2f27ce]/60 mt-0.5">Oleh: {log.user_name}</p>
                                                        </div>
                                                        <span className="text-[10px] text-[#2f27ce]/50 whitespace-nowrap font-medium">{log.created_at}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )
                        )}
                    </div>

                </div>
            </div>

            {/* Modals */}
            <CreateRoleModal
                isOpen={showCreateModal}
                onClose={() => { setShowCreateModal(false); setSelectedRole(null); }}
                duplicateRole={selectedRole}
            />
            <EditRoleModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedRole(null); }}
                role={selectedRole}
            />
        </>
    );
}

// Modal Buat Peran Baru
function CreateRoleModal({ isOpen, onClose, duplicateRole }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        permissions: []
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (duplicateRole) {
                setData({
                    name: `Copy of ${duplicateRole.name}`,
                    description: `Duplikat dari peran ${duplicateRole.name}`,
                    permissions: duplicateRole.permissions.map(p => p.name)
                });
            } else {
                setData({
                    name: '',
                    description: '',
                    permissions: []
                });
            }
        }
    }, [isOpen, duplicateRole]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user-management.role-permission.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050316]/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-[480px] max-w-full p-6 border border-[#dddbff] shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-[#dddbff]">
                    <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                        {duplicateRole ? 'Duplikat Peran Kerja' : 'Buat Peran Baru'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-[#2f27ce]/60 hover:text-[#050316] hover:bg-[#dddbff]/30 transition-colors">
                        <Icon icon="solar:close-circle-linear" className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wider mb-1.5">Nama Peran / Role</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            className="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 text-sm font-semibold text-[#050316] outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] transition-all"
                            placeholder="Contoh: Kitchen Staff, Supervisor"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-bold mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wider mb-1.5">Deskripsi Tanggung Jawab</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4 text-sm font-semibold text-[#050316] outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] transition-all resize-none"
                            placeholder="Tulis ringkasan cakupan peran ini..."
                        />
                        {errors.description && <p className="text-xs text-red-500 font-bold mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#dddbff] mt-6">
                        <button
                            type="button"
                            onClick={() => { clearErrors(); reset(); onClose(); }}
                            className="flex-1 h-11 rounded-xl border border-[#dddbff] text-sm font-bold text-[#2f27ce] hover:bg-[#dddbff]/20 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-extrabold shadow-lg shadow-[#2f27ce]/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Menyimpan...' : 'Buat Peran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Modal Edit Detail Peran
function EditRoleModal({ isOpen, onClose, role }) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (role) {
            clearErrors();
            setData({
                name: role.name || '',
                description: role.description || '',
            });
        }
    }, [role]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('user-management.role-permission.update', role.id), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen || !role) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050316]/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-[480px] max-w-full p-6 border border-[#dddbff] shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-[#dddbff]">
                    <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                        Edit Detail Peran
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-[#2f27ce]/60 hover:text-[#050316] hover:bg-[#dddbff]/30 transition-colors">
                        <Icon icon="solar:close-circle-linear" className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wider mb-1.5">Nama Peran / Role</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            className="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 text-sm font-semibold text-[#050316] outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] transition-all"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-bold mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wider mb-1.5">Deskripsi Tanggung Jawab</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4 text-sm font-semibold text-[#050316] outline-none focus:ring-2 focus:ring-[#dddbff] focus:border-[#443dff] transition-all resize-none"
                        />
                        {errors.description && <p className="text-xs text-red-500 font-bold mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#dddbff] mt-6">
                        <button
                            type="button"
                            onClick={() => { clearErrors(); reset(); onClose(); }}
                            className="flex-1 h-11 rounded-xl border border-[#dddbff] text-sm font-bold text-[#2f27ce] hover:bg-[#dddbff]/20 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-extrabold shadow-lg shadow-[#2f27ce]/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

RolePermissionIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
