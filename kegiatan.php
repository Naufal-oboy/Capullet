<?php
require_once __DIR__ . '/api/config/database.php';
$pdo = null;
$activities = [];
$itemsPerPage = 3;
$currentPage = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get total count
    $countStmt = $pdo->query("SELECT COUNT(*) as total FROM kegiatan WHERE is_aktif = 1");
    $totalCount = $countStmt->fetch()['total'];
    $totalPages = ceil($totalCount / $itemsPerPage);
    
    // Ensure current page is valid
    if ($currentPage > $totalPages && $totalPages > 0) {
        $currentPage = $totalPages;
    }
    
    // Calculate offset
    $offset = ($currentPage - 1) * $itemsPerPage;
    
    // Get activities for current page
    $stmt = $pdo->prepare("SELECT * FROM kegiatan WHERE is_aktif = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?");
    $stmt->bindValue(1, $itemsPerPage, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $activities = $stmt->fetchAll();
} catch (Exception $e) {
    $activities = [];
    $totalPages = 0;
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
                            <p class="activity-excerpt"><?php echo htmlspecialchars(substr($act['deskripsi'], 0, 150)); ?>...</p>
                            <button class="btn btn-secondary read-more-btn" onclick="openActivityModal(<?php echo htmlspecialchars(json_encode($act)); ?>)">
                                <i class="fas fa-arrow-right"></i> Baca Selengkapnya
                            </button>
                        </div>
                    </article>
                <?php endforeach; ?>
            <?php endif; ?>
        </section>

        <!-- Pagination -->
        <?php if ($totalPages > 1): ?>
        <div id="pagination-container">
            <div class="pagination">
                <?php if ($currentPage > 1): ?>
                    <a href="kegiatan.php?page=<?php echo $currentPage - 1; ?>" class="page-btn" title="Halaman Sebelumnya">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                <?php endif; ?>

                <?php 
                $startPage = max(1, $currentPage - 1);
                $endPage = min($totalPages, $currentPage + 1);
                
                if ($startPage > 1): ?>
                    <span class="page-dots">...</span>
                <?php endif; ?>

                <?php for ($i = $startPage; $i <= $endPage; $i++): ?>
                    <?php if ($i == $currentPage): ?>
                        <span class="page-btn active"><?php echo $i; ?></span>
                    <?php else: ?>
                        <a href="kegiatan.php?page=<?php echo $i; ?>" class="page-btn"><?php echo $i; ?></a>
                    <?php endif; ?>
                <?php endfor; ?>

                <?php if ($endPage < $totalPages): ?>
                    <span class="page-dots">...</span>
                <?php endif; ?>

                <?php if ($currentPage < $totalPages): ?>
                    <a href="kegiatan.php?page=<?php echo $currentPage + 1; ?>" class="page-btn" title="Halaman Berikutnya">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                <?php endif; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- Modal untuk detail kegiatan -->
        <div id="activityModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle"></h2>
                    <button class="modal-close" onclick="closeActivityModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="modalImage" src="" alt="" class="modal-image">
                    <div id="modalDescription"></div>
                </div>
            </div>
        </div>

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
    <script>
        function openActivityModal(activity) {
            const modal = document.getElementById('activityModal');
            document.getElementById('modalTitle').textContent = activity.judul;
            document.getElementById('modalImage').src = activity.gambar || 'images/placeholder-image.jpg';
            document.getElementById('modalImage').alt = activity.judul;
            document.getElementById('modalDescription').innerHTML = `<p>${activity.deskripsi.replace(/\n/g, '<br>')}</p>`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeActivityModal() {
            const modal = document.getElementById('activityModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Close modal when clicking outside of it
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('activityModal');
            if (event.target == modal) {
                closeActivityModal();
            }
        });
    </script>
</body>
</html>