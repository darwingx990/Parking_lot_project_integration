const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
    
    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
}

function soloAdmin(req, res, next) {
    if (!req.usuario || req.usuario.rol !== 'administrador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador.' });
    }
    next();
}

function soloOperadorOAdmin(req, res, next) {
    if (!req.usuario || (req.usuario.rol !== 'administrador' && req.usuario.rol !== 'operador')) {
        return res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
}

module.exports = { verificarToken, soloAdmin, soloOperadorOAdmin };
