<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_kegiatan'])) {
    echo json_encode(['success' => false, 'message' => 'ID kegiatan tidak valid']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Soft delete: nonaktifkan kegiatan
    $stmt = $pdo->prepare("UPDATE kegiatan SET is_aktif = 0 WHERE id_kegiatan = ?");
    $stmt->execute([$data['id_kegiatan']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kegiatan dinonaktifkan'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
