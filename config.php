<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'capullet');

// Database Connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Koneksi database gagal: " . $conn->connect_error);
}

// Set charset to UTF-8
$conn->set_charset("utf8mb4");

// Session Configuration
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Upload Configuration
define('UPLOAD_DIR', 'images/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Helper Functions
function sanitize($data) {
    global $conn;
    return $conn->real_escape_string(trim($data));
}

function generateSlug($text) {
    // Convert to lowercase
    $text = strtolower($text);
    
    // Replace spaces with hyphens
    $text = str_replace(' ', '-', $text);
    
    // Remove special characters
    $text = preg_replace('/[^a-z0-9-]/', '', $text);
    
    // Remove multiple hyphens
    $text = preg_replace('/-+/', '-', $text);
    
    // Trim hyphens from the ends
    $text = trim($text, '-');
    
    return $text;
}

function uploadImage($file, $prefix = '') {
    $response = ['success' => false, 'message' => '', 'filename' => ''];
    
    // Check if file was uploaded
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        $response['message'] = 'Error uploading file';
        return $response;
    }
    
    // Check file size
    if ($file['size'] > MAX_FILE_SIZE) {
        $response['message'] = 'File terlalu besar (maksimal 5MB)';
        return $response;
    }
    
    // Get file extension
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Check file extension
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        $response['message'] = 'Format file tidak diizinkan (hanya jpg, jpeg, png, gif, webp)';
        return $response;
    }
    
    // Generate unique filename
    $filename = $prefix . uniqid() . '.' . $extension;
    $filepath = UPLOAD_DIR . $filename;
    
    // Create upload directory if not exists
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $response['success'] = true;
        $response['filename'] = $filename;
        $response['message'] = 'File berhasil diupload';
    } else {
        $response['message'] = 'Gagal menyimpan file';
    }
    
    return $response;
}

function deleteImage($filename) {
    if (!empty($filename)) {
        $filepath = UPLOAD_DIR . $filename;
        if (file_exists($filepath)) {
            unlink($filepath);
            return true;
        }
    }
    return false;
}

// Authentication Functions
function isLoggedIn() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login-admin.php');
        exit;
    }
}

function login($id, $username) {
    $_SESSION['admin_id'] = $id;
    $_SESSION['admin_username'] = $username;
}

function logout() {
    session_destroy();
    header('Location: login-admin.php');
    exit;
}

// Handle logout request
if (isset($_GET['logout'])) {
    logout();
}

// Format Currency
function formatRupiah($number) {
    return 'Rp ' . number_format($number, 0, ',', '.');
}

function formatPrice($number) {
    return number_format($number, 0, ',', '.');
}

// Get page title
function getPageTitle($page) {
    $titles = [
        'index' => 'Beranda',
        'katalog' => 'Katalog Produk',
        'kegiatan' => 'Kegiatan Kami',
        'tentang-kami' => 'Tentang Kami',
        'kontak' => 'Kontak',
        'dashboard-admin' => 'Dashboard Admin',
        'login-admin' => 'Login Admin',
        'manajemen-produk' => 'Manajemen Produk',
        'manajemen-kategori' => 'Manajemen Kategori',
        'manajemen-kegiatan' => 'Manajemen Kegiatan',
        'manajemen-faqs' => 'Manajemen FAQs',
        'manajemen-kontak' => 'Manajemen Kontak',
        'manajemen-tentang-kami' => 'Manajemen Tentang Kami',
    ];
    
    return $titles[$page] ?? 'Capullet';
}
?>
