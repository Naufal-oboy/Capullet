<?php
require_once 'includes/auth-check.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen FAQs - Capullet</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/admin/manajemen-kategori.css">
    <link rel="stylesheet" href="css/admin/manajemen-faqs.css">
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
                <li><a href="manajemen-faqs.php" class="active">FAQs</a></li>
                <li class="mobile-logout"><a href="#">Logout</a></li>
            </ul>

            <a href="#" class="btn btn-logout desktop-logout">Logout</a>
        </nav>
    </header>

    <main class="admin-main container">
        <h1 class="admin-page-title">MANAJEMEN FAQS</h1>

        <!-- VIEW 1: TABEL LIST DATA -->
        <div class="management-container" id="faq-list-view">
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
</body>
</html>