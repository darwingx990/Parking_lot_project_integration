const express = require('express');
const router = express.Router();
const getEstadoService = require('../services/getEstadoService');

router.get('/', async (req, res) => {
    try {
        const estados = await getEstadoService.obtenerEstados();
        res.status(200).json(estados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const estado = await getEstadoService.obtenerEstadoPorId(req.params.id);
        res.status(200).json(estado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/tipo/:tipo', async (req, res) => {
    try {
        const estados = await getEstadoService.obtenerEstadosPorTipo(req.params.tipo);
        res.status(200).json(estados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/estado/:estado', async (req, res) => {
    try {
        const estados = await getEstadoService.obtenerEstadosPorEstado(req.params.estado);
        res.status(200).json(estados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/libre/:tipo', async (req, res) => {
    try {
        const celda = await getEstadoService.obtenerCeldaLibrePorTipo(req.params.tipo);
        res.status(200).json(celda);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoEstado = await getEstadoService.crearEstado(req.body);
        res.status(201).json({ message: 'Celda creada exitosamente', celda: nuevoEstado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await getEstadoService.actualizarEstado(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id/ocupar', async (req, res) => {
    try {
        const resultado = await getEstadoService.ocuparCelda(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id/liberar', async (req, res) => {
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
