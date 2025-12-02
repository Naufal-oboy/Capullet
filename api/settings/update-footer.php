<?php
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get POST data
    $description = $_POST['description'] ?? '';
    $address = $_POST['address'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    
    // Validate
    if (empty($description) || empty($address) || empty($phone) || empty($email)) {
        throw new Exception('Semua field harus diisi');
    }
    
    // Update database
    $stmt = $pdo->prepare("UPDATE website_settings SET 
        footer_description = ?,
        footer_address = ?,
        footer_phone = ?,
        footer_email = ?
        WHERE id = 1
    ");
    
    $stmt->execute([$description, $address, $phone, $email]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Footer berhasil diupdate'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
