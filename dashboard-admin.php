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
    <link rel="stylesheet" href="css/admin/manajemen-kategori.css">
    <link rel="stylesheet" href="css/admin/dashboard-admin.css">
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
                <li><a href="dashboard-admin.php" class="active">Dashboard</a></li>
                <li><a href="manajemen-produk.php">Produk</a></li>
                <li><a href="manajemen-kategori.php">Kategori</a></li>
                <li><a href="manajemen-penjualan.php">Penjualan</a></li>
                <li><a href="manajemen-kegiatan.php">Kegiatan</a></li>
                <li><a href="manajemen-tentang-kami.php">Tentang Kami</a></li>
                <li><a href="manajemen-kontak.php">Kontak</a></li>
                <li><a href="manajemen-pengaturan.php">Pengaturan</a></li>
                <li class="mobile-logout"><a href="#">Logout</a></li>
            </ul>

            <a href="#" class="btn btn-logout desktop-logout">Logout</a>
        </nav>
    </header>

    <main class="admin-main container">
        <section class="dashboard-welcome">
            <h1>SELAMAT DATANG, ADMIN!</h1>
            <p>Silakan melakukan manajemen produk, kategori produk, dan kegiatan.</p>
        </section>

        <section class="dashboard-quick-links">
             <a href="manajemen-produk.php" class="dashboard-link-card">Manajemen Produk</a>
             <a href="manajemen-kategori.php" class="dashboard-link-card">Manajemen Kategori Produk</a>
             <a href="manajemen-penjualan.php" class="dashboard-link-card">Manajemen Penjualan</a>
             <a href="manajemen-kegiatan.php" class="dashboard-link-card">Manajemen Kegiatan</a>
             <a href="manajemen-tentang-kami.php" class="dashboard-link-card">Manajemen Tentang Kami</a>
             <a href="manajemen-kontak.php" class="dashboard-link-card">Manajemen Kontak</a>
             <a href="manajemen-pengaturan.php" class="dashboard-link-card">Manajemen Pengaturan</a>
        </section>
    </main>

    <footer class="admin-footer">
        <p>© 2025 Capullet. All rights reserved.</p>
    </footer>
    
    <script src="js/global.js"></script>
    <script src="js/admin/logout.js"></script>
</body>
</html>