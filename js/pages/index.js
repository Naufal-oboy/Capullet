document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. TESTIMONIAL 3D SLIDER (INFINITE LOOP)
       ========================================= */
    const testCards = document.querySelectorAll('.testimonial-card');
    const testPrevBtn = document.querySelector('.prev-arrow');
    const testNextBtn = document.querySelector('.next-arrow');
    
    if (testCards.length > 0) {
        let activeIndex = 0;

        function updateTestimonialSlider() {
            if (window.innerWidth <= 768) {
                testCards.forEach(card => {
                    card.classList.remove('active', 'prev', 'next', 'hidden');
                    card.style.transform = '';
                    card.style.opacity = '';
                    card.style.zIndex = '';
                    card.style.filter = '';
                });
                return;
            }

            const total = testCards.length;
            const prevIndex = (activeIndex - 1 + total) % total;
            const nextIndex = (activeIndex + 1) % total;

            testCards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'hidden');
                
                if (index === activeIndex) {
                    card.classList.add('active');
                    card.style.transform = ''; card.style.opacity = ''; card.style.zIndex = '';
                } else if (index === prevIndex) {
                    card.classList.add('prev');
                    card.style.transform = ''; card.style.opacity = ''; card.style.zIndex = '';
                } else if (index === nextIndex) {
                    card.classList.add('next');
                    card.style.transform = ''; card.style.opacity = ''; card.style.zIndex = '';
                } else {
                    card.classList.add('hidden');
                    card.style.transform = 'translateX(0) scale(0.5)';
                    card.style.opacity = '0';
                    card.style.zIndex = '-1';
                }
            });
        }

        if (testNextBtn) {
            testNextBtn.addEventListener('click', () => {
                activeIndex = (activeIndex + 1) % testCards.length;
                updateTestimonialSlider();
            });
        }

        if (testPrevBtn) {
            testPrevBtn.addEventListener('click', () => {
                activeIndex = (activeIndex - 1 + testCards.length) % testCards.length;
                updateTestimonialSlider();
            });
        }
        
        testCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (window.innerWidth > 768) {
                    // Jika klik prev/next, update index
                    const total = testCards.length;
                    const prevIndex = (activeIndex - 1 + total) % total;
                    const nextIndex = (activeIndex + 1) % total;
                    if (index === prevIndex || index === nextIndex) {
                        activeIndex = index;
                        updateTestimonialSlider();
                    }
                }
            });
        });

        updateTestimonialSlider();
        window.addEventListener('resize', updateTestimonialSlider);
    }


    /* =========================================
       2. FILTER KATALOG BERANDA
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-controls button');
    const productCards = document.querySelectorAll('.catalog-section .product-card');

    function applyFilter(filterValue, isInitialLoad = false) {
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'semua' || category === filterValue) {
                card.style.display = 'flex';
                if (isInitialLoad) {
                    card.style.opacity = '1';
                } else {
                    setTimeout(() => card.style.opacity = '1', 50);
                }
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.textContent.toLowerCase().trim();
                applyFilter(filterValue);
            });
        });

        const activeBtn = document.querySelector('.filter-controls button.active');
        if (activeBtn) {
            applyFilter(activeBtn.textContent.toLowerCase().trim(), true);
        }
    }


    /* =========================================
       3. ADD TO CART LOGIC (NEW)
       ========================================= */
    const addToCartButtons = document.querySelectorAll('.btn-plus-cart');

    // Fungsi Simpan ke LocalStorage (Sama seperti di katalog.js)
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('capullet_cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.name === product.name);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('capullet_cart', JSON.stringify(cart));
        
        // Update Badge Header
        if (typeof window.updateCartCount === "function") {
            window.updateCartCount(); 
        }

        // Tampilkan Alert
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Masuk Keranjang!',
                text: `${product.name} telah ditambahkan.`,
                showConfirmButton: false,
                timer: 1500,
                position: 'center'
            });
        } else {
            alert(`${product.name} masuk keranjang!`);
        }
    };

    // Event Listener Tombol Keranjang
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const card = btn.closest('.product-card');
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


    /* =========================================
       4. FAQ ACCORDION
       ========================================= */
    const faqDetails = document.querySelectorAll('.faq-item');
    if (faqDetails.length > 0) {
        faqDetails.forEach((targetDetail) => {
            const summary = targetDetail.querySelector('summary');
            const answer = targetDetail.querySelector('.answer');
            summary.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = targetDetail.hasAttribute('open');
                if (isOpen) {
                    answer.style.gridTemplateRows = '0fr';
                    answer.style.opacity = '0';
                    setTimeout(() => {
                        targetDetail.removeAttribute('open');
                        answer.style.removeProperty('grid-template-rows');
                        answer.style.removeProperty('opacity');
                    }, 500);
                } else {
                    faqDetails.forEach((otherDetail) => {
                        if (otherDetail !== targetDetail && otherDetail.hasAttribute('open')) {
                            const otherAnswer = otherDetail.querySelector('.answer');
                            otherAnswer.style.gridTemplateRows = '0fr';
                            otherAnswer.style.opacity = '0';
                            setTimeout(() => {
                                otherDetail.removeAttribute('open');
                                otherAnswer.style.removeProperty('grid-template-rows');
                                otherAnswer.style.removeProperty('opacity');
                            }, 500);
                        }
                    });
                    targetDetail.setAttribute('open', '');
                }
            });
        });
    }
});