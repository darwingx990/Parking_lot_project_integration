const express = require('express');
const router = express.Router();
const historialParqueoService = require('../services/historialParqueoService');

router.get('/', async (req, res) => {
    try {
        const historiales = await historialParqueoService.obtenerHistoriales();
        res.status(200).json(historiales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vehiculo/:vehiculoId', async (req, res) => {
    try {
        const historiales = await historialParqueoService.obtenerHistorialesPorVehiculo(req.params.vehiculoId);
        res.status(200).json(historiales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/celda/:celdaId', async (req, res) => {
    try {
        const historiales = await historialParqueoService.obtenerHistorialesPorCelda(req.params.celdaId);
        res.status(200).json(historiales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:celdaId/:vehiculoId', async (req, res) => {
    try {
        const historial = await historialParqueoService.obtenerHistorialPorId(
            req.params.celdaId,
            req.params.vehiculoId
        );
        res.status(200).json(historial);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoHistorial = await historialParqueoService.crearHistorial(req.body);
        res.status(201).json({ message: 'Historial de parqueo creado exitosamente', historial: nuevoHistorial });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:celdaId/:vehiculoId', async (req, res) => {
    try {
        const resultado = await historialParqueoService.actualizarHistorial(
            req.params.celdaId,
            req.params.vehiculoId,
            req.body
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:celdaId/:vehiculoId', async (req, res) => {
    try {
        const resultado = await historialParqueoService.eliminarHistorial(
            req.params.celdaId,
            req.params.vehiculoId
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
