const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function initDatabase() {
    // First connect without database to create it if needed
    const tempConn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: parseInt(process.env.DB_PORT) || 3306
    });

    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'parking_lot'}\``);
    await tempConn.end();

    // Now use the pool from db.js
    const pool = require('./db');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS PERFIL_USUARIO (
            id INT AUTO_INCREMENT PRIMARY KEY,
            perfil VARCHAR(45) DEFAULT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS USUARIO (
            id_usuario INT AUTO_INCREMENT PRIMARY KEY,
            tipo_documento VARCHAR(45) NOT NULL,
            numero_documento VARCHAR(45) NOT NULL,
            primer_nombre VARCHAR(255) NOT NULL,
            segundo_nombre VARCHAR(225) DEFAULT NULL,
            primer_apellido VARCHAR(255) NOT NULL,
            segundo_apellido VARCHAR(45) DEFAULT NULL,
            direccion_correo VARCHAR(255) NOT NULL,
            numero_celular VARCHAR(45) NOT NULL,
            foto_perfil VARCHAR(255) DEFAULT NULL,
            estado VARCHAR(45) NOT NULL,
            clave VARCHAR(255) DEFAULT NULL,
            PERFIL_USUARIO_id INT NOT NULL,
            CONSTRAINT fk_USUARIO_PERFIL_USUARIO FOREIGN KEY (PERFIL_USUARIO_id) REFERENCES PERFIL_USUARIO(id)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS VEHICULO (
            id INT AUTO_INCREMENT PRIMARY KEY,
            placa VARCHAR(45) DEFAULT NULL,
            color VARCHAR(45) DEFAULT NULL,
            modelo VARCHAR(45) DEFAULT NULL,
            marca VARCHAR(45) DEFAULT NULL,
            tipo VARCHAR(45) DEFAULT NULL,
            USUARIO_id_usuario INT NOT NULL,
            CONSTRAINT fk_VEHICULO_USUARIO1 FOREIGN KEY (USUARIO_id_usuario) REFERENCES USUARIO(id_usuario)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ACCESO_SALIDAS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            movimiento VARCHAR(45) NOT NULL,
            fecha_hora DATETIME NOT NULL,
            puerta VARCHAR(45) DEFAULT NULL,
            tiempo_estadia INT DEFAULT NULL,
            VEHICULO_id INT NOT NULL,
            CONSTRAINT fk_ACCESO_SALIDAS_VEHICULO1 FOREIGN KEY (VEHICULO_id) REFERENCES VEHICULO(id)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS CELDA (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tipo VARCHAR(45) DEFAULT NULL,
            estado VARCHAR(45) DEFAULT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS HISTORIAL_PARQUEO (
            CELDA_id INT NOT NULL,
            VEHICULO_id INT NOT NULL,
            fecha_hora DATETIME DEFAULT NULL,
            PRIMARY KEY (CELDA_id, VEHICULO_id),
            CONSTRAINT fk_CELDA_has_VEHICULO_CELDA1 FOREIGN KEY (CELDA_id) REFERENCES CELDA(id),
            CONSTRAINT fk_CELDA_has_VEHICULO_VEHICULO1 FOREIGN KEY (VEHICULO_id) REFERENCES VEHICULO(id)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS INCIDENCIA (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(45) DEFAULT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS PICO_PLACA (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tipo_vehiculo VARCHAR(45) DEFAULT NULL,
            numero VARCHAR(45) DEFAULT NULL,
            dia VARCHAR(45) DEFAULT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS REPORTE_INCIDENCIA (
            VEHICULO_id INT NOT NULL,
            INCIDENCIA_id INT NOT NULL,
            fecha_hora DATETIME DEFAULT NULL,
            PRIMARY KEY (VEHICULO_id, INCIDENCIA_id),
            CONSTRAINT fk_VEHICULO_has_INCIDENCIA_INCIDENCIA1 FOREIGN KEY (INCIDENCIA_id) REFERENCES INCIDENCIA(id),
            CONSTRAINT fk_VEHICULO_has_INCIDENCIA_VEHICULO1 FOREIGN KEY (VEHICULO_id) REFERENCES VEHICULO(id)
        )
    `);

    // Insertar datos base si las tablas están vacías
    const [perfiles] = await pool.query('SELECT COUNT(*) as count FROM PERFIL_USUARIO');
    if (perfiles[0].count === 0) {
        await pool.query("INSERT INTO PERFIL_USUARIO (perfil) VALUES ('administrador'), ('operador'), ('usuario')");
    }

    // Insertar 3 usuarios de prueba si no hay usuarios
    const [usuarios] = await pool.query('SELECT COUNT(*) as count FROM USUARIO');
    if (usuarios[0].count === 0) {
        const claveAdmin = await bcrypt.hash('admin123', 10);
        const claveOper = await bcrypt.hash('oper123', 10);

        await pool.query(
            `INSERT INTO USUARIO (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, PERFIL_USUARIO_id) VALUES
            ('CC', '100100100', 'Carlos', 'Admin', 'Rodriguez', 'Lopez', 'admin@bioparking.com', '3001234567', NULL, 'activo', ?, 1),
            ('CC', '200200200', 'Maria', 'Oper', 'Gonzalez', 'Perez', 'operador@bioparking.com', '3009876543', NULL, 'activo', ?, 2),
            ('CC', '300300300', 'Juan', 'User', 'Martinez', 'Diaz', 'usuario@bioparking.com', '3005551234', NULL, 'activo', NULL, 3)`,
            [claveAdmin, claveOper]
        );

        // Insertar vehículos para los usuarios de prueba
        await pool.query(`
            INSERT INTO VEHICULO (placa, color, modelo, marca, tipo, USUARIO_id_usuario) VALUES
            ('ADM001', 'Negro', '2024', 'Toyota', 'Carro', 1),
            ('OPR001', 'Blanco', '2023', 'Chevrolet', 'Carro', 2),
            ('USR001', 'Rojo', '2022', 'Yamaha', 'Moto', 3)
        `);

        // Insertar celdas de ejemplo
        await pool.query(`
            INSERT INTO CELDA (tipo, estado) VALUES
            ('Carro', 'Libre'), ('Carro', 'Libre'), ('Carro', 'Libre'), ('Carro', 'Libre'), ('Carro', 'Libre'),
            ('Carro', 'Libre'), ('Carro', 'Libre'), ('Carro', 'Libre'), ('Carro', 'Libre'), ('Carro', 'Libre'),
            ('Moto', 'Libre'), ('Moto', 'Libre'), ('Moto', 'Libre'), ('Moto', 'Libre'), ('Moto', 'Libre')
        `);

        // Insertar incidencias base
        await pool.query(`
            INSERT INTO INCIDENCIA (nombre) VALUES
            ('Robo de vehiculo'), ('Robo de accesorios'), ('Choque'), ('Rayon'), ('Fuga de fluidos')
        `);

        // Insertar reglas de pico y placa
        await pool.query(`
            INSERT INTO PICO_PLACA (tipo_vehiculo, numero, dia) VALUES
            ('Carro', '1', 'Lunes'), ('Carro', '2', 'Lunes'),
            ('Carro', '3', 'Martes'), ('Carro', '4', 'Martes'),
            ('Carro', '5', 'Miercoles'), ('Carro', '6', 'Miercoles'),
            ('Carro', '7', 'Jueves'), ('Carro', '8', 'Jueves'),
            ('Carro', '9', 'Viernes'), ('Carro', '0', 'Viernes')
        `);
    }
}

module.exports = initDatabase;
