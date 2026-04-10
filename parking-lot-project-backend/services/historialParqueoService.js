const pool = require('../config/db.js');

class HistorialParqueoService {
    async crearHistorial(datos) {
        const { celdaId, vehiculoId, fechaHora } = datos;
        if (!celdaId || !vehiculoId) throw new Error('Campos obligatorios: celdaId, vehiculoId.');
        const fecha = fechaHora || new Date().toISOString().slice(0, 19).replace('T', ' ');
        await pool.query('INSERT INTO HISTORIAL_PARQUEO (CELDA_id, VEHICULO_id, fecha_hora) VALUES (?, ?, ?)', [celdaId, vehiculoId, fecha]);
        return { message: 'Historial creado correctamente.', celdaId, vehiculoId };
    }

    async obtenerHistoriales() {
        const [result] = await pool.query(
            'SELECT h.*, c.tipo as celda_tipo, v.placa, u.primer_nombre, u.primer_apellido FROM HISTORIAL_PARQUEO h LEFT JOIN CELDA c ON h.CELDA_id = c.id LEFT JOIN VEHICULO v ON h.VEHICULO_id = v.id LEFT JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario ORDER BY h.fecha_hora DESC'
        );
        return result.map(r => ({ celdaId: r.CELDA_id, vehiculoId: r.VEHICULO_id, fechaHora: r.fecha_hora, celdaTipo: r.celda_tipo, placa: r.placa || '', propietario: r.primer_nombre ? r.primer_nombre + ' ' + r.primer_apellido : '' }));
    }

    async obtenerHistorialesPorVehiculo(vehiculoId) {
        const [result] = await pool.query('SELECT h.*, c.tipo as celda_tipo FROM HISTORIAL_PARQUEO h LEFT JOIN CELDA c ON h.CELDA_id = c.id WHERE h.VEHICULO_id = ? ORDER BY h.fecha_hora DESC', [vehiculoId]);
        return result.map(r => ({ celdaId: r.CELDA_id, vehiculoId: r.VEHICULO_id, fechaHora: r.fecha_hora, celdaTipo: r.celda_tipo }));
    }

    async obtenerHistorialesPorCelda(celdaId) {
        const [result] = await pool.query('SELECT h.*, v.placa FROM HISTORIAL_PARQUEO h LEFT JOIN VEHICULO v ON h.VEHICULO_id = v.id WHERE h.CELDA_id = ? ORDER BY h.fecha_hora DESC', [celdaId]);
        return result.map(r => ({ celdaId: r.CELDA_id, vehiculoId: r.VEHICULO_id, fechaHora: r.fecha_hora, placa: r.placa || '' }));
    }

    async obtenerHistorialPorId(celdaId, vehiculoId) {
        const [result] = await pool.query('SELECT * FROM HISTORIAL_PARQUEO WHERE CELDA_id = ? AND VEHICULO_id = ?', [celdaId, vehiculoId]);
        if (result.length === 0) throw new Error('Historial no encontrado.');
        const r = result[0];
        return { celdaId: r.CELDA_id, vehiculoId: r.VEHICULO_id, fechaHora: r.fecha_hora };
    }

    async actualizarHistorial(celdaId, vehiculoId, datos) {
        const sets = []; const values = [];
        if (datos.fechaHora !== undefined) { sets.push('fecha_hora = ?'); values.push(datos.fechaHora); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(celdaId, vehiculoId);
        const [result] = await pool.query('UPDATE HISTORIAL_PARQUEO SET ' + sets.join(', ') + ' WHERE CELDA_id = ? AND VEHICULO_id = ?', values);
        if (result.affectedRows === 0) throw new Error('Historial no encontrado.');
        return { message: 'Historial actualizado correctamente.' };
    }

    async eliminarHistorial(celdaId, vehiculoId) {
        const [result] = await pool.query('DELETE FROM HISTORIAL_PARQUEO WHERE CELDA_id = ? AND VEHICULO_id = ?', [celdaId, vehiculoId]);
        if (result.affectedRows === 0) throw new Error('Historial no encontrado.');
        return { message: 'Historial eliminado con exito.' };
    }
}

module.exports = new HistorialParqueoService();
