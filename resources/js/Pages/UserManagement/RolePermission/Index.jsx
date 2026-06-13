import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Head from '@/Components/Head';
import client from '@/api/client';

export default function RolePermissionIndex({ roles = [], logs = [] }) {
    const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [processing, setProcessing] = useState(false);

    const currentRole = roles.find(r => r.id === selectedRoleId) || null;

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

    useEffect(() => {
        if (currentRole) {
            setPermissions(currentRole.permissions?.map(p => p.name) ?? []);
        }
    }, [selectedRoleId, roles]);

    const getDotColor = (name) => {
        const colors = {
            'owner': 'bg-brand-secondary',
            'admin': 'bg-[#3b82f6]',
            'cashier': 'bg-[#f59e0b]',
            'kitchen': 'bg-[#10b981]',
            'inventory': 'bg-[#8b5cf6]',
        };
        return colors[name.toLowerCase()] || 'bg-[#6b7280]';
    };

    const handleCheckboxChange = (permName) => {
        setPermissions(prev =>
            prev.includes(permName)
                ? prev.filter(p => p !== permName)
                : [...prev, permName]
        );
    };

    const handleToggleRowAll = (moduleKey) => {
        const rowPermissions = actions.map(act => `${moduleKey}.${act}`);
        const allChecked = rowPermissions.every(p => permissions.includes(p));
        if (allChecked) {
            setPermissions(prev => prev.filter(p => !rowPermissions.includes(p)));
        } else {
            setPermissions(prev => [...new Set([...prev, ...rowPermissions])]);
        }
    };

    const isPresetActive = (type) => {
        let targetList = [];
        if (type === 'read-only') {
            targetList = Object.keys(modules).map(m => `${m}.view`);
        } else if (type === 'full') {
            Object.keys(modules).forEach(m => actions.forEach(a => targetList.push(`${m}.${a}`)));
        } else if (type === 'pos') {
            targetList = ['pos.view', 'pos.create', 'pos.edit', 'transactions.view', 'transactions.create'];
        }
        const a = [...permissions].sort();
        const b = [...targetList].sort();
        return a.length === b.length && a.every((v, i) => v === b[i]);
    };

    const applyPreset = (type) => {
        let targetList = [];
        if (type === 'read-only') {
            targetList = Object.keys(modules).map(m => `${m}.view`);
        } else if (type === 'full') {
            Object.keys(modules).forEach(m => actions.forEach(a => targetList.push(`${m}.${a}`)));
        } else if (type === 'pos') {
            targetList = ['pos.view', 'pos.create', 'pos.edit', 'transactions.view', 'transactions.create'];
        }
        setPermissions(isPresetActive(type) ? [] : targetList);
    };

    const submitPermissions = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await client.put(`/user-management/role-permission/${selectedRoleId}/permissions`, { permissions });
            window.location.reload();
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteRole = async (id, name) => {
        if (!confirm(`Hapus peran ${name}?`)) return;
        try {
            await client.delete(`/user-management/role-permission/${id}`);
            if (selectedRoleId === id) setSelectedRoleId(roles[0]?.id || null);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDuplicateRole = (role) => {
        setSelectedRole(role);
        setShowCreateModal(true);
    };

    return (
        <>
            <Head title="Roles & Permissions" />

            <div className="min-h-screen bg-brand-bg font-inter text-brand-dark p-4 md:p-6 space-y-6">



                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Roles & Permissions
                        </h1>
                        <p className="text-sm text-brand-primary/70 font-medium mt-1">
                            Kelola hak akses pengguna berdasarkan tanggung jawab kerja mereka.
                        </p>
                    </div>
                    <button
                        onClick={() => { setSelectedRole(null); setShowCreateModal(true); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/30 transition-all active:scale-[0.97] duration-150 whitespace-nowrap"
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
                            <h2 className="text-sm font-black text-brand-dark">Daftar Peran</h2>
                            <span className="text-xs font-bold text-white bg-brand-secondary rounded-full px-2.5 py-0.5">
                                {roles.length}
                            </span>
                        </div>

                        <div className="space-y-3 xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto px-1 py-1 xl:pr-2 pb-2">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={`rounded-2xl border p-4 cursor-pointer transition-all duration-150 group ${selectedRoleId === role.id
                                        ? 'border-brand-primary bg-white shadow-md shadow-brand-primary/10 ring-1 ring-brand-primary'
                                        : 'border-brand-light bg-white hover:border-brand-secondary/50 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                            <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(role.name)} flex-shrink-0 mt-0.5`} />
                                            <div className="min-w-0">
                                                <p className="font-bold text-brand-dark text-sm truncate">{role.name}</p>
                                                <p className="text-[11px] font-bold text-brand-primary/60 mt-0.5">
                                                    {role.users_count ?? 0} Users
                                                </p>
                                            </div>
                                        </div>

                                        {/* Don't show edit/delete triggers for default protected system roles */}
                                        {!['owner', 'admin', 'cashier'].includes(role.name.toLowerCase()) && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => { setSelectedRole(role); setShowEditModal(true); }}
                                                    className="p-1.5 text-brand-primary/50 hover:text-brand-secondary hover:bg-brand-light/50 rounded-lg transition-all active:scale-[0.97]"
                                                >
                                                    <Icon icon="solar:pen-linear" className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRole(role.id, role.name)}
                                                    className="p-1.5 text-[#ef4444]/50 hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-all active:scale-[0.97]"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-linear" className="text-sm" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-brand-dark/60 font-medium mt-2 ml-5 line-clamp-2">
                                        {role.description || 'Tidak ada deskripsi peran.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PANELS RIGHT: DETAIL & PERMISSION MATRIX */}
                    <div className="xl:col-span-8 space-y-5 xl:max-h-[calc(100vh-180px)] xl:overflow-y-auto xl:pr-2">
                        {selectedRoleId === null ? (
                            <div className="bg-white rounded-2xl border border-brand-light p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-brand-light/30 flex items-center justify-center text-brand-primary/30 text-4xl mb-4">
                                    <Icon icon="solar:shield-keyhole-linear" />
                                </div>
                                <p className="font-bold text-brand-dark">Pilih peran untuk melihat detail</p>
                                <p className="text-sm text-brand-primary/50 mt-1">Klik salah satu peran di sebelah kiri.</p>
                            </div>
                        ) : (
                            currentRole && (
                                <div className="space-y-5">

                                    {/* Header Detail Peran */}
                                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-brand-light/40 flex items-center justify-center text-brand-primary text-2xl">
                                                    <Icon icon="solar:shield-user-linear" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-extrabold text-brand-dark">{currentRole.name}</h2>
                                                    <p className="text-sm text-brand-primary/60 font-medium mt-0.5">{currentRole.description || 'Tidak ada deskripsi peran.'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleDuplicateRole(currentRole)}
                                                    className="flex items-center gap-1.5 px-3 py-2 border border-brand-light bg-white text-brand-primary text-xs font-bold hover:bg-brand-light rounded-xl transition-all active:scale-[0.97]"
                                                >
                                                    <Icon icon="solar:copy-linear" className="text-sm" /> Duplikat
                                                </button>
                                                {!['owner', 'admin', 'cashier'].includes(currentRole.name.toLowerCase()) && (
                                                    <button
                                                        onClick={() => { setSelectedRole(currentRole); setShowEditModal(true); }}
                                                        className="flex items-center gap-1.5 px-3 py-2 border border-brand-light bg-white text-brand-primary text-xs font-bold hover:bg-brand-light rounded-xl transition-all active:scale-[0.97]"
                                                    >
                                                        <Icon icon="solar:pen-linear" className="text-sm" /> Edit Detail
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Preset Cepat */}
                                        <div className="mt-4 pt-4 border-t border-brand-light flex items-center gap-3 flex-wrap">
                                            <p className="text-[10px] font-black text-brand-primary/50 capitalize tracking-widest">Preset Cepat:</p>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset('read-only')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all active:scale-[0.97] text-xs font-bold ${isPresetActive('read-only') ? 'border-brand-secondary bg-brand-secondary text-white shadow-md shadow-brand-secondary/25' : 'border-brand-light bg-brand-bg text-brand-dark hover:bg-brand-light/50' }`}
                                            >
                                                <Icon icon={isPresetActive('read-only') ? "solar:check-circle-linear" : "solar:lock-keyhole-linear"} className="text-sm" /> Read-Only
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset('full')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all active:scale-[0.97] text-xs font-bold ${isPresetActive('full') ? 'border-brand-secondary bg-brand-secondary text-white shadow-md shadow-brand-secondary/25' : 'border-brand-light bg-brand-bg text-brand-dark hover:bg-brand-light/50' }`}
                                            >
                                                <Icon icon={isPresetActive('full') ? "solar:check-circle-linear" : "solar:lock-unlocked-linear"} className="text-sm" /> Full Access
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyPreset('pos')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all active:scale-[0.97] text-xs font-bold ${isPresetActive('pos') ? 'border-brand-secondary bg-brand-secondary text-white shadow-md shadow-brand-secondary/25' : 'border-brand-light bg-brand-bg text-brand-dark hover:bg-brand-light/50' }`}
                                            >
                                                <Icon icon={isPresetActive('pos') ? "solar:check-circle-linear" : "solar:monitor-smartphone-linear"} className="text-sm" /> POS-Only Access
                                            </button>
                                        </div>
                                    </div>

                                    {/* Permission Matrix Form */}
                                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                                        <form onSubmit={submitPermissions}>
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[560px]">
                                                    <thead>
                                                        <tr className="border-b border-brand-light bg-brand-bg/60">
                                                            <th className="px-5 py-4 text-xs font-black text-brand-dark text-left">Modul Sistem</th>
                                                            {actions.map(act => (
                                                                <th key={act} className="px-3 py-4 text-center">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <Icon icon={act === 'view' ? "solar:eye-linear" : act === 'create' ? "solar:add-circle-linear" : act === 'edit' ? "solar:pen-linear" : act === 'delete' ? "solar:trash-bin-trash-linear" : "solar:upload-square-linear"} className="text-brand-primary/60 text-base" />
                                                                        <span className="text-[10px] font-black text-brand-primary/60 capitalize tracking-wider">{act}</span>
                                                                    </div>
                                                                </th>
                                                            ))}
                                                            <th className="px-3 py-4 text-center">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Icon icon="solar:check-square-linear" className="text-brand-primary/60 text-base" />
                                                                    <span className="text-[10px] font-black text-brand-primary/60 capitalize tracking-wider">All</span>
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-brand-light/50">
                                                        {Object.entries(modules).map(([modKey, modLabel]) => {
                                                            const rowPermissions = actions.map(a => `${modKey}.${a}`);
                                                            const isRowAllChecked = rowPermissions.every(p => permissions.includes(p));

                                                            return (
                                                                <tr key={modKey} className="hover:bg-brand-light/10 transition-colors duration-100 group">
                                                                    <td className="px-5 py-4 text-sm font-bold text-brand-dark">{modLabel}</td>

                                                                    {actions.map(action => {
                                                                        const permName = `${modKey}.${action}`;
                                                                        const isChecked = permissions.includes(permName);

                                                                        return (
                                                                            <td key={action} className="px-3 py-4 text-center">
                                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="sr-only peer"
                                                                                        checked={isChecked}
                                                                                        onChange={() => handleCheckboxChange(permName)}
                                                                                    />
                                                                                    <div className="w-10 h-6 bg-brand-light/60 peer-checked:bg-brand-secondary rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 shadow-inner" />
                                                                                </label>
                                                                            </td>
                                                                        );
                                                                    })}

                                                                    {/* Column ALL toggle indicator */}
                                                                    <td className="px-3 py-4 text-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleRowAll(modKey)}
                                                                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 mx-auto ${isRowAllChecked ? 'border-brand-secondary bg-brand-secondary text-white' : 'border-brand-light text-transparent hover:border-brand-secondary' } active:scale-[0.97]`}
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

                                            <div className="px-5 py-4 border-t border-brand-light bg-brand-bg/50 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.97] disabled:opacity-50"
                                                >
                                                    <Icon icon="solar:diskette-linear" className="text-lg" />
                                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* History Audit Log */}
                                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Icon icon="solar:history-linear" className="text-brand-primary text-lg" />
                                            <h3 className="font-extrabold text-brand-dark">Riwayat Perubahan Terakhir</h3>
                                        </div>
                                        {!logs || logs.length === 0 ? (
                                            <p className="text-sm text-brand-primary/40 text-center py-4">Belum ada riwayat perubahan.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {logs.map((log) => (
                                                    <div key={log.id} className="flex items-center justify-between text-xs border-b border-brand-light/50 pb-2.5 last:border-b-0 last:pb-0">
                                                        <div>
                                                            <p className="font-bold text-brand-dark">{log.action}</p>
                                                            <p className="text-[10px] text-brand-primary/60 mt-0.5">Oleh: {log.user_name}</p>
                                                        </div>
                                                        <span className="text-[10px] text-brand-primary/50 whitespace-nowrap font-medium">{log.created_at}</span>
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
    const [data, setDataState] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setData = (key, value) => {
        if (typeof key === 'object') return setDataState(prev => ({ ...prev, ...key }));
        setDataState(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setDataState(duplicateRole ? {
                name: `Copy of ${duplicateRole.name}`,
                description: `Duplikat dari peran ${duplicateRole.name}`,
            } : { name: '', description: '' });
        }
    }, [isOpen, duplicateRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await client.post('/user-management/role-permission', data);
            onClose();
            window.location.reload();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-[480px] max-w-full p-6 border border-brand-light shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-brand-light">
                    <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                        {duplicateRole ? 'Duplikat Peran Kerja' : 'Buat Peran Baru'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-brand-primary/60 hover:text-brand-dark hover:bg-brand-light/30 transition-colors active:scale-[0.97]">
                        <Icon icon="solar:close-circle-linear" className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wider mb-1.5">Nama Peran / Role</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            className="w-full h-11 bg-brand-bg border border-brand-light rounded-xl px-4 text-sm font-bold text-brand-dark outline-none transition-all hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                            placeholder="Contoh: Kitchen Staff, Supervisor"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-bold mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wider mb-1.5">Deskripsi Tanggung Jawab</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full bg-brand-bg border border-brand-light rounded-xl p-4 text-sm font-bold text-brand-dark outline-none transition-all resize-none hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                            placeholder="Tulis ringkasan cakupan peran ini..."
                        />
                        {errors.description && <p className="text-xs text-red-500 font-bold mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-brand-light mt-6">
                        <button
                            type="button"
                            onClick={() => { setErrors({}); setDataState({ name: '', description: '' }); onClose(); }}
                            className="flex-1 h-11 rounded-xl border border-brand-light text-sm font-bold text-brand-primary hover:bg-brand-light/20 transition-all active:scale-[0.97]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white text-sm font-extrabold shadow-lg shadow-brand-primary/25 disabled:opacity-50 transition-all active:scale-[0.97]"
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
    const [data, setDataState] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setData = (key, value) => {
        if (typeof key === 'object') return setDataState(prev => ({ ...prev, ...key }));
        setDataState(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (role) {
            setErrors({});
            setDataState({ name: role.name || '', description: role.description || '' });
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await client.put(`/user-management/role-permission/${role.id}`, data);
            onClose();
            window.location.reload();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen || !role) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-[480px] max-w-full p-6 border border-brand-light shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-brand-light">
                    <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                        Edit Detail Peran
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-brand-primary/60 hover:text-brand-dark hover:bg-brand-light/30 transition-colors active:scale-[0.97]">
                        <Icon icon="solar:close-circle-linear" className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wider mb-1.5">Nama Peran / Role</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            className="w-full h-11 bg-brand-bg border border-brand-light rounded-xl px-4 text-sm font-bold text-brand-dark outline-none transition-all hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-bold mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wider mb-1.5">Deskripsi Tanggung Jawab</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full bg-brand-bg border border-brand-light rounded-xl p-4 text-sm font-bold text-brand-dark outline-none transition-all resize-none hover:border-brand-primary/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-light"
                        />
                        {errors.description && <p className="text-xs text-red-500 font-bold mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-brand-light mt-6">
                        <button
                            type="button"
                            onClick={() => { setErrors({}); onClose(); }}
                            className="flex-1 h-11 rounded-xl border border-brand-light text-sm font-bold text-brand-primary hover:bg-brand-light/20 transition-all active:scale-[0.97]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white text-sm font-extrabold shadow-lg shadow-brand-primary/25 disabled:opacity-50 transition-all active:scale-[0.97]"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


