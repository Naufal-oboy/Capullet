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
    let categories = [];
    let products = [];
    let currentImageBase64 = ''; // Untuk nyimpen string gambar
    let currentPage = 1;
    let totalPages = 1;
    let currentFilter = 'all';

    // Load categories from database
    async function loadCategories() {
        try {
            const response = await fetch('api/get-categories.php');
            const result = await response.json();
            
            if (result.success) {
                categories = result.categories.map(c => ({
                    id: parseInt(c.id_kategori),
                    name: c.nama_kategori
                }));
                renderCategories();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            // Fallback to default
            categories = [
                {id: 1, name: 'Keripik'}, 
                {id: 2, name: 'Risol'}, 
                {id: 3, name: 'Minuman'}
            ];
            renderCategories();
        }
    }

    // Load products from database
    async function loadProducts(page = 1, category = 'all') {
        try {
            // For "Semua" tab, use pagination
            let url = 'api/get-products.php';
            if (category === 'all') {
                url += `?page=${page}&limit=12`;
            }
            
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {'Cache-Control': 'no-cache'}
            });
            const result = await response.json();
            
            if (result.success) {
                products = result.products.map(p => ({
                    id: parseInt(p.id_produk),
                    name: p.nama_produk,
                    description: p.deskripsi || '',
                    price: parseFloat(p.harga),
                    category: p.nama_kategori || 'Lainnya',
                    categoryId: parseInt(p.id_kategori),
                    image: p.gambar_utama || 'images/placeholder.jpg',
                    isBestSeller: p.is_best_seller == 1,
                    isAvailable: p.is_aktif == 1,
                    canFried: false,
                    friedPrice: 0
                }));
                
                // Update pagination info if available
                if (result.pagination) {
                    currentPage = result.pagination.current_page;
                    totalPages = result.pagination.total_pages;
                }
                
                console.log('Products loaded from DB:', products);
                renderProducts(category);
                renderPagination();
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Initialize data on load
    loadCategories();
    loadProducts();

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
                
                const filterValue = btn.dataset.cat;
                currentFilter = filterValue;
                
                // If "Semua" tab, reload with pagination
                if (filterValue === 'all') {
                    loadProducts(1, 'all');
                } else {
                    // For other tabs, show all products without pagination
                    renderProducts(filterValue);
                    // Hide pagination
                    const paginationContainer = document.getElementById('pagination-container');
                    if (paginationContainer) {
                        paginationContainer.innerHTML = '';
                    }
                }
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
    btnSave.addEventListener('click', async () => {
        // Validasi Sederhana
        if (!inpName.value || !inpPrice.value || !inpCategory.value) {
            Swal.fire('Error', 'Nama, Harga, dan Kategori wajib diisi!', 'error');
            return;
        }

        const isEdit = inpId.value !== '';
        const categoryId = categories.find(c => c.name === inpCategory.value)?.id || 1;
        const isBestSeller = document.querySelector('input[name="isBestSeller"]:checked').value === 'true' ? 1 : 0;
        
        const productData = {
            nama_produk: inpName.value,
            deskripsi: inpDesc.value,
            harga: parseInt(inpPrice.value),
            id_kategori: categoryId,
            gambar_utama: currentImageBase64 || (isEdit ? imgPreview.src : 'images/placeholder.jpg'),
            is_best_seller: isBestSeller,
            is_aktif: document.querySelector('input[name="isAvailable"]:checked').value === 'true' ? 1 : 0,
            stok: 100
        };

        console.log('Saving product:', productData);
        console.log('Best Seller checkbox value:', isBestSeller);

        try {
            let url, method;
            if (isEdit) {
                productData.id_produk = parseInt(inpId.value);
                url = 'api/produk/update.php';
                method = 'POST';
            } else {
                url = 'api/produk/create.php';
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: isEdit ? 'Produk diperbarui.' : 'Produk ditambahkan.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    hideForm();
                    loadProducts(); // Reload from database
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Gagal menyimpan produk: ' + error.message, 'error');
        }
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
    window.deleteProduct = async (id) => {
        Swal.fire({
            title: 'Hapus Produk?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('api/produk/delete.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_produk: id })
                    });

                    const apiResult = await response.json();

                    if (apiResult.success) {
                        Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
                        loadProducts(); // Reload from database
                    } else {
                        throw new Error(apiResult.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Gagal menghapus produk', 'error');
                }
            }
        });
    };

    // Event Listeners UI
    btnShowAdd.addEventListener('click', () => showForm(false));
    btnCancel.addEventListener('click', hideForm);
    
    searchInput.addEventListener('input', (e) => {
        renderProducts('all', e.target.value);
    });
    
    // Render Pagination
    function renderPagination() {
        const paginationContainer = document.getElementById('pagination-container');
        
        // Only show pagination for "Semua" tab
        if (!paginationContainer || currentFilter !== 'all' || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        if (currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`;
        }

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationHTML += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
            paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        if (currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`;
        }

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        const pageButtons = paginationContainer.querySelectorAll('.page-btn');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                if (page !== currentPage) {
                    loadProducts(page, currentFilter);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }
});