const pool = require('../config/db.js');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UsuarioService {
    async crearUsuario(datos) {
        const { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave, perfilId } = datos;
        if (!tipoDocumento || !numeroDocumento || !primerNombre || !primerApellido || !direccionCorreo || !numeroCelular || !perfilId) {
            throw new Error('Campos obligatorios: tipoDocumento, numeroDocumento, primerNombre, primerApellido, direccionCorreo, numeroCelular, perfilId.');
        }
        const claveHash = clave ? await bcrypt.hash(clave, 10) : null;
        const [result] = await pool.query(
            'INSERT INTO USUARIO (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, PERFIL_USUARIO_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [tipoDocumento, numeroDocumento, primerNombre, segundoNombre || null, primerApellido, segundoApellido || null, direccionCorreo, numeroCelular, fotoPerfil || null, estado || 'activo', claveHash, perfilId]
        );
        const [rows] = await pool.query('SELECT * FROM USUARIO WHERE id_usuario = ?', [result.insertId]);
        const row = rows[0];
        return new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado);
    }

    async validarCredenciales(numeroDocumento, clavePla) {
        const [result] = await pool.query('SELECT u.*, p.perfil FROM USUARIO u JOIN PERFIL_USUARIO p ON u.PERFIL_USUARIO_id = p.id WHERE u.numero_documento = ?', [numeroDocumento]);
        if (result.length === 0) throw new Error('Documento o clave incorrectos.');
        const usuarioDB = result[0];
        if (usuarioDB.clave && clavePla) {
            let match = false;
            if (usuarioDB.clave.startsWith('$2b$') || usuarioDB.clave.startsWith('$2a$')) { match = await bcrypt.compare(clavePla, usuarioDB.clave); }
            else { match = (clavePla === usuarioDB.clave); }
            if (!match) throw new Error('Documento o clave incorrectos.');
        } else if (usuarioDB.clave && !clavePla) { throw new Error('Se requiere clave para este usuario.'); }
        let rol = usuarioDB.perfil.toLowerCase();
        if (usuarioDB.PERFIL_USUARIO_id === 1) rol = 'administrador';
        else if (usuarioDB.PERFIL_USUARIO_id === 2) rol = 'operador';
        else rol = 'usuario';
        const token = jwt.sign({ id: usuarioDB.id_usuario, numeroDocumento: usuarioDB.numero_documento, rol, perfilId: usuarioDB.PERFIL_USUARIO_id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        return { token, usuario: { id: usuarioDB.id_usuario, numeroDocumento: usuarioDB.numero_documento, nombre: usuarioDB.primer_nombre + ' ' + usuarioDB.primer_apellido, rol, perfilId: usuarioDB.PERFIL_USUARIO_id } };
    }

    async obtenerUsuarios() {
        const [result] = await pool.query('SELECT u.*, p.perfil FROM USUARIO u JOIN PERFIL_USUARIO p ON u.PERFIL_USUARIO_id = p.id ORDER BY u.id_usuario');
        return result.map(row => ({ id: row.id_usuario, tipoDocumento: row.tipo_documento, numeroDocumento: row.numero_documento, primerNombre: row.primer_nombre, segundoNombre: row.segundo_nombre, primerApellido: row.primer_apellido, segundoApellido: row.segundo_apellido, direccionCorreo: row.direccion_correo, numeroCelular: row.numero_celular, fotoPerfil: row.foto_perfil, estado: row.estado, perfil: row.perfil }));
    }

    async obtenerUsuarioPorId(id) {
        const [result] = await pool.query('SELECT * FROM USUARIO WHERE id_usuario = ?', [id]);
        if (result.length === 0) throw new Error('Usuario no encontrado.');
        const row = result[0];
        return new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado);
    }

    async obtenerUsuarioPorDocumento(numeroDocumento) {
        const [result] = await pool.query('SELECT * FROM USUARIO WHERE numero_documento = ?', [numeroDocumento]);
        if (result.length === 0) throw new Error('Usuario no encontrado.');
        const row = result[0];
        return new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.primer_nombre, row.segundo_nombre, row.primer_apellido, row.segundo_apellido, row.direccion_correo, row.numero_celular, row.foto_perfil, row.estado);
    }

    async actualizarUsuario(id, datos) {
        const sets = []; const values = [];
        const mapping = { tipoDocumento:'tipo_documento', numeroDocumento:'numero_documento', primerNombre:'primer_nombre', segundoNombre:'segundo_nombre', primerApellido:'primer_apellido', segundoApellido:'segundo_apellido', direccionCorreo:'direccion_correo', numeroCelular:'numero_celular', fotoPerfil:'foto_perfil', estado:'estado' };
        for (const [key, col] of Object.entries(mapping)) { if (datos[key] !== undefined) { sets.push(col + ' = ?'); values.push(datos[key]); } }
        if (datos.clave !== undefined) { sets.push('clave = ?'); values.push(await bcrypt.hash(datos.clave, 10)); }
        if (sets.length === 0) throw new Error('No hay campos para actualizar.');
        values.push(id);
        const [result] = await pool.query('UPDATE USUARIO SET ' + sets.join(', ') + ' WHERE id_usuario = ?', values);
        if (result.affectedRows === 0) throw new Error('Usuario no encontrado.');
        return { message: 'Usuario actualizado correctamente.', datos };
    }

    async eliminarUsuario(id) {
        const [result] = await pool.query('DELETE FROM USUARIO WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) throw new Error('Usuario no encontrado.');
        return { message: 'Usuario eliminado con exito.' };
    }

    async recuperarClave(documento, correo, nuevaClave) {
        const [result] = await pool.query('SELECT id_usuario FROM USUARIO WHERE numero_documento = ? AND direccion_correo = ?', [documento, correo]);
        if (result.length === 0) throw new Error('Datos no coinciden.');
        const claveHash = await bcrypt.hash(nuevaClave, 10);
        await pool.query('UPDATE USUARIO SET clave = ? WHERE id_usuario = ?', [claveHash, result[0].id_usuario]);
        return { message: 'Clave actualizada exitosamente.' };
    }
}

module.exports = new UsuarioService();
