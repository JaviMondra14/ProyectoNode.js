require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

const app = express();

// CORS configurado para desarrollo y producción
const corsOptions = {
    origin: '*',
    credentials: false,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'API running', env: process.env.NODE_ENV });
});

// Servir index.html para todas las rutas no API
app.get('*', (req, res, next) => {
    // Ignorar rutas API
    if (req.path.startsWith('/api')) {
        return next();
    }

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Visit http://localhost:${PORT}`);
});
