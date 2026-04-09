const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const administradorRoutes = require('./routes/administradorRoutes');
const operadorRoutes = require('./routes/operadorRoutes');
const reporteIncidenciaRoutes = require('./routes/reporteIncidenciaRoutes');
const incidenciaRoutes = require('./routes/incidenciaRoutes');
const historialParqueoRoutes = require('./routes/historialParqueoRoutes');
const getEstadoRoutes = require('./routes/getEstadoRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const accesoSalidasRoutes = require('./routes/accesoSalidasRoutes');
const picoPlacaRoutes = require('./routes/picoPlacaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite a la app procesar cuerpos JSON en las peticiones HTTP

// Rutas de la API
// Rutas de autenticación pública
app.use('/api/auth', authRoutes);

// Rutas de la API Protegidas
app.use('/api/usuarios', (req, res, next) => {
    // Permitir Registro (POST /) y Recuperación (POST /recuperar) sin Token
    if (req.method === 'POST' && (req.path === '/' || req.path === '/recuperar')) {
        return next();
    }
    return authMiddleware(req, res, next);
}, usuarioRoutes);

app.use('/api/administradores', authMiddleware, administradorRoutes);
app.use('/api/operadores', authMiddleware, operadorRoutes);
app.use('/api/reportes-incidencia', authMiddleware, reporteIncidenciaRoutes);
app.use('/api/incidencia', authMiddleware, incidenciaRoutes);
app.use('/api/historial-parqueo', authMiddleware, historialParqueoRoutes);
app.use('/api/get-estado', authMiddleware, getEstadoRoutes);   
app.use('/api/vehiculo', authMiddleware, vehiculoRoutes);
app.use('/api/acceso-salida', authMiddleware, accesoSalidasRoutes);
app.use('/api/pico-placa', authMiddleware, picoPlacaRoutes);
// Servir aplicación Frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../parking-lot-project-frontend')));

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
