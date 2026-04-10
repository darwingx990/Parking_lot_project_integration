const pool = require('../config/db.js');

class IncidenciaService {
    async crearIncidencia(datos) {
        const { nombre } = datos;
        if (!nombre) throw new Error('El nombre de la incidencia es obligatorio.');
        const [result] = await pool.query('INSERT INTO INCIDENCIA (nombre) VALUES (?)', [nombre]);
        const [rows] = await pool.query('SELECT * FROM INCIDENCIA WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    async obtenerIncidencias() {
        const [result] = await pool.query('SELECT * FROM INCIDENCIA ORDER BY id');
        return result;
    }

    async obtenerIncidenciaPorId(id) {
        const [result] = await pool.query('SELECT * FROM INCIDENCIA WHERE id = ?', [id]);
        if (result.length === 0) throw new Error('Incidencia no encontrada.');
        return result[0];
    }

    async obtenerIncidenciaPorNombre(nombre) {
        const [result] = await pool.query('SELECT * FROM INCIDENCIA WHERE nombre LIKE ?', [`%${nombre}%`]);
        if (result.length === 0) throw new Error('Incidencia no encontrada.');
        return result;
    }

    async actualizarIncidencia(id, datos) {
        const sets = []; const values = [];
        if (datos.nombre !== undefined) { sets.push('nombre = ?'); values.push(datos.nombre); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query(`UPDATE INCIDENCIA SET ${sets.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) throw new Error('Incidencia no encontrada.');
        return { message: 'Incidencia actualizada correctamente.' };
    }

    async eliminarIncidencia(id) {
        const [result] = await pool.query('DELETE FROM INCIDENCIA WHERE id = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Incidencia no encontrada.');
        return { message: 'Incidencia eliminada con éxito.' };
    }
}

module.exports = new IncidenciaService();
