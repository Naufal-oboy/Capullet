<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);
$reviewId = isset($input['id']) ? (int)$input['id'] : 0;

if ($reviewId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID ulasan tidak valid.']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    $pdo->exec("CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        rating INT DEFAULT 5,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = :id");
    $stmt->execute([':id' => $reviewId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ulasan tidak ditemukan.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menghapus ulasan.']);
}
