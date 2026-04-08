const express = require('express');
const router = express.Router();
const picoPlacaService = require('../services/picoPlacaService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

/**
 * REQ-CAR-4: Solo administrador/operador pueden crear restricciones de pico y placa
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const nuevoPicoPlaca = await picoPlacaService.crearPicoPlaca(req.body);
        res.status(201).json({ message: 'Pico y placa creado exitosamente', picoPlaca: nuevoPicoPlaca.toJSON() });
    } catch (error) {
        next(error);
    }
});

/**
 * Listar todas las restricciones (cualquier usuario autenticado)
 */
router.get('/', verificarToken, async (req, res, next) => {
    try {
        const picoPlacas = await picoPlacaService.obtenerPicoPlacas();
        res.status(200).json(picoPlacas.map(p => p.toJSON()));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        const picoPlaca = await picoPlacaService.obtenerPicoPlacaPorId(req.params.id);
        res.status(200).json(picoPlaca.toJSON());
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede actualizar restricciones de pico y placa
 */
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await picoPlacaService.actualizarPicoPlaca(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * Solo administrador puede eliminar restricciones de pico y placa
 */
router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await picoPlacaService.eliminarPicoPlaca(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
