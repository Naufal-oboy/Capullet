<?php
require_once 'includes/auth-check.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Capullet</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/admin/manajemen-kontak.css">
</head>
<body class="admin-page dashboard-page">
    <header>
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
                <li><a href="manajemen-kontak.php" class="active">Kontak</a></li>
                <li><a href="manajemen-pengaturan.php">Pengaturan</a></li>
                <li class="mobile-logout"><a href="#">Logout</a></li>
            </ul>

            <a href="#" class="btn btn-logout desktop-logout">Logout</a>
        </nav>
    </header>

    <main class="admin-main container">
        <h1 class="admin-page-title">MANAJEMEN KONTAK</h1>

        <form class="page-form-container">
            <div class="form-section">
                <div class="form-group">
                    <label for="whatsapp">WhatsApp</label>
                    <input type="text" id="whatsapp" value="6282251004290">
                </div>
                <div class="form-group">
                    <label for="instagram">Instagram (tanpa @)</label>
                    <input type="text" id="instagram" value="capull3t.smd">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="info@capullet.com">
                </div>
                <div class="form-group">
                    <label for="address">Alamat</label>
                    <textarea id="address" rows="3">Jl. Subulussalam I no. 9, Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda, Kalimantan Timur 75116</textarea>
                </div>
                 <div class="form-group">
                    <label for="maps-url">URL Embed Google Maps</label>
                    <textarea id="maps-url" rows="5">https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.664455822368!2d117.16204417592404!3d-0.4924445352697984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67fb548c8658d%3A0xe7b0004b646bfa61!2sKeripik%20usus%20dan%20kulit%20samarinda%20Capullet!5e0!3m2!1sid!2sid!4v1696885333010!5m2!1sid!2sid</textarea>
                </div>
                 <div class="form-group">
                    <label for="hours">Jam Operasional</label>
                    <textarea id="hours" rows="7">Senin - Sabtu: 08.00 – 17.00
                    Minggu: Tutup</textarea>
                </div>
            </div>

            <div class="form-actions">
                 <button type="submit" class="btn-form btn-save"><i class="fas fa-save"></i> Simpan Perubahan</button>
            </div>
        </form>
    </main>

    <footer class="admin-footer">
        <p>© 2025 Capullet. All rights reserved.</p>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/global.js"></script>
    <script src="js/admin/logout.js"></script>
    <script src="js/admin/manajemen-kontak.js"></script>
</body>
</html>