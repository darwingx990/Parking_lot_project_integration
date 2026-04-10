const pool = require('../config/db.js');
const Operador = require('../models/Operador');

class OperadorService {
    async crearOperador(datos) {
        const { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave } = datos;
        if (!tipoDocumento || !numeroDocumento || !primerNombre || !primerApellido || !direccionCorreo || !numeroCelular) {
            throw new Error('Los campos obligatorios son: tipoDocumento, numeroDocumento, primerNombre, primerApellido, direccionCorreo, numeroCelular.');
        }
        const bcrypt = require('bcrypt');
        const claveHash = clave ? await bcrypt.hash(clave, 10) : null;
        const [result] = await pool.query(
            `INSERT INTO USUARIO (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, PERFIL_USUARIO_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2)`,
            [tipoDocumento, numeroDocumento, primerNombre, segundoNombre || null, primerApellido, segundoApellido || null, direccionCorreo, numeroCelular, fotoPerfil || null, estado || 'activo', claveHash]
        );
        const [rows] = await pool.query('SELECT * FROM USUARIO WHERE id_usuario = ?', [result.insertId]);
        const r = rows[0];
        return new Operador(r.id_usuario, r.tipo_documento, r.numero_documento, r.primer_nombre, r.segundo_nombre, r.primer_apellido, r.segundo_apellido, r.direccion_correo, r.numero_celular, r.foto_perfil, r.estado);
    }

    async obtenerOperadores() {
        const [result] = await pool.query('SELECT * FROM USUARIO WHERE PERFIL_USUARIO_id = 2 ORDER BY id_usuario');
        return result.map(r => new Operador(r.id_usuario, r.tipo_documento, r.numero_documento, r.primer_nombre, r.segundo_nombre, r.primer_apellido, r.segundo_apellido, r.direccion_correo, r.numero_celular, r.foto_perfil, r.estado));
    }

    async obtenerOperadorPorId(id) {
        const [result] = await pool.query('SELECT * FROM USUARIO WHERE id_usuario = ? AND PERFIL_USUARIO_id = 2', [id]);
        if (result.length === 0) throw new Error('Operador no encontrado.');
        const r = result[0];
        return new Operador(r.id_usuario, r.tipo_documento, r.numero_documento, r.primer_nombre, r.segundo_nombre, r.primer_apellido, r.segundo_apellido, r.direccion_correo, r.numero_celular, r.foto_perfil, r.estado);
    }

    async actualizarOperador(id, datos) {
        const sets = []; const values = [];
        const mapping = { tipoDocumento:'tipo_documento', numeroDocumento:'numero_documento', primerNombre:'primer_nombre', segundoNombre:'segundo_nombre', primerApellido:'primer_apellido', segundoApellido:'segundo_apellido', direccionCorreo:'direccion_correo', numeroCelular:'numero_celular', fotoPerfil:'foto_perfil', estado:'estado' };
        for (const [key, col] of Object.entries(mapping)) { if (datos[key] !== undefined) { sets.push(`${col} = ?`); values.push(datos[key]); } }
        if (datos.clave) { const bcrypt = require('bcrypt'); sets.push('clave = ?'); values.push(await bcrypt.hash(datos.clave, 10)); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query(`UPDATE USUARIO SET ${sets.join(', ')} WHERE id_usuario = ? AND PERFIL_USUARIO_id = 2`, values);
        if (result.affectedRows === 0) throw new Error('Operador no encontrado.');
        return { message: 'Operador actualizado correctamente.' };
    }

    async eliminarOperador(id) {
        const [result] = await pool.query('DELETE FROM USUARIO WHERE id_usuario = ? AND PERFIL_USUARIO_id = 2', [id]);
        if (result.affectedRows === 0) throw new Error('Operador no encontrado.');
        return { message: 'Operador eliminado con éxito.' };
    }
}

module.exports = new OperadorService();
