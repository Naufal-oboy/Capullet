<?php
// Script untuk membuat admin user pertama kali
// Jalankan sekali saja: http://localhost/Capullet/api/create-admin.php

require_once __DIR__ . '/config/database.php';

// Data admin default
$username = 'admin';
$password = 'admin123'; // Ganti dengan password yang aman

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Cek apakah admin sudah ada
    $stmt = $pdo->prepare("SELECT * FROM admin WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Admin sudah ada! Username: ' . $username
        ]);
        exit;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert admin
    $stmt = $pdo->prepare("INSERT INTO admin (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $hashedPassword]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Admin berhasil dibuat!',
        'username' => $username,
        'password' => $password,
        'note' => 'Silakan login dan GANTI password segera!'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
