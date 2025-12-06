<?php
require_once 'includes/auth-check.php';
require_once 'api/config/database.php';

// Get current settings
$db = Database::getInstance();
$pdo = $db->getConnection();

// Check if table exists, if not create it
try {
    $stmt = $pdo->query("SELECT * FROM website_settings LIMIT 1");
    $settings = $stmt->fetch();
    
    // Check if footer columns exist, if not add them
    try {
        $pdo->query("SELECT footer_description FROM website_settings LIMIT 1");
    } catch (PDOException $e) {
        // Add footer columns
        $pdo->exec("ALTER TABLE website_settings 
            ADD COLUMN footer_description TEXT AFTER about_description,
            ADD COLUMN footer_address TEXT AFTER footer_description,
            ADD COLUMN footer_phone VARCHAR(50) DEFAULT '+62 812-3456-7890' AFTER footer_address,
            ADD COLUMN footer_email VARCHAR(100) DEFAULT 'info@capullet.com' AFTER footer_phone
        ");
        
        // Reload settings after adding columns
        $stmt = $pdo->query("SELECT * FROM website_settings LIMIT 1");
        $settings = $stmt->fetch();
    }
    
    // If no data, insert default OR update if data exists but empty
    if (!$settings) {
        $pdo->exec("
            INSERT INTO website_settings 
            (id, logo, hero_image, hero_subtitle, hero_title, hero_button_text, about_image, about_tag, about_title, about_description, footer_description, footer_address, footer_phone, footer_email, stat_products, stat_customers, stat_experience) 
            VALUES 
            (1, 'images/logo.png', 'images/hero-image.jpg', 'Capullet Pangan Lumintu', 'A TASTE TO\nREMEMBER.', 'Jelajahi Rasa', 'images/about-home.png', 'Sekilas Tentang Kami', 'Cita Rasa Otentik,\nDibuat dengan Hati.', 'Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food. Kami tidak sekadar menjual makanan, tapi menyajikan pengalaman rasa yang renyah, lezat, dan selalu segar untuk menemani setiap momen spesial Anda.', 'Capullet adalah produsen keripik dan frozen food berkualitas dengan rasa yang otentik dan lezat.', 'Jl. Contoh No. 123, Jakarta, Indonesia', '+62 812-3456-7890', 'info@capullet.com', 50, 1000, 5)
        ");
        $stmt = $pdo->query("SELECT * FROM website_settings LIMIT 1");
        $settings = $stmt->fetch();
    } else {
        // Update existing empty data
        $pdo->exec("
            UPDATE website_settings SET 
            logo = COALESCE(NULLIF(logo, ''), 'images/logo.png'),
            hero_image = COALESCE(NULLIF(hero_image, ''), 'images/hero-image.jpg'),
            hero_subtitle = COALESCE(NULLIF(hero_subtitle, ''), 'Capullet Pangan Lumintu'),
            hero_title = COALESCE(NULLIF(hero_title, ''), 'A TASTE TO\nREMEMBER.'),
            hero_button_text = COALESCE(NULLIF(hero_button_text, ''), 'Jelajahi Rasa'),
            about_image = COALESCE(NULLIF(about_image, ''), 'images/about-home.png'),
            about_tag = COALESCE(NULLIF(about_tag, ''), 'Sekilas Tentang Kami'),
            about_title = COALESCE(NULLIF(about_title, ''), 'Cita Rasa Otentik,\nDibuat dengan Hati.'),
            about_description = COALESCE(NULLIF(about_description, ''), 'Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food. Kami tidak sekadar menjual makanan, tapi menyajikan pengalaman rasa yang renyah, lezat, dan selalu segar untuk menemani setiap momen spesial Anda.'),
            footer_description = COALESCE(NULLIF(footer_description, ''), 'Capullet adalah produsen keripik dan frozen food berkualitas dengan rasa yang otentik dan lezat.'),
            footer_address = COALESCE(NULLIF(footer_address, ''), 'Jl. Contoh No. 123, Jakarta, Indonesia'),
            footer_phone = COALESCE(NULLIF(footer_phone, ''), '+62 812-3456-7890'),
            footer_email = COALESCE(NULLIF(footer_email, ''), 'info@capullet.com'),
            stat_products = COALESCE(NULLIF(stat_products, 0), 50),
            stat_customers = COALESCE(NULLIF(stat_customers, 0), 1000),
            stat_experience = COALESCE(NULLIF(stat_experience, 0), 5)
            WHERE id = 1
        ");
        $stmt = $pdo->query("SELECT * FROM website_settings LIMIT 1");
        $settings = $stmt->fetch();
    }
} catch (PDOException $e) {
    // Table doesn't exist, create it
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `website_settings` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `logo` varchar(255) DEFAULT 'images/logo.png',
          `hero_image` varchar(255) DEFAULT 'images/hero-image.jpg',
          `hero_subtitle` varchar(255) DEFAULT 'Capullet Pangan Lumintu',
          `hero_title` text,
          `hero_button_text` varchar(100) DEFAULT 'Jelajahi Rasa',
          `about_image` varchar(255) DEFAULT 'images/about-home.png',
          `about_tag` varchar(255) DEFAULT 'Sekilas Tentang Kami',
          `about_title` text,
          `about_description` text,
          `footer_description` text,
          `footer_address` text,
          `footer_phone` varchar(50) DEFAULT '+62 812-3456-7890',
          `footer_email` varchar(100) DEFAULT 'info@capullet.com',
          `stat_products` int(11) DEFAULT 50,
          `stat_customers` int(11) DEFAULT 1000,
          `stat_experience` int(11) DEFAULT 5,
          `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    
    // Insert default data with all values
    $pdo->exec("
        INSERT INTO website_settings 
        (id, logo, hero_image, hero_subtitle, hero_title, hero_button_text, about_image, about_tag, about_title, about_description, footer_description, footer_address, footer_phone, footer_email, stat_products, stat_customers, stat_experience) 
        VALUES 
        (1, 'images/logo.png', 'images/hero-image.jpg', 'Capullet Pangan Lumintu', 'A TASTE TO\nREMEMBER.', 'Jelajahi Rasa', 'images/about-home.png', 'Sekilas Tentang Kami', 'Cita Rasa Otentik,\nDibuat dengan Hati.', 'Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food. Kami tidak sekadar menjual makanan, tapi menyajikan pengalaman rasa yang renyah, lezat, dan selalu segar untuk menemani setiap momen spesial Anda.', 'Capullet adalah produsen keripik dan frozen food berkualitas dengan rasa yang otentik dan lezat.', 'Jl. Contoh No. 123, Jakarta, Indonesia', '+62 812-3456-7890', 'info@capullet.com', 50, 1000, 5)
    ");
    
    $stmt = $pdo->query("SELECT * FROM website_settings LIMIT 1");
    $settings = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Pengaturan - Capullet</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/admin/manajemen-kategori.css">
    <link rel="stylesheet" href="css/admin/manajemen-faqs.css">
    <link rel="stylesheet" href="css/admin/manajemen-pengaturan.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="admin-page">
    <header class="admin-header">
        <nav class="container">
            <a href="dashboard-admin.php" class="logo">
                <img src="images/logo.png" alt="Logo Capullet">
            </a>
            
            <div class="menu-toggle">
                <span class="bar-top"></span>
                <span class="bar-middle"></span>
                <span class="bar-bottom"></span>
            </div>

            <ul>
                <li><a href="dashboard-admin.php">Dashboard</a></li>
                <li><a href="manajemen-produk.php">Produk</a></li>
                <li><a href="manajemen-kategori.php">Kategori</a></li>
                <li><a href="manajemen-penjualan.php">Penjualan</a></li>
                <li><a href="manajemen-kegiatan.php">Kegiatan</a></li>
                <li><a href="manajemen-tentang-kami.php">Tentang Kami</a></li>
                <li><a href="manajemen-kontak.php">Kontak</a></li>
                <li><a href="manajemen-pengaturan.php" class="active">Pengaturan</a></li>
                <li class="mobile-logout"><a href="#">Keluar</a></li>
            </ul>

            <a href="#" class="btn btn-logout desktop-logout">Keluar</a>
        </nav>
    </header>

    <main class="admin-main container">
        <h1 class="admin-page-title">PENGATURAN</h1>

        <!-- SECTION PENGATURAN WEBSITE -->
        <div class="settings-container">
            <h2 style="color: var(--secondary-color); margin-bottom: 2rem; font-size: 1.8rem;"><i class="fas fa-cog"></i> Pengaturan Website</h2>
            
            <!-- Logo Section -->
                <div class="settings-section">
                    <h2><i class="fas fa-image"></i> Logo Website</h2>
                    <div class="form-group">
                        <label for="logo-upload">Upload Logo Baru</label>
                        <input type="file" id="logo-upload" accept="image/*">
                        <div class="current-image">
                            <p>Logo Saat Ini:</p>
                            <img src="<?= htmlspecialchars($settings['logo'] ?? 'images/logo.png') ?>" alt="Current Logo" id="current-logo">
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="updateLogo()">Update Logo</button>
                </div>

                <!-- Hero Slider Section -->
                <div class="settings-section">
                    <h2><i class="fas fa-sliders-h"></i> Hero Slider (Beranda)</h2>
                    
                    <div class="form-group">
                        <label for="hero-image-upload">Upload Gambar Hero</label>
                        <input type="file" id="hero-image-upload" accept="image/*">
                        <div class="current-image">
                            <p>Gambar Hero Saat Ini:</p>
                            <img src="<?= htmlspecialchars($settings['hero_image'] ?? 'images/hero-image.jpg') ?>" alt="Current Hero" id="current-hero">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="hero-subtitle">Subtitle Hero</label>
                        <input type="text" id="hero-subtitle" value="<?= htmlspecialchars($settings['hero_subtitle'] ?? 'Capullet Pangan Lumintu') ?>" placeholder="Capullet Pangan Lumintu">
                    </div>

                    <div class="form-group">
                        <label for="hero-title">Judul Hero</label>
                        <textarea id="hero-title" rows="2" placeholder="A TASTE TO REMEMBER."><?= htmlspecialchars($settings['hero_title'] ?? 'A TASTE TO\nREMEMBER.') ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="hero-button-text">Text Button</label>
                        <input type="text" id="hero-button-text" value="<?= htmlspecialchars($settings['hero_button_text'] ?? 'Jelajahi Rasa') ?>" placeholder="Jelajahi Rasa">
                    </div>

                    <button type="button" class="btn btn-primary" onclick="updateHeroSlider()">Update Hero Slider</button>
                </div>

                <!-- About Home Section -->
                <div class="settings-section">
                    <h2><i class="fas fa-info-circle"></i> About Section (Beranda)</h2>
                    
                    <div class="form-group">
                        <label for="about-image-upload">Upload Gambar About</label>
                        <input type="file" id="about-image-upload" accept="image/*">
                        <div class="current-image">
                            <p>Gambar About Saat Ini:</p>
                            <img src="<?= htmlspecialchars($settings['about_image'] ?? 'images/about-home.png') ?>" alt="Current About" id="current-about">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="about-tag">Tag About</label>
                        <input type="text" id="about-tag" value="<?= htmlspecialchars($settings['about_tag'] ?? 'Sekilas Tentang Kami') ?>" placeholder="Sekilas Tentang Kami">
                    </div>

                    <div class="form-group">
                        <label for="about-title">Judul About</label>
                        <textarea id="about-title" rows="2" placeholder="Cita Rasa Otentik, Dibuat dengan Hati."><?= htmlspecialchars($settings['about_title'] ?? 'Cita Rasa Otentik,\nDibuat dengan Hati.') ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="about-description">Deskripsi About</label>
                        <textarea id="about-description" rows="4" placeholder="Deskripsi tentang perusahaan..."><?= htmlspecialchars($settings['about_description'] ?? '') ?></textarea>
                    </div>

                    <button type="button" class="btn btn-primary" onclick="updateAboutSection()">Update About Section</button>
                </div>
            </div>
        </div>

        <!-- SECTION Ulasan Pelanggan -->
        <div class="management-container" style="margin-top: 3rem;">
            <h2 style="color: var(--secondary-color); margin-bottom: 1.5rem;"><i class="fas fa-star"></i> Ulasan Pelanggan</h2>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 60px;">#</th>
                            <th style="width: 18%;">Nama</th>
                            <th style="width: 18%;">Email</th>
                            <th>Pesan</th>
                            <th style="width: 150px;">Tanggal</th>
                            <th style="width: 110px; text-align: right;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="reviewsTableBody">
                        <tr><td colspan="6" style="text-align:center; color:#666;">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- SECTION FAQs -->
        <div class="management-container" id="faq-list-view" style="margin-top: 3rem;">
            <h2 style="color: var(--secondary-color); margin-bottom: 1.5rem;"><i class="fas fa-question-circle"></i> Frequently Asked Questions (FAQs)</h2>
            <div class="management-header">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Cari Pertanyaan...">
                </div>
                <button class="btn-add" id="btnShowAddForm"><i class="fas fa-plus"></i> Tambah FAQs</button>
            </div>

            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">#</th>
                            <th style="width: 30%;">Pertanyaan</th>
                            <th>Jawaban</th>
                            <th style="width: 120px; text-align: right;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="faqTableBody">
                        <!-- Data akan di-render via JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- VIEW 2: FORM TAMBAH/EDIT (Hidden) -->
        <div class="management-container hidden" id="faq-form-view">
            <h2 id="formTitle" style="margin-bottom: 1.5rem; color: var(--secondary-color);">Tambah Pertanyaan Baru</h2>
            
            <div class="faq-form">
                <input type="hidden" id="faqId">
                
                <div class="form-group">
                    <label for="faqQuestion">Pertanyaan</label>
                    <input type="text" id="faqQuestion" placeholder="Masukkan pertanyaan yang sering diajukan">
                </div>

                <div class="form-group">
                    <label for="faqAnswer">Jawaban</label>
                    <textarea id="faqAnswer" rows="5" placeholder="Tuliskan jawaban lengkap di sini..."></textarea>
                </div>

                <div class="form-actions-buttons">
                    <button class="btn-edit" id="btnCancelForm">
                        <i class="fas fa-undo"></i> Batal
                    </button>
                    <button class="btn-add" id="btnSaveFaq">
                        <i class="fas fa-save"></i> Simpan
                    </button>
                </div>
            </div>
        </div>
    </main>

    <footer class="admin-footer">
        <p>© 2025 Capullet. All rights reserved.</p>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/global.js"></script>
    <script src="js/admin/logout.js"></script>
    <script src="js/admin/manajemen-faqs.js"></script>
    <script src="js/admin/manajemen-pengaturan.js"></script>
</body>
</html>