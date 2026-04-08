const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { verificarToken, soloAdmin, soloOperadorOAdmin } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');

const usuarioRoutes = require('./routes/usuarioRoutes');
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
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://bioparking.com' // Cambiar al dominio de producción real
        : '*', // Permitir local (mejorar luego para dev exacto)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: { error: 'Demasiadas solicitudes, intenta más tarde' }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: { error: 'Demasiados intentos de login, intenta más tarde' }
});

app.use('/api/', limiter);

// Rutas Públicas de la API
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/get-estado', getEstadoRoutes); // Asumimos que ver las celdas libres es público por pantalla general

// Rutas Protegidas (Requieren autenticación general)
app.use(verificarToken);
app.use('/api/historial-parqueo', historialParqueoRoutes);
app.use('/api/vehiculo', vehiculoRoutes);
app.use('/api/acceso-salida', accesoSalidasRoutes);
app.use('/api/pico-placa', picoPlacaRoutes);
app.use('/api/reportes-incidencia', reporteIncidenciaRoutes);
app.use('/api/incidencia', incidenciaRoutes);

// Rutas Administrativas (Requieren rol admin o admin/operador)
// Para los usuarios normales (con rol de usuario), sólo deberían poder ver su info, pero simplificaremos con soloAdmin/operador por los requerimientos.
app.use('/api/usuarios', soloOperadorOAdmin, usuarioRoutes);
app.use('/api/administradores', soloAdmin, administradorRoutes);
app.use('/api/operadores', soloAdmin, operadorRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de Parking Lot funcionando correctamente.');
});

// Manejo de roles centralizado para errores no atrapados
app.use(errorHandler);

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
