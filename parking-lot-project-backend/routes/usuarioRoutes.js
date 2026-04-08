const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const { validar, crearUsuarioSchema } = require('../middlewares/validationMiddleware');

/**
 * REQ-USR-2: Solo administrador y operadores pueden crear usuarios
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), validar(crearUsuarioSchema), async (req, res, next) => {
    try {
        const nuevoUsuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario.toJSON ? nuevoUsuario.toJSON() : nuevoUsuario });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-01: Solo administrador puede listar todos los usuarios
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
        res.status(200).json(usuario.toJSON ? usuario.toJSON() : usuario);
    } catch (error) {
        next(error);
    }
});

router.get('/documento/:numeroDocumento', verificarToken, async (req, res, next) => {
    try {
        const usuario = await usuarioService.obtenerUsuarioPorDocumento(req.params.numeroDocumento);
        res.status(200).json(usuario.toJSON ? usuario.toJSON() : usuario);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-USR-5: Solo administrador puede actualizar datos de otros usuarios
 */
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await usuarioService.actualizarUsuario(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-USR-3: Solo administrador puede cambiar estado de usuario (activo/inactivo)
 */
router.patch('/:id/estado', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const { estado } = req.body;
        if (!estado || !['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({ error: 'Estado debe ser activo o inactivo' });
        }
        const resultado = await usuarioService.actualizarEstadoUsuario(req.params.id, estado);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await usuarioService.eliminarUsuario(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
