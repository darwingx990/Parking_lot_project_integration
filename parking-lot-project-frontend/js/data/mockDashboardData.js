export const mockDashboardData = {
    celdasTotales: 150,
    celdasDisponibles: 42,
    vehiculosActivos: 108,
    ingresosDia: 125000,
    tiempoPromedio: 145, // en minutos
    alertas: [
        { id: 1, tipo: 'pico_placa', mensaje: 'Vehículo bloqueado: Placa termina en 7 (Jueves)', fecha: 'hace 5 min' },
        { id: 2, tipo: 'info', mensaje: 'Mantenimiento en zona A completado', fecha: 'hace 15 min' },
        { id: 3, tipo: 'error', mensaje: 'Falla en sensor de celda #84', fecha: 'hace 32 min' },
        { id: 4, tipo: 'pico_placa', mensaje: 'Vehículo bloqueado: Placa termina en 8 (Jueves)', fecha: 'hace 1 hora' },
        { id: 5, tipo: 'info', mensaje: 'Turno de tarde iniciado por Carlos Manuel', fecha: 'hace 2 horas' }
    ],
    reportes: {
        ocupacionSemanal: [60, 85, 45, 70, 95, 30, 15], // Lun a Dom (%)
        ingresosMensuales: 1250000,
        incidentesMes: 12,
        actividadReciente: [
            { id: 101, fecha: new Date(), vehiculo_id: 'ABC-123', tipo_acceso: 'Entrada' },
            { id: 102, fecha: new Date(Date.now() - 3600000), vehiculo_id: 'XYZ-987', tipo_acceso: 'Salida' },
            { id: 103, fecha: new Date(Date.now() - 7200000), vehiculo_id: 'GHT-456', tipo_acceso: 'Entrada' },
            { id: 104, fecha: new Date(Date.now() - 86400000), vehiculo_id: 'RTY-111', tipo_acceso: 'Salida' },
            { id: 105, fecha: new Date(Date.now() - 86400000 * 2), vehiculo_id: 'MNO-555', tipo_acceso: 'Entrada' }
        ]
    }
};
