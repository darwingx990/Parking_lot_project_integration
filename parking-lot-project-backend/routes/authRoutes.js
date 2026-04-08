const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { validar, loginSchema } = require('../middlewares/validationMiddleware');

router.post('/login', validar(loginSchema), async (req, res) => {
    try {
        const { numeroDocumento, clave, tipoLogin } = req.body;
        
        const resultado = await authService.autenticarUsuario(numeroDocumento, clave, tipoLogin);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;