<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../config/database.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
        throw new Exception('Password saat ini dan password baru wajib diisi');
    }
    
    $currentPassword = $data['currentPassword'];
    $newPassword = $data['newPassword'];
    
    // Validate new password length
    if (strlen($newPassword) < 6) {
        throw new Exception('Password baru minimal 6 karakter');
    }
    
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Get current admin
    $stmt = $pdo->prepare("SELECT * FROM admin WHERE username = ? LIMIT 1");
    $stmt->execute([$_SESSION['admin_username']]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        throw new Exception('Admin tidak ditemukan');
    }
    
    // Verify current password
    if (!password_verify($currentPassword, $admin['password'])) {
        throw new Exception('Password saat ini salah');
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password
    $updateStmt = $pdo->prepare("UPDATE admin SET password = ?, updated_at = NOW() WHERE id_admin = ?");
    $updateStmt->execute([$hashedPassword, $admin['id_admin']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Password berhasil diperbarui'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
