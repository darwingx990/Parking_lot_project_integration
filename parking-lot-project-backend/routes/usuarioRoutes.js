const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');

router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario.toJSON ? nuevoUsuario.toJSON() : nuevoUsuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
        res.status(200).json(usuario.toJSON ? usuario.toJSON() : usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/documento/:numeroDocumento', async (req, res) => {
    try {
        const usuario = await usuarioService.obtenerUsuarioPorDocumento(req.params.numeroDocumento);
        res.status(200).json(usuario.toJSON ? usuario.toJSON() : usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const resultado = await usuarioService.actualizarUsuario(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await usuarioService.eliminarUsuario(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
