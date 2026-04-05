const express = require('express');
const router = express.Router();
const incidenciaService = require('../services/incidenciaService');

const verificarAdminOOperador = (req, res, next) => {
    const { rol } = req.headers;
    if (rol !== 'administrador' && rol !== 'operador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador u operador' });
    }
    next();
};

const verificarAdmin = (req, res, next) => {
    const { rol } = req.headers;
    if (rol !== 'administrador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
    }
    next();
};

router.post('/', verificarAdminOOperador, async (req, res) => {
    try {
        const nuevaIncidencia = await incidenciaService.crearIncidencia(req.body);
        res.status(201).json({ message: 'Incidencia creada exitosamente', incidencia: nuevaIncidencia });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', verificarAdminOOperador, async (req, res) => {
    try {
        const incidencias = await incidenciaService.obtenerIncidencias();
        res.status(200).json(incidencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', verificarAdminOOperador, async (req, res) => {
    try {
        const incidencia = await incidenciaService.obtenerIncidenciaPorId(req.params.id);
        res.status(200).json(incidencia);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/nombre/:nombre', verificarAdminOOperador, async (req, res) => {
    try {
        const incidencia = await incidenciaService.obtenerIncidenciaPorNombre(req.params.nombre);
        res.status(200).json(incidencia);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', verificarAdminOOperador, async (req, res) => {
    try {
        const resultado = await incidenciaService.actualizarIncidencia(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', verificarAdmin, async (req, res) => {
    try {
        const resultado = await incidenciaService.eliminarIncidencia(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
