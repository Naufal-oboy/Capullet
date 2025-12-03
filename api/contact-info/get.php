<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Ensure email column exists
    try {
        $pdo->query("SELECT email FROM contact_info LIMIT 1");
    } catch (PDOException $e) {
        $pdo->exec("ALTER TABLE contact_info ADD COLUMN email VARCHAR(100) DEFAULT 'info@capullet.com'");
    }

    // Get the single row of contact info
    $stmt = $pdo->query("SELECT * FROM contact_info LIMIT 1");
    $info = $stmt->fetch();
    
    if (!$info) {
        // Return defaults if no row exists yet
        $info = [
            'whatsapp' => '6282251004290',
            'instagram' => 'capull3t.smd',
            'address' => 'Jl. Subulussalam I no. 9, Sidomulyo, Kec. Samarinda Ilir, Kota Samarinda, Kalimantan Timur 75116',
            'maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.664448375631!2d117.1620441747806!3d-0.4924445353086088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67fb548c8658d%3A0xe7b0004b646bfa61!2sKeripik%20usus%20dan%20kulit%20samarinda%20Capullet!5e0!3m2!1sen!2sid!4v1683033281234!5m2!1sen!2sid',
            'hours' => "Senin - Sabtu: 08.00 – 17.00\nMinggu: Tutup",
            'email' => 'info@capullet.com'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $info
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
