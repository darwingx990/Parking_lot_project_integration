const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');
const { verificarToken } = require('../middlewares/authMiddleware');
const bcrypt = require('bcryptjs');

/**
 * REQ-USR-4: Usuarios autenticados pueden ver y actualizar su propio perfil
 */
router.get('/:id', verificarToken, async (req, res, next) => {
    try {
        // Validar que el usuario solo vea su propio perfil o sea admin
        if (req.usuario.id != req.params.id && req.usuario.tipo !== 'Administrador') {
            return res.status(403).json({ error: 'No tienes permiso para acceder a este perfil' });
        }
        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-USR-4: Usuario puede actualizar su propio perfil
 * Se envía notificación al administrador
 */
router.put('/:id', verificarToken, async (req, res, next) => {
    try {
        // Validar que el usuario solo actualice su propio perfil o sea admin
        if (req.usuario.id != req.params.id && req.usuario.tipo !== 'Administrador') {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este perfil' });
        }

        const { primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil } = req.body;
        
        const datosActualizados = {};
        if (primerNombre !== undefined) datosActualizados.primerNombre = primerNombre;
        if (segundoNombre !== undefined) datosActualizados.segundoNombre = segundoNombre;
        if (primerApellido !== undefined) datosActualizados.primerApellido = primerApellido;
        if (segundoApellido !== undefined) datosActualizados.segundoApellido = segundoApellido;
        if (direccionCorreo !== undefined) datosActualizados.direccionCorreo = direccionCorreo;
        if (numeroCelular !== undefined) datosActualizados.numeroCelular = numeroCelular;
        if (fotoPerfil !== undefined) datosActualizados.fotoPerfil = fotoPerfil;
        
        const resultado = await usuarioService.actualizarUsuario(req.params.id, datosActualizados);
        
        // TODO: Enviar notificación al administrador si es usuario quien actualizó sus datos
        if (req.usuario.tipo === 'Usuario') {
            console.log(`Notificación pendiente: Usuario ${req.usuario.id} actualizó su perfil`);
        }
        
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * Usuario puede cambiar su propia contraseña
 */
router.put('/:id/clave', verificarToken, async (req, res, next) => {
    try {
        // Validar que el usuario solo cambie su propia contraseña
        if (req.usuario.id != req.params.id) {
            return res.status(403).json({ error: 'No tienes permiso para cambiar la contraseña de otro usuario' });
        }

        const { claveActual, claveNueva } = req.body;
        
        if (!claveActual || !claveNueva) {
            return res.status(400).json({ error: 'La contraseña actual y nueva son requeridas' });
        }
        
        if (claveNueva.length < 6) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
        
        // Comparar contraseña hasheada
        const claveValida = await bcrypt.compare(claveActual, usuario.clave || '');
        if (!claveValida) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }
        
        // Hashear la nueva contraseña
        const claveHasheada = await bcrypt.hash(claveNueva, 10);
        const resultado = await usuarioService.actualizarUsuario(req.params.id, { clave: claveHasheada });
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;