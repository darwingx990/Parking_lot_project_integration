const sql = require('../config/db.js');
const AccesoSalidas = require('../models/AccesoSalidas');

class AccesoSalidasService {
    async crearAccesoSalidas(datos) {
        try {
            const { movimiento, fechaHora, puerta, tiempoEstadia, vehiculoId } = datos;
            
            if (!movimiento || !vehiculoId) {
                throw new Error('Los campos movimiento y vehiculoId son obligatorios.');
            }
            
            const result = await sql`
                INSERT INTO "ACCESO_SALIDAS" (movimiento, fecha_hora, puerta, tiempo_estadia, "VEHICULO_id")
                VALUES (${movimiento}, ${fechaHora || new Date()}, ${puerta || null}, ${tiempoEstadia || 0}, ${vehiculoId})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el registro de acceso/salida.');
            }
            
            const row = result[0];
            return new AccesoSalidas(row.id, row.movimiento, row.fecha_hora, row.puerta, row.tiempo_estadia, row.VEHICULO_id);
        } catch (error) {
            console.error('Error en crearAccesoSalidas:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear acceso/salida: ${error.message}`);
        }
    }

    async obtenerAccesoSalidas(limite = 100, offset = 0) {
        try {
            const result = await sql`
                SELECT a.*, v.placa as vehiculo_placa
                FROM "ACCESO_SALIDAS" a
                JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
                ORDER BY a.fecha_hora DESC
                LIMIT ${limite} OFFSET ${offset}
            `;
            
            return result.map(row => ({
                id: row.id,
                movimiento: row.movimiento,
                fechaHora: row.fecha_hora,
                puerta: row.puerta,
                tiempoEstadia: row.tiempo_estadia,
                vehiculoId: row.VEHICULO_id,
                vehiculoPlaca: row.vehiculo_placa
            }));
        } catch (error) {
            console.error('Error en obtenerAccesoSalidas:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener accesos/salidas: ${error.message}`);
        }
    }

    async obtenerAccesoSalidasPorId(id) {
        try {
            const result = await sql`
                SELECT a.*, v.placa as vehiculo_placa
                FROM "ACCESO_SALIDAS" a
                JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
                WHERE a.id = ${id}
            `;
            
            if (result.length === 0) {
                throw new Error('Acceso/Salida no encontrado.');
            }
            
            const row = result[0];
            return new AccesoSalidas(row.id, row.movimiento, row.fecha_hora, row.puerta, row.tiempo_estadia, row.VEHICULO_id);
        } catch (error) {
            console.error('Error en obtenerAccesoSalidasPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener acceso/salida por ID: ${error.message}`);
        }
    }

    async obtenerAccesoSalidasPorVehiculo(vehiculoId) {
        try {
            const result = await sql`
                SELECT * FROM "ACCESO_SALIDAS" 
                WHERE "VEHICULO_id" = ${vehiculoId}
                ORDER BY fecha_hora DESC
            `;
            
            return result.map(row => 
                new AccesoSalidas(row.id, row.movimiento, row.fecha_hora, row.puerta, row.tiempo_estadia, row.VEHICULO_id)
            );
        } catch (error) {
            console.error('Error en obtenerAccesoSalidasPorVehiculo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener accesos/salidas por vehículo: ${error.message}`);
        }
    }

    async obtenerAccesoSalidasPorFecha(fechaInicio, fechaFin) {
        try {
            const result = await sql`
                SELECT a.*, v.placa as vehiculo_placa
                FROM "ACCESO_SALIDAS" a
                JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
                WHERE a.fecha_hora BETWEEN ${fechaInicio} AND ${fechaFin}
                ORDER BY a.fecha_hora DESC
            `;
            
            return result.map(row => ({
                id: row.id,
                movimiento: row.movimiento,
                fechaHora: row.fecha_hora,
                puerta: row.puerta,
                tiempoEstadia: row.tiempo_estadia,
                vehiculoId: row.VEHICULO_id,
                vehiculoPlaca: row.vehiculo_placa
            }));
        } catch (error) {
            console.error('Error en obtenerAccesoSalidasPorFecha:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener accesos/salidas por fecha: ${error.message}`);
        }
    }

    async actualizarAccesoSalidas(id, datosActualizados) {
        try {
            const valores = {};
            if (datosActualizados.movimiento !== undefined) valores.movimiento = datosActualizados.movimiento;
            if (datosActualizados.fechaHora !== undefined) valores.fecha_hora = datosActualizados.fechaHora;
            if (datosActualizados.puerta !== undefined) valores.puerta = datosActualizados.puerta;
            if (datosActualizados.tiempoEstadia !== undefined) valores.tiempo_estadia = datosActualizados.tiempoEstadia;
            if (datosActualizados.vehiculoId !== undefined) valores['"VEHICULO_id"'] = datosActualizados.vehiculoId;

            if (Object.keys(valores).length === 0) {
                throw new Error('No hay campos para actualizar.');
            }

            const result = await sql`
                UPDATE "ACCESO_SALIDAS"
                SET ${sql(valores)}
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Acceso/Salida no encontrado para actualizar.');
            }
            
            return { message: "Acceso/Salida actualizado correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarAccesoSalidas:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar acceso/salida: ${error.message}`);
        }
    }

    async eliminarAccesoSalidas(id) {
        try {
            const result = await sql`DELETE FROM "ACCESO_SALIDAS" WHERE id = ${id} RETURNING id`;
            
            if (!result || result.length === 0) {
                throw new Error('Acceso/Salida no encontrado para eliminar.');
            }
            
            return { message: "Acceso/Salida eliminado con éxito." };
        } catch (error) {
            console.error('Error en eliminarAccesoSalidas:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar acceso/salida: ${error.message}`);
        }
    }
}

module.exports = new AccesoSalidasService();
