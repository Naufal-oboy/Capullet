<?php
require_once 'includes/auth-check.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Penjualan - Capullet</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/admin/manajemen-penjualan.css">
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
                <li><a href="manajemen-kategori.php">Kategori</a></li>
                <li><a href="manajemen-penjualan.php" class="active">Penjualan</a></li>
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
        <h1 class="admin-page-title">MANAJEMEN PENJUALAN</h1>
        
        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #4CAF50;">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stat-info">
                    <h3 id="total-orders">0</h3>
                    <p>Total Pesanan</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #FF9800;">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3 id="pending-orders">0</h3>
                    <p>Pesanan Pending</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #2196F3;">
                    <i class="fas fa-truck"></i>
                </div>
                <div class="stat-info">
                    <h3 id="processing-orders">0</h3>
                    <p>Diproses</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #9C27B0;">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="stat-info">
                    <h3 id="total-revenue">Rp 0</h3>
                    <p>Total Pendapatan</p>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
            <div class="chart-container">
                <h3><i class="fas fa-chart-line"></i> Trend Penjualan (7 Hari Terakhir)</h3>
                <canvas id="salesTrendChart"></canvas>
            </div>
            <div class="chart-container">
                <h3><i class="fas fa-chart-pie"></i> Status Pesanan</h3>
                <canvas id="orderStatusChart"></canvas>
            </div>
        </div>

        <div class="management-container">
            <div class="management-header">
                <div class="filter-group">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" id="search-order" placeholder="Cari Nomor Pesanan / Nama Pelanggan...">
                    </div>
                    <select id="filter-status" class="filter-select">
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Terkonfirmasi</option>
                        <option value="processing">Diproses</option>
                        <option value="shipped">Dikirim</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                    <input type="date" id="filter-date" class="filter-date">
                </div>
                <a href="#" class="btn-add" id="btn-add-order"><i class="fas fa-plus"></i> Tambah Pesanan</a>
            </div>

            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>No. Pesanan</th>
                            <th>Tanggal</th>
                            <th>Pelanggan</th>
                            <th>Produk</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="orders-tbody">
                        <!-- Data akan dimuat via JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Modal Tambah/Edit Pesanan -->
    <div id="order-modal" class="modal">
        <div class="modal-content modal-large">
            <span class="close-modal">&times;</span>
            <h2 id="modal-title">Tambah Pesanan Baru</h2>
            <form id="order-form">
                <input type="hidden" id="order-id">
                
                <!-- Informasi Pelanggan -->
                <div class="form-section">
                    <h3><i class="fas fa-user"></i> Informasi Pelanggan</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="customer-name">Nama Pelanggan *</label>
                            <input type="text" id="customer-name" required>
                        </div>
                        <div class="form-group">
                            <label for="customer-phone">No. Telepon *</label>
                            <input type="tel" id="customer-phone" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="customer-email">Email</label>
                        <input type="email" id="customer-email">
                    </div>
                    <div class="form-group">
                        <label for="customer-address">Alamat Lengkap *</label>
                        <textarea id="customer-address" rows="3" required></textarea>
                    </div>
                </div>

                <!-- Detail Pesanan -->
                <div class="form-section">
                    <h3><i class="fas fa-box"></i> Detail Pesanan</h3>
                    <div id="order-items-container">
                        <!-- Item pesanan akan ditambahkan di sini -->
                    </div>
                    <button type="button" class="btn-add-item" id="add-item-btn">
                        <i class="fas fa-plus"></i> Tambah Produk
                    </button>
                    
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="subtotal-display">Rp 0</span>
                        </div>
                        <div class="summary-row">
                            <span>Ongkir:</span>
                            <input type="number" id="shipping-cost" value="0" min="0">
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="total-display">Rp 0</span>
                        </div>
                    </div>
                </div>

                <!-- Informasi Tambahan -->
                <div class="form-section">
                    <h3><i class="fas fa-info-circle"></i> Informasi Tambahan</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="payment-method">Metode Pembayaran</label>
                            <select id="payment-method">
                                <option value="">Pilih Metode</option>
                                <option value="transfer">Transfer Bank</option>
                                <option value="cod">COD</option>
                                <option value="ewallet">E-Wallet</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="order-status">Status Pesanan *</label>
                            <select id="order-status" required>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Terkonfirmasi</option>
                                <option value="processing">Diproses</option>
                                <option value="shipped">Dikirim</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="order-notes">Catatan</label>
                        <textarea id="order-notes" rows="3" placeholder="Catatan tambahan..."></textarea>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-cancel" id="cancel-btn">Batal</button>
                    <button type="submit" class="btn-submit">Simpan Pesanan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Detail Pesanan -->
    <div id="detail-modal" class="modal">
        <div class="modal-content modal-large">
            <span class="close-modal">&times;</span>
            <h2>Detail Pesanan</h2>
            <div id="detail-content">
                <!-- Konten detail akan dimuat via JavaScript -->
            </div>
        </div>
    </div>

    <footer class="admin-footer">
        <p>© 2025 Capullet. All rights reserved.</p>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="js/global.js"></script>
    <script src="js/admin/manajemen-penjualan.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
