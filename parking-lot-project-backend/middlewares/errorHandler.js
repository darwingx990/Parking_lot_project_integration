function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;
    const isProd = process.env.NODE_ENV === 'production';
    
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${err.message}`);
    
    res.status(status).json({
        error: isProd ? 'Error interno del servidor' : err.message,
        ...(isProd ? {} : { stack: err.stack })
    });
}

module.exports = errorHandler;
