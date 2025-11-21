document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('header nav ul');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('slide');
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                menuToggle.classList.remove('active');
                navList.classList.remove('slide');
            }
        });
    }
});

window.updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('capullet_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadgeIcon = document.querySelector('.cart-button'); 

    // Cek apakah ada tombol keranjang di halaman ini (Halaman Login mungkin tidak ada)
    if (!cartBadgeIcon) return;

    // Cek apakah badge sudah ada
    let badge = document.querySelector('.cart-count-badge');
    
    // Jika belum ada dan item > 0, buat element badge baru
    if (!badge && totalItems > 0) {
        badge = document.createElement('span');
        badge.className = 'cart-count-badge'; // Class dari global.css
        cartBadgeIcon.appendChild(badge);
    }

    // Update angka dan visibilitas
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       2. INITIALIZE CART BADGE (ON LOAD)
       ========================================= */
    // Jalankan fungsi ini setiap kali halaman apapun dibuka
    window.updateCartCount();

    /* =========================================
       3. HAMBURGER MENU LOGIC
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('header nav ul');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active'); 
            navList.classList.toggle('slide');
        });

        // Tutup menu jika klik di luar
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                menuToggle.classList.remove('active');
                navList.classList.remove('slide');
            }
        });
    }
});