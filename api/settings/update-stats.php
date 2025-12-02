<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once '../config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $statProducts = (int)($data['stat_products'] ?? 50);
    $statCustomers = (int)($data['stat_customers'] ?? 1000);
    $statExperience = (int)($data['stat_experience'] ?? 5);
    
    // Update database
    $stmt = $pdo->prepare("UPDATE website_settings SET stat_products = ?, stat_customers = ?, stat_experience = ? WHERE id = 1");
    $stmt->execute([$statProducts, $statCustomers, $statExperience]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Statistik berhasil diperbarui'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
