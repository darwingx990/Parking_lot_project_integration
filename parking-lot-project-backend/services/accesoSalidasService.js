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

    async obtenerAccesoSalidas() {
        try {
            const result = await sql`
                SELECT a.*, v.placa as vehiculo_placa
                FROM "ACCESO_SALIDAS" a
                JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
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
            const { movimiento, fechaHora, puerta, tiempoEstadia, vehiculoId } = datosActualizados;
            
            const result = await sql`
                UPDATE "ACCESO_SALIDAS"
                SET movimiento = ${movimiento || sql.unsafe('movimiento')},
                    fecha_hora = ${fechaHora !== undefined ? fechaHora : sql.unsafe('fecha_hora')},
                    puerta = ${puerta !== undefined ? puerta : sql.unsafe('puerta')},
                    tiempo_estadia = ${tiempoEstadia !== undefined ? tiempoEstadia : sql.unsafe('tiempo_estadia')},
                    "VEHICULO_id" = ${vehiculoId || sql.unsafe('"VEHICULO_id"')}
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
