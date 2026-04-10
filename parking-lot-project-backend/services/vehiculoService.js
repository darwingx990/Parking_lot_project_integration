const pool = require('../config/db.js');
const Vehiculo = require('../models/Vehiculo');

class VehiculoService {
    async crearVehiculo(datos) {
        const { placa, tipo, modelo, color, marca, usuarioId } = datos;
        if (!placa || !tipo || !usuarioId) throw new Error('Campos obligatorios: placa, tipo, usuarioId.');
        const [result] = await pool.query(
            'INSERT INTO VEHICULO (placa, color, modelo, marca, tipo, USUARIO_id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
            [placa, color || null, modelo || null, marca || null, tipo, usuarioId]
        );
        const [rows] = await pool.query('SELECT * FROM VEHICULO WHERE id = ?', [result.insertId]);
        const r = rows[0];
        return new Vehiculo(r.id, r.placa, r.color, r.modelo, r.marca, r.tipo, r.USUARIO_id_usuario);
    }

    async obtenerVehiculos() {
        const [result] = await pool.query(
            `SELECT v.*, u.primer_nombre, u.primer_apellido, u.numero_documento
             FROM VEHICULO v LEFT JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario ORDER BY v.id`
        );
        return result.map(r => ({
            id: r.id, placa: r.placa, color: r.color, modelo: r.modelo, marca: r.marca, tipo: r.tipo,
            usuarioId: r.USUARIO_id_usuario,
            usuarioNombre: r.primer_nombre ? `${r.primer_nombre} ${r.primer_apellido}` : 'Sin propietario',
            usuarioDocumento: r.numero_documento || ''
        }));
    }

    async obtenerVehiculoPorId(id) {
        const [result] = await pool.query(
            `SELECT v.*, u.primer_nombre, u.primer_apellido FROM VEHICULO v
             LEFT JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario WHERE v.id = ?`, [id]
        );
        if (result.length === 0) throw new Error('Vehículo no encontrado.');
        const r = result[0];
        return { id: r.id, placa: r.placa, color: r.color, modelo: r.modelo, marca: r.marca, tipo: r.tipo,
            usuarioId: r.USUARIO_id_usuario, usuarioNombre: r.primer_nombre ? `${r.primer_nombre} ${r.primer_apellido}` : null };
    }

    async obtenerVehiculoPorPlaca(placa) {
        const [result] = await pool.query(
            `SELECT v.*, u.primer_nombre, u.primer_apellido FROM VEHICULO v
             LEFT JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario WHERE v.placa = ?`, [placa]
        );
        if (result.length === 0) throw new Error('Vehículo no encontrado con esa placa.');
        const r = result[0];
        return { id: r.id, placa: r.placa, color: r.color, modelo: r.modelo, marca: r.marca, tipo: r.tipo,
            usuarioId: r.USUARIO_id_usuario, usuarioNombre: r.primer_nombre ? `${r.primer_nombre} ${r.primer_apellido}` : null };
    }

    async obtenerVehiculosPorUsuario(usuarioId) {
        const [result] = await pool.query('SELECT * FROM VEHICULO WHERE USUARIO_id_usuario = ?', [usuarioId]);
        return result.map(r => new Vehiculo(r.id, r.placa, r.color, r.modelo, r.marca, r.tipo, r.USUARIO_id_usuario));
    }

    async actualizarVehiculo(id, datos) {
        const sets = []; const values = [];
        const mapping = { placa:'placa', tipo:'tipo', modelo:'modelo', color:'color', marca:'marca', usuarioId:'USUARIO_id_usuario' };
        for (const [key, col] of Object.entries(mapping)) { if (datos[key] !== undefined) { sets.push(`${col} = ?`); values.push(datos[key]); } }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query(`UPDATE VEHICULO SET ${sets.join(', ')} WHERE id = ?`, values);
        if (result.affectedRows === 0) throw new Error('Vehículo no encontrado.');
        return { message: 'Vehículo actualizado correctamente.' };
    }

    async eliminarVehiculo(id) {
        const [result] = await pool.query('DELETE FROM VEHICULO WHERE id = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Vehículo no encontrado.');
        return { message: 'Vehículo eliminado con éxito.' };
    }
}

module.exports = new VehiculoService();
