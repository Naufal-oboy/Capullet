<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_kategori'])) {
    echo json_encode(['success' => false, 'message' => 'ID kategori tidak valid']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->prepare("DELETE FROM kategori WHERE id_kategori = ?");
    $stmt->execute([$data['id_kategori']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kategori berhasil dihapus'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
