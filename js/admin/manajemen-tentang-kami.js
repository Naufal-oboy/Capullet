document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const form = document.querySelector('.page-form-container');
    
    // Inputs
    const imgInput = document.getElementById('about-image');
    const imgPreview = document.querySelector('.image-preview img');
    const p1Input = document.getElementById('about-p1');
    const p2Input = document.getElementById('about-p2');
    const visionInput = document.getElementById('vision');
    const missionInput = document.getElementById('mission');

    // --- DATA INITIALIZATION ---
    // Data default jika LocalStorage masih kosong (Teks asli dari HTML)
    const defaultAboutData = {
        image: 'images/about-product.jpg',
        p1: "Kami adalah sebuah perusahaan yang membuat kreasi makanan olahan keripik dan frozen food. Capullet Pangan Lumintu dibangun untuk pelayanan kebutuhan yang dikhususkan untuk penyediaan cemilan frozen dan olahan keripik yang berkualitas dan tentunya dengan cita rasa nomor satu demi memuaskan kebutuhan pelanggan kami.",
        p2: "Perusahaan kami juga menjamin kebersihan produk yang kami sajikan. Semua ini didukung dengan kualitas terbaik dari bahan baku pembuatan makanan kami.",
        vision: "Menjadi Berkat Bagi Sesama Manusia Melalui Pemberdayaan, Inovasi, dan Kepemimpinan.",
        mission: "Memberdayakan perempuan, terutama ibu-ibu rumah tangga agar mampu berkarya dan berdiri di kaki sendiri.\nMenghadirkan produk terbaik dengan berbagai rasa tapi tetap dengan citarasa buatan tangan sendiri bukan pabrikan.\nMengolah bahan yang dianggap limbah, manjadi makanan yang enak dan nikmat dikonsumsi serta bernilai ekonomis tinggi."
    };

    // Ambil data dari LocalStorage atau gunakan default
    let aboutData = JSON.parse(localStorage.getItem('capullet_about_content')) || defaultAboutData;

    // --- FUNGSI RENDER DATA KE FORM ---
    function loadDataToForm() {
        if (aboutData.image) imgPreview.src = aboutData.image;
        p1Input.value = aboutData.p1;
        p2Input.value = aboutData.p2;
        visionInput.value = aboutData.vision;
        missionInput.value = aboutData.mission;
    }

    // --- IMAGE PREVIEW LOGIC ---
    imgInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Validasi ukuran file (Opsional, misal max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire('Error', 'Ukuran gambar terlalu besar (Max 2MB)', 'error');
                this.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result; // Update preview langsung
            }
            reader.readAsDataURL(file);
        }
    });

    // --- HANDLE SAVE ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update object data dengan nilai dari input
        aboutData.p1 = p1Input.value;
        aboutData.p2 = p2Input.value;
        aboutData.vision = visionInput.value;
        aboutData.mission = missionInput.value;
        
        // Ambil source gambar dari preview (karena sudah di-handle oleh FileReader saat change)
        // Ini menyimpan gambar sebagai Base64 string
        aboutData.image = imgPreview.src;

        // Simpan ke LocalStorage
        localStorage.setItem('capullet_about_content', JSON.stringify(aboutData));

        // Tampilkan notifikasi sukses
        Swal.fire({
            icon: 'success',
            title: 'Berhasil Disimpan!',
            text: 'Konten halaman Tentang Kami telah diperbarui.',
            showConfirmButton: false,
            timer: 1500,
            position: 'center'
        });
    });

    // --- INITIALIZE ---
    loadDataToForm();
});