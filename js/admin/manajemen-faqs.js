document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const viewList = document.getElementById('faq-list-view');
    const viewForm = document.getElementById('faq-form-view');
    const tableBody = document.getElementById('faqTableBody');
    const searchInput = document.getElementById('searchInput');
    const formTitle = document.getElementById('formTitle');

    // Buttons
    const btnShowAdd = document.getElementById('btnShowAddForm');
    const btnCancel = document.getElementById('btnCancelForm');
    const btnSave = document.getElementById('btnSaveFaq');

    // Inputs
    const inpId = document.getElementById('faqId');
    const inpQuestion = document.getElementById('faqQuestion');
    const inpAnswer = document.getElementById('faqAnswer');

    // --- DATA INITIALIZATION ---
    const defaultFaqs = [
        {
            id: 1,
            question: "Di mana saja produk Capullet bisa dibeli?",
            answer: "Produk kami tersedia di beberapa tempat, seperti Gerai Panglima Roti, Wisata Buah Antasari, Muara Kafe, Brownies Amanda Kalimantan Selatan, dan Farmer Market Mall SCP. Setiap Sabtu dan Minggu, Anda juga bisa menemukan kami di event Weekend UMKM."
        },
        {
            id: 2,
            question: "Apakah bisa pesan langsung dari rumah?",
            answer: "Bisa banget! Tapi untuk pengambilan langsung ke rumah, harus janjian dulu ya supaya kami bisa menyiapkan pesanan Anda dengan baik."
        },
        {
            id: 3,
            question: "Metode pembayaran apa saja yang tersedia?",
            answer: "Anda bisa bayar dengan QRIS, transfer bank, atau cash saat pengambilan pesanan."
        },
        {
            id: 4,
            question: "Apakah produk Capullet halal?",
            answer: "Semua bahan yang kami gunakan halal dan aman dikonsumsi, serta diproses secara higienis di dapur produksi kami."
        }
    ];

    // Ambil data dari LocalStorage
    let faqs = JSON.parse(localStorage.getItem('capullet_faqs')) || defaultFaqs;

    // --- 1. RENDER TABLE ---
    function renderTable(query = '') {
        tableBody.innerHTML = '';

        // Filter berdasarkan pencarian
        const filtered = faqs.filter(item => 
            item.question.toLowerCase().includes(query.toLowerCase()) || 
            item.answer.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2rem; color:#888;">Tidak ada data FAQ ditemukan.</td></tr>`;
            return;
        }

        filtered.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${item.question}</strong></td>
                <td><div class="truncate-text">${item.answer}</div></td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="window.editFaq(${item.id})"><i class="fas fa-pen"></i></button>
                    <button class="btn-delete" onclick="window.deleteFaq(${item.id})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- 2. FORM HANDLING ---
    function showForm(isEdit = false) {
        viewList.classList.add('hidden');
        viewForm.classList.remove('hidden');
        window.scrollTo(0, 0);

        if (!isEdit) {
            resetForm();
            formTitle.textContent = "Tambah Pertanyaan Baru";
        } else {
            formTitle.textContent = "Edit Pertanyaan";
        }
    }

    function hideForm() {
        viewForm.classList.add('hidden');
        viewList.classList.remove('hidden');
        resetForm();
    }

    function resetForm() {
        inpId.value = '';
        inpQuestion.value = '';
        inpAnswer.value = '';
    }

    // --- 3. CRUD ACTIONS ---

    // SAVE (Add / Update)
    btnSave.addEventListener('click', () => {
        const question = inpQuestion.value.trim();
        const answer = inpAnswer.value.trim();

        if (!question || !answer) {
            Swal.fire('Error', 'Pertanyaan dan Jawaban wajib diisi!', 'error');
            return;
        }

        const isEdit = inpId.value !== '';
        
        if (isEdit) {
            // Update Data
            const id = parseInt(inpId.value);
            const index = faqs.findIndex(f => f.id === id);
            if (index !== -1) {
                faqs[index].question = question;
                faqs[index].answer = answer;
            }
        } else {
            // Add New Data
            const newFaq = {
                id: Date.now(),
                question: question,
                answer: answer
            };
            faqs.push(newFaq);
        }

        // Simpan & Refresh
        localStorage.setItem('capullet_faqs', JSON.stringify(faqs));
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: isEdit ? 'FAQ berhasil diperbarui.' : 'FAQ berhasil ditambahkan.',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            hideForm();
            renderTable();
        });
    });

    // EDIT (Global Function)
    window.editFaq = (id) => {
        const item = faqs.find(f => f.id === id);
        if (!item) return;

        inpId.value = item.id;
        inpQuestion.value = item.question;
        inpAnswer.value = item.answer;

        showForm(true);
    };

    // DELETE (Global Function)
    window.deleteFaq = (id) => {
        Swal.fire({
            title: 'Hapus Pertanyaan?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                faqs = faqs.filter(f => f.id !== id);
                localStorage.setItem('capullet_faqs', JSON.stringify(faqs));
                renderTable();
                Swal.fire('Terhapus!', 'FAQ berhasil dihapus.', 'success');
            }
        });
    };

    // SEARCH
    searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value);
    });

    // BUTTON LISTENERS
    btnShowAdd.addEventListener('click', () => showForm(false));
    btnCancel.addEventListener('click', hideForm);

    // INIT
    renderTable();
});