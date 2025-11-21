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

    // Ambil data dari LocalStorage atau gunakan default
    let activities = JSON.parse(localStorage.getItem('capullet_activities')) || defaultActivities;

    // --- 3. RENDER FUNCTIONS ---
    
    function renderActivities(query = '') {
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

        filtered.forEach(act => {
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
    }

    // --- 4. FORM HANDLING ---

    function showForm(isEdit = false) {
        viewList.classList.add('hidden');
        viewForm.classList.remove('hidden');
        window.scrollTo(0, 0); // Scroll ke atas
        
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
    btnSave.addEventListener('click', () => {
        // Validasi Sederhana
        if (!inpTitle.value.trim() || !inpDesc.value.trim()) {
            Swal.fire('Error', 'Judul dan Deskripsi wajib diisi!', 'error');
            return;
        }

        const isEdit = inpId.value !== '';
        const activityData = {
            id: isEdit ? parseInt(inpId.value) : Date.now(),
            title: inpTitle.value,
            description: inpDesc.value,
            // Gunakan gambar baru jika ada, jika tidak gunakan gambar lama (saat edit) atau placeholder
            image: currentImageBase64 || (isEdit ? imgPreview.src : 'images/placeholder-image.jpg')
        };

        if (isEdit) {
            // Update existing
            const index = activities.findIndex(a => a.id === activityData.id);
            if (index !== -1) activities[index] = activityData;
        } else {
            // Create new
            activities.push(activityData);
        }

        // Simpan ke LocalStorage
        localStorage.setItem('capullet_activities', JSON.stringify(activities));

        // Feedback User
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: isEdit ? 'Kegiatan diperbarui.' : 'Kegiatan ditambahkan.',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            hideForm();
            renderActivities();
        });
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
                activities = activities.filter(a => a.id !== id);
                localStorage.setItem('capullet_activities', JSON.stringify(activities));
                renderActivities();
                Swal.fire('Terhapus!', 'Kegiatan berhasil dihapus.', 'success');
            }
        });
    };

    // --- 6. EVENT LISTENERS ---
    
    // Search Real-time
    searchInput.addEventListener('input', (e) => {
        renderActivities(e.target.value);
    });

    // Tombol Tambah & Batal
    btnShowAdd.addEventListener('click', () => showForm(false));
    btnCancel.addEventListener('click', hideForm);

    // --- 7. INITIALIZE ---
    renderActivities();
});