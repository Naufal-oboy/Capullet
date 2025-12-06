// Preview image before upload
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Add event listeners for image previews
document.getElementById('logo-upload')?.addEventListener('change', function() {
    previewImage(this, 'current-logo');
});

document.getElementById('hero-image-upload')?.addEventListener('change', function() {
    previewImage(this, 'current-hero');
});

document.getElementById('about-image-upload')?.addEventListener('change', function() {
    previewImage(this, 'current-about');
});

// Update Logo
async function updateLogo() {
    const fileInput = document.getElementById('logo-upload');
    const formData = new FormData();
    
    if (fileInput.files[0]) {
        formData.append('logo', fileInput.files[0]);
    }
    
    try {
        const response = await fetch('api/settings/update-logo.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Logo berhasil diperbarui',
                timer: 1500
            }).then(() => {
                location.reload();
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.message || 'Gagal memperbarui logo'
        });
    }
}

// Update Hero Slider
async function updateHeroSlider() {
    const fileInput = document.getElementById('hero-image-upload');
    const formData = new FormData();
    
    if (fileInput.files[0]) {
        formData.append('hero_image', fileInput.files[0]);
    }
    
    formData.append('hero_subtitle', document.getElementById('hero-subtitle').value);
    formData.append('hero_title', document.getElementById('hero-title').value);
    formData.append('hero_button_text', document.getElementById('hero-button-text').value);
    
    try {
        const response = await fetch('api/settings/update-hero.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Hero slider berhasil diperbarui',
                timer: 1500
            }).then(() => {
                location.reload();
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.message || 'Gagal memperbarui hero slider'
        });
    }
}

// Update About Section
async function updateAboutSection() {
    const fileInput = document.getElementById('about-image-upload');
    const formData = new FormData();
    
    if (fileInput.files[0]) {
        formData.append('about_image', fileInput.files[0]);
    }
    
    formData.append('about_tag', document.getElementById('about-tag').value);
    formData.append('about_title', document.getElementById('about-title').value);
    formData.append('about_description', document.getElementById('about-description').value);
    
    try {
        const response = await fetch('api/settings/update-about.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'About section berhasil diperbarui',
                timer: 1500
            }).then(() => {
                location.reload();
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.message || 'Gagal memperbarui about section'
        });
    }
}

// Update Stats
async function updateStats() {
    const data = {
        stat_products: document.getElementById('stat-products').value,
        stat_customers: document.getElementById('stat-customers').value,
        stat_experience: document.getElementById('stat-experience').value
    };
    
    try {
        const response = await fetch('api/settings/update-stats.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Statistik berhasil diperbarui',
                timer: 1500
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.message || 'Gagal memperbarui statistik'
        });
    }
}

// Update Footer
async function updateFooter() {
    const formData = new FormData();
    
    formData.append('description', document.getElementById('footer-description').value);
    formData.append('address', document.getElementById('footer-address').value);
    formData.append('phone', document.getElementById('footer-phone').value);
    formData.append('email', document.getElementById('footer-email').value);
    
    try {
        const response = await fetch('api/settings/update-footer.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Footer berhasil diperbarui',
                timer: 1500
            }).then(() => {
                location.reload();
            });
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.message || 'Gagal memperbarui footer'
        });
    }
}

// ==== Reviews Management ====
const reviewsTableBody = document.getElementById('reviewsTableBody');

async function loadReviews() {
    if (!reviewsTableBody) return;
    try {
        const res = await fetch('api/reviews/list.php', { cache: 'no-store' });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || 'Gagal memuat ulasan');
        renderReviews(result.reviews || []);
    } catch (err) {
        reviewsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#e11d48;">${err.message || 'Gagal memuat ulasan.'}</td></tr>`;
    }
}

function renderReviews(items) {
    if (!items.length) {
        reviewsTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#666;">Belum ada ulasan.</td></tr>';
        return;
    }

    reviewsTableBody.innerHTML = items.map((item, idx) => {
        const dateStr = item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-';
        const messageSafe = (item.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const emailSafe = (item.email || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const nameSafe = (item.name || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
            <tr>
                <td>${idx + 1}</td>
                <td>${nameSafe}</td>
                <td>${emailSafe}</td>
                <td style="white-space: pre-wrap;">${messageSafe}</td>
                <td>${dateStr}</td>
                <td style="text-align: right;">
                    <button class="btn-delete-review" data-id="${item.id}" aria-label="Hapus ulasan">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function deleteReview(id) {
    try {
        const res = await fetch('api/reviews/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || 'Gagal menghapus ulasan');
        Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1200, showConfirmButton: false });
        loadReviews();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.message || 'Tidak dapat menghapus ulasan' });
    }
}

reviewsTableBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-delete-review');
    if (!btn) return;
    const id = Number(btn.dataset.id || 0);
    if (!id) return;

    Swal.fire({
        title: 'Hapus ulasan ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal'
    }).then((res) => {
        if (res.isConfirmed) deleteReview(id);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
});
