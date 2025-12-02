<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->query("
        SELECT 
            p.id_produk,
            p.nama_produk,
            p.deskripsi,
            p.harga,
            p.gambar_utama,
            p.slug,
            p.is_best_seller,
            p.is_aktif,
            p.id_kategori,
            k.nama_kategori,
            k.slug as kategori_slug
        FROM produk p
        LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
        WHERE p.is_aktif = 1
        ORDER BY p.is_best_seller DESC, p.nama_produk ASC
    ");
    
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'products' => $products
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching products: ' . $e->getMessage()
    ]);
}
?>
