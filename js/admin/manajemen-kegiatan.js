/* --- START OF FILE js/admin/manajemen-kegiatan.js --- */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM ELEMENTS ---
    const viewList = document.getElementById('activity-list-view');
    const viewForm = document.getElementById('activity-form-view');
    const gridContainer = document.getElementById('activityGridContainer');
    const searchInput = document.getElementById('searchInput');
    
    // Buttons
    const btnShowAdd = document.getElementById('btnShowAddForm');
    const btnCancel = document.getElementById('btnCancelForm');
    const btnSave = document.getElementById('btnSaveActivity');
    
    // Inputs
    const inpId = document.getElementById('activityId');
    const inpTitle = document.getElementById('activityTitle');
    const inpDesc = document.getElementById('activityDesc');
    const imgInput = document.getElementById('activityImageInput');
    const imgPreview = document.getElementById('previewImage');

    let currentImageBase64 = '';

    // --- 2. DATA INITIALIZATION ---
    const defaultActivities = [
        {
            id: 171001,
            title: "Kita Indonesia Pasar Seni Tradisional",
            description: "Capullet turut berpartisipasi dalam acara Kita Indonesia Pasar Seni Tradisional yang diselenggarakan oleh RBI Samarinda di Halaman GOR Segiri, memberikan kesempatan bagi pengunjung untuk menikmati berbagai produk unggulan kami.",
            image: "images/kita-indonesia-pasar-seni-tradisional.jpg"
        },
        {
            id: 171002,
            title: "Pojok UMKM",
            description: "Setiap akhir pekan, Capullet hadir di Lobby Hotel Puri Senyiur dalam acara Pojok UMKM. Ini adalah kesempatan emas untuk menemukan dan membeli produk-produk spesial kami langsung di lokasi dengan suasana yang nyaman.",
            image: "images/pojok-umkm.jpg"
        }
    ];

    // Data dari database
    let activities = [];

    async function loadActivities() {
        gridContainer.innerHTML = '<p style="text-align:center; color:#888; padding:2rem; width:100%;">Memuat data...</p>';
        try {
            const res = await fetch('api/kegiatan/get-all.php', { cache: 'no-store' });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal memuat kegiatan');
            activities = (result.data || []).map(r => ({
                id: parseInt(r.id_kegiatan),
                title: r.judul,
                description: r.deskripsi || '',
                image: r.gambar || 'images/placeholder-image.jpg',
                lokasi: r.lokasi || '',
                tanggal_kegiatan: r.tanggal_kegiatan,
                is_aktif: r.is_aktif == 1
            }));
            renderActivities(searchInput.value.trim());
        } catch (e) {
            console.error(e);
            gridContainer.innerHTML = '<p style="text-align:center; color:#c00; padding:2rem; width:100%;">Error memuat data kegiatan</p>';
        }
    }

    let currentPage = 1;
    const itemsPerPage = 3;

    // --- 3. RENDER FUNCTIONS ---
    
    function renderActivities(query = '', page = 1) {
        gridContainer.innerHTML = '';

        // Filter berdasarkan pencarian (Judul atau Deskripsi)
        const filtered = activities.filter(act => 
            act.title.toLowerCase().includes(query.toLowerCase()) || 
            act.description.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            gridContainer.innerHTML = '<p style="text-align:center; color:#888; padding:2rem; width:100%;">Tidak ada kegiatan ditemukan.</p>';
            return;
        }

        // Pagination logic
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        page = Math.max(1, Math.min(page, totalPages));
        currentPage = page;
        
        const startIdx = (page - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const pageItems = filtered.slice(startIdx, endIdx);

        // Render items
        pageItems.forEach(act => {
            const card = document.createElement('article');
            card.className = 'activity-admin-card';
            card.innerHTML = `
                <img src="${act.image}" alt="${act.title}" onerror="this.src='images/placeholder-image.jpg'">
                <div class="activity-admin-card-content">
                    <h3>${act.title}</h3>
                    <p>${act.description}</p>
                    <div class="activity-actions">
                        <button class="btn-edit" onclick="window.editActivity(${act.id})">
                            <i class="fas fa-pen"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="window.deleteActivity(${act.id})">
                            <i class="fas fa-trash-alt"></i> Hapus
                        </button>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        // Render pagination
        if (totalPages > 1) {
            // Remove existing pagination container if it exists
            const existingPagination = document.getElementById('pagination-container');
            if (existingPagination) {
                existingPagination.remove();
            }
            
            const paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-container';
            
            let paginationHTML = '<div class="pagination">';
            
            // Previous button
            if (page > 1) {
                paginationHTML += `<button class="page-btn" onclick="window.goToPage(${page - 1})"><i class="fas fa-chevron-left"></i></button>`;
            }

            // Page numbers
            const startPage = Math.max(1, page - 1);
            const endPage = Math.min(totalPages, page + 1);
            
            if (startPage > 1) {
                paginationHTML += '<span class="page-dots">...</span>';
            }

            for (let i = startPage; i <= endPage; i++) {
                if (i === page) {
                    paginationHTML += `<span class="page-btn active">${i}</span>`;
                } else {
                    paginationHTML += `<button class="page-btn" onclick="window.goToPage(${i})">${i}</button>`;
                }
            }

            if (endPage < totalPages) {
                paginationHTML += '<span class="page-dots">...</span>';
            }

            // Next button
            if (page < totalPages) {
                paginationHTML += `<button class="page-btn" onclick="window.goToPage(${page + 1})"><i class="fas fa-chevron-right"></i></button>`;
            }

            paginationHTML += '</div>';
            paginationContainer.innerHTML = paginationHTML;
            gridContainer.parentNode.insertBefore(paginationContainer, gridContainer.nextSibling);
        } else {
            // Remove pagination if only 1 page
            const existingPagination = document.getElementById('pagination-container');
            if (existingPagination) {
                existingPagination.remove();
            }
        }
    }

    // --- 4. FORM HANDLING ---

    function showForm(isEdit = false) {
        viewList.classList.add('hidden');
        viewForm.classList.remove('hidden');
        // Scroll form into view smoothly instead of jumping to top
        viewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (!isEdit) {
            resetForm();
        }
    }

    function hideForm() {
        viewForm.classList.add('hidden');
        viewList.classList.remove('hidden');
        resetForm();
    }

    function resetForm() {
        inpId.value = '';
        inpTitle.value = '';
        inpDesc.value = '';
        imgInput.value = '';
        imgPreview.src = 'images/placeholder-image.jpg';
        currentImageBase64 = '';
    }

    // Image Preview Logic
    imgInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                currentImageBase64 = e.target.result; // Simpan string base64
            }
            reader.readAsDataURL(file);
        }
    });

    // --- 5. CRUD ACTIONS ---

    // SAVE (Create / Update)
    btnSave.addEventListener('click', async () => {
        // Validasi Sederhana
        if (!inpTitle.value.trim() || !inpDesc.value.trim()) {
            Swal.fire('Error', 'Judul dan Deskripsi wajib diisi!', 'error');
            return;
        }

        const isEdit = inpId.value !== '';
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        try {
            const endpoint = isEdit ? 'api/kegiatan/update.php' : 'api/kegiatan/create.php';
            const payload = {
                id_kegiatan: isEdit ? parseInt(inpId.value) : undefined,
                judul: inpTitle.value.trim(),
                deskripsi: inpDesc.value.trim(),
                lokasi: '',
                tanggal_kegiatan: null,
                gambar: null,
                gambar_base64: currentImageBase64 || null
            };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal menyimpan kegiatan');
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: isEdit ? 'Kegiatan diperbarui.' : 'Kegiatan ditambahkan.',
                timer: 1400,
                showConfirmButton: false
            }).then(async () => {
                hideForm();
                await loadActivities();
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.innerHTML = '<i class=\"fas fa-save\"></i> Simpan';
        }
    });

    // EDIT (Global Function)
    window.editActivity = (id) => {
        const activity = activities.find(a => a.id === id);
        if (!activity) return;

        // Isi form dengan data lama
        inpId.value = activity.id;
        inpTitle.value = activity.title;
        inpDesc.value = activity.description;
        
        if (activity.image) {
            imgPreview.src = activity.image;
            // Kita tidak set currentImageBase64 di sini agar jika user tidak ganti gambar,
            // logika save tetap menggunakan src dari preview
        }

        showForm(true); // Mode Edit
    };

    // DELETE (Global Function)
    window.deleteActivity = (id) => {
        Swal.fire({
            title: 'Hapus Kegiatan?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                (async () => {
                    try {
                        const res = await fetch('api/kegiatan/delete.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id_kegiatan: id })
                        });
                        const result = await res.json();
                        if (!result.success) throw new Error(result.message || 'Gagal menghapus');
                        Swal.fire('Terhapus!', 'Kegiatan berhasil dihapus.', 'success');
                        await loadActivities();
                    } catch (err) {
                        console.error(err);
                        Swal.fire('Error', err.message, 'error');
                    }
                })();
            }
        });
    };

    // --- 6. EVENT LISTENERS ---
    
    // Search Real-time
    searchInput.addEventListener('input', (e) => {
        currentPage = 1; // Reset to page 1 when searching
        renderActivities(e.target.value, currentPage);
    });

    // Tombol Tambah & Batal
    btnShowAdd.addEventListener('click', () => showForm(false));
    btnCancel.addEventListener('click', hideForm);

    // --- 7. GLOBAL FUNCTIONS FOR PAGINATION ---
    window.goToPage = function(page) {
        renderActivities(searchInput.value, page);
    }

    // --- 8. INITIALIZE ---
    loadActivities();
});