<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->query("SELECT * FROM faq ORDER BY urutan ASC, created_at DESC");
    $faqs = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $faqs
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
