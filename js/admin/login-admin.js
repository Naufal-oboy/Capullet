document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Berjalan...");
    const captchaCodeEl = document.getElementById('captcha-code');
    if (!captchaCodeEl) {
        console.error("ERROR: Elemen dengan id 'captcha-code' tidak ditemukan di HTML!");
        return;
    }
    const captchaInput = document.getElementById('captcha-input');
    const refreshBtn = document.getElementById('refresh-captcha');
    const captchaDisplay = document.getElementById('captcha-display');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    let currentCaptcha = '';

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        currentCaptcha = code;
        console.log("Captcha Generated: ", code);
        captchaCodeEl.textContent = code;
        captchaInput.value = '';
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        errorMessage.style.display = 'none';

        const usernameVal = document.getElementById('username').value;
        const passwordVal = document.getElementById('password').value;
        const captchaVal = captchaInput.value.toUpperCase();

        if (captchaVal !== currentCaptcha) {
            showError('Kode CAPTCHA salah! Silakan coba lagi.');
            generateCaptcha();
            return;
        }

        // Use API for login
        fetch('api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameVal,
                password: passwordVal
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                window.location.href = 'dashboard-admin.php';
            } else {
                showError(result.message || 'Login gagal!');
                generateCaptcha();
                document.getElementById('password').value = '';
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            showError('Terjadi kesalahan. Silakan coba lagi.');
            generateCaptcha();
        });
    };

    const showError = (msg) => {
        errorText.textContent = msg;
        errorMessage.style.display = 'flex';
    };

    refreshBtn.addEventListener('click', generateCaptcha);
    captchaDisplay.addEventListener('click', generateCaptcha);
    loginForm.addEventListener('submit', handleSubmit);

    generateCaptcha();
});
