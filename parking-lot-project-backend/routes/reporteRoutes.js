const express = require('express');
const router = express.Router();
const sql = require('../config/db.js');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const validacionPicoPlacaService = require('../services/validacionPicoPlacaService');

/**
 * REQ-REP-01: Solo administrador puede consultar y generar listado de usuarios
 */
router.get('/usuarios', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const result = await sql`
            SELECT u.*, p.perfil 
            FROM "USUARIO" u
            JOIN "PERFIL_USUARIO" p ON u."PERFIL_USUARIO_id" = p.id
            ORDER BY u.id_usuario
        `;
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-02: Solo administrador puede consultar y generar listado de vehículos
 */
router.get('/vehiculos', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const result = await sql`
            SELECT v.*, u.numero_documento as usuario_documento, 
                   CONCAT(u.primer_nombre, ' ', u.primer_apellido) as usuario_nombre
            FROM "VEHICULO" v
            JOIN "USUARIO" u ON v."USUARIO_id_usuario" = u.id_usuario
            ORDER BY v.id
        `;
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-03: Solo administrador puede listar todas las entradas al parqueadero
 */
router.get('/entradas', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const { fecha } = req.query;
        let query = `
            SELECT a.*, v.placa as vehiculo_placa
            FROM "ACCESO_SALIDAS" a
            JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
            WHERE a.movimiento = 'Entrada'
        `;
        
        if (fecha) {
            query += ` AND DATE(a.fecha_hora) = '${fecha}'`;
        }
        
        query += ` ORDER BY a.fecha_hora DESC`;
        
        const result = await sql.unsafe(query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-04: Solo administrador puede listar todas las salidas del parqueadero
 */
router.get('/salidas', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const { fecha } = req.query;
        let query = `
            SELECT a.*, v.placa as vehiculo_placa
            FROM "ACCESO_SALIDAS" a
            JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
            WHERE a.movimiento = 'Salida'
        `;
        
        if (fecha) {
            query += ` AND DATE(a.fecha_hora) = '${fecha}'`;
        }
        
        query += ` ORDER BY a.fecha_hora DESC`;
        
        const result = await sql.unsafe(query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-05: Solo administrador puede listar todas las incidencias
 */
router.get('/incidencias', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const result = await sql`
            SELECT ri.*, v.placa as vehiculo_placa, i.nombre as incidencia_nombre
            FROM "REPORTE_INCIDENCIA" ri
            JOIN "VEHICULO" v ON ri."VEHICULO_id" = v.id
            JOIN "INCIDENCIA" i ON ri."INCIDENCIA_id" = i.id
            ORDER BY ri.fecha_hora DESC
        `;
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-06: Total de vehículos que no ingresarán en un determinado día por pico y placa
 */
router.get('/pico-placa/dia/:fecha', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const fecha = new Date(req.params.fecha);
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dia = diasSemana[fecha.getDay()];
        
        const resultado = await validacionPicoPlacaService.contarVehiculosRestringidosPorDia(dia);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-07: Total de celdas ocupadas por un día determinado
 */
router.get('/celdas-ocupadas/dia/:fecha', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const { fecha } = req.params;
        
        const result = await sql`
            SELECT c.id, c.tipo, c.estado, v.placa
            FROM "CELDA" c
            LEFT JOIN "HISTORIAL_PARQUEO" hp ON c.id = hp."CELDA_id"
            LEFT JOIN "VEHICULO" v ON hp."VEHICULO_id" = v.id
            WHERE DATE(hp.fecha_inicio) = ${fecha} OR hp.id IS NULL
            ORDER BY c.id
        `;
        
        const ocupadas = result.filter(c => c.estado === 'Ocupada' && c.vehiculo_placa).length;
        const totales = result.length || 0;
        
        res.status(200).json({
            fecha: fecha,
            totalCeldas: totales,
            celdasOcupadas: ocupadas,
            celdasDisponibles: totales - ocupadas,
            porcentajeOcupacion: totales > 0 ? Math.round((ocupadas / totales) * 100) : 0,
            detalle: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-08: Celdas más usadas en un lapso de tiempo
 */
router.get('/celdas-top/:fechaInicio/:fechaFin', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const { fechaInicio, fechaFin } = req.params;
        
        const result = await sql`
            SELECT COUNT(*) as veces_usada, "CELDA_id" as celda_id, c.tipo
            FROM "HISTORIAL_PARQUEO" hp
            JOIN "CELDA" c ON hp."CELDA_id" = c.id
            WHERE hp.fecha_inicio BETWEEN ${fechaInicio} AND ${fechaFin}
            GROUP BY "CELDA_id", c.tipo
            ORDER BY veces_usada DESC
            LIMIT 10
        `;
        res.status(200).json({
            periodo: { inicio: fechaInicio, fin: fechaFin },
            top10Celdas: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-09: Vehículos que más usan el parqueadero
 */
router.get('/vehiculos-top', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const result = await sql`
            SELECT COUNT(*) as total_accesos, v.placa, v.id as vehiculo_id, v.marca, v.modelo
            FROM "ACCESO_SALIDAS" a
            JOIN "VEHICULO" v ON a."VEHICULO_id" = v.id
            WHERE a.movimiento = 'Entrada'
            GROUP BY v.id, v.placa, v.marca, v.modelo
            ORDER BY total_accesos DESC
            LIMIT 10
        `;
        res.status(200).json({
            top10Vehiculos: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * REQ-REP-10: Horas y días que más se ocupa el parqueadero
 */
router.get('/picos-ocupacion', verificarToken, verificarRol(['Administrador']), async (req, res, next) => {
    try {
        const result = await sql`
            SELECT 
                EXTRACT(DOW FROM a.fecha_hora) as dia_semana,
                EXTRACT(HOUR FROM a.fecha_hora) as hora,
                COUNT(*) as total_accesos
            FROM "ACCESO_SALIDAS" a
            WHERE a.movimiento = 'Entrada'
            GROUP BY EXTRACT(DOW FROM a.fecha_hora), EXTRACT(HOUR FROM a.fecha_hora)
            ORDER BY total_accesos DESC
            LIMIT 20
        `;
        
        const diasSemana = { 0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado' };
        const resultadoFormato = result.map(r => ({
            dia: diasSemana[r.dia_semana],
            hora: `${String(r.hora).padStart(2, '0')}:00`,
            totalAccesos: r.total_accesos
        }));
        
        res.status(200).json({
            picosOcupacion: resultadoFormato
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
