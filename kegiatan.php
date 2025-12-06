<?php
require_once __DIR__ . '/api/config/database.php';
$pdo = null;
try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    $stmt = $pdo->query("SELECT * FROM kegiatan WHERE is_aktif = 1 ORDER BY created_at DESC");
    $activities = $stmt->fetchAll();
} catch (Exception $e) {
    $activities = [];
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capullet - Kegiatan</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/pages/kegiatan.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        <nav class="container">
            <a href="index.php" class="logo">
                <img src="images/logo.png" alt="Logo Capullet">
            </a>
            <div class="menu-toggle">
                <span class="bar-top"></span>
                <span class="bar-middle"></span>
                <span class="bar-bottom"></span>
            </div>
            <ul>
                <li><a href="index.php">Beranda</a></li>
                <li><a href="katalog.php">Katalog</a></li>
                <li><a href="kegiatan.php" class="active">Kegiatan</a></li>
                <li><a href="tentang-kami.php">Tentang Kami</a></li>
                <li><a href="kontak.php">Kontak</a></li>
            </ul>
            <a href="keranjang.php" class="cart-button"><i class="fas fa-shopping-cart"></i></a>
        </nav>
    </header>

    <main>
        <section class="page-header-section">
            <h1>Kegiatan Kami</h1>
            <p>Pengalaman rasa terbaik Capullet di setiap kegiatan.</p>
        </section>

        <section class="activities-list container">
            <?php if (empty($activities)): ?>
                <p style="text-align:center; color:#888; padding:2rem; width:100%;">Belum ada kegiatan aktif.</p>
            <?php else: ?>
                <?php foreach ($activities as $act): ?>
                    <article class="activity-item">
                        <img src="<?php echo htmlspecialchars($act['gambar'] ?: 'images/placeholder-image.jpg'); ?>" alt="<?php echo htmlspecialchars($act['judul']); ?>" onerror="this.src='images/placeholder-image.jpg'">
                        <div class="activity-content">
                            <h3><?php echo htmlspecialchars($act['judul']); ?></h3>
                            <p><?php echo htmlspecialchars($act['deskripsi']); ?></p>
                        </div>
                    </article>
                <?php endforeach; ?>
            <?php endif; ?>
        </section>

        <section class="cta-section">
            <div class="container">
                <h2>Ingin berkolaborasi?</h2>
                <p>Kami terbuka untuk setiap peluang kerja sama dan cita rasa baru. Ayo mulai sekarang!</p>
                <a href="kontak.php" class="btn btn-primary">Hubungi Kami</a>
            </div>
        </section>
    </main>

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
                        <li><a href="index.php">Beranda</a></li>
                        <li><a href="katalog.php">Katalog</a></li>
                        <li><a href="kegiatan.php">Kegiatan</a></li>
                        <li><a href="tentang-kami.php">Tentang Kami</a></li>
                        <li><a href="kontak.php">Kontak</a></li>
                    </ul>
                </div>
                <div class="footer-address">
                    <h3>Alamat</h3>
                    <p>Jl. Subulussalam I no. 9, Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda, Kalimantan Timur 75116</p>
                </div>
                <div class="footer-contact">
                    <h3>Hubungi Kami</h3>
                    <div class="social-links">
                        <a href="https://www.instagram.com/capull3t.smd" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://wa.me/6282251004290" target="_blank" aria-label="Whatsapp"><i class="fab fa-whatsapp"></i></a>
                        <a href="https://mail.google.com/mail/u/0/?fs=1&to=info@capullet.com" target="_blank" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 Capullet. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script src="js/global.js"></script>
</body>
</html>