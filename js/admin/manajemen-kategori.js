document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.data-table tbody');
    const searchInput = document.querySelector('.search-bar input');
    const btnAdd = document.querySelector('.btn-add');

    let categories = [];

    // Load categories from database
    async function loadCategories() {
        try {
            const response = await fetch('api/get-categories.php');
            const result = await response.json();
            if (result.success) {
                categories = result.categories.map(cat => ({
                    id: cat.id_kategori,
                    name: cat.nama_kategori
                }));
                renderTable();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

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

    async function saveCategory(categoryName) {
        try {
            const response = await fetch('api/kategori/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama_kategori: categoryName })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving category:', error);
            return { success: false, message: 'Terjadi kesalahan' };
        }
    }

    async function updateCategory(id, categoryName) {
        try {
            const response = await fetch('api/kategori/update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_kategori: id, nama_kategori: categoryName })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating category:', error);
            return { success: false, message: 'Terjadi kesalahan' };
        }
    }

    async function deleteCategory(id) {
        try {
            const response = await fetch('api/kategori/delete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_kategori: id })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, message: 'Terjadi kesalahan' };
        }
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
            const result = await saveCategory(categoryName);
            if (result.success) {
                await loadCategories();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Kategori berhasil ditambahkan.',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', result.message, 'error');
            }
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
                    const result = await updateCategory(id, newName);
                    if (result.success) {
                        await loadCategories();
                        Swal.fire({
                            icon: 'success',
                            title: 'Tersimpan!',
                            text: 'Data berhasil diperbarui',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire('Error', result.message, 'error');
                    }
                }
            });
        });

        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'));
                
                Swal.fire({
                    title: 'Hapus Kategori?',
                    text: "Data yang dihapus tidak bisa dikembalikan!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, Hapus!',
                    cancelButtonText: 'Batal',
                    reverseButtons: true
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const deleteResult = await deleteCategory(id);
                        if (deleteResult.success) {
                            await loadCategories();
                            Swal.fire({
                                icon: 'success',
                                title: 'Terhapus!',
                                text: 'Kategori telah dihapus.',
                                timer: 1500,
                                showConfirmButton: false
                            });
                        } else {
                            Swal.fire('Error', deleteResult.message, 'error');
                        }
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

    loadCategories();
});