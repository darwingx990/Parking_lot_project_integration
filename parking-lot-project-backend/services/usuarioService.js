const sql = require('../config/db.js');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

class UsuarioService {
    async crearUsuario(datos) {
        try {
            const { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave, perfilId } = datos;
            
            if (!tipoDocumento || !numeroDocumento || !primerNombre || !primerApellido || !direccionCorreo || !numeroCelular || !perfilId) {
                throw new Error('Los campos obligatorios son: tipoDocumento, numeroDocumento, primerNombre, primerApellido, direccionCorreo, numeroCelular, perfilId.');
            }
            
            let claveHash = null;
            if (clave) {
                claveHash = await bcrypt.hash(clave, 12);
            }
            
            const result = await sql`
                INSERT INTO "USUARIO" (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, "PERFIL_USUARIO_id")
                VALUES (${tipoDocumento}, ${numeroDocumento}, ${primerNombre}, ${segundoNombre || null}, ${primerApellido}, ${segundoApellido || null}, ${direccionCorreo}, ${numeroCelular}, ${fotoPerfil || null}, ${estado || 'activo'}, ${claveHash}, ${perfilId})
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

    async obtenerUsuarios(limite = 100, offset = 0) {
        try {
            const result = await sql`
                SELECT u.*, p.perfil 
                FROM "USUARIO" u
                JOIN "PERFIL_USUARIO" p ON u."PERFIL_USUARIO_id" = p.id
                ORDER BY u.id_usuario
                LIMIT ${limite} OFFSET ${offset}
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
            const valores = {};
            
            if (datosActualizados.tipoDocumento !== undefined) valores.tipo_documento = datosActualizados.tipoDocumento;
            if (datosActualizados.numeroDocumento !== undefined) valores.numero_documento = datosActualizados.numeroDocumento;
            if (datosActualizados.primerNombre !== undefined) valores.primer_nombre = datosActualizados.primerNombre;
            if (datosActualizados.segundoNombre !== undefined) valores.segundo_nombre = datosActualizados.segundoNombre;
            if (datosActualizados.primerApellido !== undefined) valores.primer_apellido = datosActualizados.primerApellido;
            if (datosActualizados.segundoApellido !== undefined) valores.segundo_apellido = datosActualizados.segundoApellido;
            if (datosActualizados.direccionCorreo !== undefined) valores.direccion_correo = datosActualizados.direccionCorreo;
            if (datosActualizados.numeroCelular !== undefined) valores.numero_celular = datosActualizados.numeroCelular;
            if (datosActualizados.fotoPerfil !== undefined) valores.foto_perfil = datosActualizados.fotoPerfil;
            if (datosActualizados.estado !== undefined) valores.estado = datosActualizados.estado;
            
            if (datosActualizados.clave !== undefined) {
                 valores.clave = await bcrypt.hash(datosActualizados.clave, 12);
            }
            
            if (Object.keys(valores).length === 0) {
                throw new Error('No hay campos para actualizar.');
            }
            
            const result = await sql`
                UPDATE "USUARIO"
                SET ${sql(valores)}
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
