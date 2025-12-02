<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT');
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
    
    $pdo->beginTransaction();

    // Update order
    $stmt = $pdo->prepare("
        UPDATE orders 
        SET customer_name = ?,
            customer_phone = ?,
            customer_email = ?,
            customer_address = ?,
            subtotal = ?,
            shipping_cost = ?,
            total_amount = ?,
            payment_method = ?,
            status = ?,
            notes = ?,
            updated_at = NOW()
        WHERE id_order = ?
    ");

    $stmt->execute([
        $data['customerName'],
        $data['customerPhone'] ?? '',
        $data['customerEmail'] ?? '',
        $data['customerAddress'],
        $data['subtotal'],
        $data['shippingCost'] ?? 0,
        $data['totalAmount'],
        $data['paymentMethod'] ?? '',
        $data['status'],
        $data['notes'] ?? '',
        $data['id_order']
    ]);

    // Delete existing items
    $stmt = $pdo->prepare("DELETE FROM order_items WHERE id_order = ?");
    $stmt->execute([$data['id_order']]);

    // Insert new items
    if (isset($data['items']) && is_array($data['items'])) {
        $stmt = $pdo->prepare("
            INSERT INTO order_items 
            (id_order, id_produk, nama_produk, harga, quantity, subtotal) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        foreach ($data['items'] as $item) {
            $stmt->execute([
                $data['id_order'],
                $item['productId'] ?? 0,
                $item['productName'],
                $item['price'],
                $item['quantity'],
                $item['subtotal']
            ]);
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order updated successfully'
    ]);

} catch(PDOException $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Error updating order: ' . $e->getMessage()
    ]);
}
?>
