const express = require('express');
const router = express.Router();
const incidenciaService = require('../services/incidenciaService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * REQ-INCD-1: Registrar incidencias (admin/operador)
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const nuevaIncidencia = await incidenciaService.crearIncidencia(req.body);
        res.status(201).json({ message: 'Incidencia creada exitosamente', incidencia: nuevaIncidencia });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-05: Solo administrador puede listar todas las incidencias
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const incidencias = await incidenciaService.obtenerIncidencias();
        res.status(200).json(incidencias);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        const incidencia = await incidenciaService.obtenerIncidenciaPorId(req.params.id);
        res.status(200).json(incidencia);
    } catch (error) {
        next(error);
    }
});

router.get('/nombre/:nombre', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const incidencia = await incidenciaService.obtenerIncidenciaPorNombre(req.params.nombre);
        res.status(200).json(incidencia);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const resultado = await incidenciaService.actualizarIncidencia(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await incidenciaService.eliminarIncidencia(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
