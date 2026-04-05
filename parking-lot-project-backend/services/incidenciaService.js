const sql = require('../config/db.js');

class IncidenciaService {
    async crearIncidencia(datos) {
        try {
            const { nombre } = datos;
            
            if (!nombre) {
                throw new Error('El campo nombre es obligatorio.');
            }
            
            const result = await sql`
                INSERT INTO "INCIDENCIA" (nombre)
                VALUES (${nombre})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear la incidencia.');
            }
            
            const row = result[0];
            return { id: row.id, nombre: row.nombre };
        } catch (error) {
            console.error('Error en crearIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear incidencia: ${error.message}`);
        }
    }

    async obtenerIncidencias() {
        try {
            const result = await sql`SELECT * FROM "INCIDENCIA" ORDER BY id`;
            
            return result.map(row => ({
                id: row.id,
                nombre: row.nombre
            }));
        } catch (error) {
            console.error('Error en obtenerIncidencias:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener incidencias: ${error.message}`);
        }
    }

    async obtenerIncidenciaPorId(id) {
        try {
            const result = await sql`SELECT * FROM "INCIDENCIA" WHERE id = ${id}`;
            
            if (result.length === 0) {
                throw new Error('Incidencia no encontrada.');
            }
            
            const row = result[0];
            return { id: row.id, nombre: row.nombre };
        } catch (error) {
            console.error('Error en obtenerIncidenciaPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener incidencia por ID: ${error.message}`);
        }
    }

    async obtenerIncidenciaPorNombre(nombre) {
        try {
            const result = await sql`SELECT * FROM "INCIDENCIA" WHERE nombre ILIKE ${'%' + nombre + '%'}`;
            
            if (result.length === 0) {
                throw new Error('Incidencia no encontrada.');
            }
            
            const row = result[0];
            return { id: row.id, nombre: row.nombre };
        } catch (error) {
            console.error('Error en obtenerIncidenciaPorNombre:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener incidencia por nombre: ${error.message}`);
        }
    }

    async actualizarIncidencia(id, datosActualizados) {
        try {
            const { nombre } = datosActualizados;
            
            if (!nombre) {
                throw new Error('El campo nombre es obligatorio.');
            }
            
            const result = await sql`
                UPDATE "INCIDENCIA"
                SET nombre = ${nombre}
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Incidencia no encontrada para actualizar.');
            }
            
            return { message: "Incidencia actualizada correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar incidencia: ${error.message}`);
        }
    }

    async eliminarIncidencia(id) {
        try {
            const result = await sql`DELETE FROM "INCIDENCIA" WHERE id = ${id} RETURNING id`;
            
            if (!result || result.length === 0) {
                throw new Error('Incidencia no encontrada para eliminar.');
            }
            
            return { message: "Incidencia eliminada con éxito." };
        } catch (error) {
            console.error('Error en eliminarIncidencia:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar incidencia: ${error.message}`);
        }
    }
}

module.exports = new IncidenciaService();
