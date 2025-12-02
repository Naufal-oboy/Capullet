document.addEventListener('DOMContentLoaded', () => {

    const cartItemsContainer = document.getElementById('summaryCartItems');
    const cartTotalDisplay = document.getElementById('cartTotalDisplay');
    const orderForm = document.getElementById('orderForm');
    
    const deliveryOptionRadios = document.getElementsByName('deliveryOption');
    const addressGroup = document.getElementById('addressGroup');
    const addressInput = document.getElementById('buyerAddress');
    const courierAlert = document.getElementById('courierAlert');

    let cart = JSON.parse(localStorage.getItem('capullet_cart')) || [];

    function renderCart() {

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-state">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Keranjangmu masih kosong nih!</p>
                    <a href="katalog.php" class="btn btn-primary">Belanja Sekarang</a>
                </div>`;
            cartTotalDisplay.textContent = 'Rp 0';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            let friedOptionHTML = '';
            if (item.friedPrice) {
                if (item.isFried) {
                    total += (item.friedPrice * item.quantity);
                }

                friedOptionHTML = `
                    <div class="fried-option-container">
                        <label class="fried-label">
                            <input type="checkbox" class="goreng-check" data-index="${index}" ${item.isFried ? 'checked' : ''}> 
                            Digoreng (+Rp${item.friedPrice.toLocaleString('id-ID')})
                        </label>
                    </div>`;
            }

            const itemHTML = `
                <div class="summary-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="summary-item-info">
                        <h4>${item.name}</h4>
                        <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
                        
                        ${friedOptionHTML}

                        <div class="qty-controls">
                            <button type="button" onclick="window.updateQty(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" onclick="window.updateQty(${index}, 1)">+</button>
                        </div>
                    </div>
                    <button type="button" class="btn-delete-item" onclick="window.removeItem(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotalDisplay.textContent = 'Rp ' + total.toLocaleString('id-ID');
        
        attachCheckboxListeners();
    }

    function attachCheckboxListeners() {
        document.querySelectorAll('.goreng-check').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                cart[idx].isFried = e.target.checked;
                saveCart();
            });
        });
    }

    function saveCart() {
        localStorage.setItem('capullet_cart', JSON.stringify(cart));
        renderCart();
        if(typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
    }

    window.updateQty = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            confirmRemoveItem(index);
            return; 
        }
        saveCart();
    };

    window.removeItem = (index) => {
        confirmRemoveItem(index);
    };

    function confirmRemoveItem(index) {
        Swal.fire({
            title: 'Hapus item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                cart.splice(index, 1);
                saveCart();
            }
        });
    }

    function toggleDeliveryOptions() {
        const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;

        if (selectedOption === 'Pesan Kurir') {
            addressGroup.style.display = 'block';
            addressInput.setAttribute('required', 'true');
            courierAlert.style.display = 'block';
        } else {
            addressGroup.style.display = 'none';
            addressInput.removeAttribute('required');
            courierAlert.style.display = 'none';
        }
    }

    deliveryOptionRadios.forEach(radio => {
        radio.addEventListener('change', toggleDeliveryOptions);
    });

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            Swal.fire('Oops', 'Keranjang kosong!', 'error');
            return;
        }

        const name = document.getElementById('buyerName').value;
        const phone = document.getElementById('buyerPhone').value;
        const delivery = document.querySelector('input[name="deliveryOption"]:checked').value;
        const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
        const address = document.getElementById('buyerAddress').value;

        // Hitung total dan prepare items untuk database
        let finalTotal = 0;
        const orderItems = [];
        
        cart.forEach(item => {
            let itemPriceTotal = item.price * item.quantity;
            
            if(item.isFried) {
                itemPriceTotal += (item.friedPrice * item.quantity);
            }

            finalTotal += itemPriceTotal;
            
            orderItems.push({
                productId: item.id || item.productId || 0,
                productName: item.name + (item.isFried ? ' (Goreng)' : ''),
                price: item.price + (item.isFried ? item.friedPrice : 0),
                quantity: item.quantity,
                subtotal: itemPriceTotal
            });
        });

        // Prepare data untuk API
        const orderData = {
            customerName: name,
            customerPhone: phone,
            customerEmail: '',
            customerAddress: delivery === 'Pesan Kurir' ? address : 'Ambil Sendiri',
            subtotal: finalTotal,
            shippingCost: 0,
            paymentMethod: payment,
            notes: `Pengiriman: ${delivery}`,
            items: orderItems
        };

        // Show loading
        Swal.fire({
            title: 'Memproses pesanan...',
            html: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Simpan ke database
            const response = await fetch('api/save-order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            // Cek apakah response OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            console.log('API Response:', result); // Debug log

            if (result.success) {
                // IMPORTANT: Build message BEFORE clearing cart
                let message = `Halo Capullet, saya mau pesan dong:\n\n`;
                message += `*No. Pesanan:* ${result.orderNumber}\n`;
                message += `*Nama:* ${name}\n`;
                message += `*No. HP:* ${phone}\n`;
                message += `*Pengiriman:* ${delivery}\n`;
                
                if (delivery === 'Pesan Kurir') {
                    message += `*Alamat:* ${address}\n`;
                }
                
                message += `*Pembayaran:* ${payment}\n`;
                message += `\n*--- RINCIAN PESANAN ---*\n`;
                
                // Build cart items list
                cart.forEach(item => {
                    let itemPriceTotal = item.price * item.quantity;
                    let friedText = "";
                    
                    if(item.isFried) {
                        itemPriceTotal += (item.friedPrice * item.quantity);
                        friedText = " (Goreng)";
                    }

                    message += `- ${item.name}${friedText} (${item.quantity}x) : Rp ${itemPriceTotal.toLocaleString('id-ID')}\n`;
                });

                message += `\n*TOTAL: Rp ${finalTotal.toLocaleString('id-ID')}*\n\nMohon konfirmasi ketersediaan produk. Terima kasih!`;

                console.log('=== WhatsApp Message ===');
                console.log(message);
                console.log('========================');

                // Encode message for URL
                const encodedMessage = encodeURIComponent(message);
                const waNumber = "6282251004290";
                const waURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;
                
                console.log('WhatsApp URL Length:', waURL.length);
                console.log('WhatsApp URL:', waURL);

                // Close loading
                Swal.close();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Pesanan Berhasil!',
                    html: `Nomor pesanan: <strong>${result.orderNumber}</strong><br>Anda akan diarahkan ke WhatsApp`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    // Open WhatsApp
                    window.open(waURL, '_blank');
                    
                    // Clear cart AFTER opening WhatsApp
                    localStorage.removeItem('capullet_cart');
                    
                    // Redirect to catalog
                    setTimeout(() => {
                        window.location.href = 'katalog.php';
                    }, 1000);
                });

            } else {
                throw new Error(result.message || 'Gagal menyimpan pesanan');
            }

        } catch (error) {
            console.error('Error details:', error);
            console.error('Error message:', error.message);
            
            Swal.fire({
                icon: 'warning',
                title: 'Pesanan Dicatat Manual',
                html: `Data pesanan tidak tersimpan ke sistem (${error.message}), tapi akan tetap dikirim ke WhatsApp`,
                confirmButtonText: 'Lanjut ke WhatsApp'
            }).then(() => {
                // Fallback: tetap kirim ke WA meskipun gagal save
                let message = `Halo Capullet, saya mau pesan dong:\n\n`;
                message += `*Nama:* ${name}\n`;
                message += `*No. HP:* ${phone}\n`;
                message += `*Pengiriman:* ${delivery}\n`;
                
                if (delivery === 'Pesan Kurir') {
                    message += `*Alamat:* ${address}\n`;
                }
                
                message += `*Pembayaran:* ${payment}\n`;
                message += `\n*--- RINCIAN PESANAN ---*\n`;
                
                cart.forEach(item => {
                    let itemPriceTotal = item.price * item.quantity;
                    let friedText = "";
                    
                    if(item.isFried) {
                        itemPriceTotal += (item.friedPrice * item.quantity);
                        friedText = " (Goreng)";
                    }

                    message += `- ${item.name}${friedText} (${item.quantity}x) : Rp ${itemPriceTotal.toLocaleString('id-ID')}\n`;
                });

                message += `\n*TOTAL: Rp ${finalTotal.toLocaleString('id-ID')}*\nMohon konfirmasi ketersediaan produk. Terima kasih!`;

                const encodedMessage = encodeURIComponent(message);
                const waNumber = "6282251004290"; 
                window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
                
                // Clear cart
                localStorage.removeItem('capullet_cart');
                setTimeout(() => {
                    window.location.href = 'katalog.php';
                }, 1000);
            });
        }
    });

    renderCart();
    toggleDeliveryOptions();
});
