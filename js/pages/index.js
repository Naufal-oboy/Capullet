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
       2. FILTER KATALOG BERANDA (INDEX)
       ========================================= */
    const filterButtonsIndex = document.querySelectorAll('.filter-controls-index button');
    const categorySections = document.querySelectorAll('.category-section-index');

    function applyFilterIndex(filterValue) {
        categorySections.forEach(section => {
            const category = section.getAttribute('data-category');
            if (category === filterValue) {
                section.classList.add('show');
            } else {
                section.classList.remove('show');
            }
        });
    }

    if (filterButtonsIndex.length > 0) {
        // Show first category by default
        const firstCategory = filterButtonsIndex[0].getAttribute('data-category');
        filterButtonsIndex[0].classList.add('active');
        applyFilterIndex(firstCategory);

        filterButtonsIndex.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtonsIndex.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-category');
                applyFilterIndex(filterValue);
            });
        });
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
    async function loadFaqs() {
        const container = document.getElementById('faq-container');
        if (!container) return;
        try {
            const response = await fetch('api/get-faqs.php', { cache: 'no-store' });
            const result = await response.json();
            if (!result.success) throw new Error(result.message || 'Gagal memuat FAQ');

            if (!result.faqs || result.faqs.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:1.5rem; color:#888;">Belum ada FAQ aktif.</div>';
                return;
            }

            const html = result.faqs.map(f => `
                <details class="faq-item">
                    <summary>${escapeHtml(f.pertanyaan)}</summary>
                    <div class="answer"><div class="answer-content">${escapeHtml(f.jawaban)}</div></div>
                </details>
            `).join('');
            container.innerHTML = html;
            initFaqAccordion();
        } catch (err) {
            console.error(err);
            container.innerHTML = '<div style="text-align:center; padding:1.5rem; color:#c00;">Terjadi kesalahan memuat FAQ.</div>';
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function initFaqAccordion() {
        const faqDetails = document.querySelectorAll('.faq-item');
        faqDetails.forEach(detail => {
            const summary = detail.querySelector('summary');
            const answer = detail.querySelector('.answer');
            summary.addEventListener('click', e => {
                e.preventDefault();
                const isOpen = detail.hasAttribute('open');
                if (isOpen) {
                    answer.style.gridTemplateRows = '0fr';
                    answer.style.opacity = '0';
                    setTimeout(() => {
                        detail.removeAttribute('open');
                        answer.style.removeProperty('grid-template-rows');
                        answer.style.removeProperty('opacity');
                    }, 400);
                } else {
                    faqDetails.forEach(other => {
                        if (other !== detail && other.hasAttribute('open')) {
                            const otherAnswer = other.querySelector('.answer');
                            otherAnswer.style.gridTemplateRows = '0fr';
                            otherAnswer.style.opacity = '0';
                            setTimeout(() => {
                                other.removeAttribute('open');
                                otherAnswer.style.removeProperty('grid-template-rows');
                                otherAnswer.style.removeProperty('opacity');
                            }, 400);
                        }
                    });
                    detail.setAttribute('open', '');
                }
            });
        });
    }

    loadFaqs();

    /* =========================================
       5. REVIEW FORM (HOME) TOGGLE & SEND
       ========================================= */
    const btnOpenReview = document.getElementById('btn-open-review');
    const reviewModal = document.getElementById('review-modal');
    const reviewBackdrop = document.getElementById('review-modal-backdrop');
    const reviewClose = document.getElementById('review-modal-close');
    const reviewForm = document.getElementById('home-review-form');

    const openReviewModal = () => {
        if (!reviewModal) return;
        reviewModal.classList.add('show');
        reviewModal.setAttribute('aria-hidden', 'false');
    };

    const closeReviewModal = () => {
        if (!reviewModal) return;
        reviewModal.classList.remove('show');
        reviewModal.setAttribute('aria-hidden', 'true');
    };

    if (btnOpenReview) {
        btnOpenReview.addEventListener('click', (e) => {
            e.preventDefault();
            openReviewModal();
        });
    }
    if (reviewBackdrop) reviewBackdrop.addEventListener('click', closeReviewModal);
    if (reviewClose) reviewClose.addEventListener('click', closeReviewModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeReviewModal();
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('home-review-name')?.value || '').trim();
            const email = (document.getElementById('home-review-email')?.value || '').trim();
            const message = (document.getElementById('home-review-message')?.value || '').trim();

            if (!name || !message) {
                alert('Nama dan ulasan wajib diisi.');
                return;
            }

            fetch('api/reviews/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            }).then(res => res.json())
              .then(data => {
                  if (!data.success) throw new Error(data.message || 'Gagal menyimpan ulasan');
                  alert('Terima kasih! Ulasan Anda sudah disimpan.');
                  reviewForm.reset();
                  closeReviewModal();
                  // Refresh agar ulasan baru tampil di slider
                  window.location.reload();
              })
              .catch(err => {
                  console.error(err);
                  alert('Gagal menyimpan ulasan. Silakan coba lagi.');
              });
        });
    }
});