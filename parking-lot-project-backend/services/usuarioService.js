const sql = require('../config/db.js');
const Usuario = require('../models/Usuario');

class UsuarioService {
    async crearUsuario(datos) {
        try {
            const { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave, perfilId } = datos;
            
            if (!tipoDocumento || !numeroDocumento || !primerNombre || !primerApellido || !direccionCorreo || !numeroCelular || !perfilId) {
                throw new Error('Los campos obligatorios son: tipoDocumento, numeroDocumento, primerNombre, primerApellido, direccionCorreo, numeroCelular, perfilId.');
            }
            
            const result = await sql`
                INSERT INTO "USUARIO" (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, "PERFIL_USUARIO_id")
                VALUES (${tipoDocumento}, ${numeroDocumento}, ${primerNombre}, ${segundoNombre || null}, ${primerApellido}, ${segundoApellido || null}, ${direccionCorreo}, ${numeroCelular}, ${fotoPerfil || null}, ${estado || 'activo'}, ${clave || null}, ${perfilId})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el usuario.');
            }
            
            const row = result[0];
            return new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado);
        } catch (error) {
            console.error('Error en crearUsuario:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    async obtenerUsuarios() {
        try {
            const result = await sql`
                SELECT u.*, p.perfil 
                FROM "USUARIO" u
                JOIN "PERFIL_USUARIO" p ON u."PERFIL_USUARIO_id" = p.id
                ORDER BY u.id_usuario
            `;
            
            return result.map(row => ({
                id: row.id_usuario,
                tipoDocumento: row.tipo_documento,
                numeroDocumento: row.numero_documento,
                primerNombre: row.primer_nombre,
                segundoNombre: row.segundo_nombre,
                primerApellido: row.primer_apellido,
                segundoApellido: row.segundo_apellido,
                direccionCorreo: row.direccion_correo,
                numeroCelular: row.numero_celular,
                fotoPerfil: row.foto_perfil,
                estado: row.estado,
                perfil: row.perfil
            }));
        } catch (error) {
            console.error('Error en obtenerUsuarios:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    async obtenerUsuarioPorId(id) {
        try {
            const result = await sql`
                SELECT u.*, p.perfil 
                FROM "USUARIO" u
                JOIN "PERFIL_USUARIO" p ON u."PERFIL_USUARIO_id" = p.id
                WHERE u.id_usuario = ${id}
            `;
            
            if (result.length === 0) {
                throw new Error('Usuario no encontrado.');
            }
            
            const row = result[0];
            return new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado);
        } catch (error) {
            console.error('Error en obtenerUsuarioPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }

    async obtenerUsuarioPorDocumento(numeroDocumento) {
        try {
            const result = await sql`
                SELECT u.*, p.perfil 
                FROM "USUARIO" u
                JOIN "PERFIL_USUARIO" p ON u."PERFIL_USUARIO_id" = p.id
                WHERE u.numero_documento = ${numeroDocumento}
            `;
            
            if (result.length === 0) {
                throw new Error('Usuario no encontrado.');
            }
            
            const row = result[0];
            return new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado);
        } catch (error) {
            console.error('Error en obtenerUsuarioPorDocumento:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener usuario por documento: ${error.message}`);
        }
    }

    async actualizarUsuario(id, datosActualizados) {
        try {
            const campos = [];
            const valores = {};
            
            if (datosActualizados.tipoDocumento !== undefined) {
                campos.push('tipo_documento');
                valores.tipoDocumento = datosActualizados.tipoDocumento;
            }
            if (datosActualizados.numeroDocumento !== undefined) {
                campos.push('numero_documento');
                valores.numeroDocumento = datosActualizados.numeroDocumento;
            }
            if (datosActualizados.primerNombre !== undefined) {
                campos.push('primer_nombre');
                valores.primerNombre = datosActualizados.primerNombre;
            }
            if (datosActualizados.segundoNombre !== undefined) {
                campos.push('segundo_nombre');
                valores.segundoNombre = datosActualizados.segundoNombre;
            }
            if (datosActualizados.primerApellido !== undefined) {
                campos.push('primer_apellido');
                valores.primerApellido = datosActualizados.primerApellido;
            }
            if (datosActualizados.segundoApellido !== undefined) {
                campos.push('segundo_apellido');
                valores.segundoApellido = datosActualizados.segundoApellido;
            }
            if (datosActualizados.direccionCorreo !== undefined) {
                campos.push('direccion_correo');
                valores.direccionCorreo = datosActualizados.direccionCorreo;
            }
            if (datosActualizados.numeroCelular !== undefined) {
                campos.push('numero_celular');
                valores.numeroCelular = datosActualizados.numeroCelular;
            }
            if (datosActualizados.fotoPerfil !== undefined) {
                campos.push('foto_perfil');
                valores.fotoPerfil = datosActualizados.fotoPerfil;
            }
            if (datosActualizados.estado !== undefined) {
                campos.push('estado');
                valores.estado = datosActualizados.estado;
            }
            if (datosActualizados.clave !== undefined) {
                campos.push('clave');
                valores.clave = datosActualizados.clave;
            }
            
            if (campos.length === 0) {
                throw new Error('No hay campos para actualizar.');
            }
            
            const result = await sql`
                UPDATE "USUARIO"
                SET tipo_documento = ${valores.tipoDocumento || sql.unsafe('tipo_documento')},
                    numero_documento = ${valores.numeroDocumento || sql.unsafe('numero_documento')},
                    primer_nombre = ${valores.primerNombre || sql.unsafe('primer_nombre')},
                    segundo_nombre = ${valores.segundoNombre !== undefined ? valores.segundoNombre : sql.unsafe('segundo_nombre')},
                    primer_apellido = ${valores.primerApellido || sql.unsafe('primer_apellido')},
                    segundo_apellido = ${valores.segundoApellido !== undefined ? valores.segundoApellido : sql.unsafe('segundo_apellido')},
                    direccion_correo = ${valores.direccionCorreo || sql.unsafe('direccion_correo')},
                    numero_celular = ${valores.numeroCelular || sql.unsafe('numero_celular')},
                    foto_perfil = ${valores.fotoPerfil !== undefined ? valores.fotoPerfil : sql.unsafe('foto_perfil')},
                    estado = ${valores.estado || sql.unsafe('estado')},
                    clave = ${valores.clave !== undefined ? valores.clave : sql.unsafe('clave')}
                WHERE id_usuario = ${id}
                RETURNING id_usuario
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Usuario no encontrado para actualizar.');
            }
            
            return { message: "Usuario actualizado correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarUsuario:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    async eliminarUsuario(id) {
        try {
            const result = await sql`DELETE FROM "USUARIO" WHERE id_usuario = ${id} RETURNING id_usuario`;
            
            if (!result || result.length === 0) {
                throw new Error('Usuario no encontrado para eliminar.');
            }
            
            return { message: "Usuario eliminado con éxito." };
        } catch (error) {
            console.error('Error en eliminarUsuario:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

module.exports = new UsuarioService();
