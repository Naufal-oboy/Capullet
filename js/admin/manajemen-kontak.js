document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM ELEMENTS ---
    const form = document.querySelector('.page-form-container');
    const waInput = document.getElementById('whatsapp');
    const igInput = document.getElementById('instagram');
    const addrInput = document.getElementById('address');
    const mapsInput = document.getElementById('maps-url');
    const hoursInput = document.getElementById('hours');

    // --- 2. DATA INITIALIZATION ---
    // Data default (Sesuai HTML asli) jika LocalStorage masih kosong
    const defaultContactData = {
        whatsapp: "6282251004290",
        instagram: "capull3t.smd",
        address: "Jl. Subulussalam I no. 9, Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda, Kalimantan Timur 75116",
        mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.664455822368!2d117.16204417592404!3d-0.4924445352697984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67fb548c8658d%3A0xe7b0004b646bfa61!2sKeripik%20usus%20dan%20kulit%20samarinda%20Capullet!5e0!3m2!1sid!2sid!4v1696885333010!5m2!1sid!2sid",
        hours: "Senin - Sabtu: 08.00 – 17.00\nMinggu: Tutup"
    };

    // Ambil data dari LocalStorage atau gunakan default
    let contactData = JSON.parse(localStorage.getItem('capullet_contact_info')) || defaultContactData;

    // --- 3. FUNGSI RENDER DATA KE FORM ---
    function loadDataToForm() {
        waInput.value = contactData.whatsapp;
        igInput.value = contactData.instagram;
        addrInput.value = contactData.address;
        mapsInput.value = contactData.mapsUrl;
        hoursInput.value = contactData.hours;
    }

    // --- 4. HANDLE SAVE ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update object data dengan nilai dari input
        contactData.whatsapp = waInput.value;
        contactData.instagram = igInput.value;
        contactData.address = addrInput.value;
        contactData.mapsUrl = mapsInput.value;
        contactData.hours = hoursInput.value;

        // Simpan ke LocalStorage
        localStorage.setItem('capullet_contact_info', JSON.stringify(contactData));

        // Tampilkan notifikasi sukses (SweetAlert2)
        Swal.fire({
            icon: 'success',
            title: 'Berhasil Disimpan!',
            text: 'Informasi kontak telah diperbarui.',
            showConfirmButton: false,
            timer: 1500,
            position: 'center'
        });
    });

    // --- 5. INITIALIZE ---
    loadDataToForm();
});