<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capullet - Katalog</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/pages/katalog.css">
    <link rel="stylesheet" href="css/pages/keranjang.css">
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
                <li><a href="katalog.php" class="active">Katalog</a></li>
                <li><a href="kegiatan.php">Kegiatan</a></li>
                <li><a href="tentang-kami.php">Tentang Kami</a></li>
                <li><a href="kontak.php">Kontak</a></li>
            </ul>
            <a href="keranjang.php" class="cart-button"><i class="fas fa-shopping-cart"></i></a>
        </nav>
    </header>

    <main>
        <section class="page-header-section">
            <h1>Katalog Kami</h1>
            <p>Semua camilan favorit dalam satu tempat!</p>
        </section>

        <section class="catalog-main container">
            <div class="filter-controls">
                <button class="active" data-filter="all">Semua</button>
                <button data-filter="keripik">Keripik</button>
                <button data-filter="risol">Risol</button>
                <button data-filter="minuman">Minuman</button>
            </div>

            <div class="catalog-grid" id="catalog-container">
            </div>
            
            <!-- Pagination -->
            <div id="pagination-container"></div>
        </section>

        <section class="cta-section">
             <div class="container">
                <h2>Siap untuk memesan?</h2>
                <p>Jangan tunda kelezatannya! Hubungi kami via WhatsApp atau Instagram untuk pemesanan.</p>
                <a href="kontak.html" class="btn btn-primary">Pesan Sekarang</a>
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
<script src="js/pages/katalog.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>