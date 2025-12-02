<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nama_kategori'])) {
    echo json_encode(['success' => false, 'message' => 'Nama kategori harus diisi']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Generate slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['nama_kategori'])));
    
    $stmt = $pdo->prepare("
        INSERT INTO kategori (nama_kategori, slug, deskripsi, gambar, is_aktif) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['nama_kategori'],
        $slug,
        $data['deskripsi'] ?? null,
        $data['gambar'] ?? null,
        isset($data['is_aktif']) ? $data['is_aktif'] : 1
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kategori berhasil ditambahkan',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
