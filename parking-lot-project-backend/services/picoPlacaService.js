const pool = require('../config/db.js');
const PicoPlaca = require('../models/PicoPlaca');

class PicoPlacaService {
    async crearPicoPlaca(datos) {
        const { tipoVehiculo, numero, dia } = datos;
        if (!numero || !dia) throw new Error('Campos obligatorios: numero, dia.');
        const [result] = await pool.query(
            'INSERT INTO PICO_PLACA (tipo_vehiculo, numero, dia) VALUES (?, ?, ?)',
            [tipoVehiculo || null, numero, dia]
        );
        const [rows] = await pool.query('SELECT * FROM PICO_PLACA WHERE id = ?', [result.insertId]);
        const r = rows[0];
        return new PicoPlaca(r.id, r.tipo_vehiculo, r.numero, r.dia);
    }

    async obtenerPicoPlacas() {
        const [result] = await pool.query('SELECT * FROM PICO_PLACA ORDER BY dia, numero');
        return result.map(r => new PicoPlaca(r.id, r.tipo_vehiculo, r.numero, r.dia));
    }

    async obtenerPicoPlacaPorId(id) {
        const [result] = await pool.query('SELECT * FROM PICO_PLACA WHERE id = ?', [id]);
        if (result.length === 0) throw new Error('Pico y Placa no encontrado.');
        const r = result[0];
        return new PicoPlaca(r.id, r.tipo_vehiculo, r.numero, r.dia);
    }

    async actualizarPicoPlaca(id, datos) {
        const sets = []; const values = [];
        if (datos.tipoVehiculo !== undefined) { sets.push('tipo_vehiculo = ?'); values.push(datos.tipoVehiculo); }
        if (datos.numero !== undefined) { sets.push('numero = ?'); values.push(datos.numero); }
        if (datos.dia !== undefined) { sets.push('dia = ?'); values.push(datos.dia); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query(`UPDATE PICO_PLACA SET ${sets.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) throw new Error('Pico y Placa no encontrado.');
        return { message: 'Pico y Placa actualizado correctamente.' };
    }

    async eliminarPicoPlaca(id) {
        const [result] = await pool.query('DELETE FROM PICO_PLACA WHERE id = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Pico y Placa no encontrado.');
        return { message: 'Pico y Placa eliminado con éxito.' };
    }
}

module.exports = new PicoPlacaService();
