document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.page-form-container');
    const waInput = document.getElementById('whatsapp');
    const igInput = document.getElementById('instagram');
    const addrInput = document.getElementById('address');
    const mapsInput = document.getElementById('maps-url');
    const hoursInput = document.getElementById('hours');

    async function loadContactInfo() {
        try {
            const res = await fetch('api/contact-info/get.php', { cache: 'no-store' });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal memuat data');
            const data = result.data;
            
            waInput.value = data.whatsapp || '';
            igInput.value = data.instagram || '';
            addrInput.value = data.address || '';
            mapsInput.value = data.maps_embed || '';
            hoursInput.value = data.hours || '';
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...'; }

            const res = await fetch('api/contact-info/update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    whatsapp: waInput.value,
                    instagram: igInput.value,
                    address: addrInput.value,
                    maps_embed: mapsInput.value,
                    hours: hoursInput.value
                })
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal menyimpan');

            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Informasi kontak diperbarui', timer: 1200, showConfirmButton: false });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        } finally {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan'; }
        }
    });

    loadContactInfo();
});