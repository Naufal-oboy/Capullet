document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('catalog-container');

    const products = [
        {
            id: 1,
            name: "Keripik Mustofa Usus",
            price: 23000,
            category: "keripik",
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
            image: "images/keripik-mustofa-kulit.jpg",
            description: "Kulit ayam crispy berbalut bumbu mustofa pedas manis.",
            friedPrice: 0,
            isBestSeller: true 
        },
        {
            id: 3,
            name: "American Risol",
            price: 33000,
            category: "risol",
            image: "images/american-risol.jpg",
            description: "Isian daging asap, telur, dan mayonaise lumer.",
            friedPrice: 3000,
            isBestSeller: false
        },
        {
            id: 4,
            name: "American Mentai",
            price: 35000,
            category: "risol",
            image: "images/american-mentai.jpg",
            description: "Paduan saus mentai creamy dengan isian american.",
            friedPrice: 3000,
            isBestSeller: false
        },
        {
            id: 5,
            name: "Spicy Chicken Risol",
            price: 30000,
            category: "risol",
            image: "images/spicy-chicken-risol.jpg",
            description: "Ayam suwir pedas nampol dalam balutan kulit renyah.",
            friedPrice: 3000,
            isBestSeller: false
        },
        {
            id: 6,
            name: "Rougut Risol",
            price: 20000,
            category: "risol",
            image: "images/rougut-risol.jpg",
            description: "Cita rasa klasik sayuran dan ayam dengan tekstur creamy.",
            friedPrice: 3000,
            isBestSeller: false
        },
        {
            id: 7,
            name: "Jasuke Risol",
            price: 20000,
            category: "risol",
            image: "images/jasuke-risol.jpg",
            description: "Manis gurih jagung susu keju dalam satu gigitan.",
            friedPrice: 3000,
            isBestSeller: false
        },
        {
            id: 8,
            name: "Chococizz Risol",
            price: 28000,
            category: "risol",
            image: "images/chococizz-risol.jpg",
            description: "Lumeran coklat premium berpadu dengan keju gurih.",
            friedPrice: 3000,
            isBestSeller: false
        },
        {
            id: 9,
            name: "Lemongrass",
            price: 7000,
            category: "minuman",
            image: "images/lemongrass.jpg",
            description: "Minuman sereh segar penyejuk dahaga.",
            friedPrice: 0,
            isBestSeller: false
        },
        {
            id: 10,
            name: "Es Nutella",
            price: 20000,
            category: "minuman",
            image: "images/es-nutella.jpg",
            description: "Manisnya nutella asli disajikan dingin.",
            friedPrice: 0,
            isBestSeller: false
        },
        {
            id: 11,
            name: "Coffee Jelly Dessert",
            price: 25000,
            category: "minuman",
            image: "images/coffee-jelly-dessert.jpg",
            description: "Dessert kopi dengan jelly kenyal yang nikmat.",
            friedPrice: 0,
            isBestSeller: false
        },
        {
            id: 12,
            name: "Es Yuhuut",
            price: 12000,
            category: "minuman",
            image: "images/es-yahuut.jpg",
            description: "Kesegaran yogurt buah asli.",
            friedPrice: 0,
            isBestSeller: false
        },
        {
            id: 13,
            name: "Matcha",
            price: 10000,
            category: "minuman",
            image: "images/matcha-cincau.jpg",
            description: "Teh hijau jepang creamy dengan topping cincau.",
            friedPrice: 0,
            isBestSeller: false
        },
        {
            id: 14,
            name: "Cappucino Cincau",
            price: 10000,
            category: "minuman",
            image: "images/cappuccino-cincau.jpg",
            description: "Kopi cappuccino klasik dengan cincau segar.",
            friedPrice: 0,
            isBestSeller: false
        }
    ];

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

    renderProducts();
});
