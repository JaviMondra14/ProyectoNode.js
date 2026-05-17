const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// Todas las rutas de empleados requieren autenticación
router.use(verifyToken);

// GET /api/employees - Obtener todos los empleados
router.get('/', employeeController.getAllEmployees);

// GET /api/employees/search?nombre=xxx - Buscar empleados por nombre o apellidos
router.get('/search', employeeController.searchByName);

// GET /api/employees/:id - Obtener empleado por ID
router.get('/:id', employeeController.getEmployeeById);

// POST /api/employees - Crear nuevo empleado
router.post('/', employeeController.createEmployee);

// PUT /api/employees/:id - Actualizar empleado
router.put('/:id', employeeController.updateEmployee);

// DELETE /api/employees/:id - Eliminar empleado
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
