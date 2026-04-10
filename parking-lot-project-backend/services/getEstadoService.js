const pool = require('../config/db.js');
const GetEstado = require('../models/GetEstado');

class GetEstadoService {
    async crearEstado(datos) {
        const { tipo, estado } = datos;
        if (!tipo) throw new Error('El tipo de celda es obligatorio.');
        const [result] = await pool.query(
            'INSERT INTO CELDA (tipo, estado) VALUES (?, ?)', [tipo, estado || 'Libre']
        );
        const [rows] = await pool.query('SELECT * FROM CELDA WHERE id = ?', [result.insertId]);
        const r = rows[0];
        return new GetEstado(r.id, r.tipo, r.estado);
    }

    async obtenerEstados() {
        const [result] = await pool.query('SELECT * FROM CELDA ORDER BY id');
        return result.map(r => new GetEstado(r.id, r.tipo, r.estado));
    }

    async obtenerEstadoPorId(id) {
        const [result] = await pool.query('SELECT * FROM CELDA WHERE id = ?', [id]);
        if (result.length === 0) throw new Error('Celda no encontrada.');
        const r = result[0];
        return new GetEstado(r.id, r.tipo, r.estado);
    }

    async obtenerEstadosPorTipo(tipo) {
        const [result] = await pool.query('SELECT * FROM CELDA WHERE tipo = ? ORDER BY id', [tipo]);
        return result.map(r => new GetEstado(r.id, r.tipo, r.estado));
    }

    async obtenerEstadosPorEstado(estado) {
        const [result] = await pool.query('SELECT * FROM CELDA WHERE estado = ? ORDER BY id', [estado]);
        return result.map(r => new GetEstado(r.id, r.tipo, r.estado));
    }

    async obtenerCeldaLibrePorTipo(tipo) {
        const [result] = await pool.query("SELECT * FROM CELDA WHERE tipo = ? AND estado = 'Libre' LIMIT 1", [tipo]);
        if (result.length === 0) throw new Error('No hay celdas libres de ese tipo.');
        const r = result[0];
        return new GetEstado(r.id, r.tipo, r.estado);
    }

    async ocuparCelda(id) {
        const [result] = await pool.query("UPDATE CELDA SET estado = 'Ocupado' WHERE id = ? AND estado = 'Libre'", [id]);
        if (result.affectedRows === 0) throw new Error('Celda no disponible o no encontrada.');
        return { message: 'Celda ocupada correctamente.' };
    }

    async liberarCelda(id) {
        const [result] = await pool.query("UPDATE CELDA SET estado = 'Libre' WHERE id = ? AND estado = 'Ocupado'", [id]);
        if (result.affectedRows === 0) throw new Error('Celda no ocupada o no encontrada.');
        return { message: 'Celda liberada correctamente.' };
    }

    async actualizarEstado(id, datos) {
        const sets = []; const values = [];
        if (datos.tipo !== undefined) { sets.push('tipo = ?'); values.push(datos.tipo); }
        if (datos.estado !== undefined) { sets.push('estado = ?'); values.push(datos.estado); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query(`UPDATE CELDA SET ${sets.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) throw new Error('Celda no encontrada.');
        return { message: 'Celda actualizada correctamente.' };
    }

    async eliminarEstado(id) {
        const [result] = await pool.query('DELETE FROM CELDA WHERE id = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Celda no encontrada.');
        return { message: 'Celda eliminada con éxito.' };
    }
}

module.exports = new GetEstadoService();
