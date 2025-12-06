document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const viewList = document.getElementById('faq-list-view');
    const viewForm = document.getElementById('faq-form-view');
    const tableBody = document.getElementById('faqTableBody');
    const searchInput = document.getElementById('searchInput');
    const formTitle = document.getElementById('formTitle');
    const btnShowAdd = document.getElementById('btnShowAddForm');
    const btnCancel = document.getElementById('btnCancelForm');
    const btnSave = document.getElementById('btnSaveFaq');
    const inpId = document.getElementById('faqId');
    const inpQuestion = document.getElementById('faqQuestion');
    const inpAnswer = document.getElementById('faqAnswer');

    let faqs = []; // akan diisi dari database

    async function loadFaqs() {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#888;">Memuat data...</td></tr>';
        try {
            const res = await fetch('api/faq/get-all.php', { cache: 'no-store' });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal memuat data');
            faqs = (result.data || []).map(r => ({
                id_faq: parseInt(r.id_faq),
                pertanyaan: r.pertanyaan,
                jawaban: r.jawaban,
                urutan: parseInt(r.urutan || 0),
                is_aktif: r.is_aktif == 1
            }));
            renderTable();
        } catch (e) {
            console.error(e);
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#c00;">Error memuat data FAQ</td></tr>';
        }
    }

    function renderTable(query = '') {
        tableBody.innerHTML = '';
        const filtered = faqs.filter(item => {
            const q = query.toLowerCase();
            return item.pertanyaan.toLowerCase().includes(q) || item.jawaban.toLowerCase().includes(q);
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#888;">Tidak ada data FAQ ditemukan.</td></tr>';
            return;
        }

        filtered.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(item.pertanyaan)}</strong></td>
                <td><div class="truncate-text">${escapeHtml(item.jawaban)}</div></td>
                <td class="action-buttons" style="text-align:right;">
                    <button class="btn-edit" onclick="window.editFaq(${item.id_faq})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn-delete" onclick="window.deleteFaq(${item.id_faq})" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showForm(isEdit = false) {
        viewList.classList.add('hidden');
        viewForm.classList.remove('hidden');
        // Scroll form into view smoothly instead of jumping to top
        viewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        formTitle.textContent = isEdit ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru';
        if (!isEdit) resetForm();
    }
    async function hideForm() {
        viewForm.classList.add('hidden');
        viewList.classList.remove('hidden');
        resetForm();
        await loadFaqs(); // Reload data when returning to list
    }
    function resetForm() {
        inpId.value = '';
        inpQuestion.value = '';
        inpAnswer.value = '';
    }

    btnSave.addEventListener('click', async () => {
        const pertanyaan = inpQuestion.value.trim();
        const jawaban = inpAnswer.value.trim();
        if (!pertanyaan || !jawaban) {
            Swal.fire('Error', 'Pertanyaan dan Jawaban wajib diisi!', 'error');
            return;
        }
        const isEdit = inpId.value !== '';
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        try {
            let endpoint, payload;
            if (isEdit) {
                endpoint = 'api/faq/update.php';
                payload = { id_faq: parseInt(inpId.value), pertanyaan, jawaban, urutan: 0, is_aktif: 1 };
            } else {
                endpoint = 'api/faq/create.php';
                payload = { pertanyaan, jawaban, urutan: faqs.length }; // append at end
            }
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal menyimpan');
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: isEdit ? 'FAQ berhasil diperbarui.' : 'FAQ berhasil ditambahkan.',
                timer: 1400,
                showConfirmButton: false
            }).then(async () => {
                hideForm();
                await loadFaqs();
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.innerHTML = '<i class="fas fa-save"></i> Simpan';
        }
    });

    window.editFaq = (id) => {
        const item = faqs.find(f => f.id_faq === id);
        if (!item) return;
        inpId.value = item.id_faq;
        inpQuestion.value = item.pertanyaan;
        inpAnswer.value = item.jawaban;
        showForm(true);
    };

    window.deleteFaq = (id) => {
        Swal.fire({
            title: 'Hapus Pertanyaan?',
            text: 'Data tidak bisa dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#66b5ff',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch('api/faq/delete.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id_faq: id })
                    });
                    const r = await res.json();
                    if (!r.success) throw new Error(r.message || 'Gagal menghapus');
                    Swal.fire('Terhapus!', 'FAQ berhasil dihapus.', 'success');
                    await loadFaqs();
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error', err.message, 'error');
                }
            }
        });
    };

    searchInput.addEventListener('input', e => renderTable(e.target.value));
    btnShowAdd.addEventListener('click', () => showForm(false));
    btnCancel.addEventListener('click', hideForm);

    loadFaqs();
});