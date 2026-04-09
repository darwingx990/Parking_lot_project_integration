const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');

router.post('/login', async (req, res) => {
    try {
        const { numeroDocumento, clave } = req.body;
        
        if (!numeroDocumento || !clave) {
            return res.status(400).json({ error: 'Número de documento y clave son obligatorios.' });
        }

        const usuarioAutenticado = await usuarioService.validarCredenciales(numeroDocumento, clave);
        res.status(200).json(usuarioAutenticado);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;
