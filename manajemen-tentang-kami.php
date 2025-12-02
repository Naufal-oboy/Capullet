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
    <link rel="stylesheet" href="css/admin/manajemen-tentang-kami.css">
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
                <li><a href="manajemen-tentang-kami.php" class="active">Tentang Kami</a></li>
                <li><a href="manajemen-kontak.php">Kontak</a></li>
                <li><a href="manajemen-pengaturan.php">Pengaturan</a></li>
                <li class="mobile-logout"><a href="#">Logout</a></li>
            </ul>

            <a href="#" class="btn btn-logout desktop-logout">Logout</a>
        </nav>
    </header>

    <main class="admin-main container">
        <h1 class="admin-page-title">MANAJEMEN TENTANG KAMI</h1>

        <form class="page-form-container">
            <div class="form-section">
                <div class="form-group">
                    <div class="form-group">
                        <label for="about-image">Gambar Utama</label>
                        
                        <div class="image-preview-box" style="max-width: 30%;"> 
                            <img src="images/about-product.jpg" alt="Preview Tentang Kami">
                        </div>
                        
                        <input type="file" id="about-image" class="file-input">
                    </div>
                <div class="form-group">
                    <label for="about-p1">Deskripsi</label>
                    <textarea id="about-p1" rows="5">Kami adalah sebuah perusahaan yang membuat kreasi makanan olahan keripik dan frozen food. Capullet Pangan Lumintu dibangun untuk pelayanan kebutuhan yang dikhususkan untuk penyediaan cemilan frozen dan olahan keripik yang berkualitas dan tentunya dengan cita rasa nomor satu demi memuaskan kebutuhan pelanggan kami.</textarea>
                </div>
            </div>

            <div class="form-section">
                <div class="form-group">
                    <label for="vision">Visi</label>
                    <textarea id="vision" rows="3">Menjadi Berkat Bagi Sesama Manusia Melalui Pemberdayaan, Inovasi, dan Kepemimpinan.</textarea>
                </div>
                <div class="form-group">
                    <label for="mission">Misi</label>
                    <textarea id="mission" rows="5">Memberdayakan perempuan, terutama ibu-ibu rumah tangga agar mampu berkarya dan berdiri di kaki sendiri.
Menghadirkan produk terbaik dengan berbagai rasa tapi tetap dengan citarasa buatan tangan sendiri bukan pabrikan.
Mengolah bahan yang dianggap limbah, manjadi makanan yang enak dan nikmat dikonsumsi serta bernilai ekonomis tinggi.</textarea>
                    <small>Gunakan baris baru untuk setiap poin misi.</small>
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
    <script src="js/admin/manajemen-tentang-kami.js"></script>
</body>
</html>