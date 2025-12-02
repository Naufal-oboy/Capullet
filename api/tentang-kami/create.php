<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['konten'])) {
    echo json_encode(['success' => false, 'message' => 'Konten harus diisi']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Handle base64 image upload if provided
    $gambarPath = $data['gambar'] ?? null;
    if (isset($data['gambar_base64']) && is_string($data['gambar_base64']) && strpos($data['gambar_base64'], 'data:image') === 0) {
        $uploadDir = __DIR__ . '/../../images/about';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0775, true);
        }
        $nameBase = isset($data['judul_section']) && $data['judul_section'] ? preg_replace('/[^a-z0-9]+/i', '-', strtolower($data['judul_section'])) : 'about';
        if (preg_match('/^data:image\/(png|jpeg|jpg);base64,(.+)$/', $data['gambar_base64'], $matches)) {
            $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
            $binary = base64_decode($matches[2]);
            $filename = $nameBase . '-' . time() . '.' . $ext;
            $filePath = $uploadDir . '/' . $filename;
            if (file_put_contents($filePath, $binary) !== false) {
                $gambarPath = 'images/about/' . $filename;
            }
        }
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO tentang_kami (judul_section, konten, gambar, urutan, is_aktif) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['judul_section'] ?? null,
        $data['konten'],
        $gambarPath,
        $data['urutan'] ?? 0,
        isset($data['is_aktif']) ? $data['is_aktif'] : 1
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Konten berhasil ditambahkan',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
