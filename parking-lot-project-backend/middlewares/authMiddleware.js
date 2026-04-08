const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT
 * Valida que el token sea válido y extraiga la información del usuario
 */
const verificarToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token requerido' });
        }

        const claims = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.usuario = claims;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

/**
 * Middleware para verificar roles
 * @param {string[]} rolesPermitidos - Array de roles que pueden acceder
 */
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes' });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    verificarRol
};
