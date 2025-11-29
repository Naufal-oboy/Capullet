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
        const captchaVal = captchaInput.value;

        if (captchaVal !== currentCaptcha) {
            showError('Kode CAPTCHA salah! Silakan coba lagi.');
            generateCaptcha();
            return;
        }

        if (usernameVal === 'admin' && passwordVal === 'admin') {
            alert('Login Berhasil! Mengalihkan...');
            window.location.href = '/dashboard-admin.html';
        } else {
            showError('Nama pengguna atau kata sandi salah!');
            generateCaptcha();
            document.getElementById('password').value = '';
        }
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
