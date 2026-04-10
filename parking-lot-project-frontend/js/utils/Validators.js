import { apiClient } from '../core/api.js';

export const Validators = {
    /**
     * Valida si un vehículo tiene restricción de Pico y Placa para el día de hoy.
     * @param {string} placa - Placa del vehículo
     * @returns {Promise<{restricted: boolean, message: string}>}
     */
    async checkPicoPlaca(placa) {
        if (!placa) return { restricted: false };
        
        const lastDigit = parseInt(placa.slice(-1));
        if (isNaN(lastDigit)) return { restricted: false };

        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        const hoy = diasSemana[new Date().getDay()];

        if (hoy === 'Sabado' || hoy === 'Domingo') {
            return { restricted: false };
        }

        try {
            // Obtener reglas del backend
            const reglas = await apiClient.picoPlaca.getAll();
            
            // Buscar si hay una regla para el dígito y día actual
            const restriccion = reglas.find(r => 
                parseInt(r.numero) === lastDigit && 
                r.dia.toLowerCase() === hoy.toLowerCase()
            );

            if (restriccion) {
                return { 
                    restricted: true, 
                    message: `El vehículo con placa terminada en ${lastDigit} tiene restricción para el día ${hoy}.` 
                };
            }

            return { restricted: false };
        } catch (error) {
            console.error('Error al validar Pico y Placa:', error);
            // Fallback: Si el API falla, no bloqueamos por defecto para no detener la operación
            return { restricted: false };
        }
    }
};
