const pool = require('../config/database');

// Obtener todos los empleados
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await pool.query('SELECT * FROM empleados ORDER BY id ASC');

        res.json({
            success: true,
            message: 'Empleados recuperados exitosamente',
            data: employees
        });
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

// Buscar empleados por nombre o apellidos
exports.searchByName = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de búsqueda es requerido'
            });
        }

        const employees = await pool.query(
            `SELECT * FROM empleados 
             WHERE nombre LIKE ?
             OR apellidos LIKE ?
             OR CONCAT(nombre, ' ',apellidos) LIKE ?
             ORDER BY id ASC`,
            [
                `%${nombre}%`,
                `%${nombre}%`,
                `%${nombre}%`
            ]
        );

        res.json({
            success: true,
            message: 'Empleados encontrados exitosamente',
            data: employees,
            count: employees.length
        });

    } catch (error) {
        console.error('Error al buscar empleados:', error);

        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

// Obtener empleado por ID
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employees = await pool.query(
            'SELECT * FROM empleados WHERE id = ?',
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Empleado no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Empleado recuperado exitosamente',
            data: employees[0]
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

// Crear nuevo empleado
exports.createEmployee = async (req, res) => {
    try {
        const { nombre, apellidos, telefono, email, direccion } = req.body;

        // Validation
        if (!nombre || !apellidos || !telefono || !email || !direccion) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos: nombre, apellidos, telefono, email, direccion'
            });
        }

        // Check if email already exists
        const existingEmployee = await pool.query(
            'SELECT * FROM empleados WHERE email = ?',
            [email]
        );

        if (existingEmployee.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está en uso'
            });
        }

        const result = await pool.query(
            'INSERT INTO empleados (nombre, apellidos, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellidos, telefono, email, direccion]
        );

        res.status(201).json({
            success: true,
            message: 'Empleado creado exitosamente',
            data: {
                id: result.insertId,
                nombre,
                apellidos,
                telefono,
                email,
                direccion
            }
        });
    } catch (error) {
        console.error('Crear empleado error:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

// Actualizar empleado
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, telefono, email, direccion } = req.body;

        // Check if employee exists
        const employees = await pool.query(
            'SELECT * FROM empleados WHERE id = ?',
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Empleado no encontrado'
            });
        }

        if (email && email !== employees[0].email) {
            const existingEmail = await pool.query(
                'SELECT * FROM empleados WHERE email = ? AND id != ?',
                [email, id]
            );

            if (existingEmail.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está en uso'
                });
            }
        }

        const updateFields = [];
        const updateValues = [];

        if (nombre !== undefined) {
            updateFields.push('nombre = ?');
            updateValues.push(nombre);
        }
        if (apellidos !== undefined) {
            updateFields.push('apellidos = ?');
            updateValues.push(apellidos);
        }
        if (telefono !== undefined) {
            updateFields.push('telefono = ?');
            updateValues.push(telefono);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (direccion !== undefined) {
            updateFields.push('direccion = ?');
            updateValues.push(direccion);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(id);

        await pool.query(
            `UPDATE empleados SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        res.json({
            success: true,
            message: 'Empleado actualizado exitosamente'
        });
    } catch (error) {
        console.error('Actualizar empleado error:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

// Eliminar empleado
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const employees = await pool.query(
            'SELECT * FROM empleados WHERE id = ?',
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Empleado no encontrado'
            });
        }

        await pool.query(
            'DELETE FROM empleados WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Empleado eliminado exitosamente'
        });
    } catch (error) {
        console.error('Eliminar empleado error:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};
