<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

require_once __DIR__ . '/config/database.php';

// Get pagination parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : null;
$limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : null;
$category = isset($_GET['category']) ? $_GET['category'] : null;

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    
    // Build WHERE clause
    $whereClause = "WHERE p.is_aktif = 1";
    $params = [];
    
    if ($category && $category !== 'all') {
        $whereClause .= " AND k.slug = :category";
        $params[':category'] = $category;
    }
    
    // If pagination requested
    if ($page !== null && $limit !== null) {
        $offset = ($page - 1) * $limit;
        
        // Get total count
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM produk p LEFT JOIN kategori k ON p.id_kategori = k.id_kategori " . $whereClause);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $totalItems = $countStmt->fetchColumn();
        $totalPages = ceil($totalItems / $limit);
        
        // Get paginated products
        $sql = "
            SELECT 
                p.id_produk,
                p.nama_produk,
                p.deskripsi,
                p.harga,
                p.gambar_utama,
                p.slug,
                p.is_best_seller,
                p.is_aktif,
                p.id_kategori,
                k.nama_kategori,
                k.slug as kategori_slug
            FROM produk p
            LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
            " . $whereClause . "
            ORDER BY p.is_best_seller DESC, p.nama_produk ASC
            LIMIT :limit OFFSET :offset
        ";
        
        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $products = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'products' => $products,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_items' => (int)$totalItems,
                'items_per_page' => $limit
            ]
        ]);
    } else {
        // No pagination - return all products
        $sql = "
            SELECT 
                p.id_produk,
                p.nama_produk,
                p.deskripsi,
                p.harga,
                p.gambar_utama,
                p.slug,
                p.is_best_seller,
                p.is_aktif,
                p.id_kategori,
                k.nama_kategori,
                k.slug as kategori_slug
            FROM produk p
            LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
            " . $whereClause . "
            ORDER BY p.is_best_seller DESC, p.nama_produk ASC
        ";
        
        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        
        $products = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'products' => $products
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching products: ' . $e->getMessage()
    ]);
}
?>
