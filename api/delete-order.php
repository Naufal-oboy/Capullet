<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_order'])) {
    echo json_encode(['success' => false, 'message' => 'Missing order ID']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    // Order items akan terhapus otomatis karena ON DELETE CASCADE
    $stmt = $pdo->prepare("DELETE FROM orders WHERE id_order = ?");
    $stmt->execute([$data['id_order']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Order deleted successfully'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting order: ' . $e->getMessage()
    ]);
}
?>
