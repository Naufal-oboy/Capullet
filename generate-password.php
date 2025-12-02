<?php
/**
 * Password Generator untuk Admin Capullet
 * 
 * File ini digunakan untuk generate password hash yang benar
 * Jalankan file ini di browser untuk mendapatkan hash password
 */

// Password yang ingin di-hash
$password = 'admin123';

// Generate hash
$hash = password_hash($password, PASSWORD_DEFAULT);

?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Generator - Capullet</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #FFBF00;
            border-bottom: 3px solid #FFBF00;
            padding-bottom: 10px;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
        }
        .success-box {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
        }
        code {
            background: #f4f4f4;
            padding: 3px 8px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #c7254e;
        }
        .hash-box {
            background: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        .step {
            margin: 20px 0;
            padding: 15px;
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        }
        .step strong {
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Password Generator - Capullet Admin</h1>
        
        <div class="success-box">
            <strong>✅ Password Hash Berhasil Di-generate!</strong>
        </div>

        <div class="info-box">
            <strong>📌 Informasi Login:</strong><br>
            Username: <code>admin</code><br>
            Password: <code><?php echo htmlspecialchars($password); ?></code>
        </div>

        <h3>Password Hash:</h3>
        <div class="hash-box">
            <?php echo $hash; ?>
        </div>

        <h3>📝 Cara Update Password di Database:</h3>
        
        <div class="step">
            <strong>Opsi 1: Via phpMyAdmin</strong>
            <ol>
                <li>Buka phpMyAdmin (http://localhost/phpmyadmin)</li>
                <li>Pilih database <code>capullet</code></li>
                <li>Klik tabel <code>admin</code></li>
                <li>Klik "Edit" pada baris admin</li>
                <li>Copy hash di atas dan paste ke kolom <code>password</code></li>
                <li>Klik "Go" untuk simpan</li>
            </ol>
        </div>

        <div class="step">
            <strong>Opsi 2: Via SQL Query</strong>
            <p>Jalankan query berikut di phpMyAdmin:</p>
            <div class="hash-box">
UPDATE admin SET password = '<?php echo $hash; ?>' WHERE username = 'admin';
            </div>
        </div>

        <div class="step">
            <strong>Opsi 3: Re-import Database</strong>
            <ol>
                <li>File <code>Capullet.sql</code> sudah di-update dengan password hash yang benar</li>
                <li>Drop database <code>capullet</code> (jika sudah ada)</li>
                <li>Buat database baru <code>capullet</code></li>
                <li>Import file <code>Capullet.sql</code></li>
            </ol>
        </div>

        <div class="info-box">
            <strong>💡 Tips:</strong><br>
            Setelah login berhasil, segera ganti password melalui panel admin untuk keamanan.
        </div>

        <h3>🔧 Generate Password Lain:</h3>
        <p>Edit file ini dan ubah nilai <code>$password</code> di baris 9, lalu refresh halaman.</p>

        <div class="success-box">
            <strong>✅ Setelah update database, hapus file ini dari server untuk keamanan!</strong>
        </div>
    </div>
</body>
</html>
