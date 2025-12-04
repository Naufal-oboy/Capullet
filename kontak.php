<?php
require_once __DIR__ . '/api/config/database.php';
$contactInfo = null;
try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    $stmt = $pdo->query("SELECT * FROM contact_info LIMIT 1");
    $contactInfo = $stmt->fetch();
} catch (Exception $e) {
    $contactInfo = null;
}
function e($s){return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');}
$wa = $contactInfo && $contactInfo['whatsapp'] ? $contactInfo['whatsapp'] : '6282251004290';
$ig = $contactInfo && $contactInfo['instagram'] ? $contactInfo['instagram'] : 'capull3t.smd';
$addr = $contactInfo && $contactInfo['address'] ? $contactInfo['address'] : 'Jl. Subulussalam I no. 9, Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda, Kalimantan Timur 75116';
$maps = $contactInfo && $contactInfo['maps_embed'] ? $contactInfo['maps_embed'] : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.664448375631!2d117.1620441747806!3d-0.4924445353086088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67fb548c8658d%3A0xe7b0004b646bfa61!2sKeripik%20usus%20dan%20kulit%20samarinda%20Capullet!5e0!3m2!1sen!2sid!4v1683033281234!5m2!1sen!2sid';
$email = $contactInfo && isset($contactInfo['email']) ? $contactInfo['email'] : 'info@capullet.com';
$hours = $contactInfo && $contactInfo['hours'] ? $contactInfo['hours'] : "Senin - Sabtu: 08.00 – 17.00\nMinggu: Tutup";
$hoursLines = array_filter(array_map('trim', preg_split("/\r?\n/", $hours)));
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capullet - Kontak</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/pages/kontak.css">
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
                <li><a href="tentang-kami.php">Tentang Kami</a></li>
                <li><a href="kontak.php" class="active">Kontak</a></li>
            </ul>
            <a href="keranjang.php" class="cart-button"><i class="fas fa-shopping-cart"></i></a>
        </nav>
    </header>

    <main>
        <section class="page-header-section">
            <h1>Hubungi Kami</h1>
            <p>Silakan hubungi kami untuk info dan pemesanan.</p>
        </section>

        <section class="contact-cards-section container">
            <div class="contact-grid">
                <div class="contact-card">
                    <div class="icon-background">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <h3>Chat di WhatsApp</h3>
                    <p class="contact-detail">+<?php echo e($wa); ?></p>
                    <a href="https://wa.me/<?php echo e($wa); ?>" target="_blank" class="btn btn-primary">Chat Kami Sekarang</a>
                </div>
                <div class="contact-card">
                     <div class="icon-background">
                        <i class="fab fa-instagram"></i>
                    </div>
                    <h3>Ikuti di Instagram</h3>
                    <p class="contact-detail">@<?php echo e($ig); ?></p>
                    <a href="https://www.instagram.com/<?php echo e($ig); ?>" target="_blank" class="btn btn-primary">Kunjungi Instagram kami</a>
                </div>
                <div class="contact-card">
                    <div class="icon-background">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    <p class="contact-detail"><?php echo e($email); ?></p>
                    <a href="https://mail.google.com/mail/u/0/?fs=1&to=<?php echo urlencode($email); ?>&subject=Pertanyaan%20dari%20Website&body=" target="_blank" class="btn btn-primary">Kirim Email</a>
                </div>
            </div>
        </section>

        <section class="location-section">
            <div class="container">
                 <div class="section-title">
                    <h2><i class="fas fa-map-marker-alt"></i> Lokasi Kami</h2>
                </div>
                <div class="location-grid">
                    <div class="location-map">
                        <iframe src="<?php echo e($maps); ?>" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div class="location-info">
                        <h3>Keripik Usus dan Kulit Samarinda Capulet</h3>
                        <div class="rating">
                            <span>5,0</span> ★★★★★
                        </div>
                        <address>
                            <?php echo e($addr); ?>
                        </address>
                        <h4>Jam Operasional</h4>
                        <ul>
                            <?php foreach ($hoursLines as $line): ?>
                                <li><?php echo e($line); ?></li>
                            <?php endforeach; ?>
                        </ul>
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
                    <p><?php 
                        $aboutText = ($contactInfo && isset($contactInfo['about'])) ? $contactInfo['about'] : 'Capullet Pangan Lumintu adalah perusahaan yang memproduksi olahan keripik dan frozen food berkualitas.';
                        echo e($aboutText);
                    ?></p>
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
                    <p><?php echo e($addr); ?></p>
                </div>
                <div class="footer-contact">
                    <h3>Hubungi Kami</h3>
                    <div class="social-links">
                        <a href="https://www.instagram.com/<?php echo e($ig); ?>" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://wa.me/<?php echo e($wa); ?>" target="_blank" aria-label="Whatsapp"><i class="fab fa-whatsapp"></i></a>
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