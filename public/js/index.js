window.onload = init;
const API_URL = '/api';

function init() {
    // Si ya existe token, redirigir a employees
    if (localStorage.getItem('token')) {
        window.location.href = 'employees.html';
    }

    document.getElementById('loginForm').addEventListener('submit', login);
}

function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    axios.post(API_URL + '/auth/login', {
        email: email,
        password: password
    })
        .then(function (res) {
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.location.href = 'employees.html';
            } else {
                showError(res.data.message);
            }
        })
        .catch(function (err) {
            console.error(err);
            showError('Error en la conexión. Verifica que el servidor esté ejecutándose.');
        });
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
}

function goToSignin() {
    window.location.href = 'signin.html';
}
