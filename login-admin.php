<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Capullet</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/admin/login-admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
</head>
<body>

    <div class="login-wrapper">
        <div class="login-card">
            
            <div class="form-side">
                
                <a href="/" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>Kembali</span>
                </a>

                <div class="form-container">
                    <div class="header-text">
                        <h1>Selamat Datang <span class="highlight">Admin!</span></h1>
                        <p>Silakan masuk untuk melanjutkan.</p>
                    </div>

                    <form id="loginForm">
                        <div class="input-group">
                            <label for="username">Nama Pengguna</label>
                            <input type="text" id="username" placeholder="Masukkan username" required>
                        </div>

                        <div class="input-group">
                            <label for="password">Kata Sandi</label>
                            <input type="password" id="password" placeholder="Masukkan kata sandi" required>
                        </div>

                        <div class="input-group">
                            <label for="captcha-input">Kode Keamanan</label>
                            <div class="captcha-wrapper">
                                <div class="captcha-input-box">
                                    <input type="text" id="captcha-input" placeholder="KETIK KODE" required autocomplete="off">
                                </div>
                                <div class="captcha-display" id="captcha-display" title="Klik untuk ganti kode">
                                    <span id="captcha-code"></span>
                                    <div class="captcha-noise"></div>
                                </div>
                                <button type="button" id="refresh-captcha" class="refresh-btn">
                                    <i class="fas fa-rotate"></i>
                                </button>
                            </div>
                        </div>

                        <div id="error-message" class="error-box" style="display: none;">
                            <i class="fas fa-circle-exclamation"></i>
                            <span id="error-text"></span>
                        </div>

                        <button type="submit" class="submit-btn">Masuk</button>
                    </form>
                </div>
            </div>

            <div class="image-side">
                <img src="images/login.png" alt="Capullet">
                <div class="overlay"></div>
            </div>

        </div>
    </div>

    <script src="js/admin/login-admin.js"></script>
</body>
</html>
