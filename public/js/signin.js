window.onload = init;

function init() {
    // Si ya existe token, redirigir a employees
    if (localStorage.getItem('token')) {
        window.location.href = 'employees.html';
    }

    // Event listener para el form
    document.getElementById('signinForm').addEventListener('submit', signin);
}

function signin(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    axios.post(API_URL + '/auth/register', {
        nombre: nombre,
        email: email,
        password: password
    })
        .then(function (res) {
            if (res.data.success) {
                showSuccess('¡Registrado exitosamente! Redirigiendo al login...');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showError(res.data.message);
            }
        })
        .catch(function (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                showError(err.response.data.message);
            } else {
                showError('Error en la conexión. Verifica que el servidor esté ejecutándose.');
            }
        });
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    document.getElementById('successAlert').style.display = 'none';
}

function showSuccess(message) {
    const successAlert = document.getElementById('successAlert');
    successAlert.textContent = message;
    successAlert.style.display = 'block';
    document.getElementById('errorAlert').style.display = 'none';
}

function goToLogin() {
    window.location.href = 'index.html';
}
