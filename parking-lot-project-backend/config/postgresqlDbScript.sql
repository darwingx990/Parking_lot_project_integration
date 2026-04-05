-- PostgreSQL Script for ParkingLot Database
-- Converted from MySQL
-- Date: 2025-06-19

-- Create database (uncomment if needed)
-- CREATE DATABASE "ParkingLot";

-- Connect to database
-- \c "ParkingLot";

-- --------------------------------------------------------

--
-- Table structure for table "PERFIL_USUARIO"
--

CREATE TABLE "PERFIL_USUARIO" (
  "id" SERIAL PRIMARY KEY,
  "perfil" VARCHAR(45) DEFAULT NULL
);

--
-- Data for table "PERFIL_USUARIO"
--

INSERT INTO "PERFIL_USUARIO" ("perfil") VALUES
('administrador'),
('operador'),
('usuario');

-- --------------------------------------------------------

--
-- Table structure for table "USUARIO"
--

CREATE TABLE "USUARIO" (
  "id_usuario" SERIAL PRIMARY KEY,
  "tipo_documento" VARCHAR(45) NOT NULL,
  "numero_documento" VARCHAR(45) NOT NULL,
  "primer_nombre" VARCHAR(255) NOT NULL,
  "segundo_nombre" VARCHAR(225) DEFAULT NULL,
  "primer_apellido" VARCHAR(255) NOT NULL,
  "segundo_apellido" VARCHAR(45) DEFAULT NULL,
  "direccion_correo" VARCHAR(255) NOT NULL,
  "numero_celular" VARCHAR(45) NOT NULL,
  "foto_perfil" VARCHAR(255) DEFAULT NULL,
  "estado" VARCHAR(45) NOT NULL,
  "clave" VARCHAR(255) DEFAULT NULL,
  "PERFIL_USUARIO_id" INTEGER NOT NULL,
  CONSTRAINT "fk_USUARIO_PERFIL_USUARIO" FOREIGN KEY ("PERFIL_USUARIO_id") REFERENCES "PERFIL_USUARIO" ("id")
);

--
-- Data for table "USUARIO"
--

INSERT INTO "USUARIO" ("tipo_documento", "numero_documento", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "direccion_correo", "numero_celular", "foto_perfil", "estado", "clave", "PERFIL_USUARIO_id") VALUES
('CC', '651684841', 'Abel', '', 'Rivero', 'Herrera', 'abel.rivero@gmail.com', '561465151', 'img/abel.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '8947676234', 'Ada', 'Alicia', 'Rivero', 'herrera', 'ada.rivero@gmail.com', '897484561', 'img/ada.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 1),
('CC', '8947676234', 'Martha', 'Paola', 'Perez', 'Ospino', 'martha.perez@gmail.com', '897484561', 'img/Martha.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '756876875', 'Carlos', 'Manuel', 'Uran', 'Menodza', 'carlos.uran@gmail.com', '7866856', 'img/carlos.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 2),
('CC', '756876875', 'Maria', 'Del Carmen', 'Herrera', 'Alian', 'maria.herrera@gmail.com', '56154118', 'img/maria.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '894151', 'Peggy', 'Geraldine', 'Herrera', 'Alian', 'peggy.herrera@gmail.com', '8948484', 'img/peggy.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '7894484644', 'Esteban', 'Solarte', 'Jaramillo', 'Alian', 'esteban.solarte@gmail.com', '4851855', 'img/esteban.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '23151486', 'Amparo', '', 'Grisales', 'Londoño', 'amaparo.grisales@gmail.com', '7894844', 'img/amparo.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '6815158', 'Libardo', 'De Jesus', 'Atehortua', 'Grisales', 'libardo.atehortua@gmail.com', '12584181', 'img/libardo.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 3),
('CC', '8764554', 'Lincho', 'De Jesus', 'Alvarez', 'Otero', 'lincho.alvarez@gmail.com', '1868445', 'img/lincho.jpg', 'activo', '3be76c0e963a343cd25f38dd92649ed2', 2);

-- --------------------------------------------------------

--
-- Table structure for table "VEHICULO"
--

CREATE TABLE "VEHICULO" (
  "id" SERIAL PRIMARY KEY,
  "placa" VARCHAR(45) DEFAULT NULL,
  "color" VARCHAR(45) DEFAULT NULL,
  "modelo" VARCHAR(45) DEFAULT NULL,
  "marca" VARCHAR(45) DEFAULT NULL,
  "tipo" VARCHAR(45) DEFAULT NULL,
  "USUARIO_id_usuario" INTEGER NOT NULL,
  CONSTRAINT "fk_VEHICULO_USUARIO1" FOREIGN KEY ("USUARIO_id_usuario") REFERENCES "USUARIO" ("id_usuario")
);

--
-- Data for table "VEHICULO"
--

INSERT INTO "VEHICULO" ("placa", "color", "modelo", "marca", "tipo", "USUARIO_id_usuario") VALUES
('ABC123', 'rojo', '2020', 'Toyota', 'Carro', 1),
('GHT124', 'azul', '2011', 'Chevrolet', 'Carro', 2),
('EWX125', 'oro azucar', '2000', 'Hyundai', 'Carro', 3),
('ABC126', 'mate negro', '2020', 'Nissan', 'Carro', 4),
('ABC127', 'rojo perla', '2020', 'Yamaha', 'Moto', 5),
('MEA222', 'Negro gotico', '1999', 'BMW', 'Carro', 5),
('FDA128', 'rojo tomate', '2020', 'Yamaha', 'Moto', 6),
('FBI129', 'amarillo mostaza', '2020', 'Nissan', 'Carro', 7),
('CIA130', 'marron fecal', '2020', 'Toyota', 'Carro', 8),
('NHA131', 'blanco perla', '2020', 'Yamaha', 'Moto', 9);

-- --------------------------------------------------------

--
-- Table structure for table "ACCESO_SALIDAS"
--

CREATE TABLE "ACCESO_SALIDAS" (
  "id" SERIAL PRIMARY KEY,
  "movimiento" VARCHAR(45) NOT NULL,
  "fecha_hora" TIMESTAMP NOT NULL,
  "puerta" VARCHAR(45) DEFAULT NULL,
  "tiempo_estadia" INTEGER DEFAULT NULL,
  "VEHICULO_id" INTEGER NOT NULL,
  CONSTRAINT "fk_ACCESO_SALIDAS_VEHICULO1" FOREIGN KEY ("VEHICULO_id") REFERENCES "VEHICULO" ("id")
);

--
-- Data for table "ACCESO_SALIDAS"
--

INSERT INTO "ACCESO_SALIDAS" ("movimiento", "fecha_hora", "puerta", "tiempo_estadia", "VEHICULO_id") VALUES
('Entrada', '2025-04-06 19:22:53', 'Puerta 1', 0, 1),
('Entrada', '2025-04-06 19:22:53', 'Puerta 2', 0, 2),
('Entrada', '2025-04-06 19:22:53', 'Puerta 3', 0, 3),
('Salida', '2025-04-06 19:22:53', 'Puerta 4', 560000, 4),
('Salida', '2025-04-06 19:22:53', 'Puerta 1', 0, 5),
('Entrada', '2025-04-06 19:22:53', 'Puerta 3', 0, 6),
('Entrada', '2025-04-06 19:22:53', 'Puerta 4', 0, 7),
('Entrada', '2025-04-06 19:22:53', 'Puerta 1', 0, 8),
('Salida', '2025-04-06 19:22:53', 'Puerta 1', 340000, 9),
('Salida', '2025-04-06 19:22:53', 'Puerta 1', 260000, 10);

-- --------------------------------------------------------

--
-- Table structure for table "CELDA"
--

CREATE TABLE "CELDA" (
  "id" SERIAL PRIMARY KEY,
  "tipo" VARCHAR(45) DEFAULT NULL,
  "estado" VARCHAR(45) DEFAULT NULL
);

--
-- Data for table "CELDA" (limited to 10 records)
--

INSERT INTO "CELDA" ("tipo", "estado") VALUES
('Carro', 'Libre'),
('Carro', 'Libre'),
('Carro', 'Libre'),
('Carro', 'Libre'),
('Carro', 'Libre'),
('Moto', 'Libre'),
('Moto', 'Libre'),
('Moto', 'Libre'),
('Moto', 'Libre'),
('Moto', 'Libre');

-- --------------------------------------------------------

--
-- Table structure for table "HISTORIAL_PARQUEO"
--

CREATE TABLE "HISTORIAL_PARQUEO" (
  "CELDA_id" INTEGER NOT NULL,
  "VEHICULO_id" INTEGER NOT NULL,
  "fecha_hora" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("CELDA_id", "VEHICULO_id"),
  CONSTRAINT "fk_CELDA_has_VEHICULO_CELDA1" FOREIGN KEY ("CELDA_id") REFERENCES "CELDA" ("id"),
  CONSTRAINT "fk_CELDA_has_VEHICULO_VEHICULO1" FOREIGN KEY ("VEHICULO_id") REFERENCES "VEHICULO" ("id")
);

--
-- Data for table "HISTORIAL_PARQUEO"
--

INSERT INTO "HISTORIAL_PARQUEO" ("CELDA_id", "VEHICULO_id", "fecha_hora") VALUES
(1, 1, '2025-04-06 19:22:53'),
(2, 2, '2025-04-06 19:22:53'),
(3, 3, '2025-04-06 19:22:53'),
(4, 4, '2025-04-06 19:22:53'),
(5, 5, '2025-04-06 19:22:53'),
(6, 6, '2025-04-06 19:22:53'),
(7, 7, '2025-04-06 19:22:53'),
(8, 8, '2025-04-06 19:22:53'),
(9, 9, '2025-04-06 19:22:53'),
(10, 10, '2025-04-06 19:22:53');

-- --------------------------------------------------------

--
-- Table structure for table "INCIDENCIA"
--

CREATE TABLE "INCIDENCIA" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(45) DEFAULT NULL
);

--
-- Data for table "INCIDENCIA"
--

INSERT INTO "INCIDENCIA" ("nombre") VALUES
('Robo de vehiculo'),
('Robo de accesorios'),
('Robo de llaves'),
('Robo de documentos'),
('Robo de objetos personales'),
('Robo de dinero'),
('Robo de celular'),
('Robo de computador'),
('Robo de maletín'),
('choque');

-- --------------------------------------------------------

--
-- Table structure for table "PICO_PLACA"
--

CREATE TABLE "PICO_PLACA" (
  "id" SERIAL PRIMARY KEY,
  "tipo_vehiculo" VARCHAR(45) DEFAULT NULL,
  "numero" VARCHAR(45) DEFAULT NULL,
  "dia" VARCHAR(45) DEFAULT NULL
);

--
-- Data for table "PICO_PLACA"
--

INSERT INTO "PICO_PLACA" ("tipo_vehiculo", "numero", "dia") VALUES
('Carro', '1', 'Lunes'),
('Carro', '2', 'Lunes'),
('Carro', '3', 'Martes'),
('Carro', '4', 'Martes'),
('Carro', '5', 'Miercoles'),
('Carro', '6', 'Miercoles'),
('Carro', '7', 'Jueves'),
('Carro', '8', 'Jueves'),
('Carro', '9', 'Viernes'),
('Carro', '0', 'Viernes');

-- --------------------------------------------------------

--
-- Table structure for table "REPORTE_INCIDENCIA"
--

CREATE TABLE "REPORTE_INCIDENCIA" (
  "VEHICULO_id" INTEGER NOT NULL,
  "INCIDENCIA_id" INTEGER NOT NULL,
  "fecha_hora" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("VEHICULO_id", "INCIDENCIA_id"),
  CONSTRAINT "fk_VEHICULO_has_INCIDENCIA_INCIDENCIA1" FOREIGN KEY ("INCIDENCIA_id") REFERENCES "INCIDENCIA" ("id"),
  CONSTRAINT "fk_VEHICULO_has_INCIDENCIA_VEHICULO1" FOREIGN KEY ("VEHICULO_id") REFERENCES "VEHICULO" ("id")
);

--
-- Data for table "REPORTE_INCIDENCIA"
--

INSERT INTO "REPORTE_INCIDENCIA" ("VEHICULO_id", "INCIDENCIA_id", "fecha_hora") VALUES
(1, 10, '2025-04-06 19:22:53'),
(2, 1, '2025-04-06 19:22:53'),
(3, 10, '2025-04-06 19:22:53'),
(4, 2, '2025-04-06 19:22:53'),
(5, 10, '2025-04-06 19:22:53'),
(6, 3, '2025-04-06 19:22:53'),
(7, 4, '2025-04-06 19:22:53'),
(8, 5, '2025-04-06 19:22:53'),
(9, 6, '2025-04-06 19:22:53'),
(10, 7, '2025-04-06 19:22:53');

-- Create indexes for better performance
CREATE INDEX "idx_usuario_documento" ON "USUARIO" ("numero_documento");
CREATE INDEX "idx_vehiculo_placa" ON "VEHICULO" ("placa");
CREATE INDEX "idx_acceso_fecha" ON "ACCESO_SALIDAS" ("fecha_hora");
CREATE INDEX "idx_historial_fecha" ON "HISTORIAL_PARQUEO" ("fecha_hora");

-- Reset sequences to match the inserted data
SELECT setval('"PERFIL_USUARIO_id_seq"', (SELECT MAX("id") FROM "PERFIL_USUARIO"));
SELECT setval('"USUARIO_id_usuario_seq"', (SELECT MAX("id_usuario") FROM "USUARIO"));
SELECT setval('"VEHICULO_id_seq"', (SELECT MAX("id") FROM "VEHICULO"));
SELECT setval('"ACCESO_SALIDAS_id_seq"', (SELECT MAX("id") FROM "ACCESO_SALIDAS"));
SELECT setval('"CELDA_id_seq"', (SELECT MAX("id") FROM "CELDA"));
SELECT setval('"INCIDENCIA_id_seq"', (SELECT MAX("id") FROM "INCIDENCIA"));
SELECT setval('"PICO_PLACA_id_seq"', (SELECT MAX("id") FROM "PICO_PLACA"));

-- End of script
