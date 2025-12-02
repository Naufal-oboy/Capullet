<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Check if row exists
    $stmt = $pdo->query("SELECT id FROM contact_info LIMIT 1");
    $existing = $stmt->fetch();
    
    if ($existing) {
        // Update existing row
        $stmt = $pdo->prepare("
            UPDATE contact_info 
            SET whatsapp = ?, instagram = ?, address = ?, maps_embed = ?, hours = ?
            WHERE id = ?
        ");
        
        $stmt->execute([
            $data['whatsapp'] ?? '',
            $data['instagram'] ?? '',
            $data['address'] ?? '',
            $data['maps_embed'] ?? '',
            $data['hours'] ?? '',
            $existing['id']
        ]);
    } else {
        // Insert new row
        $stmt = $pdo->prepare("
            INSERT INTO contact_info (whatsapp, instagram, address, maps_embed, hours) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['whatsapp'] ?? '',
            $data['instagram'] ?? '',
            $data['address'] ?? '',
            $data['maps_embed'] ?? '',
            $data['hours'] ?? ''
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Informasi kontak berhasil diperbarui'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
