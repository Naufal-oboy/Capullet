// Logout functionality
function handleLogout() {
    fetch('api/auth/logout.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            window.location.href = 'login-admin.php';
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        window.location.href = 'login-admin.php';
    });
}

// Attach logout to all logout buttons
document.addEventListener('DOMContentLoaded', function() {
    const logoutButtons = document.querySelectorAll('.btn-logout, .mobile-logout a');
    
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
});
