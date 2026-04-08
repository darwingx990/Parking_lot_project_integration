const express = require('express');
const router = express.Router();
const historialParqueoService = require('../services/historialParqueoService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * Solo administrador puede listar todos los historiales
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const historiales = await historialParqueoService.obtenerHistoriales();
        res.status(200).json(historiales);
    } catch (error) {
        next(error);
    }
});

router.get('/vehiculo/:vehiculoId', verificarToken, async (req, res, next) => {
    try {
        const historiales = await historialParqueoService.obtenerHistorialesPorVehiculo(req.params.vehiculoId);
        res.status(200).json(historiales);
    } catch (error) {
        next(error);
    }
});

router.get('/celda/:celdaId', verificarToken, async (req, res, next) => {
    try {
        const historiales = await historialParqueoService.obtenerHistorialesPorCelda(req.params.celdaId);
        res.status(200).json(historiales);
    } catch (error) {
        next(error);
    }
});

router.get('/:celdaId/:vehiculoId', verificarToken, async (req, res, next) => {
    try {
        const historial = await historialParqueoService.obtenerHistorialPorId(
            req.params.celdaId,
            req.params.vehiculoId
        );
        res.status(200).json(historial);
    } catch (error) {
        next(error);
    }
});

/**
 * Admin/Operador pueden crear historiales de parqueo
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const nuevoHistorial = await historialParqueoService.crearHistorial(req.body);
        res.status(201).json({ message: 'Historial de parqueo creado exitosamente', historial: nuevoHistorial });
    } catch (error) {
        next(error);
    }
});

router.put('/:celdaId/:vehiculoId', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const resultado = await historialParqueoService.actualizarHistorial(
            req.params.celdaId,
            req.params.vehiculoId,
            req.body
        );
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

router.delete('/:celdaId/:vehiculoId', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await historialParqueoService.eliminarHistorial(
            req.params.celdaId,
            req.params.vehiculoId
        );
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

// module.exports = router;
//         res.status(400).json({ error: error.message });

module.exports = router;
