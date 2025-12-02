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
    
    $uploadDir = '../../images/';
    $logoPath = 'images/logo.png'; // Default path
    
    // Handle file upload
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $fileName = 'logo.png'; // Always use same name
        $targetPath = $uploadDir . $fileName;
        
        // Validate image
        $imageInfo = getimagesize($_FILES['logo']['tmp_name']);
        if ($imageInfo === false) {
            throw new Exception('File bukan gambar yang valid');
        }
        
        // Move uploaded file
        if (!move_uploaded_file($_FILES['logo']['tmp_name'], $targetPath)) {
            throw new Exception('Gagal mengupload file');
        }
        
        $logoPath = 'images/' . $fileName . '?v=' . time(); // Add version to bust cache
    }
    
    // Update database
    $stmt = $pdo->prepare("UPDATE website_settings SET logo = ? WHERE id = 1");
    $stmt->execute([$logoPath]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Logo berhasil diperbarui'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
