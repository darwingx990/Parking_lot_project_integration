const sql = require('../config/db.js');
const Vehiculo = require('../models/Vehiculo');

class VehiculoService {
    async crearVehiculo(datos) {
        try {
            const { placa, color, modelo, marca, tipo, usuarioId } = datos;
            
            if (!placa || !usuarioId) {
                throw new Error('Los campos placa y usuarioId son obligatorios.');
            }
            
            const result = await sql`
                INSERT INTO "VEHICULO" (placa, color, modelo, marca, tipo, "USUARIO_id_usuario")
                VALUES (${placa}, ${color || null}, ${modelo || null}, ${marca || null}, ${tipo || null}, ${usuarioId})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el vehículo.');
            }
            
            const row = result[0];
            return new Vehiculo(row.id, row.placa, row.color, row.modelo, row.marca, row.tipo, row.USUARIO_id_usuario);
        } catch (error) {
            console.error('Error en crearVehiculo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear vehículo: ${error.message}`);
        }
    }

    async obtenerVehiculos() {
        try {
            const result = await sql`
                SELECT v.*, u.numero_documento as usuario_documento, u.primer_nombre as usuario_nombre
                FROM "VEHICULO" v
                JOIN "USUARIO" u ON v."USUARIO_id_usuario" = u.id_usuario
                ORDER BY v.id
            `;
            
            return result.map(row => ({
                id: row.id,
                placa: row.placa,
                color: row.color,
                modelo: row.modelo,
                marca: row.marca,
                tipo: row.tipo,
                usuarioId: row.USUARIO_id_usuario,
                usuarioNombre: `${row.usuario_nombre}`,
                usuarioDocumento: row.usuario_documento
            }));
        } catch (error) {
            console.error('Error en obtenerVehiculos:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener vehículos: ${error.message}`);
        }
    }

    async obtenerVehiculoPorId(id) {
        try {
            const result = await sql`
                SELECT v.*, u.numero_documento as usuario_documento, u.primer_nombre as usuario_nombre
                FROM "VEHICULO" v
                JOIN "USUARIO" u ON v."USUARIO_id_usuario" = u.id_usuario
                WHERE v.id = ${id}
            `;
            
            if (result.length === 0) {
                throw new Error('Vehículo no encontrado.');
            }
            
            const row = result[0];
            return new Vehiculo(row.id, row.placa, row.color, row.modelo, row.marca, row.tipo, row.USUARIO_id_usuario);
        } catch (error) {
            console.error('Error en obtenerVehiculoPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener vehículo por ID: ${error.message}`);
        }
    }

    async obtenerVehiculosPorUsuario(usuarioId) {
        try {
            const result = await sql`
                SELECT * FROM "VEHICULO" 
                WHERE "USUARIO_id_usuario" = ${usuarioId}
                ORDER BY id
            `;
            
            return result.map(row => 
                new Vehiculo(row.id, row.placa, row.color, row.modelo, row.marca, row.tipo, row.USUARIO_id_usuario)
            );
        } catch (error) {
            console.error('Error en obtenerVehiculosPorUsuario:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener vehículos por usuario: ${error.message}`);
        }
    }

    async obtenerVehiculoPorPlaca(placa) {
        try {
            const result = await sql`
                SELECT v.*, u.numero_documento as usuario_documento
                FROM "VEHICULO" v
                JOIN "USUARIO" u ON v."USUARIO_id_usuario" = u.id_usuario
                WHERE v.placa = ${placa}
            `;
            
            if (result.length === 0) {
                throw new Error('Vehículo no encontrado.');
            }
            
            const row = result[0];
            return new Vehiculo(row.id, row.placa, row.color, row.modelo, row.marca, row.tipo, row.USUARIO_id_usuario);
        } catch (error) {
            console.error('Error en obtenerVehiculoPorPlaca:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener vehículo por placa: ${error.message}`);
        }
    }

    async actualizarVehiculo(id, datosActualizados) {
        try {
            const { placa, color, modelo, marca, tipo } = datosActualizados;
            
            const result = await sql`
                UPDATE "VEHICULO"
                SET placa = ${placa || sql.unsafe('placa')},
                    color = ${color !== undefined ? color : sql.unsafe('color')},
                    modelo = ${modelo !== undefined ? modelo : sql.unsafe('modelo')},
                    marca = ${marca !== undefined ? marca : sql.unsafe('marca')},
                    tipo = ${tipo !== undefined ? tipo : sql.unsafe('tipo')}
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Vehículo no encontrado para actualizar.');
            }
            
            return { message: "Vehículo actualizado correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarVehiculo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar vehículo: ${error.message}`);
        }
    }

    async eliminarVehiculo(id) {
        try {
            const result = await sql`DELETE FROM "VEHICULO" WHERE id = ${id} RETURNING id`;
            
            if (!result || result.length === 0) {
                throw new Error('Vehículo no encontrado para eliminar.');
            }
            
            return { message: "Vehículo eliminado con éxito." };
        } catch (error) {
            console.error('Error en eliminarVehiculo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar vehículo: ${error.message}`);
        }
    }
}

module.exports = new VehiculoService();
