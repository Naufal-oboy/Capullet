document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const viewList = document.getElementById('product-list-view');
    const viewForm = document.getElementById('product-form-view');
    const gridContainer = document.getElementById('productGridContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilterContainer = document.getElementById('categoryFilterContainer');
    
    // Form Elements
    const btnShowAdd = document.getElementById('btnShowAddForm');
    const btnCancel = document.getElementById('btnCancelForm');
    const btnSave = document.getElementById('btnSaveProduct');
    const imgInput = document.getElementById('productImageInput');
    const imgPreview = document.getElementById('previewImage');
    
    // Inputs
    const inpId = document.getElementById('productId');
    const inpName = document.getElementById('productName');
    const inpDesc = document.getElementById('productDesc');
    const inpPrice = document.getElementById('productPrice');
    const inpCategory = document.getElementById('productCategory');
    const friedPriceGroup = document.getElementById('friedPriceGroup');
    const inpFriedPrice = document.getElementById('friedPrice');

    // --- DATA INITIALIZATION ---
    // Ambil Kategori dari LocalStorage (dari fitur Manajemen Kategori sebelumnya)
    const categories = JSON.parse(localStorage.getItem('capullet_categories')) || [
        {id: 1, name: 'Keripik'}, {id: 2, name: 'Risol'}, {id: 3, name: 'Minuman'}
    ];

    // Default Products (Jika kosong)
// Default Products (Data awal jika LocalStorage kosong)
    const defaultProducts = [
        {
            id: 1,
            name: "Keripik Mustofa Usus",
            description: "Olahan usus ayam pilihan yang renyah dan gurih.",
            price: 23000,
            category: "Keripik",
            image: "images/keripik-mustofa-usus.jpg",
            isBestSeller: true,
            isAvailable: true,
            canFried: false
        },
        {
            id: 2,
            name: "Keripik Mustofa Kulit",
            description: "Kulit ayam crispy dengan bumbu mustofa khas.",
            price: 25000,
            category: "Keripik",
            image: "images/keripik-mustofa-kulit.jpg",
            isBestSeller: false,
            isAvailable: true,
            canFried: false
        },
        {
            id: 3,
            name: "American Risol",
            description: "Isian smokebeef, telur, keju, dan mayones.",
            price: 33000,
            category: "Risol",
            image: "images/american-risol.jpg",
            isBestSeller: true,
            isAvailable: true,
            canFried: true,
            friedPrice: 3000
        },
        {
            id: 4,
            name: "American Mentai",
            description: "Risol premium dengan saus mentai yang creamy.",
            price: 35000,
            category: "Risol",
            image: "images/american-mentai.jpg",
            isBestSeller: false,
            isAvailable: true,
            canFried: true,
            friedPrice: 3000
        },
        {
            id: 5,
            name: "Lemongrass",
            description: "Minuman segar serai dan lemon.",
            price: 7000,
            category: "Minuman",
            image: "images/lemongrass.jpg",
            isBestSeller: false,
            isAvailable: true,
            canFried: false
        },
        {
            id: 6,
            name: "Es Nutella",
            description: "Minuman coklat Nutella yang manis dan creamy.",
            price: 20000,
            category: "Minuman",
            image: "images/es-nutella.jpg",
            isBestSeller: false,
            isAvailable: true,
            canFried: false
        }
    ];

    let products = JSON.parse(localStorage.getItem('capullet_products')) || defaultProducts;
    let currentImageBase64 = ''; // Untuk nyimpen string gambar

    // --- 1. RENDER FUNCTIONS ---

    // Populate Dropdown Kategori & Filter
    function renderCategories() {
        // Isi Dropdown di Form
        inpCategory.innerHTML = '<option value="">Pilih Kategori</option>';
        // Isi Filter di List
        let filterHTML = '<button class="active" data-cat="all">Semua</button>';

        categories.forEach(cat => {
            inpCategory.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
            filterHTML += `<button data-cat="${cat.name}">${cat.name}</button>`;
        });
        
        categoryFilterContainer.innerHTML = filterHTML;

        // Pasang Event Listener untuk Filter
        categoryFilterContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                categoryFilterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProducts(btn.dataset.cat);
            });
        });
    }

    // Render Grid Produk
    function renderProducts(filterCategory = 'all', searchQuery = '') {
        gridContainer.innerHTML = '';
        
        const filtered = products.filter(p => {
            const matchCat = filterCategory === 'all' || p.category === filterCategory;
            const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            gridContainer.innerHTML = '<p style="text-align:center; width:100%; col-span:3;">Tidak ada produk ditemukan.</p>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('article');
            card.className = 'product-admin-card';
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" onerror="this.src='images/placeholder-product.jpg'">
                <div class="product-admin-card-content">
                    <h3>${p.name}</h3>
                    <p class="price">Rp ${parseInt(p.price).toLocaleString('id-ID')}</p>
                    <p class="description">${p.category} | ${p.isAvailable ? '<span style="color:green">Tersedia</span>' : '<span style="color:red">Habis</span>'}</p>
                </div>
                <div class="product-admin-card-actions">
                    <button class="btn-edit" onclick="window.editProduct(${p.id})"><i class="fas fa-pen"></i> Edit</button>
                    <button class="btn-delete" onclick="window.deleteProduct(${p.id})"><i class="fas fa-trash-alt"></i> Hapus</button>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // --- 2. FORM HANDLING ---

    function showForm(isEdit = false) {
        viewList.classList.add('hidden');
        viewForm.classList.remove('hidden');
        window.scrollTo(0, 0);
        
        if(!isEdit) {
            resetForm();
        }
    }

    function hideForm() {
        viewForm.classList.add('hidden');
        viewList.classList.remove('hidden');
        resetForm();
    }

    function resetForm() {
        inpId.value = '';
        inpName.value = '';
        inpDesc.value = '';
        inpPrice.value = '';
        inpCategory.value = '';
        inpFriedPrice.value = '';
        currentImageBase64 = '';
        imgPreview.src = 'images/placeholder-product.jpg';
        imgInput.value = '';
        
        // Reset Radio Buttons to default
        document.querySelector('input[name="isBestSeller"][value="false"]').checked = true;
        document.querySelector('input[name="isAvailable"][value="true"]').checked = true;
        document.querySelector('input[name="canFried"][value="false"]').checked = true;
        friedPriceGroup.classList.add('hidden');
    }

    // Preview Image Logic
    imgInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                currentImageBase64 = e.target.result; // Simpan string base64
            }
            reader.readAsDataURL(file);
        }
    });

    // Logic Toggle Input Harga Goreng
    document.querySelectorAll('input[name="canFried"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'true') {
                friedPriceGroup.classList.remove('hidden');
            } else {
                friedPriceGroup.classList.add('hidden');
                inpFriedPrice.value = '';
            }
        });
    });

    // --- 3. CRUD ACTIONS ---

    // Save (Create / Update)
    btnSave.addEventListener('click', () => {
        // Validasi Sederhana
        if (!inpName.value || !inpPrice.value || !inpCategory.value) {
            Swal.fire('Error', 'Nama, Harga, dan Kategori wajib diisi!', 'error');
            return;
        }

        const isEdit = inpId.value !== '';
        const productData = {
            id: isEdit ? parseInt(inpId.value) : Date.now(),
            name: inpName.value,
            description: inpDesc.value,
            price: parseInt(inpPrice.value),
            category: inpCategory.value,
            image: currentImageBase64 || (isEdit ? imgPreview.src : 'images/placeholder-product.jpg'),
            isBestSeller: document.querySelector('input[name="isBestSeller"]:checked').value === 'true',
            isAvailable: document.querySelector('input[name="isAvailable"]:checked').value === 'true',
            canFried: document.querySelector('input[name="canFried"]:checked').value === 'true',
            friedPrice: inpFriedPrice.value ? parseInt(inpFriedPrice.value) : 0
        };

        if (isEdit) {
            // Update existing
            const index = products.findIndex(p => p.id === productData.id);
            if (index !== -1) products[index] = productData;
        } else {
            // Create new
            products.push(productData);
        }

        localStorage.setItem('capullet_products', JSON.stringify(products));
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: isEdit ? 'Produk diperbarui.' : 'Produk ditambahkan.',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            hideForm();
            renderProducts();
        });
    });

    // Edit (Dipanggil dari onclick HTML)
    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        inpId.value = product.id;
        inpName.value = product.name;
        inpDesc.value = product.description;
        inpPrice.value = product.price;
        inpCategory.value = product.category;
        
        // Set Image
        if(product.image) {
            imgPreview.src = product.image;
            currentImageBase64 = product.image; // Keep old image if not changed
        }

        // Set Radios
        document.querySelector(`input[name="isBestSeller"][value="${product.isBestSeller}"]`).checked = true;
        document.querySelector(`input[name="isAvailable"][value="${product.isAvailable}"]`).checked = true;
        document.querySelector(`input[name="canFried"][value="${product.canFried || false}"]`).checked = true;

        // Handle Fried Price
        if (product.canFried) {
            friedPriceGroup.classList.remove('hidden');
            inpFriedPrice.value = product.friedPrice;
        } else {
            friedPriceGroup.classList.add('hidden');
        }

        showForm(true); // true = mode edit
    };

    // Delete
    window.deleteProduct = (id) => {
        Swal.fire({
            title: 'Hapus Produk?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                products = products.filter(p => p.id !== id);
                localStorage.setItem('capullet_products', JSON.stringify(products));
                renderProducts();
                Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
            }
        });
    };

    // Event Listeners UI
    btnShowAdd.addEventListener('click', () => showForm(false));
    btnCancel.addEventListener('click', hideForm);
    
    searchInput.addEventListener('input', (e) => {
        renderProducts('all', e.target.value);
    });

    // --- INITIALIZE ---
    renderCategories();
    renderProducts();
});