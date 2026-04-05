const express = require('express');
const router = express.Router();
const administradorService = require('../services/administradorService');

router.post('/', async (req, res) => {
    try {
        const nuevoAdmin = await administradorService.crearAdministrador(req.body);
        res.status(201).json({ message: 'Administrador creado exitosamente', administrador: nuevoAdmin.toJSON ? nuevoAdmin.toJSON() : nuevoAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const admins = await administradorService.obtenerAdministradores();
        res.status(200).json(admins.map(a => a.toJSON ? a.toJSON() : a));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const admin = await administradorService.obtenerAdministradorPorId(req.params.id);
        res.status(200).json(admin.toJSON ? admin.toJSON() : admin);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await administradorService.actualizarAdministrador(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await administradorService.eliminarAdministrador(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
