const sql = require('../config/db.js');

class HistorialParqueoService {
    async crearHistorial(datos) {
        try {
            const { celdaId, vehiculoId, fechaHora } = datos;
            
            if (!celdaId || !vehiculoId) {
                throw new Error('Los campos celdaId y vehiculoId son obligatorios.');
            }
            
            const result = await sql`
                INSERT INTO "HISTORIAL_PARQUEO" (celda_id, vehiculo_id, fecha_hora)
                VALUES (${celdaId}, ${vehiculoId}, ${fechaHora || new Date()})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el historial de parqueo.');
            }
            
            const row = result[0];
            return { celdaId: row.celda_id, vehiculoId: row.vehiculo_id, fechaHora: row.fecha_hora };
        } catch (error) {
            console.error('Error en crearHistorial:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear historial de parqueo: ${error.message}`);
        }
    }

    async obtenerHistoriales() {
        try {
            const result = await sql`
                SELECT hp.*, c.tipo as celda_tipo, v.placa as vehiculo_placa, v.marca as vehiculo_marca
                FROM "HISTORIAL_PARQUEO" hp
                JOIN "CELDA" c ON hp.celda_id = c.id
                JOIN "VEHICULO" v ON hp.vehiculo_id = v.id
                ORDER BY hp.fecha_hora DESC
            `;
            
            return result.map(row => ({
                celdaId: row.celda_id,
                celdaTipo: row.celda_tipo,
                vehiculoId: row.vehiculo_id,
                vehiculoPlaca: row.vehiculo_placa,
                vehiculoMarca: row.vehiculo_marca,
                fechaHora: row.fecha_hora
            }));
        } catch (error) {
            console.error('Error en obtenerHistoriales:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener historiales de parqueo: ${error.message}`);
        }
    }

    async obtenerHistorialPorId(celdaId, vehiculoId) {
        try {
            const result = await sql`
                SELECT hp.*, c.tipo as celda_tipo, v.placa as vehiculo_placa
                FROM "HISTORIAL_PARQUEO" hp
                JOIN "CELDA" c ON hp.celda_id = c.id
                JOIN "VEHICULO" v ON hp.vehiculo_id = v.id
                WHERE hp.celda_id = ${celdaId} AND hp.vehiculo_id = ${vehiculoId}
            `;
            
            if (result.length === 0) {
                throw new Error('Historial de parqueo no encontrado.');
            }
            
            const row = result[0];
            return {
                celdaId: row.celda_id,
                celdaTipo: row.celda_tipo,
                vehiculoId: row.vehiculo_id,
                vehiculoPlaca: row.vehiculo_placa,
                fechaHora: row.fecha_hora
            };
        } catch (error) {
            console.error('Error en obtenerHistorialPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener historial de parqueo por ID: ${error.message}`);
        }
    }

    async obtenerHistorialesPorVehiculo(vehiculoId) {
        try {
            const result = await sql`
                SELECT hp.*, c.tipo as celda_tipo, c.estado as celda_estado
                FROM "HISTORIAL_PARQUEO" hp
                JOIN "CELDA" c ON hp.celda_id = c.id
                WHERE hp.vehiculo_id = ${vehiculoId}
                ORDER BY hp.fecha_hora DESC
            `;
            
            return result.map(row => ({
                celdaId: row.celda_id,
                celdaTipo: row.celda_tipo,
                celdaEstado: row.celda_estado,
                vehiculoId: row.vehiculo_id,
                fechaHora: row.fecha_hora
            }));
        } catch (error) {
            console.error('Error en obtenerHistorialesPorVehiculo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener historiales por vehículo: ${error.message}`);
        }
    }

    async obtenerHistorialesPorCelda(celdaId) {
        try {
            const result = await sql`
                SELECT hp.*, v.placa as vehiculo_placa, v.marca as vehiculo_marca
                FROM "HISTORIAL_PARQUEO" hp
                JOIN "VEHICULO" v ON hp.vehiculo_id = v.id
                WHERE hp.celda_id = ${celdaId}
                ORDER BY hp.fecha_hora DESC
            `;
            
            return result.map(row => ({
                celdaId: row.celda_id,
                vehiculoId: row.vehiculo_id,
                vehiculoPlaca: row.vehiculo_placa,
                vehiculoMarca: row.vehiculo_marca,
                fechaHora: row.fecha_hora
            }));
        } catch (error) {
            console.error('Error en obtenerHistorialesPorCelda:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener historiales por celda: ${error.message}`);
        }
    }

    async actualizarHistorial(celdaId, vehiculoId, datosActualizados) {
        try {
            const { fechaHora } = datosActualizados;
            
            const result = await sql`
                UPDATE "HISTORIAL_PARQUEO"
                SET fecha_hora = ${fechaHora || new Date()}
                WHERE celda_id = ${celdaId} AND vehiculo_id = ${vehiculoId}
                RETURNING celda_id, vehiculo_id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Historial de parqueo no encontrado para actualizar.');
            }
            
            return { message: "Historial de parqueo actualizado correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarHistorial:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar historial de parqueo: ${error.message}`);
        }
    }

    async eliminarHistorial(celdaId, vehiculoId) {
        try {
            const result = await sql`
                DELETE FROM "HISTORIAL_PARQUEO" 
                WHERE celda_id = ${celdaId} AND vehiculo_id = ${vehiculoId}
                RETURNING celda_id, vehiculo_id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Historial de parqueo no encontrado para eliminar.');
            }
            
            return { message: "Historial de parqueo eliminado con éxito." };
        } catch (error) {
            console.error('Error en eliminarHistorial:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar historial de parqueo: ${error.message}`);
        }
    }
}

module.exports = new HistorialParqueoService();
