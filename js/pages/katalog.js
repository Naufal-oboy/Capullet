document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('catalog-container');
    let products = [];
    let categories = [];

    // Load data from database
    async function loadData() {
        try {
            // Load products
            const productsResponse = await fetch('api/get-products.php', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const productsResult = await productsResponse.json();
            
            if (productsResult.success) {
                products = productsResult.products.map(p => ({
                    id: parseInt(p.id_produk),
                    name: p.nama_produk,
                    price: parseFloat(p.harga),
                    category: p.kategori_slug || 'uncategorized',
                    categoryName: p.nama_kategori || 'Lainnya',
                    image: p.gambar_utama || 'images/placeholder.jpg',
                    description: p.deskripsi || '',
                    friedPrice: 0, // Bisa ditambahkan field di database jika perlu
                    isBestSeller: p.is_best_seller == 1
                }));
                console.log('Products loaded:', products);
                console.log('Best sellers:', products.filter(p => p.isBestSeller));
            }

            // Load categories
            const categoriesResponse = await fetch('api/get-categories.php', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const categoriesResult = await categoriesResponse.json();
            
            if (categoriesResult.success) {
                categories = categoriesResult.categories;
                updateFilterButtons();
            }

            renderProducts();
            
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback ke dummy data jika API gagal
            loadDummyData();
        }
    }

    // Fallback dummy data
    function loadDummyData() {
        products = [
            {
                id: 1,
                name: "Keripik Mustofa Usus",
                price: 23000,
                category: "keripik",
                categoryName: "Keripik",
                image: "images/keripik-mustofa-usus.jpg",
                description: "Keripik usus renyah dengan bumbu balado khas.",
                friedPrice: 0,
                isBestSeller: true 
            },
            {
                id: 2,
                name: "Keripik Mustofa Kulit",
                price: 25000,
                category: "keripik",
                categoryName: "Keripik",
                image: "images/keripik-mustofa-kulit.jpg",
                description: "Kulit ayam crispy berbalut bumbu mustofa pedas manis.",
                friedPrice: 0,
                isBestSeller: true 
            }
        ];
        renderProducts();
    }

    // Update filter buttons based on categories from database
    function updateFilterButtons() {
        const filterControls = document.querySelector('.filter-controls');
        if (!filterControls) return;

        let buttonsHTML = '<button class="active" data-filter="all">Semua</button>';
        
        categories.forEach(cat => {
            buttonsHTML += `<button data-filter="${cat.slug}">${cat.nama_kategori}</button>`;
        });

        filterControls.innerHTML = buttonsHTML;
    }

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number).replace(/\s/g, ''); 
    };

    const renderProducts = () => {
        container.innerHTML = '';

        products.forEach(product => {
            const friedAttr = product.friedPrice > 0 ? `data-fried-price="${product.friedPrice}"` : '';
            const badgeHTML = product.isBestSeller 
                ? `<div class="badge-best-seller"><i class="fas fa-star"></i> Best Seller</div>` 
                : '';

            const productHTML = `
                <article class="product-card-item" data-category="${product.category}" ${friedAttr}>
                    ${badgeHTML}
                    <img src="${product.image}" alt="${product.name}" loading="lazy" />
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <p class="price">${formatRupiah(product.price)}</p>
                        <p class="description">${product.description}</p>
                        <button class="btn-plus-cart">
                            <i class="fa-solid fa-plus"></i>
                            Keranjang
                        </button>
                    </div>
                </article>
            `;
            container.innerHTML += productHTML;
        });

        initScrollAnimation();
        initFilterLogic();
        initAddToCartLogic();
    };

    let animationQueue = [];
    let isProcessingQueue = false;

    const processQueue = () => {
        if (animationQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }
        isProcessingQueue = true;
        const card = animationQueue.shift();
        card.classList.add('visible');
        setTimeout(processQueue, 100);
    };

    const initScrollAnimation = () => {
        const productCards = document.querySelectorAll('.product-card-item');

        const observerOptions = {
            root: null,
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            let newEntries = [];

            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                    newEntries.push(entry.target);
                    observer.unobserve(entry.target);
                }
            });

            if (newEntries.length > 0) {
                newEntries.sort((a, b) => {
                    const allCards = Array.from(document.querySelectorAll('.product-card-item'));
                    return allCards.indexOf(a) - allCards.indexOf(b);
                });

                animationQueue.push(...newEntries);

                if (!isProcessingQueue) {
                    processQueue();
                }
            }
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        productCards.forEach(card => scrollObserver.observe(card));
    };

    const initFilterLogic = () => {
        const filterButtons = document.querySelectorAll('.filter-controls button');
        const productCards = document.querySelectorAll('.product-card-item');

        filterButtons.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        const newFilterButtons = document.querySelectorAll('.filter-controls button');

        newFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                newFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');

                animationQueue = [];
                isProcessingQueue = false;
                
                productCards.forEach(card => {
                    card.classList.remove('visible');
                    card.style.display = 'none';
                });

                const matchedCards = [];
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        matchedCards.push(card);
                    }
                });

                matchedCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 50 + (index * 100));
                });
            });
        });
    };

    const initAddToCartLogic = () => {
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

                // Find product ID from products array by name
                const product = products.find(p => p.name === name);
                const productId = product ? product.id : 0;

                const productData = {
                    id: productId,
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
    };

    const navbar = document.querySelector('header nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Load data and render
    await loadData();
});
