const express = require('express');
const router = express.Router();
const operadorService = require('../services/operadorService');

router.post('/', async (req, res) => {
    try {
        const nuevoOperador = await operadorService.crearOperador(req.body);
        res.status(201).json({ message: 'Operador creado exitosamente', operador: nuevoOperador.toJSON ? nuevoOperador.toJSON() : nuevoOperador });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const operadores = await operadorService.obtenerOperadores();
        res.status(200).json(operadores.map(o => o.toJSON ? o.toJSON() : o));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const operador = await operadorService.obtenerOperadorPorId(req.params.id);
        res.status(200).json(operador.toJSON ? operador.toJSON() : operador);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await operadorService.actualizarOperador(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await operadorService.eliminarOperador(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
