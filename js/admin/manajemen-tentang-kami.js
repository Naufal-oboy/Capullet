document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const form = document.querySelector('.page-form-container');
    
    // Inputs
    const imgInput = document.getElementById('about-image');
    const imgPreview = document.querySelector('.image-preview-box img') || document.querySelector('.image-preview img');
    const img2Input = document.getElementById('about-image-2');
    const img2Preview = document.getElementById('about-image-2-preview');
    const p1Input = document.getElementById('about-p1');
    const p2Input = document.getElementById('about-p2');
    const visionInput = document.getElementById('vision');
    const missionInput = document.getElementById('mission');

    // --- STATE ---
    let sectionsByKey = {};
    let currentImageBase64 = null;
    let currentImage2Base64 = null;

    async function loadSections() {
        try {
            const res = await fetch('api/tentang-kami/get-all.php', { cache: 'no-store' });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal memuat data');
            sectionsByKey = {};
            (result.data || []).forEach(row => {
                const rawKey = (row.judul_section || '').toLowerCase().trim();
                const key = rawKey.replace(/\s+/g, '_');
                sectionsByKey[key] = row;
            });

            const imgRow = sectionsByKey['about_image'];
            const descRow = sectionsByKey['deskripsi'];
            const desc2Row = sectionsByKey['deskripsi_2'];
            const visiRow = sectionsByKey['visi'];
            const misiRow = sectionsByKey['misi'];
            const imgRow2 = sectionsByKey['about_image_2'];

            if (imgPreview) imgPreview.src = (imgRow && imgRow.gambar) ? imgRow.gambar : 'images/about-product.jpg';
            if (img2Preview) img2Preview.src = (imgRow2 && imgRow2.gambar) ? imgRow2.gambar : 'images/about-product.jpg';
            if (p1Input) p1Input.value = (descRow && descRow.konten) ? descRow.konten : '';
            if (p2Input) p2Input.value = (desc2Row && desc2Row.konten) ? desc2Row.konten : '';
            if (visionInput) visionInput.value = (visiRow && visiRow.konten) ? visiRow.konten : '';
            if (missionInput) missionInput.value = (misiRow && misiRow.konten) ? misiRow.konten : '';
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        }
    }

    // --- IMAGE PREVIEW LOGIC ---
    imgInput?.addEventListener('change', function() {
        const file = this.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                Swal.fire('Error', 'Ukuran gambar terlalu besar (Max 3MB)', 'error');
                this.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                if (imgPreview) imgPreview.src = e.target.result;
                currentImageBase64 = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    img2Input?.addEventListener('change', function() {
        const file = this.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                Swal.fire('Error', 'Ukuran gambar terlalu besar (Max 3MB)', 'error');
                this.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                if (img2Preview) img2Preview.src = e.target.result;
                currentImage2Base64 = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    async function upsertSection(sectionKey, payload) {
        const existing = sectionsByKey[sectionKey];
        const body = { ...payload, judul_section: sectionKey };
        const endpoint = existing ? 'api/tentang-kami/update.php' : 'api/tentang-kami/create.php';
        if (existing) body.id = existing.id;
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || `Gagal simpan ${sectionKey}`);
        return result;
    }

    // --- HANDLE SAVE ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...'; }

            await upsertSection('deskripsi', { konten: p1Input?.value || '', is_aktif: 1, urutan: 1 });
            await upsertSection('deskripsi_2', { konten: p2Input?.value || '', is_aktif: 1, urutan: 2 });
            await upsertSection('visi', { konten: visionInput?.value || '', is_aktif: 1, urutan: 3 });
            await upsertSection('misi', { konten: missionInput?.value || '', is_aktif: 1, urutan: 4 });
            await upsertSection('about_image', {
                konten: '',
                gambar: sectionsByKey['about_image']?.gambar || null,
                gambar_base64: currentImageBase64 || null,
                is_aktif: 1,
                urutan: 0
            });
            await upsertSection('about_image_2', {
                konten: '',
                gambar: sectionsByKey['about_image_2']?.gambar || null,
                gambar_base64: currentImage2Base64 || null,
                is_aktif: 1,
                urutan: 5
            });

            await loadSections();
            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Konten diperbarui', timer: 1200, showConfirmButton: false });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        } finally {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan'; }
            currentImageBase64 = null;
            currentImage2Base64 = null;
        }
    });

    // --- INITIALIZE ---
    loadSections();
});