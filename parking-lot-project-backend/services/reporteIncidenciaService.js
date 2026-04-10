const pool = require('../config/db.js');

class ReporteIncidenciaService {
    async crearReporteIncidencia(datos) {
        const { vehiculoId, incidenciaId, fechaHora } = datos;
        if (!vehiculoId || !incidenciaId) throw new Error('Campos obligatorios: vehiculoId, incidenciaId.');
        const fecha = fechaHora || new Date().toISOString().slice(0, 19).replace('T', ' ');
        await pool.query(
            'INSERT INTO REPORTE_INCIDENCIA (VEHICULO_id, INCIDENCIA_id, fecha_hora) VALUES (?, ?, ?)',
            [vehiculoId, incidenciaId, fecha]
        );
        return { message: 'Reporte creado correctamente.', vehiculoId, incidenciaId };
    }

    async obtenerReportesIncidencia() {
        const [result] = await pool.query(
            `SELECT r.*, v.placa as vehiculo_placa, i.nombre as incidencia_nombre
             FROM REPORTE_INCIDENCIA r
             LEFT JOIN VEHICULO v ON r.VEHICULO_id = v.id
             LEFT JOIN INCIDENCIA i ON r.INCIDENCIA_id = i.id
             ORDER BY r.fecha_hora DESC`
        );
        return result.map(r => ({
            vehiculoId: r.VEHICULO_id, incidenciaId: r.INCIDENCIA_id,
            fechaHora: r.fecha_hora, vehiculoPlaca: r.vehiculo_placa || '',
            incidenciaNombre: r.incidencia_nombre || ''
        }));
    }

    async obtenerReportesPorVehiculo(vehiculoId) {
        const [result] = await pool.query(
            `SELECT r.*, i.nombre as incidencia_nombre FROM REPORTE_INCIDENCIA r
             LEFT JOIN INCIDENCIA i ON r.INCIDENCIA_id = i.id
             WHERE r.VEHICULO_id = ? ORDER BY r.fecha_hora DESC`, [vehiculoId]
        );
        return result.map(r => ({
            vehiculoId: r.VEHICULO_id, incidenciaId: r.INCIDENCIA_id,
            fechaHora: r.fecha_hora, incidenciaNombre: r.incidencia_nombre || ''
        }));
    }

    async obtenerReportePorId(vehiculoId, incidenciaId) {
        const [result] = await pool.query(
            `SELECT r.*, v.placa as vehiculo_placa, i.nombre as incidencia_nombre
             FROM REPORTE_INCIDENCIA r
             LEFT JOIN VEHICULO v ON r.VEHICULO_id = v.id
             LEFT JOIN INCIDENCIA i ON r.INCIDENCIA_id = i.id
             WHERE r.VEHICULO_id = ? AND r.INCIDENCIA_id = ?`, [vehiculoId, incidenciaId]
        );
        if (result.length === 0) throw new Error('Reporte no encontrado.');
        const r = result[0];
        return { vehiculoId: r.VEHICULO_id, incidenciaId: r.INCIDENCIA_id, fechaHora: r.fecha_hora,
            vehiculoPlaca: r.vehiculo_placa, incidenciaNombre: r.incidencia_nombre };
    }

    async actualizarReporteIncidencia(vehiculoId, incidenciaId, datos) {
        const sets = []; const values = [];
        if (datos.fechaHora !== undefined) { sets.push('fecha_hora = ?'); values.push(datos.fechaHora); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(vehiculoId, incidenciaId);
        const [result] = await pool.query(`UPDATE REPORTE_INCIDENCIA SET ${sets.join(', ')} WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?`, values);
        if (result.affectedRows === 0) throw new Error('Reporte no encontrado.');
        return { message: 'Reporte actualizado correctamente.' };
    }

    async eliminarReporteIncidencia(vehiculoId, incidenciaId) {
        const [result] = await pool.query(
            'DELETE FROM REPORTE_INCIDENCIA WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?', [vehiculoId, incidenciaId]
        );
        if (result.affectedRows === 0) throw new Error('Reporte no encontrado.');
        return { message: 'Reporte eliminado con éxito.' };
    }
}

module.exports = new ReporteIncidenciaService();
