<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    $stmt = $pdo->query("SELECT id_faq, pertanyaan, jawaban FROM faq WHERE is_aktif = 1 ORDER BY urutan ASC, created_at ASC");
    $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'success' => true,
        'faqs' => $faqs
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching FAQs: ' . $e->getMessage()
    ]);
}
