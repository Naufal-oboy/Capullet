<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['judul'])) {
    echo json_encode(['success' => false, 'message' => 'Judul harus diisi']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Generate slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['judul'])));
    
    // Handle base64 image upload if provided
    $gambarPath = $data['gambar'] ?? null;
    if (isset($data['gambar_base64']) && is_string($data['gambar_base64']) && strpos($data['gambar_base64'], 'data:image') === 0) {
        $uploadDir = __DIR__ . '/../../images/kegiatan';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0775, true);
        }
        // Parse base64 data URL
        if (preg_match('/^data:image\/(png|jpeg|jpg);base64,(.+)$/', $data['gambar_base64'], $matches)) {
            $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
            $binary = base64_decode($matches[2]);
            $filename = $slug . '-' . time() . '.' . $ext;
            $filePath = $uploadDir . '/' . $filename;
            if (file_put_contents($filePath, $binary) !== false) {
                // Store relative path for web use
                $gambarPath = 'images/kegiatan/' . $filename;
            }
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO kegiatan (judul, slug, deskripsi, gambar, tanggal_kegiatan, lokasi, is_aktif) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['judul'],
        $slug,
        $data['deskripsi'] ?? null,
        $gambarPath,
        $data['tanggal_kegiatan'] ?? null,
        $data['lokasi'] ?? null,
        isset($data['is_aktif']) ? $data['is_aktif'] : 1
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kegiatan berhasil ditambahkan',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
