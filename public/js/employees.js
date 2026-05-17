window.onload = init;
const API_URL = '/api';

function init() {
    // Si no existe token, redirigir a login
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userDisplay').textContent = `Bienvenido, ${user.nombre}`;
    }

    getAllEmployees();
}

function getHeaders() {
    return {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
}

function getAllEmployees() {
    axios.get(API_URL + '/employees', getHeaders())
        .then(function (res) {
            if (res.data.success) {
                displayEmployees(res.data.data);
            } else {
                showError(res.data.message);
            }
        })
        .catch(function (err) {
            console.error(err);
            handleError(err);
        });
}

function searchEmployees() {
    const searchTerm = document.getElementById('searchInput').value;

    if (!searchTerm) {
        getAllEmployees();
        return;
    }

    axios.get(API_URL + '/employees/search?nombre=' + searchTerm, getHeaders())
        .then(function (res) {
            if (res.data.success) {
                displayEmployees(res.data.data);
                showSuccess(`Se encontraron ${res.data.count} empleado(s)`);
            } else {
                showError(res.data.message);
            }
        })
        .catch(function (err) {
            console.error(err);
            handleError(err);
        });
}

function displayEmployees(employees) {
    const tbody = document.getElementById('employeesList');
    tbody.innerHTML = '';

    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay empleados registrados</td></tr>';
        return;
    }

    employees.forEach(function (emp) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.nombre}</td>
            <td>${emp.apellidos}</td>
            <td>${emp.telefono}</td>
            <td>${emp.email}</td>
            <td>${emp.direccion}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="openEditModal(${emp.id}, '${emp.nombre}', '${emp.apellidos}', '${emp.telefono}', '${emp.email}', '${emp.direccion}')">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id})">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Empleado';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
}

function openEditModal(id, nombre, apellidos, telefono, email, direccion) {
    document.getElementById('modalTitle').textContent = 'Editar Empleado';
    document.getElementById('employeeId').value = id;
    document.getElementById('modalNombre').value = nombre;
    document.getElementById('modalApellidos').value = apellidos;
    document.getElementById('modalTelefono').value = telefono;
    document.getElementById('modalEmail').value = email;
    document.getElementById('modalDireccion').value = direccion;

    $('#employeeModal').modal('show');
}

function saveEmployee() {
    const id = document.getElementById('employeeId').value;
    const nombre = document.getElementById('modalNombre').value;
    const apellidos = document.getElementById('modalApellidos').value;
    const telefono = document.getElementById('modalTelefono').value;
    const email = document.getElementById('modalEmail').value;
    const direccion = document.getElementById('modalDireccion').value;

    if (!nombre || !apellidos || !telefono || !email || !direccion) {
        showError('Todos los campos son obligatorios');
        return;
    }

    const data = {
        nombre: nombre,
        apellidos: apellidos,
        telefono: telefono,
        email: email,
        direccion: direccion
    };

    if (id) {
        // Actualizar empleado
        axios.put(API_URL + '/employees/' + id, data, getHeaders())
            .then(function (res) {
                if (res.data.success) {
                    $('#employeeModal').modal('hide');
                    getAllEmployees();
                    showSuccess('Empleado actualizado exitosamente');
                } else {
                    showError(res.data.message);
                }
            })
            .catch(function (err) {
                console.error(err);
                handleError(err);
            });
    } else {
        // Crear nuevo empleado
        axios.post(API_URL + '/employees', data, getHeaders())
            .then(function (res) {
                if (res.data.success) {
                    $('#employeeModal').modal('hide');
                    getAllEmployees();
                    showSuccess('Empleado agregado exitosamente');
                } else {
                    showError(res.data.message);
                }
            })
            .catch(function (err) {
                console.error(err);
                handleError(err);
            });
    }
}

function deleteEmployee(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        return;
    }

    axios.delete(API_URL + '/employees/' + id, getHeaders())
        .then(function (res) {
            if (res.data.success) {
                getAllEmployees();
                showSuccess('Empleado eliminado exitosamente');
            } else {
                showError(res.data.message);
            }
        })
        .catch(function (err) {
            console.error(err);
            handleError(err);
        });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    document.getElementById('successMessage').textContent = message;
    alert.style.display = 'block';
    alert.classList.add('show');
    
    setTimeout(function () {
        alert.style.display = 'none';
    }, 4000);
}

function showError(message) {
    const alert = document.getElementById('errorAlert');
    document.getElementById('errorMessage').textContent = message;
    alert.style.display = 'block';
    alert.classList.add('show');
    
    setTimeout(function () {
        alert.style.display = 'none';
    }, 4000);
}

function handleError(err) {
    if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    } else if (err.response && err.response.data && err.response.data.message) {
        showError(err.response.data.message);
    } else {
        showError('Error en la conexión. Verifica que el servidor esté ejecutándose.');
    }
}
