document.addEventListener('DOMContentLoaded', () => {
    const testCards = document.querySelectorAll('.testimonial-card');
    const testPrevBtn = document.querySelector('.prev-arrow');
    const testNextBtn = document.querySelector('.next-arrow');
    
    if (testCards.length > 0) {
        let activeIndex = 1;

        function updateTestimonialSlider() {
            if (window.innerWidth <= 768) {
                testCards.forEach(card => {
                    card.className = 'testimonial-card';
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
                card.className = 'testimonial-card';
                
                if (index === activeIndex) {
                    card.classList.add('active');
                } else if (index === prevIndex) {
                    card.classList.add('prev');
                } else if (index === nextIndex) {
                    card.classList.add('next');
                } else {
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
                    activeIndex = index;
                    updateTestimonialSlider();
                }
            });
        });

        updateTestimonialSlider();
        window.addEventListener('resize', updateTestimonialSlider);
    }

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
            const initialFilter = activeBtn.textContent.toLowerCase().trim();
            applyFilter(initialFilter, true);
        }
    }


    const faqDetails = document.querySelectorAll('.faq-item');

    if (faqDetails.length > 0) {
        faqDetails.forEach((targetDetail) => {
            const summary = targetDetail.querySelector('summary');

            summary.addEventListener('click', (e) => {
                e.preventDefault();

                const isOpen = targetDetail.hasAttribute('open');

                faqDetails.forEach((detail) => {
                    if (detail !== targetDetail) {
                        closeAccordion(detail);
                    }
                });

                if (isOpen) {
                    closeAccordion(targetDetail);
                } else {
                    openAccordion(targetDetail);
                }
            });
        });
    }

    function openAccordion(detail) {
        detail.setAttribute('open', '');
    }

    function closeAccordion(detail) {
        detail.removeAttribute('open');
    }
});
