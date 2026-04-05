const express = require('express');
const router = express.Router();
const vehiculoService = require('../services/vehiculoService');

router.get('/', async (req, res) => {
    try {
        const vehiculos = await vehiculoService.obtenerVehiculos();
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const vehiculo = await vehiculoService.obtenerVehiculoPorId(req.params.id);
        res.status(200).json(vehiculo.toJSON ? vehiculo.toJSON() : vehiculo);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/usuario/:usuarioId', async (req, res) => {
    try {
        const vehiculos = await vehiculoService.obtenerVehiculosPorUsuario(req.params.usuarioId);
        res.status(200).json(vehiculos.map(v => v.toJSON ? v.toJSON() : v));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/placa/:placa', async (req, res) => {
    try {
        const vehiculo = await vehiculoService.obtenerVehiculoPorPlaca(req.params.placa);
        res.status(200).json(vehiculo.toJSON ? vehiculo.toJSON() : vehiculo);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoVehiculo = await vehiculoService.crearVehiculo(req.body);
        res.status(201).json({ message: 'Vehículo creado exitosamente', vehiculo: nuevoVehiculo.toJSON ? nuevoVehiculo.toJSON() : nuevoVehiculo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await vehiculoService.actualizarVehiculo(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await vehiculoService.eliminarVehiculo(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
