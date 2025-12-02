-- ========================================
-- Drop existing database and recreate
-- ========================================
DROP DATABASE IF EXISTS capullet;
CREATE DATABASE capullet;

USE capullet;

-- ========================================
-- Tabel ADMIN
-- ========================================
CREATE TABLE admin (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (username: admin, password: admin123)
-- Password is hashed using bcrypt
INSERT INTO admin (username, password, email) VALUES
('admin', '$2y$10$dXkhXSroNOOi7ckjpKI.3.r6KgSL6s4l7NEVM0p3tctiC3zRX16pK', 'admin@capullet.com');

-- ========================================
-- Tabel KATEGORI
-- ========================================
CREATE TABLE kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    gambar VARCHAR(255),
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO kategori (nama_kategori, slug, deskripsi) VALUES
('Keripik', 'keripik', 'Keripik renyah dan gurih'),
('Risol', 'risol', 'Risol dengan berbagai isian'),
('Minuman', 'minuman', 'Minuman segar dan nikmat');

-- ========================================
-- Tabel PRODUK
-- ========================================
CREATE TABLE produk (
    id_produk INT AUTO_INCREMENT PRIMARY KEY,
    id_kategori INT NOT NULL,
    nama_produk VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(10, 2) NOT NULL,
    gambar_utama VARCHAR(255),
    slug VARCHAR(200) NOT NULL UNIQUE,
    stok INT DEFAULT 0,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori) ON DELETE CASCADE
);

-- Insert sample products
INSERT INTO produk (id_kategori, nama_produk, deskripsi, harga, gambar_utama, slug, stok, is_best_seller) VALUES
(1, 'Keripik Mustofa Usus', 'Olahan usus ayam pilihan yang renyah dan gurih.', 23000, 'images/keripik-mustofa-usus.jpg', 'keripik-mustofa-usus', 100, 1),
(1, 'Keripik Mustofa Kulit', 'Kulit ayam crispy dengan bumbu mustofa khas.', 25000, 'images/keripik-mustofa-kulit.jpg', 'keripik-mustofa-kulit', 100, 0),
(2, 'American Risol', 'Isian smokebeef, telur, keju, dan mayones.', 33000, 'images/american-risol.jpg', 'american-risol', 50, 1),
(2, 'American Mentai', 'Risol premium dengan saus mentai yang creamy.', 35000, 'images/american-mentai.jpg', 'american-mentai', 50, 0),
(3, 'Lemongrass', 'Minuman segar serai dan lemon.', 7000, 'images/lemongrass.jpg', 'lemongrass', 200, 0),
(3, 'Es Nutella', 'Minuman coklat Nutella yang manis dan creamy.', 20000, 'images/es-nutella.jpg', 'es-nutella', 150, 0);

-- ========================================
-- Tabel TESTIMONI
-- ========================================
CREATE TABLE testimoni (
    id_testimoni INT AUTO_INCREMENT PRIMARY KEY,
    id_produk INT,
    nama_pemberi VARCHAR(100) NOT NULL,
    profil VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    isi_testimoni TEXT NOT NULL,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE
);

-- ========================================
-- Tabel ORDERS (PENJUALAN)
-- ========================================
CREATE TABLE orders (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    customer_address TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ========================================
-- Tabel ORDER ITEMS (DETAIL PENJUALAN)
-- ========================================
CREATE TABLE order_items (
    id_order_item INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT NOT NULL,
    id_produk INT NULL,
    nama_produk VARCHAR(200) NOT NULL,
    harga DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_order) REFERENCES orders(id_order) ON DELETE CASCADE,
    INDEX idx_order (id_order)
);

-- ========================================
-- Tabel KEGIATAN
-- ========================================
CREATE TABLE kegiatan (
    id_kegiatan INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    deskripsi TEXT,
    gambar VARCHAR(255),
    tanggal_kegiatan DATE,
    lokasi VARCHAR(200),
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample kegiatan
INSERT INTO kegiatan (judul, slug, deskripsi, gambar, lokasi) VALUES
('Kita Indonesia Pasar Seni Tradisional', 'kita-indonesia-pasar-seni-tradisional', 'Capullet turut berpartisipasi dalam acara Kita Indonesia Pasar Seni Tradisional yang diselenggarakan oleh RBI Samarinda di Halaman GOR Segiri, memberikan kesempatan bagi pengunjung untuk menikmati berbagai produk unggulan kami.', 'images/kita-indonesia-pasar-seni-tradisional.jpg', 'Halaman GOR Segiri'),
('Pojok UMKM', 'pojok-umkm', 'Setiap akhir pekan, Capullet hadir di Lobby Hotel Puri Senyiur dalam acara Pojok UMKM. Ini adalah kesempatan emas untuk menemukan dan membeli produk-produk spesial kami langsung di lokasi dengan suasana yang nyaman.', 'images/pojok-umkm.jpg', 'Lobby Hotel Puri Senyiur');

-- ========================================
-- Tabel FAQ
-- ========================================
CREATE TABLE faq (
    id_faq INT AUTO_INCREMENT PRIMARY KEY,
    pertanyaan TEXT NOT NULL,
    jawaban TEXT NOT NULL,
    urutan INT DEFAULT 0,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample FAQs
INSERT INTO faq (pertanyaan, jawaban, urutan) VALUES
('Di mana saja produk Capullet bisa dibeli?', 'Produk kami tersedia di beberapa tempat, seperti Gerai Panglima Roti, Wisata Buah Antasari, Muara Kafe, Brownies Amanda Kalimantan Selatan, dan Farmer Market Mall SCP. Setiap Sabtu dan Minggu, Anda juga bisa menemukan kami di event Weekend UMKM.', 1),
('Apakah bisa pesan langsung dari rumah?', 'Bisa banget! Tapi untuk pengambilan langsung ke rumah, harus janjian dulu ya supaya kami bisa menyiapkan pesanan Anda dengan baik.', 2),
('Metode pembayaran apa saja yang tersedia?', 'Anda bisa bayar dengan QRIS, transfer bank, atau cash saat pengambilan pesanan.', 3),
('Apakah produk Capullet halal?', 'Semua bahan yang kami gunakan halal dan aman dikonsumsi, serta diproses secara higienis di dapur produksi kami.', 4);

-- ========================================
-- Tabel KONTAK
-- ========================================
CREATE TABLE kontak (
    id_kontak INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    no_telepon VARCHAR(20),
    pesan TEXT NOT NULL,
    status ENUM('baru', 'dibaca', 'diproses', 'selesai') DEFAULT 'baru',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- ========================================
-- Tabel TENTANG KAMI
-- ========================================
CREATE TABLE tentang_kami (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul_section VARCHAR(200),
    konten TEXT NOT NULL,
    gambar VARCHAR(255),
    urutan INT DEFAULT 0,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);