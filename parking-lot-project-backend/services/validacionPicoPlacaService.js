const sql = require('../config/db.js');

/**
 * Servicio para validaciones de Pico y Placa
 * REQ-INEX-4: Denegar acceso si placa incumple restricciones
 */
class ValidacionPicoPlacaService {
    /**
     * Valida si un vehículo puede ingresar según pico y placa
     * @param {string} placa - Placa del vehículo (ej: ABC123)
     * @returns {object} { permitido: boolean, razon: string }
     */
    async validarPicoPlaca(placa) {
        try {
            // Obtener información del vehículo
            const vehiculos = await sql`
                SELECT tipo FROM "VEHICULO"
                WHERE placa = ${placa.toUpperCase()}
            `;

            if (vehiculos.length === 0) {
                return { permitido: false, razon: 'Vehículo no registrado en el sistema' };
            }

            const tipoVehiculo = vehiculos[0].tipo; // 'Carro' o 'Moto'
            const hoy = new Date();
            const diaSemana = this.obtenerDiaSemana(hoy);
            const ultimoDigito = this.extraerUltimoDigito(placa);

            // Obtener restricciones para hoy
            const restricciones = await sql`
                SELECT numero FROM "PICO_PLACA"
                WHERE LOWER(dia) = ${diaSemana.toLowerCase()}
                AND (LOWER(tipo_vehiculo) = 'todos' OR LOWER(tipo_vehiculo) = ${tipoVehiculo.toLowerCase()})
            `;

            // Buscar si el último dígito está restringido
            const restringido = restricciones.some(r => r.numero == ultimoDigito);

            if (restringido) {
                return {
                    permitido: false,
                    razon: `Vehículo restringido por pico y placa hoy (${diaSemana}). Último dígito: ${ultimoDigito}`
                };
            }

            return {
                permitido: true,
                razon: 'Vehículo autorizado para ingresar'
            };
        } catch (error) {
            console.error('Error en validarPicoPlaca:', error);
            throw new Error(`Error al validar pico y placa: ${error.message}`);
        }
    }

    /**
     * Obtiene el nombre del día de la semana
     */
    obtenerDiaSemana(fecha) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[fecha.getDay()];
    }

    /**
     * Extrae el último dígito de la placa
     * Ej: ABC1234 -> 4
     */
    extraerUltimoDigito(placa) {
        const digitos = placa.replace(/\D/g, '');
        return digitos[digitos.length - 1];
    }

    /**
     * Obtiene las restricciones de un día específico
     */
    async obtenerRestriccionesPorDia(dia) {
        try {
            const resultado = await sql`
                SELECT id, tipo_vehiculo, numero FROM "PICO_PLACA"
                WHERE LOWER(dia) = ${dia.toLowerCase()}
                ORDER BY numero
            `;
            return resultado;
        } catch (error) {
            console.error('Error en obtenerRestriccionesPorDia:', error);
            throw new Error(`Error al obtener restricciones: ${error.message}`);
        }
    }

    /**
     * Cuenta vehículos que NO pueden ingresar en un día específico
     * REQ-REP-06: Listar total de vehículos no autorizados por pico y placa
     */
    async contarVehiculosRestringidosPorDia(dia) {
        try {
            const restricciones = await this.obtenerRestriccionesPorDia(dia);
            
            if (restricciones.length === 0) {
                return { dia, totalRestringidos: 0, detalles: [] };
            }

            const numeros = restricciones.map(r => r.numero);
            
            // Buscar vehículos cuyo último dígito está en las restricciones
            const vehiculosRestringidos = await sql`
                SELECT id, placa, tipo, usuario_id
                FROM "VEHICULO"
                WHERE CAST(SUBSTRING(placa, -1) AS INTEGER) = ANY(${numeros})
            `;

            return {
                dia,
                totalRestringidos: vehiculosRestringidos.length,
                detalles: vehiculosRestringidos
            };
        } catch (error) {
            console.error('Error en contarVehiculosRestringidosPorDia:', error);
            throw new Error(`Error al contar vehículos restringidos: ${error.message}`);
        }
    }
}

module.exports = new ValidacionPicoPlacaService();
