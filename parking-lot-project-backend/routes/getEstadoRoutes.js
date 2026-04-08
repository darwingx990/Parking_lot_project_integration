const express = require('express');
const router = express.Router();
const getEstadoService = require('../services/getEstadoService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * REQ-CLD-02: Usuarios autenticados pueden visualizar todas las celdas
 */
router.get('/', verificarToken, async (req, res, next) => {
    try {
        const estados = await getEstadoService.obtenerEstados();
        res.status(200).json(estados);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        const estado = await getEstadoService.obtenerEstadoPorId(req.params.id);
        res.status(200).json(estado);
    } catch (error) {
        next(error);
    }
});

router.get('/tipo/:tipo', verificarToken, async (req, res, next) => {
    try {
        const estados = await getEstadoService.obtenerEstadosPorTipo(req.params.tipo);
        res.status(200).json(estados);
    } catch (error) {
        next(error);
    }
});

router.get('/estado/:estado', verificarToken, async (req, res, next) => {
    try {
        const estados = await getEstadoService.obtenerEstadosPorEstado(req.params.estado);
        res.status(200).json(estados);
    } catch (error) {
        next(error);
    }
});

router.get('/libre/:tipo', verificarToken, async (req, res, next) => {
    try {
        const celda = await getEstadoService.obtenerCeldaLibrePorTipo(req.params.tipo);
        res.status(200).json(celda);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CLD-01: Solo admin/operador pueden crear celdas
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const nuevoEstado = await getEstadoService.crearEstado(req.body);
        res.status(201).json({ message: 'Celda creada exitosamente', celda: nuevoEstado });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CLD-03: Solo admin puede actualizar celdas
 */
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await getEstadoService.actualizarEstado(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CLD-03: Admin/Operador pueden ocupar celdas
 */
router.patch('/:id/ocupar', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const resultado = await getEstadoService.ocuparCelda(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CLD-03: Admin/Operador pueden liberar celdas
 */
router.patch('/:id/liberar', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const resultado = await getEstadoService.liberarCelda(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await getEstadoService.eliminarEstado(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
