<?php
require_once 'api/config/database.php';

// Get best seller products
$db = Database::getInstance();
$pdo = $db->getConnection();

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
                <img src="images/logo.png" alt="Logo Capullet">
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
        <section class="hero-section">
                <div class="hero-overlay"></div>
            <div class="container hero-content">
                <p class="subtitle">Capullet Pangan Lumintu</p>
                <h1>A TASTE TO<br>REMEMBER.</h1>
                <a href="katalog.php" class="btn btn-primary btn-lg">Jelajahi Rasa</a>
            </div>
        </section>

        <!-- 2. ABOUT US (Full Background) -->
        <section class="about-section">
            <div class="about-overlay"></div>
            <div class="container about-content">
                <div class="about-text">
                    <span class="section-tag"><i class="fas fa-leaf"></i> Sekilas Tentang Kami</span>
                    <h2>Cita Rasa Otentik,<br>Dibuat dengan Hati.</h2>
                    <p>Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food. Kami tidak sekadar menjual makanan, tapi menyajikan pengalaman rasa yang renyah, lezat, dan selalu segar untuk menemani setiap momen spesial Anda.</p>
                    
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
                        <i class="fas fa-shopping-bag"></i> Pesan Sekarang
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
                        <!-- Card 1 -->
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"Rasanya mantap! Frozen foodnya praktis banget buat stok di rumah. Anak-anak suka banget sama risol mayonya."</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="images/testi1.jpg" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4>Budi Santoso</h4>
                                </div>
                            </div>
                        </article>

                        <!-- Card 2 -->
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"Enak dan sudah lama langganan. Rekomen banget buat yang cari camilan gurih di Samarinda."</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="images/testi2.jpg" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4>PELANGIJAYA.2024</h4>
                                </div>
                            </div>
                        </article>

                        <!-- Card 3 -->
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"Produksi usus ter the best! Enak renyah dan 1 lagi rasanya ga bisa bikin lupa. Bumbunya pas banget."</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="images/testi3.jpg" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4>Oryza Maghfirotunisa</h4>
                                </div>
                            </div>
                        </article>

                        <!-- Card 4 -->
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"Produk ususnya saya suka yang original tidak pedas. Kerasnya pas, krenyes, dan gurihnya mantap pol!"</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="images/testi4.jpg" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4>Muhammad Fadjar</h4>
                                </div>
                            </div>
                        </article>

                        <!-- Card 5 (Extra for smooth loop) -->
                        <article class="testimonial-card">
                            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                            <div class="card-body">
                                <p>"Pelayanan ramah, pengiriman cepat, dan rasanya konsisten enak dari dulu. Sukses terus Capullet!"</p>
                            </div>
                            <div class="card-footer">
                                <div class="user-avatar">
                                    <img src="images/testi5.jpg" alt="User">
                                </div>
                                <div class="user-info">
                                    <h4>Siti Aminah</h4>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- Navigasi -->
                    <div class="slider-controls">
                        <button class="slider-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>
                        <button class="slider-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="view-all-container">
                    <a href="https://maps.app.goo.gl/..." class="btn btn-primary" target="_blank">Beri Ulasan</a>
                </div>
            </div>
        </section>

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