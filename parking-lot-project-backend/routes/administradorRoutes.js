const express = require('express');
const router = express.Router();
const administradorService = require('../services/administradorService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * Solo administrador puede crear nuevos administradores
 */
router.post('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const nuevoAdmin = await administradorService.crearAdministrador(req.body);
        res.status(201).json({ message: 'Administrador creado exitosamente', administrador: nuevoAdmin.toJSON ? nuevoAdmin.toJSON() : nuevoAdmin });
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede listar administradores
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const admins = await administradorService.obtenerAdministradores();
        res.status(200).json(admins.map(a => a.toJSON ? a.toJSON() : a));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const admin = await administradorService.obtenerAdministradorPorId(req.params.id);
        res.status(200).json(admin.toJSON ? admin.toJSON() : admin);
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede actualizar administradores
 */
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await administradorService.actualizarAdministrador(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede eliminar administradores
 */
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await administradorService.eliminarAdministrador(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
