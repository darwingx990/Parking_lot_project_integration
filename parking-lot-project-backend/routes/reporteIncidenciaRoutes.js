const express = require('express');
const router = express.Router();
const reporteIncidenciaService = require('../services/reporteIncidenciaService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * Solo administrador puede listar reportes de incidencias
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const reportes = await reporteIncidenciaService.obtenerReportesIncidencia();
        res.status(200).json(reportes);
    } catch (error) {
        next(error);
    }
});

router.get('/vehiculo/:vehiculoId', verificarToken, async (req, res, next) => {
    try {
        const reportes = await reporteIncidenciaService.obtenerReportesPorVehiculo(req.params.vehiculoId);
        res.status(200).json(reportes);
    } catch (error) {
        next(error);
    }
});

router.get('/:vehiculoId/:incidenciaId', verificarToken, async (req, res, next) => {
    try {
        const reporte = await reporteIncidenciaService.obtenerReportePorId(
            req.params.vehiculoId,
            req.params.incidenciaId
        );
        res.status(200).json(reporte);
    } catch (error) {
        next(error);
    }
});

/**
 * Admin/Operador pueden crear reportes de incidencias
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const nuevoReporte = await reporteIncidenciaService.crearReporteIncidencia(req.body);
        res.status(201).json({ message: 'Reporte de incidencia creado exitosamente', reporte: nuevoReporte });
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede actualizar reportes
 */
router.put('/:vehiculoId/:incidenciaId', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await reporteIncidenciaService.actualizarReporteIncidencia(
            req.params.vehiculoId,
            req.params.incidenciaId,
            req.body
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:vehiculoId/:incidenciaId', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await reporteIncidenciaService.eliminarReporteIncidencia(
            req.params.vehiculoId,
            req.params.incidenciaId
        );
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
