const sql = require('../config/db.js');
const PicoPlaca = require('../models/PicoPlaca');

class PicoPlacaService {
    async crearPicoPlaca(datos) {
        try {
            const { tipoVehiculo, numero, dia } = datos;
            
            if (!tipoVehiculo || !numero || !dia) {
                throw new Error('Los campos tipoVehiculo, numero y dia son obligatorios.');
            }
            
            const result = await sql`
                INSERT INTO "PICO_PLACA" (tipo_vehiculo, numero, dia)
                VALUES (${tipoVehiculo}, ${numero}, ${dia})
                RETURNING *
            `;
            
            if (!result || result.length === 0) {
                throw new Error('No se pudo crear el registro.');
            }
            
            const row = result[0];
            return new PicoPlaca(row.id, row.tipo_vehiculo, row.numero, row.dia);
        } catch (error) {
            console.error('Error en crearPicoPlaca:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al crear pico y placa: ${error.message}`);
        }
    }

    async obtenerPicoPlacas() {
        try {
            const result = await sql`SELECT * FROM "PICO_PLACA" ORDER BY id`;
            
            return result.map(row => 
                new PicoPlaca(row.id, row.tipo_vehiculo, row.numero, row.dia)
            );
        } catch (error) {
            console.error('Error en obtenerPicoPlacas:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener pico y placa: ${error.message}`);
        }
    }

    async obtenerPicoPlacaPorId(id) {
        try {
            const result = await sql`SELECT * FROM "PICO_PLACA" WHERE id = ${id}`;
            
            if (result.length === 0) {
                throw new Error('Registro no encontrado.');
            }
            
            const row = result[0];
            return new PicoPlaca(row.id, row.tipo_vehiculo, row.numero, row.dia);
        } catch (error) {
            console.error('Error en obtenerPicoPlacaPorId:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al obtener pico y placa por ID: ${error.message}`);
        }
    }

    async actualizarPicoPlaca(id, datosActualizados) {
        try {
            const { tipoVehiculo, numero, dia } = datosActualizados;
            
            if (!tipoVehiculo || !numero || !dia) {
                throw new Error('Los campos tipoVehiculo, numero y dia son obligatorios.');
            }
            
            const result = await sql`
                UPDATE "PICO_PLACA"
                SET tipo_vehiculo = ${tipoVehiculo}, numero = ${numero}, dia = ${dia}
                WHERE id = ${id}
                RETURNING id
            `;
            
            if (!result || result.length === 0) {
                throw new Error('Registro no encontrado para actualizar.');
            }
            
            return { message: "Pico y Placa actualizado correctamente. ", datos: datosActualizados };
        } catch (error) {
            console.error('Error en actualizarPicoPlaca:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al actualizar pico y placa: ${error.message}`);
        }
    }

    async eliminarPicoPlaca(id) {
        try {
            const result = await sql`DELETE FROM "PICO_PLACA" WHERE id = ${id} RETURNING id`;
            
            if (!result || result.length === 0) {
                throw new Error('Registro no encontrado para eliminar.');
            }
            
            return { message: "Pico y Placa eliminado con exito." };
        } catch (error) {
            console.error('Error en eliminarPicoPlaca:', error);
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new Error('No se puede conectar a la base de datos. Verifica la conexión.');
            }
            throw new Error(`Error al eliminar pico y placa: ${error.message}`);
        }
    }
}

module.exports = new PicoPlacaService();