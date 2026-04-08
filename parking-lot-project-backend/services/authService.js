const sql = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    /**
     * Autentica un usuario y genera un token JWT
     * REQ-USR-7: Admin/Operador con documento + contraseña
     * REQ-USR-8: Usuario solo con documento
     */
    async autenticarUsuario(numeroDocumento, clave, tipoLogin) {
        try {
            const result = await sql`
                SELECT u.*, p.perfil 
                FROM "USUARIO" u
                JOIN "PERFIL_USUARIO" p ON u."PERFIL_USUARIO_id" = p.id
                WHERE u.numero_documento = ${numeroDocumento}
            `;
            
            if (result.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            
            const usuario = result[0];
            
            if (usuario.estado !== 'activo') {
                throw new Error('Usuario inactivo. Contacte al administrador.');
            }
            
            let rol = 'usuario';
            if (usuario.perfil === 'administrador') {
                rol = 'administrador';
            } else if (usuario.perfil === 'operador') {
                rol = 'operador';
            }
            
            // REQ-USR-8: Usuarios solo necesitan documento
            if (rol === 'usuario') {
                const token = this.generarToken(usuario, rol);
                return {
                    token,
                    usuario: {
                        id: usuario.id_usuario,
                        tipoDocumento: usuario.tipo_documento,
                        numeroDocumento: usuario.numero_documento,
                        primerNombre: usuario.primer_nombre,
                        segundoNombre: usuario.segundo_nombre,
                        primerApellido: usuario.primer_apellido,
                        segundoApellido: usuario.segundo_apellido,
                        direccionCorreo: usuario.direccion_correo,
                        numeroCelular: usuario.numero_celular,
                        fotoPerfil: usuario.foto_perfil,
                        estado: usuario.estado,
                        perfil: usuario.perfil,
                        perfilId: usuario.PERFIL_USUARIO_id,
                        rol: rol
                    }
                };
            }
            
            // REQ-USR-7: Admin/Operador requieren contraseña
            if (!clave) {
                throw new Error('La contraseña es requerida para operadores y administradores');
            }
            
            // Validar contraseña hasheada
            const claveValida = await bcrypt.compare(clave, usuario.clave || '');
            if (!claveValida) {
                throw new Error('Contraseña incorrecta');
            }
            
            const token = this.generarToken(usuario, rol);
            return {
                token,
                usuario: {
                    id: usuario.id_usuario,
                    tipoDocumento: usuario.tipo_documento,
                    numeroDocumento: usuario.numero_documento,
                    primerNombre: usuario.primer_nombre,
                    segundoNombre: usuario.segundo_nombre,
                    primerApellido: usuario.primer_apellido,
                    segundoApellido: usuario.segundo_apellido,
                    direccionCorreo: usuario.direccion_correo,
                    numeroCelular: usuario.numero_celular,
                    fotoPerfil: usuario.foto_perfil,
                    estado: usuario.estado,
                    perfil: usuario.perfil,
                    perfilId: usuario.PERFIL_USUARIO_id,
                    rol: rol
                }
            };
        } catch (error) {
            console.error('Error en autenticarUsuario:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw error;
        }
    }

    /**
     * Genera un token JWT con información del usuario
     */
    generarToken(usuario, rol) {
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                numeroDocumento: usuario.numero_documento,
                tipo: rol,
                nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`
            },
            secretKey,
            { expiresIn: '24h' }
        );
        return token;
    }

    /**
     * Hashea una contraseña usando bcryptjs
     */
    async hashearContrasena(contrasena) {
        const saltRounds = 10;
        return await bcrypt.hash(contrasena, saltRounds);
    }
}

module.exports = new AuthService();