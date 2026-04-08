/**
 * Middleware centralizado para manejo de errores
 * Captura y formatea errores de toda la aplicación
 */

const errorHandler = (error, req, res, next) => {
    console.error('Error:', {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        message: error.message,
        stack: error.stack
    });

    // Errores de validación
    if (error.isJoi || error.details) {
        return res.status(400).json({
            error: 'Validación fallida',
            detalles: error.details || error.message
        });
    }

    // Errores de autenticación
    if (error.name === 'JsonWebTokenError' || error.message.includes('token')) {
        return res.status(401).json({
            error: 'Error de autenticación',
            mensaje: error.message
        });
    }

    // Errores de base de datos
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        return res.status(503).json({
            error: 'Servicio no disponible',
            mensaje: 'No se puede conectar a la base de datos'
        });
    }

    // Errores genéricos
    const statusCode = error.statusCode || 500;
    const mensaje = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : error.message;

    res.status(statusCode).json({
        error: error.name || 'Error',
        mensaje: mensaje,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
};

module.exports = errorHandler;
