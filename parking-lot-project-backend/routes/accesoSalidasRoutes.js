const express = require('express');
const router = express.Router();
const accesoSalidasService = require('../services/accesoSalidasService');

router.get('/', async (req, res) => {
    try {
        const accesos = await accesoSalidasService.obtenerAccesoSalidas();
        res.status(200).json(accesos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const acceso = await accesoSalidasService.obtenerAccesoSalidasPorId(req.params.id);
        res.status(200).json(acceso.toJSON ? acceso.toJSON() : acceso);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/vehiculo/:vehiculoId', async (req, res) => {
    try {
        const accesos = await accesoSalidasService.obtenerAccesoSalidasPorVehiculo(req.params.vehiculoId);
        res.status(200).json(accesos.map(a => a.toJSON ? a.toJSON() : a));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/fecha/:fechaInicio/:fechaFin', async (req, res) => {
    try {
        const accesos = await accesoSalidasService.obtenerAccesoSalidasPorFecha(req.params.fechaInicio, req.params.fechaFin);
        res.status(200).json(accesos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoAcceso = await accesoSalidasService.crearAccesoSalidas(req.body);
        res.status(201).json({ message: 'Acceso/Salida creado exitosamente', acceso: nuevoAcceso.toJSON ? nuevoAcceso.toJSON() : nuevoAcceso });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await accesoSalidasService.actualizarAccesoSalidas(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await accesoSalidasService.eliminarAccesoSalidas(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
