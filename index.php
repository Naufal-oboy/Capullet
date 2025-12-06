<?php
require_once 'api/config/database.php';

// Get best seller products
$db = Database::getInstance();
$pdo = $db->getConnection();

// Get website settings
try {
    $stmtSettings = $pdo->query("SELECT * FROM website_settings LIMIT 1");
    $settings = $stmtSettings->fetch();
} catch (PDOException $e) {
    // Default values if table doesn't exist
    $settings = [
        'logo' => 'images/logo.png',
        'hero_image' => 'images/hero-image.jpg',
        'hero_subtitle' => 'Capullet Pangan Lumintu',
        'hero_title' => 'A TASTE TO\nREMEMBER.',
        'hero_button_text' => 'Jelajahi Rasa',
        'about_image' => 'images/about-home.png',
        'about_tag' => 'Sekilas Tentang Kami',
        'about_title' => 'Cita Rasa Otentik,\nDibuat dengan Hati.',
        'about_description' => 'Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food.'
    ];
}

$stmtBestSeller = $pdo->query("
    SELECT p.*, k.nama_kategori 
    FROM produk p 
    LEFT JOIN kategori k ON p.id_kategori = k.id_kategori 
    WHERE p.is_best_seller = 1 AND p.is_aktif = 1 
    ORDER BY p.created_at DESC 
    LIMIT 2
");
$bestSellers = $stmtBestSeller->fetchAll();

// Get categories for catalog
$stmtCategories = $pdo->query("SELECT * FROM kategori WHERE is_aktif = 1 ORDER BY nama_kategori");
$categories = $stmtCategories->fetchAll();

// Get products grouped by category (max 3 per category)
$productsByCategory = [];
foreach ($categories as $cat) {
    $stmt = $pdo->prepare("
        SELECT p.*, k.nama_kategori 
        FROM produk p 
        LEFT JOIN kategori k ON p.id_kategori = k.id_kategori 
        WHERE p.id_kategori = ? AND p.is_aktif = 1 
        ORDER BY p.created_at DESC 
        LIMIT 3
    ");
    $stmt->execute([$cat['id_kategori']]);
    $productsByCategory[$cat['nama_kategori']] = $stmt->fetchAll();
}

// Get recent activities
$stmtActivities = $pdo->query("
    SELECT * FROM kegiatan 
    WHERE is_aktif = 1 
    ORDER BY created_at DESC 
    LIMIT 2
");
$activities = $stmtActivities->fetchAll();

// Get highlighted product (newest or featured)
$stmtHighlight = $pdo->query("
    SELECT * FROM produk 
    WHERE is_aktif = 1 
    ORDER BY created_at DESC 
    LIMIT 1
");
$highlightProduct = $stmtHighlight->fetch();

// Get reviews (testimonials) and seed defaults if table empty
$reviews = [];
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        rating INT DEFAULT 5,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $countStmt = $pdo->query("SELECT COUNT(*) FROM reviews");
    $reviewCount = (int) ($countStmt->fetchColumn() ?? 0);

    if ($reviewCount === 0) {
        $seedReviews = [
            [
                'name' => 'Budi Santoso',
                'email' => '',
                'rating' => 5,
                'message' => 'Rasanya mantap! Frozen foodnya praktis banget buat stok di rumah. Anak-anak suka banget sama risol mayonya.'
            ],
            [
                'name' => 'PELANGIJAYA.2024',
                'email' => '',
                'rating' => 5,
                'message' => 'Enak dan sudah lama langganan. Rekomen banget buat yang cari camilan gurih di Samarinda.'
            ],
            [
                'name' => 'Oryza Maghfirotunisa',
                'email' => '',
                'rating' => 5,
                'message' => 'Produksi usus ter the best! Enak renyah dan rasanya ga bisa bikin lupa. Bumbunya pas banget.'
            ],
            [
                'name' => 'Muhammad Fadjar',
                'email' => '',
                'rating' => 5,
                'message' => 'Produk ususnya saya suka yang original tidak pedas. Kerasnya pas, krenyes, dan gurihnya mantap pol!'
            ],
            [
                'name' => 'Siti Aminah',
                'email' => '',
                'rating' => 5,
                'message' => 'Pelayanan ramah, pengiriman cepat, dan rasanya konsisten enak dari dulu. Sukses terus Capullet!'
            ],
        ];

        $ins = $pdo->prepare("INSERT INTO reviews (name, email, rating, message) VALUES (:name, :email, :rating, :message)");
        foreach ($seedReviews as $rev) {
            $ins->execute([
                ':name' => $rev['name'],
                ':email' => $rev['email'],
                ':rating' => $rev['rating'],
                ':message' => $rev['message'],
            ]);
        }
    }

    $stmtReviews = $pdo->query("SELECT id, name, email, rating, message, created_at FROM reviews ORDER BY created_at DESC");
    $reviews = $stmtReviews->fetchAll();
} catch (Exception $e) {
    $reviews = [];
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capullet - Beranda</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/pages/index.css">
    
    <!-- FontAwesome (Icons) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    
    <!-- HEADER -->
    <header>
        <nav class="container">
            <a href="index.php" class="logo">
                <img src="<?= htmlspecialchars($settings['logo'] ?? 'images/logo.png') ?>" alt="Logo Capullet">
            </a>
            
            <!-- Hamburger Menu (Mobile) -->
            <div class="menu-toggle">
                <span class="bar-top"></span>
                <span class="bar-middle"></span>
                <span class="bar-bottom"></span>
            </div>

            <ul>
                <li><a href="index.php" class="active">Beranda</a></li>
                <li><a href="katalog.php">Katalog</a></li>
                <li><a href="kegiatan.php">Kegiatan</a></li>
                <li><a href="tentang-kami.php">Tentang Kami</a></li>
                <li><a href="kontak.php">Kontak</a></li>
            </ul>
            
            <a href="keranjang.php" class="cart-button">
                <i class="fas fa-shopping-cart"></i>
                <!-- Badge angka akan muncul via JS -->
            </a>
        </nav>
    </header>

    <main>
        <!-- 1. HERO SECTION (Full Screen) -->
        <section class="hero-section" style="background: url('<?= htmlspecialchars($settings['hero_image'] ?? 'images/hero-image.jpg') ?>') no-repeat center center/cover;">
                <div class="hero-overlay"></div>
            <div class="container hero-content">
                <p class="subtitle"><?= htmlspecialchars($settings['hero_subtitle'] ?? 'Capullet Pangan Lumintu') ?></p>
                <h1><?= nl2br(htmlspecialchars($settings['hero_title'] ?? 'A TASTE TO\nREMEMBER.')) ?></h1>
                <a href="katalog.php" class="btn btn-primary btn-lg"><?= htmlspecialchars($settings['hero_button_text'] ?? 'Jelajahi Rasa') ?></a>
            </div>
        </section>

        <!-- 2. ABOUT US (Full Background) -->
        <section class="about-section" style="background: url('<?= htmlspecialchars($settings['about_image'] ?? 'images/about-home.png') ?>') no-repeat center center/cover;">
            <div class="about-overlay"></div>
            <div class="container about-content">
                <div class="about-text">
                    <span class="section-tag"><i class="fas fa-leaf"></i> <?= htmlspecialchars($settings['about_tag'] ?? 'Sekilas Tentang Kami') ?></span>
                    <h2><?= nl2br(htmlspecialchars($settings['about_title'] ?? 'Cita Rasa Otentik,\nDibuat dengan Hati.')) ?></h2>
                    <p><?= htmlspecialchars($settings['about_description'] ?? 'Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food. Kami tidak sekadar menjual makanan, tapi menyajikan pengalaman rasa yang renyah, lezat, dan selalu segar untuk menemani setiap momen spesial Anda.') ?></p>
                    
                    <div class="about-stats">
                        <div class="stat-item"><i class="fas fa-check-circle"></i><span>100% Halal</span></div>
                        <div class="stat-item"><i class="fas fa-medal"></i><span>Bahan Premium</span></div>
                        <div class="stat-item"><i class="fas fa-heart"></i><span>Homemade</span></div>
                    </div>

                    <a href="tentang-kami.php" class="btn btn-primary">Kenali Kami Lebih Dekat</a>
                </div>
                <!-- Spacer untuk layout grid -->
                <div class="about-spacer"></div>
            </div>
        </section>

        <!-- 3. NEW MENU (Highlight Section) -->
        <section class="highlight-product-section">
            <div class="container highlight-grid">
                <div class="highlight-image">
                    <img src="<?= htmlspecialchars($highlightProduct['gambar_utama'] ?? 'images/placeholder.jpg') ?>" alt="<?= htmlspecialchars($highlightProduct['nama_produk'] ?? 'Product') ?>">
                </div>
                <div class="highlight-text">
                    <span class="section-tag">Menu Baru Kami! ^_~</span>
                    <h3><?= htmlspecialchars($highlightProduct['nama_produk'] ?? 'Produk Terbaru') ?></h3>
                    <p><?= htmlspecialchars($highlightProduct['deskripsi'] ?? '') ?></p>
                    
                    <div class="price-box">
                        <span class="currency">Rp</span>
                        <span class="amount"><?= number_format($highlightProduct['harga'] ?? 0, 0, ',', '.') ?></span>
                    </div>

                    <a href="kontak.php" class="btn btn-primary btn-lg">
                        <i class="fas fa-shopping-bag"></i> Beli Sekarang
                    </a>
                </div>
            </div>
        </section>

        <!-- 4. PRODUK TERLARIS (Horizontal Compact Card) -->
        <section class="best-seller-section">
            <div class="container">
                <div class="section-header">
                    <h2>Produk Terlaris</h2>
                    <p>Camilan favorit yang selalu habis duluan!</p>
                </div>
                
                <div class="product-grid">
                    <?php foreach ($bestSellers as $product): ?>
                    <article class="product-card--horizontal">
                        <div class="product-card-content">
                            <h3><?= htmlspecialchars($product['nama_produk']) ?></h3>
                            <p class="price">Rp <?= number_format($product['harga'], 0, ',', '.') ?></p>
                            <a href="kontak.php" class="btn btn-primary">Beli Sekarang</a>
                        </div>
                        <div class="product-card-image">
                            <img src="<?= htmlspecialchars($product['gambar_utama']) ?>" alt="<?= htmlspecialchars($product['nama_produk']) ?>">
                        </div>
                    </article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- 5. KATALOG KAMI (Per Kategori dengan Filter Style) -->
        <section class="catalog-section" id="katalog">
            <div class="container">
                <div class="section-header">
                    <h2>Katalog Kami</h2>
                    <p>Semua camilan favorit dalam satu tempat!</p>
                </div>
                
                <!-- Category Filter Pills -->
                <div class="filter-controls-index">
                    <?php foreach ($productsByCategory as $categoryName => $products): ?>
                        <?php if (!empty($products)): ?>
                        <button data-category="<?= strtolower(str_replace(' ', '-', $categoryName)) ?>"><?= htmlspecialchars($categoryName) ?></button>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
                
                <!-- Products grouped by category -->
                <?php foreach ($productsByCategory as $categoryName => $products): ?>
                    <?php if (!empty($products)): ?>
                    <div class="category-section-index" data-category="<?= strtolower(str_replace(' ', '-', $categoryName)) ?>">
                        <div class="product-grid">
                            <?php foreach ($products as $product): ?>
                            <article class="product-card">
                                <img src="<?= htmlspecialchars($product['gambar_utama']) ?>" alt="<?= htmlspecialchars($product['nama_produk']) ?>">
                                <div class="product-card-content">
                                    <h3><?= htmlspecialchars($product['nama_produk']) ?></h3>
                                    <p class="price">Rp <?= number_format($product['harga'], 0, ',', '.') ?></p>
                                    <p class="description"><?= htmlspecialchars($product['deskripsi']) ?></p>
                                </div>
                            </article>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                <?php endforeach; ?>
                
                <div class="view-all-container">
                    <a href="katalog.php" class="btn btn-primary">Lihat Semua Menu</a>
                </div>
            </div>
        </section>

        <!-- 6. KEGIATAN (Parallax Background) -->
        <section class="activity-section">
            <div class="activity-overlay"></div>
            <div class="container">
                <div class="section-header white-text">
                    <h2></i> Kegiatan Kami</h2>
                    <p>Temukan kami di berbagai event seru kota Samarinda.</p>
                </div>

                <div class="activity-grid">
                    <?php foreach ($activities as $activity): ?>
                    <div class="activity-card">
                        <div class="act-img">
                            <img src="<?= htmlspecialchars($activity['gambar']) ?>" alt="<?= htmlspecialchars($activity['judul']) ?>">
                        </div>
                        <div class="act-info">
                            <h4><?= htmlspecialchars($activity['judul']) ?></h4>
                            <p><?= htmlspecialchars(substr($activity['deskripsi'], 0, 100)) ?>...</p>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <div class="view-all-container">
                    <a href="kegiatan.php" class="btn btn-secondary">Lihat Semua Kegiatan</a>
                </div>
            </div>
        </section>

        <!-- 7. TESTIMONIALS (3D Infinite Loop) -->
        <section class="testimonials-section">
            <div class="container">
                <div class="section-header">
                    <h2>Kata Mereka</h2>
                    <p>Kebahagiaan pelanggan adalah prioritas kami.</p>
                </div>
                
                <div class="testimonials-slider-container">
                    <div class="testimonials-track">
                        <?php
                        $fallbackAvatars = [
                            'images/testi1.jpg',
                            'images/testi2.jpg',
                            'images/testi3.jpg',
                            'images/testi4.jpg',
                            'images/testi5.jpg',
                        ];
                        $index = 0;
                        if (!empty($reviews)):
                            foreach ($reviews as $rev):
                                $avatar = $fallbackAvatars[$index % count($fallbackAvatars)];
                                $index++;
                        ?>
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"<?= htmlspecialchars($rev['message'] ?? '') ?>"</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="<?= htmlspecialchars($avatar) ?>" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4><?= htmlspecialchars($rev['name'] ?? 'Pengguna') ?></h4>
                                </div>
                            </div>
                        </article>
                        <?php endforeach; else: ?>
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"Belum ada ulasan. Jadilah yang pertama memberikan ulasan!"</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="images/testi1.jpg" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4>Pengguna</h4>
                                </div>
                            </div>
                        </article>
                        <?php endif; ?>
                    </div>

                    <!-- Navigasi -->
                    <div class="slider-controls">
                        <button class="slider-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>
                        <button class="slider-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="view-all-container">
                    <a href="#" class="btn btn-primary" id="btn-open-review">Beri Ulasan</a>
                </div>
            </div>
        </section>

        <!-- 7b. REVIEW FORM MODAL -->
        <div class="review-modal" id="review-modal" aria-hidden="true">
            <div class="review-modal-backdrop" id="review-modal-backdrop"></div>
            <div class="review-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
                <button class="review-modal-close" id="review-modal-close" aria-label="Tutup">&times;</button>
                <div class="section-header">
                    <h2 id="review-modal-title">Tulis Ulasan</h2>
                    <p>Bagikan pengalaman Anda agar kami bisa terus memperbaiki layanan.</p>
                </div>
                <form id="home-review-form" class="review-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="home-review-name">Nama</label>
                            <input type="text" id="home-review-name" name="name" placeholder="Mis: Budi Santoso" required>
                        </div>
                        <div class="form-group">
                            <label for="home-review-email">Email (opsional)</label>
                            <input type="email" id="home-review-email" name="email" placeholder="nama@email.com">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="home-review-message">Ulasan</label>
                            <textarea id="home-review-message" name="message" rows="4" placeholder="Contoh: Rasanya mantap! Frozen foodnya praktis banget buat stok di rumah. Anak-anak suka banget sama risol mayonya." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Kirim Ulasan</button>
                </form>
            </div>
        </div>

        <!-- 8. FAQ (Dynamic from Database) -->
        <section class="container faq-section" id="faq">
             <div class="section-header">
                <h2>FAQ</h2>
                <p>Pertanyaan yang sering diajukan.</p>
            </div>
            <div class="faq-container" id="faq-container">
                <!-- FAQ akan dimuat via JavaScript dari database -->
                <div class="loading-faq" style="text-align:center; padding:1.5rem; color:#888; font-size:0.95rem;">Memuat FAQ...</div>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-about">
                    <h3>Tentang Kami</h3>
                    <p>Capullet Pangan Lumintu adalah perusahaan yang memproduksi olahan keripik dan frozen food berkualitas.</p>
                </div>
                <div class="footer-nav">
                    <h3>Navigasi Cepat</h3>
                    <ul>
                        <li><a href="index.html">Beranda</a></li>
                        <li><a href="katalog.html">Katalog</a></li>
                        <li><a href="kegiatan.html">Kegiatan</a></li>
                        <li><a href="tentang-kami.html">Tentang Kami</a></li>
                        <li><a href="kontak.html">Kontak</a></li>
                    </ul>
                </div>
                <div class="footer-address">
                    <h3>Alamat</h3>
                    <p>Jl. Subulussalam I no. 9, Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda, Kalimantan Timur 75116</p>
                </div>
                <div class="footer-contact">
                    <h3>Hubungi Kami</h3>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-whatsapp"></i></a>
                        <a href="https://mail.google.com/mail/u/0/?fs=1&to=info@capullet.com" target="_blank" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 Capullet. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- SCRIPTS -->
    <script src="js/global.js"></script>
    <script src="js/pages/index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>