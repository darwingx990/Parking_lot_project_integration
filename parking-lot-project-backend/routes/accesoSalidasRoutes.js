const express = require('express');
const router = express.Router();
const accesoSalidasService = require('../services/accesoSalidasService');
const validacionPicoPlacaService = require('../services/validacionPicoPlacaService');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const { validar, accesoSalidaSchema } = require('../middlewares/validationMiddleware');

/**
 * REQ-REP-03: Solo administrador puede listar todas las entradas
 */
router.get('/', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const accesos = await accesoSalidasService.obtenerAccesoSalidas();
        res.status(200).json(accesos);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        const acceso = await accesoSalidasService.obtenerAccesoSalidasPorId(req.params.id);
        res.status(200).json(acceso.toJSON ? acceso.toJSON() : acceso);
    } catch (error) {
        next(error);
    }
});

router.get('/vehiculo/:vehiculoId', verificarToken, async (req, res, next) => {
    try {
        const accesos = await accesoSalidasService.obtenerAccesoSalidasPorVehiculo(req.params.vehiculoId);
        res.status(200).json(accesos.map(a => a.toJSON ? a.toJSON() : a));
    } catch (error) {
        next(error);
    }
});

router.get('/fecha/:fechaInicio/:fechaFin', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const accesos = await accesoSalidasService.obtenerAccesoSalidasPorFecha(req.params.fechaInicio, req.params.fechaFin);
        res.status(200).json(accesos);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-INEX-1,2: Registrar entrada/salida (operador/admin)
 * REQ-INEX-4: Validar pico y placa antes de acceso
 */
router.post('/', verificarToken, verificarRol(['Administrador', 'Operador']), validar(accesoSalidaSchema), async (req, res, next) => {
    try {
        const { tipo, placa } = req.body;

        // REQ-INEX-4: Si es acceso (entrada), validar pico y placa
        if (tipo === 'acceso') {
            const validacion = await validacionPicoPlacaService.validarPicoPlaca(placa);
            if (!validacion.permitido) {
                return res.status(403).json({ 
                    error: 'Acceso denegado',
                    razon: validacion.razon 
                });
            }
        }

        const nuevoAcceso = await accesoSalidasService.crearAccesoSalidas(req.body);
        res.status(201).json({ 
            message: 'Acceso/Salida creado exitosamente', 
            acceso: nuevoAcceso.toJSON ? nuevoAcceso.toJSON() : nuevoAcceso 
        });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-INEX-4: Endpoint para validar pico y placa sin registrar entrada
 */
router.post('/validar-pico-placa/:placa', verificarToken, verificarRol(['Administrador', 'Operador']), async (req, res, next) => {
    try {
        const { placa } = req.params;
        const validacion = await validacionPicoPlacaService.validarPicoPlaca(placa);
        res.status(200).json(validacion);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await accesoSalidasService.actualizarAccesoSalidas(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const resultado = await accesoSalidasService.eliminarAccesoSalidas(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
//         const resultado = await accesoSalidasService.eliminarAccesoSalidas(req.params.id);
//         res.status(200).json(resultado);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// module.exports = router;
