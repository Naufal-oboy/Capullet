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
    $aboutImagePath = null;
    
    // Handle file upload
    if (isset($_FILES['about_image']) && $_FILES['about_image']['error'] === UPLOAD_ERR_OK) {
        $fileName = 'about-home-' . time() . '.png';
        $targetPath = $uploadDir . $fileName;
        
        // Validate image
        $imageInfo = getimagesize($_FILES['about_image']['tmp_name']);
        if ($imageInfo === false) {
            throw new Exception('File bukan gambar yang valid');
        }
        
        // Move uploaded file
        if (!move_uploaded_file($_FILES['about_image']['tmp_name'], $targetPath)) {
            throw new Exception('Gagal mengupload file');
        }
        
        $aboutImagePath = 'images/' . $fileName;
    }
    
    // Get text data
    $aboutTag = $_POST['about_tag'] ?? '';
    $aboutTitle = $_POST['about_title'] ?? '';
    $aboutDescription = $_POST['about_description'] ?? '';
    
    // Update database
    if ($aboutImagePath) {
        $stmt = $pdo->prepare("UPDATE website_settings SET about_image = ?, about_tag = ?, about_title = ?, about_description = ? WHERE id = 1");
        $stmt->execute([$aboutImagePath, $aboutTag, $aboutTitle, $aboutDescription]);
    } else {
        $stmt = $pdo->prepare("UPDATE website_settings SET about_tag = ?, about_title = ?, about_description = ? WHERE id = 1");
        $stmt->execute([$aboutTag, $aboutTitle, $aboutDescription]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'About section berhasil diperbarui'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
