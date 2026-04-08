const express = require('express');
const router = express.Router();
const operadorService = require('../services/operadorService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * Solo administrador puede crear operadores
 */
router.post('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const nuevoOperador = await operadorService.crearOperador(req.body);
        res.status(201).json({ message: 'Operador creado exitosamente', operador: nuevoOperador.toJSON ? nuevoOperador.toJSON() : nuevoOperador });
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede listar operadores
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const operadores = await operadorService.obtenerOperadores();
        res.status(200).json(operadores.map(o => o.toJSON ? o.toJSON() : o));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const operador = await operadorService.obtenerOperadorPorId(req.params.id);
        res.status(200).json(operador.toJSON ? operador.toJSON() : operador);
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede actualizar operadores
 */
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await operadorService.actualizarOperador(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede eliminar operadores
 */
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await operadorService.eliminarOperador(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
