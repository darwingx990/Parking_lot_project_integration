const sql = require('../config/db.js');

class GetEstadoService {
    async crearEstado(datos) {
        try {
            const { tipo, estado } = datos;
            
            if (!tipo || !estado) {
                throw new Error('Los campos tipo y estado son obligatorios.');
            }
            
            const result = await sql`
                INSERT INTO "CELDA" (tipo, estado)
                VALUES (${tipo}, ${estado})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear la celda.');
            }
            
            const row = result[0];
            return { id: row.id, tipo: row.tipo, estado: row.estado };
        } catch (error) {
            console.error('Error en crearEstado:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear celda: ${error.message}`);
        }
    }

    async obtenerEstados() {
        try {
            const result = await sql`
                SELECT * FROM "CELDA" ORDER BY id
            `;
            
            return result.map(row => ({
                id: row.id,
                tipo: row.tipo,
                estado: row.estado
            }));
        } catch (error) {
            console.error('Error en obtenerEstados:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener celdas: ${error.message}`);
        }
    }

    async obtenerEstadoPorId(id) {
        try {
            const result = await sql`SELECT * FROM "CELDA" WHERE id = ${id}`;
            
            if (result.length === 0) {
                throw new Error('Celda no encontrada.');
            }
            
            const row = result[0];
            return { id: row.id, tipo: row.tipo, estado: row.estado };
        } catch (error) {
            console.error('Error en obtenerEstadoPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener celda por ID: ${error.message}`);
        }
    }

    async obtenerEstadosPorTipo(tipo) {
        try {
            const result = await sql`SELECT * FROM "CELDA" WHERE tipo = ${tipo} ORDER BY id`;
            
            return result.map(row => ({
                id: row.id,
                tipo: row.tipo,
                estado: row.estado
            }));
        } catch (error) {
            console.error('Error en obtenerEstadosPorTipo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener celdas por tipo: ${error.message}`);
        }
    }

    async obtenerEstadosPorEstado(estado) {
        try {
            const result = await sql`SELECT * FROM "CELDA" WHERE estado = ${estado} ORDER BY id`;
            
            return result.map(row => ({
                id: row.id,
                tipo: row.tipo,
                estado: row.estado
            }));
        } catch (error) {
            console.error('Error en obtenerEstadosPorEstado:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener celdas por estado: ${error.message}`);
        }
    }

    async obtenerCeldaLibrePorTipo(tipo) {
        try {
            const result = await sql`
                SELECT * FROM "CELDA" 
                WHERE tipo = ${tipo} AND estado = 'Libre'
                ORDER BY id
                LIMIT 1
            `;
            
            if (result.length === 0) {
                throw new Error('No hay celdas disponibles de este tipo.');
            }
            
            const row = result[0];
            return { id: row.id, tipo: row.tipo, estado: row.estado };
        } catch (error) {
            console.error('Error en obtenerCeldaLibrePorTipo:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener celda libre por tipo: ${error.message}`);
        }
    }

    async actualizarEstado(id, datosActualizados) {
        try {
            const { tipo, estado } = datosActualizados;
            
            const result = await sql`
                UPDATE "CELDA"
                SET tipo = ${tipo || sql.unsafe('tipo')},
                    estado = ${estado || sql.unsafe('estado')}
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Celda no encontrada para actualizar.');
            }
            
            return { message: "Celda actualizada correctamente.", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarEstado:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar celda: ${error.message}`);
        }
    }

    async eliminarEstado(id) {
        try {
            const result = await sql`DELETE FROM "CELDA" WHERE id = ${id} RETURNING id`;
            
            if (!result || result.length === 0) {
                throw new Error('Celda no encontrada para eliminar.');
            }
            
            return { message: "Celda eliminada con éxito." };
        } catch (error) {
            console.error('Error en eliminarEstado:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar celda: ${error.message}`);
        }
    }

    async ocuparCelda(id) {
        try {
            const result = await sql`
                UPDATE "CELDA"
                SET estado = 'Ocupada'
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Celda no encontrada.');
            }
            
            return { message: "Celda ocupada correctamente." };
        } catch (error) {
            console.error('Error en ocuparCelda:', error);
            throw new Error(`Error al ocupar celda: ${error.message}`);
        }
    }

    async liberarCelda(id) {
        try {
            const result = await sql`
                UPDATE "CELDA"
                SET estado = 'Libre'
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Celda no encontrada.');
            }
            
            return { message: "Celda liberada correctamente." };
        } catch (error) {
            console.error('Error en liberarCelda:', error);
            throw new Error(`Error al liberar celda: ${error.message}`);
        }
    }
}

module.exports = new GetEstadoService();
