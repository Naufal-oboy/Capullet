document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.data-table tbody');
    const searchInput = document.querySelector('.search-bar input');
    const btnAdd = document.querySelector('.btn-add');

    const defaultCategories = [
        { id: 1, name: 'Keripik' },
        { id: 2, name: 'Risol' },
        { id: 3, name: 'Minuman' }
    ];

    let categories = JSON.parse(localStorage.getItem('capullet_categories')) || defaultCategories;

    function renderTable(data = categories) {
        tableBody.innerHTML = ''; 

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 2rem; color: #888;">Tidak ada data kategori.</td></tr>`;
            return;
        }

        data.forEach((cat, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${cat.name}</td>
                <td class="action-buttons">
                    <button class="btn-edit" data-id="${cat.id}" title="Edit">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-delete" data-id="${cat.id}" title="Hapus">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        attachActionListeners();
    }

    function saveToLocalStorage() {
        localStorage.setItem('capullet_categories', JSON.stringify(categories));
        renderTable();
    }

    btnAdd.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const { value: categoryName } = await Swal.fire({
            title: 'Tambah Kategori',
            text: 'Masukkan nama kategori baru',
            input: 'text',
            inputPlaceholder: 'Contoh: Frozen Food',
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            inputValidator: (value) => {
                if (!value) return 'Nama kategori tidak boleh kosong!';
            }
        });

        if (categoryName) {
            const newId = Date.now();
            categories.push({ id: newId, name: categoryName });
            saveToLocalStorage();
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Kategori berhasil ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });

    function attachActionListeners() {
        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const category = categories.find(c => c.id === id);
                if (!category) return;

                const { value: newName } = await Swal.fire({
                    title: 'Edit Kategori',
                    input: 'text',
                    inputValue: category.name,
                    showCancelButton: true,
                    confirmButtonText: 'Update',
                    cancelButtonText: 'Batal',
                    inputValidator: (value) => {
                        if (!value) return 'Nama tidak boleh kosong!';
                    }
                });

                if (newName) {
                    category.name = newName;
                    saveToLocalStorage();
                    Swal.fire({
                        icon: 'success',
                        title: 'Tersimpan!',
                        text: 'Data berhasil diperbarui',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });

        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                
                Swal.fire({
                    title: 'Hapus Kategori?',
                    text: "Data yang dihapus tidak bisa dikembalikan!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, Hapus!',
                    cancelButtonText: 'Batal',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        categories = categories.filter(c => c.id !== id);
                        saveToLocalStorage();
                        Swal.fire({
                            icon: 'success',
                            title: 'Terhapus!',
                            text: 'Kategori telah dihapus.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredCategories = categories.filter(cat => 
            cat.name.toLowerCase().includes(keyword)
        );
        renderTable(filteredCategories);
    });

    renderTable();
});