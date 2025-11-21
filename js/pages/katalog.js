/* --- START OF FILE js/pages/katalog.js --- */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. FILTER PRODUK LOGIC
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-controls button');
    const productCards = document.querySelectorAll('.product-card-item');

    if (filterButtons.length > 0) {
        const applyFilter = (category) => {
            productCards.forEach(card => {
                const productCategory = card.getAttribute('data-category');
                if (category === 'all' || category === 'semua' || productCategory === category) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        };

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter') || btn.textContent.toLowerCase().trim();
                applyFilter(filterValue);
            });
        });
    }

    const addToCartButtons = document.querySelectorAll('.btn-plus-cart');

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('capullet_cart')) || [];

        const existingProductIndex = cart.findIndex(item => item.name === product.name);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('capullet_cart', JSON.stringify(cart));
        
        if (typeof window.updateCartCount === "function") {
            window.updateCartCount(); 
        }

        Swal.fire({
            icon: 'success',
            title: 'Masuk Keranjang!',
            text: `${product.name} telah ditambahkan.`,
            showConfirmButton: false,
            timer: 1200,
            position: 'center'
        });
    };

    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const card = btn.closest('.product-card-item');
            const imageSrc = card.querySelector('img').src;
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent; 
            const category = card.getAttribute('data-category');
            const friedPrice = parseInt(card.getAttribute('data-fried-price')) || 0; 
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));

            const productData = {
                id: Date.now(),
                name: name,
                price: price,
                image: imageSrc,
                category: category,
                quantity: 1,
                isFried: false,
                friedPrice: friedPrice 
            };

            addToCart(productData);
        });
    });
});