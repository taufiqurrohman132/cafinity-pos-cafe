import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import InventoryForm from '@/Components/Inventories/InventoryForm';

export default function InventoriesCreate({ suppliers, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        unit: '',
        stock: 0,
        min_stock: 0,
        price_per_unit: 0,
        supplier_id: '',
        inventory_category_id: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('inventories.store'));
    }

    return (
        <>
            <Head title="Tambah Bahan Baku" />
            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href={route('inventories.index')}
                            className="w-9 h-9 rounded-xl border border-[#dddbff] bg-white flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition">
                            <iconify-icon icon="mdi:arrow-left"></iconify-icon>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-[#050316]">Tambah Bahan Baku</h1>
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
                            <Link href={route('inventories.index')}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                                Batal
                            </Link>
                            <button type="submit" disabled={processing}
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm disabled:opacity-60">
                                {processing ? 'Menyimpan...' : 'Simpan Bahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

InventoriesCreate.layout = (page) => <AppLayout>{page}</AppLayout>;