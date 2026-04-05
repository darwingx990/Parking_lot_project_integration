const sql = require('../config/db.js');
const Administrador = require('../models/Administrador');

const PERFIL_ADMINISTRADOR = 1;

class AdministradorService {
    async crearAdministrador(datos) {
        try {
            const { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave } = datos;
            
            if (!tipoDocumento || !numeroDocumento || !primerNombre || !primerApellido || !direccionCorreo || !numeroCelular) {
                throw new Error('Los campos obligatorios son: tipoDocumento, numeroDocumento, primerNombre, primerApellido, direccionCorreo, numeroCelular.');
            }
            
            const result = await sql`
                INSERT INTO "USUARIO" (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, "PERFIL_USUARIO_id")
                VALUES (${tipoDocumento}, ${numeroDocumento}, ${primerNombre}, ${segundoNombre || null}, ${primerApellido}, ${segundoApellido || null}, ${direccionCorreo}, ${numeroCelular}, ${fotoPerfil || null}, ${estado || 'activo'}, ${clave || null}, ${PERFIL_ADMINISTRADOR})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el administrador.');
            }
            
            const row = result[0];
            return new Administrador(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado, row.clave);
        } catch (error) {
            console.error('Error en crearAdministrador:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear administrador: ${error.message}`);
        }
    }

    async obtenerAdministradores() {
        try {
            const result = await sql`
                SELECT * FROM "USUARIO" 
                WHERE "PERFIL_USUARIO_id" = ${PERFIL_ADMINISTRADOR}
                ORDER BY id_usuario
            `;
            
            return result.map(row => 
                new Administrador(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado, row.clave)
            );
        } catch (error) {
            console.error('Error en obtenerAdministradores:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener administradores: ${error.message}`);
        }
    }

    async obtenerAdministradorPorId(id) {
        try {
            const result = await sql`
                SELECT * FROM "USUARIO" 
                WHERE id_usuario = ${id} AND "PERFIL_USUARIO_id" = ${PERFIL_ADMINISTRADOR}
            `;
            
            if (result.length === 0) {
                throw new Error('Administrador no encontrado.');
            }
            
            const row = result[0];
            return new Administrador(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado, row.clave);
        } catch (error) {
            console.error('Error en obtenerAdministradorPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener administrador por ID: ${error.message}`);
        }
    }

    async actualizarAdministrador(id, datosActualizados) {
        try {
            const campos = [];
            
            if (datosActualizados.tipoDocumento !== undefined) campos.push('tipo_documento');
            if (datosActualizados.numeroDocumento !== undefined) campos.push('numero_documento');
            if (datosActualizados.primerNombre !== undefined) campos.push('primer_nombre');
            if (datosActualizados.segundoNombre !== undefined) campos.push('segundo_nombre');
            if (datosActualizados.primerApellido !== undefined) campos.push('primer_apellido');
            if (datosActualizados.segundoApellido !== undefined) campos.push('segundo_apellido');
            if (datosActualizados.direccionCorreo !== undefined) campos.push('direccion_correo');
            if (datosActualizados.numeroCelular !== undefined) campos.push('numero_celular');
            if (datosActualizados.fotoPerfil !== undefined) campos.push('foto_perfil');
            if (datosActualizados.estado !== undefined) campos.push('estado');
            if (datosActualizados.clave !== undefined) campos.push('clave');
            
            if (campos.length === 0) {
                throw new Error('No hay campos para actualizar.');
            }
            
            const result = await sql`
                UPDATE "USUARIO"
                SET tipo_documento = ${datosActualizados.tipoDocumento || sql.unsafe('tipo_documento')},
                    numero_documento = ${datosActualizados.numeroDocumento || sql.unsafe('numero_documento')},
                    primer_nombre = ${datosActualizados.primerNombre || sql.unsafe('primer_nombre')},
                    segundo_nombre = ${datosActualizados.segundoNombre !== undefined ? datosActualizados.segundoNombre : sql.unsafe('segundo_nombre')},
                    primer_apellido = ${datosActualizados.primerApellido || sql.unsafe('primer_apellido')},
                    segundo_apellido = ${datosActualizados.segundoApellido !== undefined ? datosActualizados.segundoApellido : sql.unsafe('segundo_apellido')},
                    direccion_correo = ${datosActualizados.direccionCorreo || sql.unsafe('direccion_correo')},
                    numero_celular = ${datosActualizados.numeroCelular || sql.unsafe('numero_celular')},
                    foto_perfil = ${datosActualizados.fotoPerfil !== undefined ? datosActualizados.fotoPerfil : sql.unsafe('foto_perfil')},
                    estado = ${datosActualizados.estado || sql.unsafe('estado')},
                    clave = ${datosActualizados.clave !== undefined ? datosActualizados.clave : sql.unsafe('clave')}
                WHERE id_usuario = ${id} AND "PERFIL_USUARIO_id" = ${PERFIL_ADMINISTRADOR}
                RETURNING id_usuario
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Administrador no encontrado para actualizar.');
            }
            
            return { message: "Administrador actualizado correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarAdministrador:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar administrador: ${error.message}`);
        }
    }

    async eliminarAdministrador(id) {
        try {
            const result = await sql`
                DELETE FROM "USUARIO" 
                WHERE id_usuario = ${id} AND "PERFIL_USUARIO_id" = ${PERFIL_ADMINISTRADOR}
                RETURNING id_usuario
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Administrador no encontrado para eliminar.');
            }
            
            return { message: "Administrador eliminado con éxito." };
        } catch (error) {
            console.error('Error en eliminarAdministrador:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar administrador: ${error.message}`);
        }
    }
}

module.exports = new AdministradorService();
