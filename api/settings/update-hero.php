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
    $heroImagePath = null;
    
    // Handle file upload
    if (isset($_FILES['hero_image']) && $_FILES['hero_image']['error'] === UPLOAD_ERR_OK) {
        $fileName = 'hero-image-' . time() . '.jpg';
        $targetPath = $uploadDir . $fileName;
        
        // Validate image
        $imageInfo = getimagesize($_FILES['hero_image']['tmp_name']);
        if ($imageInfo === false) {
            throw new Exception('File bukan gambar yang valid');
        }
        
        // Move uploaded file
        if (!move_uploaded_file($_FILES['hero_image']['tmp_name'], $targetPath)) {
            throw new Exception('Gagal mengupload file');
        }
        
        $heroImagePath = 'images/' . $fileName;
    }
    
    // Get text data
    $heroSubtitle = $_POST['hero_subtitle'] ?? '';
    $heroTitle = $_POST['hero_title'] ?? '';
    $heroButtonText = $_POST['hero_button_text'] ?? '';
    
    // Update database
    if ($heroImagePath) {
        $stmt = $pdo->prepare("UPDATE website_settings SET hero_image = ?, hero_subtitle = ?, hero_title = ?, hero_button_text = ? WHERE id = 1");
        $stmt->execute([$heroImagePath, $heroSubtitle, $heroTitle, $heroButtonText]);
    } else {
        $stmt = $pdo->prepare("UPDATE website_settings SET hero_subtitle = ?, hero_title = ?, hero_button_text = ? WHERE id = 1");
        $stmt->execute([$heroSubtitle, $heroTitle, $heroButtonText]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Hero slider berhasil diperbarui'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
