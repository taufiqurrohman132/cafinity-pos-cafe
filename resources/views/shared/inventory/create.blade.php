@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
    <div class="max-w-2xl mx-auto space-y-6">

        {{-- HEADER --}}
        <div class="flex items-center gap-4">
            <a href="{{ route('inventories.index') }}"
                class="w-9 h-9 rounded-xl border border-[#dddbff] bg-white flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition">
                <iconify-icon icon="mdi:arrow-left"></iconify-icon>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-[#050316]">Tambah Bahan Baku</h1>
                <p class="text-gray-500 text-sm mt-0.5">Isi detail bahan baku baru</p>
            </div>
        </div>

        {{-- FORM --}}
        <form method="POST" action="{{ route('inventories.store') }}">
            @csrf
            @include('shared.inventory._form')

            <div class="flex items-center justify-end gap-3 mt-6">
                <a href="{{ route('inventories.index') }}"
                    class="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                    Batal
                </a>
                <button type="submit"
                    class="px-6 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm">
                    Simpan Bahan
                </button>
            </div>
        </form>

    </div>
</div>
@endsection