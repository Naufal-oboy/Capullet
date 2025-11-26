<?php
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Kategori - Capullet</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/admin/manajemen-kategori.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="admin-page">
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
                <li><a href="manajemen-kategori.php" class="active">Kategori</a></li>
                <li><a href="manajemen-kegiatan.php">Kegiatan</a></li>
                <li><a href="manajemen-tentang-kami.php">Tentang Kami</a></li>
                <li><a href="manajemen-kontak.php">Kontak</a></li>
                <li><a href="manajemen-faqs.php">FAQs</a></li>
                <li class="mobile-logout"><a href="#">Logout</a></li>
            </ul>

            <a href="#" class="btn btn-logout desktop-logout">Logout</a>
        </nav>
    </header>

    <main class="admin-main container">
        <h1 class="admin-page-title">MANAJEMEN KATEGORI PRODUK</h1>
        <div class="management-container">
            <div class="management-header">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Cari Kategori...">
                </div>
                <a href="#" class="btn-add"><i class="fas fa-plus"></i> Tambah Kategori</a>
            </div>

            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $categories = [
                            ['id' => 1, 'name' => 'Keripik'],
                            ['id' => 2, 'name' => 'Risol'],
                            ['id' => 3, 'name' => 'Minuman']
                        ];
                        
                        foreach ($categories as $category) {
                            echo '<tr>';
                            echo '<td>' . $category['id'] . '</td>';
                            echo '<td>' . $category['name'] . '</td>';
                            echo '<td class="action-buttons">';
                            echo '<a href="#" class="btn-edit" aria-label="Edit"><i class="fas fa-pen"></i></a>';
                            echo '<a href="#" class="btn-delete" aria-label="Hapus"><i class="fas fa-trash-alt"></i></a>';
                            echo '</td>';
                            echo '</tr>';
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <footer class="admin-footer">
        <p>© 2025 Capullet. All rights reserved.</p>
    </footer>
    <script src="js/global.js"></script>
    <script src="js/admin/manajemen-kategori.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>