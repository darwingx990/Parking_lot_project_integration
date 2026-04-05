const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
app.use(cors());
app.use(express.json()); // Permite a la app procesar cuerpos JSON en las peticiones HTTP

// Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/operadores', operadorRoutes);
app.use('/api/reportes-incidencia', reporteIncidenciaRoutes);
app.use('/api/incidencia', incidenciaRoutes);
app.use('/api/historial-parqueo', historialParqueoRoutes);
app.use('/api/get-estado', getEstadoRoutes);   
app.use('/api/vehiculo', vehiculoRoutes);
app.use('/api/acceso-salida', accesoSalidasRoutes);
app.use('/api/pico-placa', picoPlacaRoutes);
// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de Parking Lot funcionando correctamente.');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
