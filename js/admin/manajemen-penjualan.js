// Data penjualan akan diambil dari database
let orders = [];
let products = [];

let editingOrderId = null;
let itemCounter = 0;

// Load products from database
async function loadProducts() {
    try {
        const response = await fetch('api/get-products.php');
        const result = await response.json();
        
        if (result.success) {
            products = result.products.map(p => ({
                id: parseInt(p.id_produk),
                name: p.nama_produk,
                price: parseFloat(p.harga)
            }));
        } else {
            console.error('Failed to load products:', result.message);
            // Use dummy data as fallback
            products = [
                { id: 1, name: 'Eco Bag Premium', price: 75000 },
                { id: 2, name: 'Bamboo Straw Set', price: 45000 },
                { id: 3, name: 'Reusable Water Bottle', price: 85000 }
            ];
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Use dummy data as fallback
        products = [
            { id: 1, name: 'Eco Bag Premium', price: 75000 },
            { id: 2, name: 'Bamboo Straw Set', price: 45000 },
            { id: 3, name: 'Reusable Water Bottle', price: 85000 }
        ];
    }
}

// Load orders from database
async function loadOrders() {
    try {
        const response = await fetch('api/get-orders.php');
        const result = await response.json();
        
        if (result.success) {
            // Transform database data ke format yang digunakan
            orders = result.orders.map(order => ({
                id: parseInt(order.id_order),
                orderNumber: order.order_number,
                date: order.date,
                customerName: order.customer_name,
                customerPhone: order.customer_phone || '',
                customerEmail: order.customer_email || '',
                customerAddress: order.customer_address,
                items: order.items.map(item => ({
                    id: parseInt(item.id_produk),
                    productName: item.nama_produk,
                    price: parseFloat(item.harga),
                    quantity: parseInt(item.quantity),
                    subtotal: parseFloat(item.subtotal)
                })),
                subtotal: parseFloat(order.subtotal),
                shippingCost: parseFloat(order.shipping_cost),
                totalAmount: parseFloat(order.total_amount),
                paymentMethod: order.payment_method || '',
                status: order.status,
                notes: order.notes || ''
            }));
            
            renderOrders();
        } else {
            console.error('Failed to load orders:', result.message);
            Swal.fire('Error', 'Gagal memuat data pesanan', 'error');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        // Jika gagal load, gunakan data dummy untuk demo
        loadDummyData();
    }
}

// Fallback dummy data untuk demo
function loadDummyData() {
    orders = [
        {
            id: 1,
            orderNumber: 'ORD-2025-001',
            date: '2025-12-01',
            customerName: 'Budi Santoso',
            customerPhone: '081234567890',
            customerEmail: 'budi@example.com',
            customerAddress: 'Jl. Merdeka No. 123, Jakarta Pusat',
            items: [
                { id: 1, productName: 'Eco Bag Premium', price: 75000, quantity: 2, subtotal: 150000 },
                { id: 2, productName: 'Bamboo Straw Set', price: 45000, quantity: 1, subtotal: 45000 }
            ],
            subtotal: 195000,
            shippingCost: 15000,
            totalAmount: 210000,
            paymentMethod: 'transfer',
            status: 'pending',
            notes: 'Mohon kirim secepatnya'
        }
    ];
    renderOrders();
}

// Format currency
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    // Pastikan tanggal valid
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        'pending': 'Pending',
        'confirmed': 'Terkonfirmasi',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return labels[status] || status;
}

// Update statistics
function updateStats() {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing' || o.status === 'confirmed' || o.status === 'shipped').length;
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('processing-orders').textContent = processingOrders;
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);

    // Update charts whenever stats are recalculated
    renderSalesTrendChart();
    renderOrderStatusChart();
}

// ==========================
// Charts (Chart.js)
// ==========================
let salesTrendChartInstance = null;
let orderStatusChartInstance = null;

function getLastNDates(n) {
    const dates = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dates.push({
            key: `${yyyy}-${mm}-${dd}`,
            label: `${dd}/${mm}`
        });
    }
    return dates;
}

function normalizeDateKey(value) {
    if (!value) return '';
    // Accept 'YYYY-MM-DD', 'YYYY-MM-DD HH:MM:SS', or Date
    let d;
    if (value instanceof Date) {
        d = value;
    } else if (typeof value === 'string') {
        // Replace space with 'T' to avoid timezone issues
        const cleaned = value.replace(' ', 'T');
        d = new Date(cleaned);
        if (isNaN(d.getTime())) {
            // Fallback: split manually
            const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) {
                return `${m[1]}-${m[2]}-${m[3]}`;
            }
            return '';
        }
    } else {
        d = new Date(value);
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function renderSalesTrendChart() {
    const canvas = document.getElementById('salesTrendChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const dayBuckets = getLastNDates(7);
    // Hitung total pendapatan per hari (exclude cancelled)
    const dailyRevenue = dayBuckets.map(dk => {
        return orders
            .filter(o => (o.status !== 'cancelled') && normalizeDateKey(o.date) === dk.key)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    });

    const ctx = canvas.getContext('2d');
    if (salesTrendChartInstance) salesTrendChartInstance.destroy();

    salesTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dayBuckets.map(d => d.label),
            datasets: [{
                label: 'Pendapatan Harian',
                data: dailyRevenue,
                borderColor: '#66b5ff',
                backgroundColor: 'rgba(102, 181, 255, 0.15)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#66b5ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            // Format singkat (contoh: 150000 -> 150k)
                            if (value >= 1000000) return (value/1000000).toFixed(1)+'M';
                            if (value >= 1000) return (value/1000).toFixed(0)+'k';
                            return value;
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            const val = ctx.parsed.y || 0;
                            return 'Rp ' + val.toLocaleString('id-ID');
                        }
                    }
                }
            }
        }
    });
}

function renderOrderStatusChart() {
    const canvas = document.getElementById('orderStatusChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'];
    const labels = ['Pending', 'Terkonfirmasi', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
    // Distinct color palette (no overlapping greens)
    // Gunakan warna yang konsisten dengan badge status (text color sebagai border, badge background sebagai fill)
    // Kembalikan ke palet pastel yang selaras dengan badge status
    const colors = [
        '#e06d00', // Pending (sedikit lebih gelap dari F57C00)
        '#1565C0', // Confirmed (lebih pekat)
        '#2E7D32', // Processing
        '#6A1B9A', // Shipped
        '#1B5E20', // Completed (lebih gelap hijau)
        '#B71C1C'  // Cancelled
    ];
    // Sedikit lebih gelap dari versi pastel sebelumnya untuk kontras lebih baik
    const bgColors = [
        '#FFE0BF', // Pending (darker than FFF3E0)
        '#D6E9FB', // Confirmed
        '#D1E9D4', // Processing
        '#E9D7F1', // Shipped
        '#C5E6CA', // Completed
        '#FFDBD7'  // Cancelled
    ];

    const counts = statuses.map(s => orders.filter(o => (o.status || '').toLowerCase() === s).length);
    const total = counts.reduce((a, b) => a + b, 0);
    // Avoid Chart.js zero-sum doughnut (renders nothing)
    const datasetData = total === 0 ? [1, 0, 0, 0, 0, 0] : counts;

    const ctx = canvas.getContext('2d');
    if (orderStatusChartInstance) orderStatusChartInstance.destroy();

    orderStatusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: datasetData,
                backgroundColor: bgColors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 14,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Render orders table
function renderOrders(ordersToRender = orders) {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';

    if (ordersToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    Tidak ada data pesanan
                </td>
            </tr>
        `;
        return;
    }

    ordersToRender.forEach((order, index) => {
        const itemsCount = order.items.length;
        const itemsText = itemsCount === 1 
            ? order.items[0].productName 
            : `${itemsCount} produk`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td><strong>${order.orderNumber}</strong></td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div style="line-height: 1.5;">
                    <div style="font-weight: 600; margin-bottom: 2px;">${order.customerName}</div>
                    <div style="font-size: 0.85rem; color: #999;">${order.customerPhone}</div>
                </div>
            </td>
            <td><span class="product-list">${itemsText}</span></td>
            <td style="font-weight: 600;">${formatCurrency(order.totalAmount)}</td>
            <td><span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" onclick="viewOrder(${order.id})" title="Lihat Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" onclick="editOrder(${order.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteOrder(${order.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateStats();
}

// Search and filter
function filterOrders() {
    const searchTerm = document.getElementById('search-order').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const dateFilter = document.getElementById('filter-date').value;

    let filtered = orders.filter(order => {
        const matchSearch = !searchTerm || 
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerPhone.includes(searchTerm);

        const matchStatus = !statusFilter || order.status === statusFilter;

        const matchDate = !dateFilter || order.date === dateFilter;

        return matchSearch && matchStatus && matchDate;
    });

    renderOrders(filtered);
}

// Add order item row
function addOrderItem(item = null) {
    itemCounter++;
    const container = document.getElementById('order-items-container');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item-row';
    itemDiv.dataset.itemId = itemCounter;

    let productOptions = '<option value="">Pilih Produk</option>';
    products.forEach(p => {
        const selected = item && item.productName === p.name ? 'selected' : '';
        productOptions += `<option value="${p.id}" data-price="${p.price}" ${selected}>${p.name} - ${formatCurrency(p.price)}</option>`;
    });

    itemDiv.innerHTML = `
        <select class="item-product" required onchange="updateItemPrice(${itemCounter})">
            ${productOptions}
        </select>
        <input type="number" class="item-quantity" value="${item ? item.quantity : 1}" min="1" required oninput="calculateOrderTotal()" placeholder="Qty">
        <input type="number" class="item-subtotal" value="${item ? item.subtotal : 0}" readonly placeholder="Subtotal">
        <button type="button" class="btn-remove-item" onclick="removeOrderItem(${itemCounter})">
            <i class="fas fa-trash"></i>
        </button>
    `;

    container.appendChild(itemDiv);
    if (item) updateItemPrice(itemCounter);
    calculateOrderTotal();
}

// Remove order item
function removeOrderItem(itemId) {
    const item = document.querySelector(`[data-item-id="${itemId}"]`);
    if (item) {
        item.remove();
        calculateOrderTotal();
    }
}

// Update item price when product selected
function updateItemPrice(itemId) {
    const item = document.querySelector(`[data-item-id="${itemId}"]`);
    const productSelect = item.querySelector('.item-product');
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const price = parseFloat(selectedOption.dataset.price) || 0;
    const quantity = parseInt(item.querySelector('.item-quantity').value) || 1;
    const subtotal = price * quantity;
    
    item.querySelector('.item-subtotal').value = subtotal;
    calculateOrderTotal();
}

// Calculate order total
function calculateOrderTotal() {
    let subtotal = 0;
    document.querySelectorAll('.order-item-row').forEach(item => {
        const productSelect = item.querySelector('.item-product');
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = parseFloat(selectedOption.dataset.price) || 0;
        const quantity = parseInt(item.querySelector('.item-quantity').value) || 0;
        const itemSubtotal = price * quantity;
        item.querySelector('.item-subtotal').value = itemSubtotal;
        subtotal += itemSubtotal;
    });

    const shippingCost = parseFloat(document.getElementById('shipping-cost').value) || 0;
    const total = subtotal + shippingCost;

    document.getElementById('subtotal-display').textContent = formatCurrency(subtotal);
    document.getElementById('total-display').textContent = formatCurrency(total);
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Hide modal
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Add new order
function addOrder() {
    editingOrderId = null;
    document.getElementById('modal-title').textContent = 'Tambah Pesanan Baru';
    document.getElementById('order-form').reset();
    document.getElementById('order-id').value = '';
    document.getElementById('order-items-container').innerHTML = '';
    itemCounter = 0;
    addOrderItem();
    calculateOrderTotal();
    showModal('order-modal');
}

// Edit order
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    editingOrderId = orderId;
    document.getElementById('modal-title').textContent = 'Edit Pesanan';
    document.getElementById('order-id').value = order.id;
    document.getElementById('customer-name').value = order.customerName;
    document.getElementById('customer-phone').value = order.customerPhone;
    document.getElementById('customer-email').value = order.customerEmail || '';
    document.getElementById('customer-address').value = order.customerAddress;
    document.getElementById('shipping-cost').value = order.shippingCost;
    document.getElementById('payment-method').value = order.paymentMethod || '';
    document.getElementById('order-status').value = order.status;
    document.getElementById('order-notes').value = order.notes || '';

    document.getElementById('order-items-container').innerHTML = '';
    itemCounter = 0;
    order.items.forEach(item => addOrderItem(item));
    calculateOrderTotal();

    showModal('order-modal');
}

// View order details
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const itemsList = order.items.map(item => `
        <div class="detail-item">
            <div>
                <strong>${item.productName}</strong>
                <span class="item-qty">x ${item.quantity}</span>
            </div>
            <strong>${formatCurrency(item.subtotal)}</strong>
        </div>
    `).join('');

    document.getElementById('detail-content').innerHTML = `
        <div class="order-detail-grid">
            <div class="detail-section">
                <h3><i class="fas fa-receipt"></i> Informasi Pesanan</h3>
                <div class="detail-row">
                    <span class="detail-label">No. Pesanan:</span>
                    <span class="detail-value"><strong>${order.orderNumber}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tanggal:</span>
                    <span class="detail-value">${formatDate(order.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Metode Pembayaran:</span>
                    <span class="detail-value">${order.paymentMethod ? order.paymentMethod.toUpperCase() : '-'}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Informasi Pelanggan</h3>
                <div class="detail-row">
                    <span class="detail-label">Nama:</span>
                    <span class="detail-value"><strong>${order.customerName}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">No. Telepon:</span>
                    <span class="detail-value">${order.customerPhone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${order.customerEmail || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Alamat:</span>
                    <span class="detail-value">${order.customerAddress}</span>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-box"></i> Produk yang Dipesan</h3>
            <div class="items-detail-list">
                ${itemsList}
            </div>
            <div class="order-total-section">
                <div class="detail-row">
                    <span class="detail-label">Subtotal:</span>
                    <span class="detail-value">${formatCurrency(order.subtotal)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ongkir:</span>
                    <span class="detail-value">${formatCurrency(order.shippingCost)}</span>
                </div>
                <div class="detail-row total-row">
                    <span class="detail-label"><strong>Total:</strong></span>
                    <span class="detail-value"><strong>${formatCurrency(order.totalAmount)}</strong></span>
                </div>
            </div>
        </div>

        ${order.notes ? `
            <div class="detail-section">
                <h3><i class="fas fa-sticky-note"></i> Catatan</h3>
                <p style="margin: 0; color: var(--text-muted);">${order.notes}</p>
            </div>
        ` : ''}
    `;

    showModal('detail-modal');
}

// Delete order
async function deleteOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    Swal.fire({
        title: 'Hapus Pesanan?',
        html: `Yakin ingin menghapus pesanan <strong>${order.orderNumber}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0090',
        cancelButtonColor: '#66b5ff',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch('api/delete-order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_order: orderId })
                });

                const apiResult = await response.json();

                if (apiResult.success) {
                    orders = orders.filter(o => o.id !== orderId);
                    renderOrders();
                    Swal.fire('Terhapus!', 'Pesanan berhasil dihapus.', 'success');
                } else {
                    throw new Error(apiResult.message);
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'Gagal menghapus pesanan', 'error');
            }
        }
    });
}

// Save order
function saveOrder(e) {
    e.preventDefault();

    // Get items
    const items = [];
    document.querySelectorAll('.order-item-row').forEach(itemDiv => {
        const productSelect = itemDiv.querySelector('.item-product');
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        
        if (productSelect.value) {
            const productName = selectedOption.text.split(' - ')[0];
            const price = parseFloat(selectedOption.dataset.price);
            const quantity = parseInt(itemDiv.querySelector('.item-quantity').value);
            const subtotal = parseFloat(itemDiv.querySelector('.item-subtotal').value);

            items.push({
                id: parseInt(productSelect.value),
                productName,
                price,
                quantity,
                subtotal
            });
        }
    });

    if (items.length === 0) {
        Swal.fire('Error', 'Tambahkan minimal 1 produk!', 'error');
        return;
    }

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = parseFloat(document.getElementById('shipping-cost').value) || 0;

    const orderData = {
        customerName: document.getElementById('customer-name').value,
        customerPhone: document.getElementById('customer-phone').value,
        customerEmail: document.getElementById('customer-email').value,
        customerAddress: document.getElementById('customer-address').value,
        items: items,
        subtotal: subtotal,
        shippingCost: shippingCost,
        totalAmount: subtotal + shippingCost,
        paymentMethod: document.getElementById('payment-method').value,
        status: document.getElementById('order-status').value,
        notes: document.getElementById('order-notes').value
    };

    // Disable submit button while saving
    const submitBtn = document.querySelector('#order-form .btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';

    (async () => {
        try {
            if (editingOrderId) {
                // Persist update to backend
                const response = await fetch('api/update-order.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_order: editingOrderId,
                        ...orderData,
                        // Map item product id if exists
                        items: orderData.items.map(i => ({
                            productId: i.id || 0,
                            productName: i.productName,
                            price: i.price,
                            quantity: i.quantity,
                            subtotal: i.subtotal
                        }))
                    })
                });
                const result = await response.json();
                if (!result.success) throw new Error(result.message || 'Gagal memperbarui pesanan');
                Swal.fire('Berhasil!', 'Pesanan berhasil diperbarui.', 'success');
            } else {
                // Create new order in backend (status default pending by API)
                const response = await fetch('api/save-order.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...orderData,
                        items: orderData.items.map(i => ({
                            productId: i.id || 0,
                            productName: i.productName,
                            price: i.price,
                            quantity: i.quantity,
                            subtotal: i.subtotal
                        }))
                    })
                });
                const result = await response.json();
                if (!result.success) throw new Error(result.message || 'Gagal menambahkan pesanan');
                Swal.fire('Berhasil!', 'Pesanan baru berhasil ditambahkan.', 'success');
            }

            hideModal('order-modal');
            // Reload orders from backend to reflect persisted state
            await loadOrders();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Simpan Pesanan';
        }
    })();
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Load products first
    await loadProducts();
    
    // Load orders from database
    loadOrders();

    // Search and filter
    document.getElementById('search-order').addEventListener('input', filterOrders);
    document.getElementById('filter-status').addEventListener('change', filterOrders);
    document.getElementById('filter-date').addEventListener('change', filterOrders);

    // Add order button
    document.getElementById('btn-add-order').addEventListener('click', function(e) {
        e.preventDefault();
        addOrder();
    });

    // Shipping cost change
    document.getElementById('shipping-cost').addEventListener('input', calculateOrderTotal);

    // Add item button
    document.getElementById('add-item-btn').addEventListener('click', function() {
        addOrderItem();
    });

    // Form submit
    document.getElementById('order-form').addEventListener('submit', saveOrder);

    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', function() {
        hideModal('order-modal');
    });

    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(this.closest('.modal').id);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
});
