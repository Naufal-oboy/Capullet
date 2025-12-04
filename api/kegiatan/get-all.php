<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->query("SELECT * FROM kegiatan WHERE is_aktif = 1 ORDER BY created_at DESC");
    $kegiatan = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $kegiatan
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
