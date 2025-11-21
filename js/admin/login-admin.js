const form = document.getElementById('loginForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === 'admin' && password === '12345') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);

        window.location.href = 'dashboard-admin.html';
    } else {
        alert('Username atau password salah!');
    }
});
