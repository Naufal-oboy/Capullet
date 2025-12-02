<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_produk']) || !isset($data['nama_produk'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Generate slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['nama_produk'])));
    
    $stmt = $pdo->prepare("
        UPDATE produk 
        SET id_kategori = ?, nama_produk = ?, deskripsi = ?, harga = ?, 
            gambar_utama = ?, slug = ?, stok = ?, is_best_seller = ?, is_aktif = ?
        WHERE id_produk = ?
    ");
    
    $stmt->execute([
        $data['id_kategori'],
        $data['nama_produk'],
        $data['deskripsi'] ?? null,
        $data['harga'],
        $data['gambar_utama'] ?? null,
        $slug,
        $data['stok'] ?? 0,
        isset($data['is_best_seller']) ? $data['is_best_seller'] : 0,
        isset($data['is_aktif']) ? $data['is_aktif'] : 1,
        $data['id_produk']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Produk berhasil diperbarui'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
