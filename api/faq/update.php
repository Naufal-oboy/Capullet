<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_faq']) || !isset($data['pertanyaan']) || !isset($data['jawaban'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    $stmt = $pdo->prepare("
        UPDATE faq 
        SET pertanyaan = ?, jawaban = ?, urutan = ?, is_aktif = ?
        WHERE id_faq = ?
    ");
    
    $stmt->execute([
        $data['pertanyaan'],
        $data['jawaban'],
        $data['urutan'] ?? 0,
        isset($data['is_aktif']) ? $data['is_aktif'] : 1,
        $data['id_faq']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'FAQ berhasil diperbarui'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
