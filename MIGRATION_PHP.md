# Migrasi HTML ke PHP - Capullet

## ✅ Perubahan yang Dilakukan

### 1. **Rename Semua File .html → .php**

**File User/Public:**
- ✅ `index.html` → `index.php`
- ✅ `katalog.html` → `katalog.php`
- ✅ `keranjang.html` → `keranjang.php`
- ✅ `kegiatan.html` → `kegiatan.php`
- ✅ `kontak.html` → `kontak.php`
- ✅ `tentang-kami.html` → `tentang-kami.php`

**File Admin:**
- ✅ `login-admin.html` → `login-admin.php`
- ✅ `dashboard-admin.html` → `dashboard-admin.php`
- ✅ `manajemen-kategori.html` → `manajemen-kategori.php`
- ✅ `manajemen-produk.html` → `manajemen-produk.php`
- ✅ `manajemen-penjualan.html` → `manajemen-penjualan.php`
- ✅ `manajemen-kegiatan.html` → `manajemen-kegiatan.php`
- ✅ `manajemen-kontak.html` → `manajemen-kontak.php`
- ✅ `manajemen-tentang-kami.html` → `manajemen-tentang-kami.php`
- ✅ `manajemen-faqs.html` → `manajemen-faqs.php`

---

### 2. **Session Protection untuk Halaman Admin**

**File Baru:**
- ✅ `includes/auth-check.php` - Session validation

**Ditambahkan di:**
- ✅ Semua halaman `manajemen-*.php`
- ✅ `dashboard-admin.php`

**Fungsi:**
```php
<?php
require_once 'includes/auth-check.php';
?>
```
- Redirect ke `login-admin.php` jika belum login
- Protect semua halaman admin

---

### 3. **Update Authentication System**

**Login System:**
- ✅ `login-admin.js` - Pakai API `api/auth/login.php`
- ✅ Redirect ke `dashboard-admin.php` setelah login

**Logout System:**
- ✅ `js/admin/logout.js` - Handle logout
- ✅ Included di semua halaman admin
- ✅ API `api/auth/logout.php`

---

### 4. **Update Semua Link Internal**

**Di File PHP:**
- ✅ Semua `href="*.html"` → `href="*.php"`
- ✅ Link navigasi admin
- ✅ Logo links
- ✅ Menu links

**Di File JavaScript:**
- ✅ `keranjang.js` - `katalog.html` → `katalog.php`
- ✅ Redirect links
- ✅ Window.location references

---

## 🔒 Security Features

### **Session Management:**
```php
// includes/auth-check.php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login-admin.php');
    exit();
}
```

### **API Authentication:**
- `api/auth/login.php` - Validate credentials
- `api/auth/logout.php` - Destroy session
- `api/auth/check-session.php` - Check login status

---

## 🚀 Cara Menggunakan

### **1. Setup Admin User:**
```
http://localhost/Capullet/api/create-admin.php
```
- Username: `admin`
- Password: `admin123`

### **2. Login Admin:**
```
http://localhost/Capullet/login-admin.php
```

### **3. Access User Pages:**
```
http://localhost/Capullet/index.php
http://localhost/Capullet/katalog.php
http://localhost/Capullet/keranjang.php
```

---

## ⚠️ PENTING - Konfigurasi Server

### **Apache (.htaccess) - Opsional:**
```apache
# Redirect .html ke .php
RewriteEngine On
RewriteCond %{REQUEST_FILENAME}.php -f
RewriteRule ^(.*)\.html$ $1.php [L,R=301]

# Remove .php extension (opsional)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.php -f
RewriteRule ^(.*)$ $1.php [L]
```

### **Default Document:**
Pastikan `index.php` sebagai default:
```apache
DirectoryIndex index.php index.html
```

---

## ✅ Checklist Testing

**User Pages:**
- [ ] `index.php` - Homepage load OK
- [ ] `katalog.php` - Produk & kategori dari database
- [ ] `keranjang.php` - Add to cart & WA redirect
- [ ] Navigation links work
- [ ] Cart count update

**Admin Pages:**
- [ ] `login-admin.php` - Login dengan API
- [ ] Session redirect ke dashboard
- [ ] `dashboard-admin.php` - Protected, tampil jika login
- [ ] Semua `manajemen-*.php` protected
- [ ] Logout button work
- [ ] CRUD operations (kategori, produk, dll)
- [ ] Penjualan data dari database

**API Endpoints:**
- [ ] `api/auth/login.php` - Login success
- [ ] `api/auth/logout.php` - Logout success
- [ ] `api/get-products.php` - Return products
- [ ] `api/get-categories.php` - Return categories
- [ ] `api/save-order.php` - Save order OK

---

## 🐛 Troubleshooting

### **Error: "Session not found"**
✅ Pastikan sudah login di `login-admin.php`
✅ Check PHP session enabled
✅ Clear browser cookies

### **Error: "Cannot find file"**
✅ Update link dari `.html` ke `.php`
✅ Check file path

### **Database connection failed**
✅ Check Laragon MySQL running
✅ Verify `api/config/database.php`

---

## 📝 Notes

- Semua file sekarang **.php**
- Session-based authentication untuk admin
- API-based untuk data (modern architecture)
- Backward compatible (API tetap sama)
- Security enhanced dengan session protection

---

**Migration Status: ✅ COMPLETE**
**Date: December 1, 2025**
