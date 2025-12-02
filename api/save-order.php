<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/config/database.php';

// Ambil data dari request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Validasi data
if (empty($data['customerName']) || empty($data['items']) || count($data['items']) == 0) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $pdo->beginTransaction();

    // Generate order number
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $orderCount = $result['total'] + 1;
    $orderNumber = 'ORD-' . date('Y') . '-' . str_pad($orderCount, 3, '0', STR_PAD_LEFT);

    // Insert order
    $stmt = $pdo->prepare("
        INSERT INTO orders 
        (order_number, customer_name, customer_phone, customer_email, customer_address, 
         subtotal, shipping_cost, total_amount, payment_method, status, notes, created_at) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    $customerName = $data['customerName'];
    $customerPhone = $data['customerPhone'] ?? '';
    $customerEmail = $data['customerEmail'] ?? '';
    $customerAddress = $data['customerAddress'] ?? 'Ambil Sendiri';
    $subtotal = $data['subtotal'];
    $shippingCost = $data['shippingCost'] ?? 0;
    $totalAmount = $subtotal + $shippingCost;
    $paymentMethod = $data['paymentMethod'] ?? '';
    // Gunakan status dari request jika tersedia, fallback ke pending
    $status = isset($data['status']) && $data['status'] !== '' ? $data['status'] : 'pending';
    $notes = $data['notes'] ?? '';

    $stmt->execute([
        $orderNumber,
        $customerName,
        $customerPhone,
        $customerEmail,
        $customerAddress,
        $subtotal,
        $shippingCost,
        $totalAmount,
        $paymentMethod,
        $status,
        $notes
    ]);

    $orderId = $pdo->lastInsertId();

    // Insert order items
    $stmt = $pdo->prepare("
        INSERT INTO order_items 
        (id_order, id_produk, nama_produk, harga, quantity, subtotal) 
        VALUES 
        (?, ?, ?, ?, ?, ?)
    ");

    foreach ($data['items'] as $item) {
        $productId = isset($item['productId']) && $item['productId'] > 0 ? $item['productId'] : null;
        
        $stmt->execute([
            $orderId,
            $productId,
            $item['productName'],
            $item['price'],
            $item['quantity'],
            $item['subtotal']
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order saved successfully',
        'orderNumber' => $orderNumber,
        'orderId' => $orderId
    ]);

} catch(PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Error saving order: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Unexpected error: ' . $e->getMessage()
    ]);
}
?>
