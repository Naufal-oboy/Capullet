<?php
require_once __DIR__ . '/api/config/database.php';
$sections = [];
try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    $stmt = $pdo->query("SELECT * FROM tentang_kami WHERE is_aktif = 1 ORDER BY urutan ASC, id ASC");
    $rows = $stmt->fetchAll();
    foreach ($rows as $row) {
        $key = strtolower($row['judul_section'] ?? '');
        $sections[$key] = $row;
    }
} catch (Exception $e) {
    $sections = [];
}
function e($s){return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');}
$imgPath = isset($sections['about_image']['gambar']) && $sections['about_image']['gambar'] ? $sections['about_image']['gambar'] : 'images/about-product.jpg';
$deskripsi = isset($sections['deskripsi']['konten']) ? $sections['deskripsi']['konten'] : '';
$visi = isset($sections['visi']['konten']) ? $sections['visi']['konten'] : '';
$misi = isset($sections['misi']['konten']) ? $sections['misi']['konten'] : '';
$misiItems = array_filter(array_map('trim', preg_split("/\r?\n/", $misi)));
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capullet - Tentang Kami</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/pages/tentang-kami.css">
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
                <li><a href="kegiatan.php">Kegiatan</a></li>
                <li><a href="tentang-kami.php" class="active">Tentang Kami</a></li>
                <li><a href="kontak.php">Kontak</a></li>
            </ul>
            <a href="keranjang.php" class="cart-button"><i class="fas fa-shopping-cart"></i></a>
        </nav>
    </header>

    <main>
        <section class="page-header-section">
            <h1>Tentang Kami</h1>
            <p>Perjalanan kami dalam menghadirkan rasa yang tak terlupakan</p>
        </section>

        <section class="about-story-section container">
            <div class="about-card">
                <img src="<?php echo e($imgPath); ?>" alt="Produk Capullet" onerror="this.src='images/about-product.jpg'">
                <div class="about-card-content">
                    <?php if ($deskripsi): ?>
                        <p><?php echo nl2br(e($deskripsi)); ?></p>
                    <?php else: ?>
                        <p>Capullet adalah sebuah perusahaan yang membuat kreasi makanan olahan keripik dan frozen food.</p>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <section class="vision-mission-section">
            <div class="container">
                <div class="vision-mission-grid">
                    <div class="vision-mission-item">
                        <div class="icon"><i class="fas fa-eye"></i></div>
                        <h3>Visi</h3>
                        <p><?php echo $visi ? e($visi) : 'Menjadi berkat melalui pemberdayaan, inovasi, dan kepemimpinan.'; ?></p>
                    </div>
                    <div class="vision-mission-item">
                        <div class="icon"><i class="fas fa-rocket"></i></div>
                        <h3>Misi</h3>
                        <?php if (!empty($misiItems)): ?>
                            <ul>
                                <?php foreach ($misiItems as $item): ?>
                                    <li><?php echo e($item); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        <?php else: ?>
                            <ul>
                                <li>Memberdayakan perempuan agar mampu berkarya dan mandiri.</li>
                            </ul>
                        <?php endif; ?>
                    </div>
                </div>
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