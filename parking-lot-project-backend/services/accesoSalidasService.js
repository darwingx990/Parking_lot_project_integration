const pool = require('../config/db.js');
const AccesoSalidas = require('../models/AccesoSalidas');

class AccesoSalidasService {
    async crearAccesoSalidas(datos) {
        const { movimiento, fechaHora, puerta, tiempoEstadia, vehiculoId } = datos;
        if (!movimiento || !fechaHora || !vehiculoId) throw new Error('Campos obligatorios: movimiento, fechaHora, vehiculoId.');
        const [result] = await pool.query(
            'INSERT INTO ACCESO_SALIDAS (movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id) VALUES (?, ?, ?, ?, ?)',
            [movimiento, fechaHora, puerta || null, tiempoEstadia || null, vehiculoId]
        );
        const [rows] = await pool.query('SELECT * FROM ACCESO_SALIDAS WHERE id = ?', [result.insertId]);
        const r = rows[0];
        return new AccesoSalidas(r.id, r.movimiento, r.fecha_hora, r.puerta, r.tiempo_estadia, r.VEHICULO_id);
    }

    async obtenerAccesoSalidas() {
        const [result] = await pool.query(
            `SELECT a.*, v.placa as vehiculo_placa, v.tipo as vehiculo_tipo
             FROM ACCESO_SALIDAS a
             LEFT JOIN VEHICULO v ON a.VEHICULO_id = v.id
             ORDER BY a.id DESC`
        );
        return result.map(r => ({
            id: r.id, movimiento: r.movimiento, fechaHora: r.fecha_hora,
            puerta: r.puerta, tiempoEstadia: r.tiempo_estadia,
            vehiculoId: r.VEHICULO_id, vehiculoPlaca: r.vehiculo_placa || '',
            vehiculoTipo: r.vehiculo_tipo || ''
        }));
    }

    async obtenerAccesoSalidasPorId(id) {
        const [result] = await pool.query(
            `SELECT a.*, v.placa as vehiculo_placa FROM ACCESO_SALIDAS a
             LEFT JOIN VEHICULO v ON a.VEHICULO_id = v.id WHERE a.id = ?`, [id]
        );
        if (result.length === 0) throw new Error('Acceso no encontrado.');
        const r = result[0];
        return new AccesoSalidas(r.id, r.movimiento, r.fecha_hora, r.puerta, r.tiempo_estadia, r.VEHICULO_id);
    }

    async obtenerAccesoSalidasPorVehiculo(vehiculoId) {
        const [result] = await pool.query(
            `SELECT a.*, v.placa as vehiculo_placa FROM ACCESO_SALIDAS a
             LEFT JOIN VEHICULO v ON a.VEHICULO_id = v.id WHERE a.VEHICULO_id = ?
             ORDER BY a.fecha_hora DESC`, [vehiculoId]
        );
        return result.map(r => new AccesoSalidas(r.id, r.movimiento, r.fecha_hora, r.puerta, r.tiempo_estadia, r.VEHICULO_id));
    }

    async obtenerAccesoSalidasPorFecha(fechaInicio, fechaFin) {
        const [result] = await pool.query(
            `SELECT a.*, v.placa as vehiculo_placa FROM ACCESO_SALIDAS a
             LEFT JOIN VEHICULO v ON a.VEHICULO_id = v.id
             WHERE a.fecha_hora BETWEEN ? AND ?
             ORDER BY a.fecha_hora DESC`, [fechaInicio, fechaFin]
        );
        return result.map(r => ({
            id: r.id, movimiento: r.movimiento, fechaHora: r.fecha_hora,
            puerta: r.puerta, tiempoEstadia: r.tiempo_estadia,
            vehiculoId: r.VEHICULO_id, vehiculoPlaca: r.vehiculo_placa || ''
        }));
    }

    async actualizarAccesoSalidas(id, datos) {
        const sets = []; const values = [];
        const mapping = { movimiento:'movimiento', fechaHora:'fecha_hora', puerta:'puerta', tiempoEstadia:'tiempo_estadia' };
        for (const [key, col] of Object.entries(mapping)) { if (datos[key] !== undefined) { sets.push(`${col} = ?`); values.push(datos[key]); } }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query(`UPDATE ACCESO_SALIDAS SET ${sets.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) throw new Error('Acceso no encontrado.');
        return { message: 'Acceso actualizado correctamente.' };
    }

    async eliminarAccesoSalidas(id) {
        const [result] = await pool.query('DELETE FROM ACCESO_SALIDAS WHERE id = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Acceso no encontrado.');
        return { message: 'Acceso eliminado con éxito.' };
    }
}

module.exports = new AccesoSalidasService();
