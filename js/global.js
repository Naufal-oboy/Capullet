/* =========================================
   GLOBAL CART FUNCTION
   ========================================= */
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

/* =========================================
   DOM CONTENT LOADED
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. INITIALIZE CART BADGE (ON LOAD) */
    window.updateCartCount();

    /* 2. HAMBURGER MENU LOGIC */
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('header nav ul');

    if (menuToggle && navList) {
        // Toggle menu on hamburger click (support both click and touch)
        const toggleMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuToggle.classList.toggle('active'); 
            navList.classList.toggle('slide');
        };

        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('touchstart', toggleMenu, { passive: false });

        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                menuToggle.classList.remove('active');
                navList.classList.remove('slide');
            }
        };

        document.addEventListener('click', closeMenu);
        document.addEventListener('touchstart', closeMenu);

        // Close menu when clicking on a menu link
        const menuLinks = navList.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navList.classList.remove('slide');
            });
        });
    }
});