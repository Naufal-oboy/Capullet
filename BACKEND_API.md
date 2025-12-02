# Backend API Documentation - Capullet

## 📁 Struktur Backend

```
api/
├── config/
│   └── database.php          # Database connection (Singleton)
├── auth/
│   ├── login.php            # Login admin
│   ├── logout.php           # Logout admin
│   └── check-session.php    # Validasi session
├── save-order.php           # Simpan pesanan baru
├── get-orders.php           # Ambil semua pesanan
├── get-products.php         # Ambil daftar produk aktif
├── update-order.php         # Update pesanan lengkap
├── update-order-status.php  # Update status pesanan
├── delete-order.php         # Hapus pesanan
├── get-stats.php            # Statistik penjualan
└── create-admin.php         # Script create admin (run once)
```

---

## 🔧 Setup Awal

### 1. Import Database
```sql
-- Import file: Capullet.sql
```

### 2. Buat Admin User (Jalankan Sekali)
```
http://localhost/Capullet/api/create-admin.php
```
**Default Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **PENTING:** Ganti password setelah login pertama!

---

## 📚 API Endpoints

### **Authentication**

#### 1. Login Admin
**Endpoint:** `POST /api/auth/login.php`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "username": "admin"
}
```

#### 2. Logout
**Endpoint:** `POST /api/auth/logout.php`

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

#### 3. Check Session
**Endpoint:** `GET /api/auth/check-session.php`

**Response:**
```json
{
  "success": true,
  "logged_in": true,
  "username": "admin"
}
```

---

### **Orders (Pesanan)**

#### 1. Get All Orders
**Endpoint:** `GET /api/get-orders.php`

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id_order": "1",
      "order_number": "ORD-2025-001",
      "customer_name": "John Doe",
      "customer_phone": "081234567890",
      "total_amount": "150000",
      "status": "pending",
      "items": [...]
    }
  ]
}
```

#### 2. Save New Order
**Endpoint:** `POST /api/save-order.php`

**Request:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "081234567890",
  "customerAddress": "Jl. Merdeka No. 123",
  "subtotal": 150000,
  "shippingCost": 10000,
  "paymentMethod": "QRIS",
  "notes": "Pengiriman: Kurir",
  "items": [
    {
      "productId": 1,
      "productName": "Eco Bag",
      "price": 75000,
      "quantity": 2,
      "subtotal": 150000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "orderNumber": "ORD-2025-001",
  "orderId": 1
}
```

#### 3. Update Order
**Endpoint:** `POST /api/update-order.php`

**Request:**
```json
{
  "id_order": 1,
  "customerName": "John Doe Updated",
  "status": "confirmed",
  "items": [...]
}
```

#### 4. Update Order Status
**Endpoint:** `POST /api/update-order-status.php`

**Request:**
```json
{
  "id_order": 1,
  "status": "confirmed"
}
```

**Status Options:**
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `completed`
- `cancelled`

#### 5. Delete Order
**Endpoint:** `POST /api/delete-order.php`

**Request:**
```json
{
  "id_order": 1
}
```

---

### **Products**

#### Get Products
**Endpoint:** `GET /api/get-products.php`

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id_produk": "1",
      "nama_produk": "Eco Bag Premium",
      "harga": "75000",
      "is_aktif": "1"
    }
  ]
}
```

---

### **Statistics**

#### Get Stats
**Endpoint:** `GET /api/get-stats.php`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 150,
    "pendingOrders": 25,
    "processingOrders": 30,
    "completedOrders": 90,
    "totalRevenue": 15000000,
    "monthlyRevenue": 3500000,
    "bestSellers": [...],
    "recentOrders": [...]
  }
}
```

---

## 🔐 Security Features

1. **Database Singleton Pattern** - Mencegah multiple connections
2. **Prepared Statements** - SQL Injection protection
3. **Password Hashing** - Bcrypt encryption
4. **Session Management** - Secure admin authentication
5. **CORS Headers** - Cross-origin resource sharing
6. **Input Validation** - Data validation sebelum insert

---

## 🚀 Cara Penggunaan

### Frontend → Backend Flow:

```javascript
// Example: Save Order from Cart
const response = await fetch('api/save-order.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
});

const result = await response.json();
if (result.success) {
    console.log('Order saved:', result.orderNumber);
}
```

---

## ⚙️ Configuration

Edit `api/config/database.php` untuk setting database:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'capullet');
define('DB_USER', 'root');
define('DB_PASS', '');
```

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
✅ Pastikan MySQL running di Laragon
✅ Cek database name di config
✅ Cek username/password database

### Error: "Cannot find file"
✅ Pastikan folder `api/` ada di root
✅ Cek path `require_once` benar

### Session tidak work
✅ Pastikan session_start() aktif
✅ Cek PHP session configuration

---

## 📝 Notes

- Semua response dalam format JSON
- Gunakan `Content-Type: application/json` untuk POST request
- Error handling otomatis return JSON error message
- Database transaction untuk data consistency
