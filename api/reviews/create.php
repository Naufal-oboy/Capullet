<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$rating = (int)($input['rating'] ?? 0);
$message = trim($input['message'] ?? '');

if ($name === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nama dan ulasan wajib diisi.']);
    exit;
}

if ($rating < 1 || $rating > 5) {
    $rating = 5;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    // Create table if not exists (safe guard)
    $pdo->exec("CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        rating TINYINT NOT NULL DEFAULT 5,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("INSERT INTO reviews (name, email, rating, message) VALUES (:name, :email, :rating, :message)");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email !== '' ? $email : null,
        ':rating' => $rating,
        ':message' => $message,
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan ulasan.']);
}
