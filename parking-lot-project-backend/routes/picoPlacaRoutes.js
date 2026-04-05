const express = require('express');
const router = express.Router();
const picoPlacaService = require('../services/picoPlacaService');

router.post('/', async (req, res) => {
    try {
        const nuevoPicoPlaca = await picoPlacaService.crearPicoPlaca(req.body);
        res.status(201).json({ message: 'Pico y placa creado exitosamente', picoPlaca: nuevoPicoPlaca.toJSON() });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const picoPlacas = await picoPlacaService.obtenerPicoPlacas();
        res.status(200).json(picoPlacas.map(p => p.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const picoPlaca = await picoPlacaService.obtenerPicoPlacaPorId(req.params.id);
        res.status(200).json(picoPlaca.toJSON());
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await picoPlacaService.actualizarPicoPlaca(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await picoPlacaService.eliminarPicoPlaca(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
