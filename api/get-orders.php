<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config/database.php';

// Get pagination parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 10;
$offset = ($page - 1) * $limit;

// Get all orders with items
try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get total count
    $countStmt = $pdo->query("SELECT COUNT(*) FROM orders");
    $totalItems = $countStmt->fetchColumn();
    $totalPages = ceil($totalItems / $limit);
    
    // Get paginated orders
    $stmt = $pdo->prepare("
        SELECT 
            o.*,
            DATE_FORMAT(o.created_at, '%Y-%m-%d') as date
        FROM orders o
        ORDER BY o.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get items for each order
    foreach ($orders as &$order) {
        $stmt = $pdo->prepare("
            SELECT * FROM order_items 
            WHERE id_order = ?
        ");
        $stmt->execute([$order['id_order']]);
        $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'orders' => $orders,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_items' => (int)$totalItems,
            'items_per_page' => $limit
        ]
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching orders: ' . $e->getMessage()
    ]);
}
?>
