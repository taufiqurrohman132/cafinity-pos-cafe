<script>
    const modalCreate = document.getElementById('modal-tambah-resep');
    document.getElementById('btn-buka-modal-create').addEventListener('click', () => modalCreate.showModal());
    document.getElementById('btn-tutup-modal-create').addEventListener('click', () => modalCreate.close());
    document.getElementById('btn-batal-modal-create').addEventListener('click', () => modalCreate.close());
    modalCreate.addEventListener('click', (e) => { if (e.target === modalCreate) modalCreate.close(); });

    const createWrapper = document.getElementById('create-ingredients-wrapper');
    let createRowIndex = 1;

    function buildCreateOptions() {
        return inventories.map(inv =>
            `<option value="${inv.id}" data-unit="${inv.unit}">
            ${inv.name} (Rp ${inv.price.toLocaleString('id-ID')}/${inv.unit})
        </option>`
        ).join('');
    }

    function makeCreateRow(index) {
        return `
        <div class="ingredient-row grid grid-cols-12 gap-3 items-center">
            <div class="col-span-5">
                <select name="ingredients[${index}][inventory_id]" required
                    class="inv-select-create w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                    <option value="" disabled selected>-- Pilih bahan --</option>
                    ${buildCreateOptions()}
                </select>
            </div>
            <div class="col-span-3">
                <input type="number" name="ingredients[${index}][qty]"
                    min="0.01" step="0.01" placeholder="Qty" required
                    class="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
            </div>
            <div class="col-span-3">
                <input type="text" name="ingredients[${index}][unit]"
                    placeholder="Satuan (g, ml...)" required
                    class="unit-input-create w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
            </div>
            <div class="col-span-1 flex justify-center">
                <button type="button"
                    class="btn-hapus-create w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center">
                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                </button>
            </div>
        </div>`;
    }

    document.getElementById('btn-tambah-bahan-create').addEventListener('click', () => {
        createWrapper.insertAdjacentHTML('beforeend', makeCreateRow(createRowIndex++));
    });

    createWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-hapus-create');
        if (btn) {
            const rows = createWrapper.querySelectorAll('.ingredient-row');
            if (rows.length > 1) btn.closest('.ingredient-row').remove();
        }
    });

    createWrapper.addEventListener('change', (e) => {
        if (e.target.classList.contains('inv-select-create')) {
            const row = e.target.closest('.ingredient-row');
            const unitInput = row.querySelector('.unit-input-create');
            const selected = e.target.options[e.target.selectedIndex];
            if (unitInput && selected.dataset.unit) unitInput.value = selected.dataset.unit;
        }
    });

    modalCreate.addEventListener('close', () => {
        createRowIndex = 1;
        const rows = createWrapper.querySelectorAll('.ingredient-row');
        rows.forEach((row, i) => { if (i > 0) row.remove(); });
        createWrapper.querySelector('select').value = '';
        createWrapper.querySelector('input[type="number"]').value = '';
        createWrapper.querySelector('input[type="text"]').value = '';
    });
</script>