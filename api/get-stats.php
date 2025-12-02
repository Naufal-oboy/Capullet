<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Total orders
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders");
    $totalOrders = $stmt->fetch()['total'];
    
    // Pending orders
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'");
    $pendingOrders = $stmt->fetch()['total'];
    
    // Processing orders (confirmed, processing, shipped)
    $stmt = $pdo->query("
        SELECT COUNT(*) as total FROM orders 
        WHERE status IN ('confirmed', 'processing', 'shipped')
    ");
    $processingOrders = $stmt->fetch()['total'];
    
    // Completed orders
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders WHERE status = 'completed'");
    $completedOrders = $stmt->fetch()['total'];
    
    // Total revenue (excluding cancelled)
    $stmt = $pdo->query("
        SELECT SUM(total_amount) as total 
        FROM orders 
        WHERE status != 'cancelled'
    ");
    $totalRevenue = $stmt->fetch()['total'] ?? 0;
    
    // Monthly revenue (current month)
    $stmt = $pdo->query("
        SELECT SUM(total_amount) as total 
        FROM orders 
        WHERE status != 'cancelled'
        AND MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    ");
    $monthlyRevenue = $stmt->fetch()['total'] ?? 0;
    
    // Best selling products
    $stmt = $pdo->query("
        SELECT 
            oi.nama_produk,
            SUM(oi.quantity) as total_sold,
            SUM(oi.subtotal) as total_revenue
        FROM order_items oi
        JOIN orders o ON oi.id_order = o.id_order
        WHERE o.status != 'cancelled'
        GROUP BY oi.nama_produk
        ORDER BY total_sold DESC
        LIMIT 5
    ");
    $bestSellers = $stmt->fetchAll();
    
    // Recent orders (last 10)
    $stmt = $pdo->query("
        SELECT 
            order_number,
            customer_name,
            total_amount,
            status,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $recentOrders = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'stats' => [
            'totalOrders' => (int)$totalOrders,
            'pendingOrders' => (int)$pendingOrders,
            'processingOrders' => (int)$processingOrders,
            'completedOrders' => (int)$completedOrders,
            'totalRevenue' => (float)$totalRevenue,
            'monthlyRevenue' => (float)$monthlyRevenue,
            'bestSellers' => $bestSellers,
            'recentOrders' => $recentOrders
        ]
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching stats: ' . $e->getMessage()
    ]);
}
?>
