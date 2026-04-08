const Joi = require('joi');

/**
 * Esquemas de validación para diferentes operaciones
 */

const loginSchema = Joi.object({
    numeroDocumento: Joi.string().required().messages({
        'string.empty': 'El número de documento es requerido',
        'any.required': 'El número de documento es requerido'
    }),
    clave: Joi.string().when('tipoLogin', {
        is: Joi.string().valid('admin', 'operador'),
        then: Joi.string().required().min(6).messages({
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'any.required': 'La contraseña es requerida para administradores y operadores'
        }),
        otherwise: Joi.string().allow('')
    }),
    tipoLogin: Joi.string().valid('usuario', 'operador', 'admin').required()
});

const crearUsuarioSchema = Joi.object({
    tipoDocumento: Joi.string().valid('CC', 'CE', 'NIT', 'PASAPORTE').required().messages({
        'string.empty': 'El tipo de documento es requerido',
        'any.required': 'El tipo de documento es requerido'
    }),
    numeroDocumento: Joi.string().required().regex(/^\d+$/).messages({
        'string.empty': 'El número de documento es requerido',
        'string.pattern.base': 'El número de documento debe contener solo dígitos',
        'any.required': 'El número de documento es requerido'
    }),
    primerNombre: Joi.string().required().messages({
        'string.empty': 'El primer nombre es requerido',
        'any.required': 'El primer nombre es requerido'
    }),
    primerApellido: Joi.string().required().messages({
        'string.empty': 'El primer apellido es requerido',
        'any.required': 'El primer apellido es requerido'
    }),
    segundoNombre: Joi.string().allow('').optional(),
    segundoApellido: Joi.string().allow('').optional(),
    direccionCorreo: Joi.string().email().required().messages({
        'string.email': 'El correo electrónico no es válido',
        'string.empty': 'El correo electrónico es requerido',
        'any.required': 'El correo electrónico es requerido'
    }),
    numeroCelular: Joi.string().regex(/^\d{10}$/).required().messages({
        'string.pattern.base': 'El número de celular debe tener 10 dígitos',
        'string.empty': 'El número de celular es requerido',
        'any.required': 'El número de celular es requerido'
    }),
    tipo: Joi.string().valid('Administrador', 'Operador', 'Usuario').required().messages({
        'any.only': 'El tipo de usuario debe ser Administrador, Operador o Usuario',
        'any.required': 'El tipo de usuario es requerido'
    }),
    clave: Joi.string().when('tipo', {
        is: Joi.string().valid('Administrador', 'Operador'),
        then: Joi.string().required().min(6).messages({
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'any.required': 'La contraseña es requerida para administradores y operadores'
        }),
        otherwise: Joi.string().allow('')
    })
});

const crearVehiculoSchema = Joi.object({
    placa: Joi.string().required().regex(/^[A-Z]{2,3}\d{3,4}[A-Z]{0,2}$/).messages({
        'string.empty': 'La placa es requerida',
        'string.pattern.base': 'La placa no tiene un formato válido (ej: ABC123)',
        'any.required': 'La placa es requerida'
    }),
    color: Joi.string().required().messages({
        'string.empty': 'El color es requerido',
        'any.required': 'El color es requerido'
    }),
    marca: Joi.string().required().messages({
        'string.empty': 'La marca es requerida',
        'any.required': 'La marca es requerida'
    }),
    modelo: Joi.string().required().messages({
        'string.empty': 'El modelo es requerido',
        'any.required': 'El modelo es requerido'
    })
});

const accesoSalidaSchema = Joi.object({
    puerta: Joi.string().required().messages({
        'string.empty': 'La puerta es requerida',
        'any.required': 'La puerta es requerida'
    }),
    placa: Joi.string().required().regex(/^[A-Z]{2,3}\d{3,4}[A-Z]{0,2}$/).messages({
        'string.pattern.base': 'La placa no tiene un formato válido',
        'any.required': 'La placa es requerida'
    }),
    tipo: Joi.string().valid('acceso', 'salida').required().messages({
        'any.only': 'El tipo debe ser acceso o salida',
        'any.required': 'El tipo es requerido'
    })
});

const incidenciaSchema = Joi.object({
    vehiculoId: Joi.number().required().messages({
        'any.required': 'El ID del vehículo es requerido'
    }),
    tipo: Joi.string().valid('Rayones', 'Choques', 'Atropellamientos', 'Golpes contra muros').required().messages({
        'any.only': 'El tipo de incidencia no es válido',
        'any.required': 'El tipo de incidencia es requerido'
    }),
    descripcion: Joi.string().optional()
});

/**
 * Middleware para validar datos
 * @param {object} schema - Esquema de Joi a validar
 */
const validar = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errores = error.details.map(err => ({
                campo: err.path.join('.'),
                mensaje: err.message
            }));
            return res.status(400).json({ error: 'Validación fallida', detalles: errores });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    loginSchema,
    crearUsuarioSchema,
    crearVehiculoSchema,
    accesoSalidaSchema,
    incidenciaSchema,
    validar
};
