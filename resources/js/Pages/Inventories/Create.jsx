import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '@/Components/Head';
import AppLayout from '@/Layouts/AppLayout';
import InventoryForm from '@/Components/Inventories/InventoryForm';
import client from '@/api/client';

export default function InventoriesCreate() {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [data, setDataState] = useState({
        name: '',
        unit: '',
        stock: 0,
        min_stock: 0,
        price_per_unit: 0,
        supplier_id: '',
        inventory_category_id: '',
    });

    const setData = (key, value) => {
        if (typeof key === 'object') {
            setDataState(prev => ({ ...prev, ...key }));
        } else {
            setDataState(prev => ({ ...prev, [key]: value }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await client.get('/inventories/create');
                setSuppliers(res.data.suppliers || []);
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Gagal mengambil data form:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await client.post('/inventories', data);
            navigate('/inventories');
        } catch (err) {
            console.error("Gagal menyimpan bahan baku:", err);
            if (err.response && err.response.status === 422) {
                const validationErrors = {};
                Object.entries(err.response.data.errors || {}).forEach(([key, messages]) => {
                    validationErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(validationErrors);
            } else {
                alert("Terjadi kesalahan saat menyimpan bahan baku.");
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <Head title="Tambah Bahan Baku" />
                <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-brand-primary">Memuat Form...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Tambah Bahan Baku" />
            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link to="/inventories"
                            className="w-9 h-9 rounded-xl border border-brand-light bg-white flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition">
                            <iconify-icon icon="mdi:arrow-left"></iconify-icon>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-dark">Tambah Bahan Baku</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Isi detail bahan baku baru</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InventoryForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            suppliers={suppliers}
                            categories={categories}
                        />
                        <div className="flex items-center justify-end gap-3">
                            <Link to="/inventories"
                                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition">
                                Batal
                            </Link>
                            <button type="submit" disabled={processing}
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition shadow-sm disabled:opacity-60">
                                {processing ? 'Menyimpan...' : 'Simpan Bahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}