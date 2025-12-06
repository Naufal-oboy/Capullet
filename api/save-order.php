<?php
// Immediately set up output buffering and headers
ob_start();

// Set headers first before any potential errors
http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Set error handling to not output errors directly
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'PHP Error: ' . $errstr . ' (File: ' . basename($errfile) . ':' . $errline . ')',
        'type' => 'error'
    ]);
    exit;
});

set_exception_handler(function($e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Exception: ' . $e->getMessage(),
        'type' => 'exception'
    ]);
    exit;
});

require_once __DIR__ . '/config/database.php';

// Ambil data dari request
$data = json_decode(file_get_contents('php://input'), true);

// Log untuk debugging
error_log('Save Order - Raw Input: ' . file_get_contents('php://input'));
error_log('Save Order - Parsed Data: ' . json_encode($data));

if (!$data) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Validasi data
if (empty($data['customerName']) || empty($data['items']) || count($data['items']) == 0) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    error_log('Save Order - Database connected');
    
    $pdo->beginTransaction();

    // Generate unique order number with format ORD-YYYY-XXX (tahun + nomor urut)
    $currentYear = date('Y');
    
    // Get the maximum sequence number for current year
    // Use a simple approach: get max existing order number and extract sequence
    $maxStmt = $pdo->prepare("
        SELECT order_number 
        FROM orders 
        WHERE order_number LIKE ? 
        ORDER BY CAST(SUBSTRING(order_number, -3) AS UNSIGNED) DESC 
        LIMIT 1
    ");
    $maxStmt->execute(['ORD-' . $currentYear . '-%']);
    $maxRow = $maxStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($maxRow && preg_match('/ORD-\d+-(\d+)$/', $maxRow['order_number'], $matches)) {
        $currentSeq = (int)$matches[1];
    } else {
        $currentSeq = 0;
    }
    
    $nextSeq = $currentSeq + 1;
    $orderNumber = 'ORD-' . $currentYear . '-' . str_pad($nextSeq, 3, '0', STR_PAD_LEFT);

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
    $subtotal = (float)($data['subtotal'] ?? 0);
    $shippingCost = (float)($data['shippingCost'] ?? 0);
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
    error_log('Save Order - Order inserted with ID: ' . $orderId);

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
            (string)($item['productName'] ?? ''),
            (float)($item['price'] ?? 0),
            (int)($item['quantity'] ?? 1),
            (float)($item['subtotal'] ?? 0)
        ]);
    }

    $pdo->commit();

    ob_end_clean();
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
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'type' => 'database',
        'sqlstate' => $e->getCode()
    ]);
} catch(Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'type' => 'exception'
    ]);
}
?>
