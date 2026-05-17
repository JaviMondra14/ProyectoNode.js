const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Correo electrónico y contraseña son requeridos'
            });
        }

        const users = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Correo electrónico o contraseña inválidos'
            });
        }

        const user = users[0];

        // Soportar contraseñas en texto plano (legado) y hasheadas (bcrypt)
        let validPassword = false;
        
        // Primero intentar bcrypt (para contraseñas hasheadas)
        try {
            validPassword = await bcrypt.compare(password, user.password);
        } catch (err) {
            // Si bcrypt falla, comparar directamente (compatibilidad con texto plano)
            validPassword = (password === user.password);
        }

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Correo electrónico o contraseña inválidos'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                nombre: user.nombre
            },
            process.env.JWT_SECRET ,
            { expiresIn: process.env.JWT_EXPIRE}
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, correo electrónico y contraseña son requeridos'
            });
        }

        const existingUsers = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está en uso'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: result.insertId,
                nombre,
                email
            }
        });
    } catch (error) {
        console.error('Registrar usuario error:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};
