const express = require('express');
const router = express.Router();
const reporteIncidenciaService = require('../services/reporteIncidenciaService');

router.get('/', async (req, res) => {
    try {
        const reportes = await reporteIncidenciaService.obtenerReportesIncidencia();
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vehiculo/:vehiculoId', async (req, res) => {
    try {
        const reportes = await reporteIncidenciaService.obtenerReportesPorVehiculo(req.params.vehiculoId);
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:vehiculoId/:incidenciaId', async (req, res) => {
    try {
        const reporte = await reporteIncidenciaService.obtenerReportePorId(
            req.params.vehiculoId,
            req.params.incidenciaId
        );
        res.status(200).json(reporte);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoReporte = await reporteIncidenciaService.crearReporteIncidencia(req.body);
        res.status(201).json({ message: 'Reporte de incidencia creado exitosamente', reporte: nuevoReporte });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:vehiculoId/:incidenciaId', async (req, res) => {
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

router.delete('/:vehiculoId/:incidenciaId', async (req, res) => {
    try {
        const resultado = await reporteIncidenciaService.eliminarReporteIncidencia(
            req.params.vehiculoId,
            req.params.incidenciaId
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
