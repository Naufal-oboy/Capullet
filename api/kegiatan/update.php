<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_kegiatan']) || !isset($data['judul'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Generate slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['judul'])));
    
    // Handle base64 image upload if provided; else keep existing when gambar missing
    $gambarPath = $data['gambar'] ?? null;
    if (isset($data['gambar_base64']) && is_string($data['gambar_base64']) && strpos($data['gambar_base64'], 'data:image') === 0) {
        $uploadDir = __DIR__ . '/../../images/kegiatan';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0775, true);
        }
        if (preg_match('/^data:image\/(png|jpeg|jpg);base64,(.+)$/', $data['gambar_base64'], $matches)) {
            $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
            $binary = base64_decode($matches[2]);
            $filename = $slug . '-' . time() . '.' . $ext;
            $filePath = $uploadDir . '/' . $filename;
            if (file_put_contents($filePath, $binary) !== false) {
                $gambarPath = 'images/kegiatan/' . $filename;
            }
        }
    }

    // Get current image for comparison / fallback
    $stmtCur = $pdo->prepare('SELECT gambar FROM kegiatan WHERE id_kegiatan = ?');
    $stmtCur->execute([$data['id_kegiatan']]);
    $cur = $stmtCur->fetch();
    $currentImage = $cur ? $cur['gambar'] : null;

    // If no new or provided image, keep current DB value
    if ($gambarPath === null) {
        $gambarPath = $currentImage;
    }

    // If a new image was saved (path differs), delete old file safely
    if ($currentImage && $gambarPath && $currentImage !== $gambarPath) {
        // Only allow deletion inside images/kegiatan for safety
        if (strpos($currentImage, 'images/kegiatan/') === 0) {
            $oldFile = __DIR__ . '/../../' . $currentImage;
            if (is_file($oldFile)) {
                @unlink($oldFile);
            }
        }
    }

    $stmt = $pdo->prepare("
        UPDATE kegiatan 
        SET judul = ?, slug = ?, deskripsi = ?, gambar = ?, tanggal_kegiatan = ?, lokasi = ?, is_aktif = ?
        WHERE id_kegiatan = ?
    ");
    
    $stmt->execute([
        $data['judul'],
        $slug,
        $data['deskripsi'] ?? null,
        $gambarPath,
        $data['tanggal_kegiatan'] ?? null,
        $data['lokasi'] ?? null,
        isset($data['is_aktif']) ? $data['is_aktif'] : 1,
        $data['id_kegiatan']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kegiatan berhasil diperbarui'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
