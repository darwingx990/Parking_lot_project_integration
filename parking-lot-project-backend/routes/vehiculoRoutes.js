const express = require('express');
const router = express.Router();
const vehiculoService = require('../services/vehiculoService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const { validar, crearVehiculoSchema } = require('../middlewares/validationMiddleware');

/**
 * REQ-REP-02: Solo administrador puede listar todos los vehículos
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const vehiculos = await vehiculoService.obtenerVehiculos();
        res.status(200).json(vehiculos);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        const vehiculo = await vehiculoService.obtenerVehiculoPorId(req.params.id);
        res.status(200).json(vehiculo.toJSON ? vehiculo.toJSON() : vehiculo);
    } catch (error) {
        next(error);
    }
});

router.get('/usuario/:usuarioId', verificarToken, async (req, res, next) => {
    try {
        const vehiculos = await vehiculoService.obtenerVehiculosPorUsuario(req.params.usuarioId);
        res.status(200).json(vehiculos.map(v => v.toJSON ? v.toJSON() : v));
    } catch (error) {
        next(error);
    }
});

router.get('/placa/:placa', verificarToken, async (req, res, next) => {
    try {
        const vehiculo = await vehiculoService.obtenerVehiculoPorPlaca(req.params.placa);
        res.status(200).json(vehiculo.toJSON ? vehiculo.toJSON() : vehiculo);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CAR-1: Solo administrador y operadores pueden crear vehículos
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), validar(crearVehiculoSchema), async (req, res, next) => {
    try {
        const nuevoVehiculo = await vehiculoService.crearVehiculo(req.body);
        res.status(201).json({ message: 'Vehículo creado exitosamente', vehiculo: nuevoVehiculo.toJSON ? nuevoVehiculo.toJSON() : nuevoVehiculo });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CAR-2: Solo administrador puede actualizar vehículos
 */
router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await vehiculoService.actualizarVehiculo(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-CAR-3: Solo administrador puede asignar vehículo a otro usuario
 */
router.patch('/:id/usuario', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const { usuarioId } = req.body;
        if (!usuarioId) {
            return res.status(400).json({ error: 'usuarioId es requerido' });
        }
        const resultado = await vehiculoService.asignarVehiculoAUsuario(req.params.id, usuarioId);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await vehiculoService.eliminarVehiculo(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
