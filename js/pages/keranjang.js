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
                    <a href="katalog.html" class="btn btn-primary">Belanja Sekarang</a>
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

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            Swal.fire('Oops', 'Keranjang kosong!', 'error');
            return;
        }

        const name = document.getElementById('buyerName').value;
        const delivery = document.querySelector('input[name="deliveryOption"]:checked').value;
        const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
        const address = document.getElementById('buyerAddress').value;

        let message = `Halo Capullet, saya mau pesan dong:\n\n`;
        message += `*Nama:* ${name}\n`;
        message += `*Pengiriman:* ${delivery}\n`;
        
        if (delivery === 'Pesan Kurir') {
            message += `*Alamat:* ${address}\n`;
        }
        
        message += `*Pembayaran:* ${payment}\n`;
        
        message += `\n*--- RINCIAN PESANAN ---*\n`;
        
        let finalTotal = 0;
        cart.forEach(item => {
            let itemPriceTotal = item.price * item.quantity;
            let friedText = "";
            
            if(item.isFried) {
                itemPriceTotal += (item.friedPrice * item.quantity);
                friedText = " (Goreng)";
            }

            message += `- ${item.name}${friedText} (${item.quantity}x) : Rp ${itemPriceTotal.toLocaleString('id-ID')}\n`;
            finalTotal += itemPriceTotal;
        });

        message += `\n*TOTAL: Rp ${finalTotal.toLocaleString('id-ID')}*\nMohon konfirmasi ketersediaan produk. Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const waNumber = "6282251004290"; 
        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
    });

    renderCart();
    toggleDeliveryOptions();
});
