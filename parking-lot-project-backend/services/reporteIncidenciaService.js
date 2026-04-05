const sql = require('../config/db.js');

class ReporteIncidenciaService {
    async crearReporteIncidencia(datos) {
        try {
            const { vehiculoId, incidenciaId, fechaHora } = datos;
            
            if (!vehiculoId || !incidenciaId) {
                throw new Error('Los campos vehiculoId e incidenciaId son obligatorios.');
            }
            
            const result = await sql`
                INSERT INTO "REPORTE_INCIDENCIA" ("VEHICULO_id", "INCIDENCIA_id", fecha_hora)
                VALUES (${vehiculoId}, ${incidenciaId}, ${fechaHora || new Date()})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el reporte.');
            }
            
            const row = result[0];
            return {
                vehiculoId: row.VEHICULO_id,
                incidenciaId: row.INCIDENCIA_id,
                fechaHora: row.fecha_hora
            };
        } catch (error) {
            console.error('Error en crearReporteIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear reporte de incidencia: ${error.message}`);
        }
    }

    async obtenerReportesIncidencia() {
        try {
            const result = await sql`
                SELECT ri.*, v.placa as vehiculo_placa, i.nombre as incidencia_nombre
                FROM "REPORTE_INCIDENCIA" ri
                JOIN "VEHICULO" v ON ri."VEHICULO_id" = v.id
                JOIN "INCIDENCIA" i ON ri."INCIDENCIA_id" = i.id
                ORDER BY ri.fecha_hora DESC
            `;
            
            return result.map(row => ({
                vehiculoId: row.VEHICULO_id,
                vehiculoPlaca: row.vehiculo_placa,
                incidenciaId: row.INCIDENCIA_id,
                incidenciaNombre: row.incidencia_nombre,
                fechaHora: row.fecha_hora
            }));
        } catch (error) {
            console.error('Error en obtenerReportesIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener reportes de incidencia: ${error.message}`);
        }
    }

    async obtenerReportePorId(vehiculoId, incidenciaId) {
        try {
            const result = await sql`
                SELECT * FROM "REPORTE_INCIDENCIA" 
                WHERE "VEHICULO_id" = ${vehiculoId} AND "INCIDENCIA_id" = ${incidenciaId}
            `;
            
            if (result.length === 0) {
                throw new Error('Reporte no encontrado.');
            }
            
            const row = result[0];
            return {
                vehiculoId: row.VEHICULO_id,
                incidenciaId: row.INCIDENCIA_id,
                fechaHora: row.fecha_hora
            };
        } catch (error) {
            console.error('Error en obtenerReportePorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener reporte de incidencia por ID: ${error.message}`);
        }
    }

    async obtenerReportesPorVehiculo(vehiculoId) {
        try {
            const result = await sql`
                SELECT ri.*, i.nombre as incidencia_nombre
                FROM "REPORTE_INCIDENCIA" ri
                JOIN "INCIDENCIA" i ON ri."INCIDENCIA_id" = i.id
                WHERE ri."VEHICULO_id" = ${vehiculoId}
                ORDER BY ri.fecha_hora DESC
            `;
            
            return result.map(row => ({
                vehiculoId: row.VEHICULO_id,
                incidenciaId: row.INCIDENCIA_id,
                incidenciaNombre: row.incidencia_nombre,
                fechaHora: row.fecha_hora
            }));
        } catch (error) {
            console.error('Error en obtenerReportesPorVehiculo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener reportes por vehículo: ${error.message}`);
        }
    }

    async actualizarReporteIncidencia(vehiculoId, incidenciaId, datosActualizados) {
        try {
            const { fechaHora } = datosActualizados;
            
            const result = await sql`
                UPDATE "REPORTE_INCIDENCIA"
                SET fecha_hora = ${fechaHora || new Date()}
                WHERE "VEHICULO_id" = ${vehiculoId} AND "INCIDENCIA_id" = ${incidenciaId}
                RETURNING "VEHICULO_id", "INCIDENCIA_id"
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Reporte no encontrado para actualizar.');
            }
            
            return { message: "Reporte de incidencia actualizado correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarReporteIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar reporte de incidencia: ${error.message}`);
        }
    }

    async eliminarReporteIncidencia(vehiculoId, incidenciaId) {
        try {
            const result = await sql`
                DELETE FROM "REPORTE_INCIDENCIA" 
                WHERE "VEHICULO_id" = ${vehiculoId} AND "INCIDENCIA_id" = ${incidenciaId}
                RETURNING "VEHICULO_id", "INCIDENCIA_id"
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Reporte no encontrado para eliminar.');
            }
            
            return { message: "Reporte de incidencia eliminado con éxito." };
        } catch (error) {
            console.error('Error en eliminarReporteIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar reporte de incidencia: ${error.message}`);
        }
    }
}

module.exports = new ReporteIncidenciaService();
