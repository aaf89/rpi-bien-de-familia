-- Script de carga inicial para RPI - Bien de Familia
-- Ejecutado automáticamente por Spring Boot

-- 1) Renombrar la tabla rota
ALTER TABLE personas_inmuebles RENAME TO personas_inmuebles_old;

-- 2) Crear la tabla nueva, BIEN definida
CREATE TABLE personas_inmuebles (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    persona_id   BIGINT  NOT NULL,
    inmueble_id  BIGINT  NOT NULL,
    numerador    INTEGER NOT NULL,
    denominador  INTEGER NOT NULL
);

-- 3) (Opcional) copiar los datos viejos si querés conservarlos
INSERT INTO personas_inmuebles (persona_id, inmueble_id, numerador, denominador)
SELECT persona_id, inmueble_id, numerador, denominador
FROM personas_inmuebles_old;

-- 4) Borrar la tabla vieja
DROP TABLE personas_inmuebles_old;

INSERT INTO departamentos (id, codigo, descripcion) VALUES (1, '58035', 'Confluencia');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (2, '58999', 'Sin declarar');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (3, '58998', 'Indeterminado');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (4, '58007', 'Aluminé');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (5, '58014', 'Añelo');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (6, '58021', 'Catán Lil');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (7, '58042', 'Chos Malal');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (8, '58028', 'Collón Curá');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (9, '58049', 'Huiliches');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (10, '58056', 'Lacar');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (11, '58063', 'Loncopué');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (12, '58070', 'Los Lagos');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (13, '58077', 'Minas');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (14, '58084', 'Ñorquín');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (15, '58091', 'Pehuenches');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (16, '58098', 'Picún Leufú');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (17, '58105', 'Picunches');
INSERT INTO departamentos (id, codigo, descripcion) VALUES (18, '58112', 'Zapala');

insert into ciudades (id, id_departamento, codigo, descripcion) values(1, 1, '1', 'Neuquén'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(2, 1, '2', 'Centenario'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(3, 1, '3', 'Plottier'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(4, 1, '4', 'Vista Alegre'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(5, 1, '5', 'Senillosa'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(6, 1, '6', 'Sauzal Bonito'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(7, 1, '7', 'Cutral-Co'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(8, 1, '8', 'Plaza Huincul'); 
insert into ciudades (id, id_departamento, codigo, descripcion) values(9, 1, '9', 'Villa El Chocón');

insert into actos_registrales(id, descripcion) values (1, 'Bien de Familia');
insert into actos_registrales(id, descripcion) values (2, 'Hipoteca');

insert into tipos_participaciones(id, descripcion) values (1, 'Titular');
insert into tipos_participaciones(id, descripcion) values (2, 'Co-Titular');
insert into tipos_participaciones(id, descripcion) values (3, 'Co-Deudor');

INSERT INTO personas (id, cuit, apellido, nombre) VALUES (1, '20-12345678-3', 'González', 'María');
INSERT INTO personas (id, cuit, apellido, nombre) VALUES (2, '27-20456789-5', 'Pérez', 'Julián');
INSERT INTO personas (id, cuit, apellido, nombre) VALUES (3, '23-33445566-9', 'Rojas', 'Ana');
INSERT INTO personas (id, cuit, apellido, nombre) VALUES (4, '26-28990123-7', 'Méndez', 'Carlos');
INSERT INTO personas (id, cuit, apellido, nombre) VALUES (5, '25-17889900-2', 'Salinas', 'Lucía');


INSERT INTO inmuebles (id, matricula, nomenclatura_catastral, id_ciudad)
VALUES (1, 'MC-001', '5803-1234-5678-9012-3456', 1); 
INSERT INTO inmuebles (id, matricula, nomenclatura_catastral, id_ciudad)
VALUES (2, 'MC-002', '5807-9876-5432-1098-7654', 2); 
INSERT INTO inmuebles (id, matricula, nomenclatura_catastral, id_ciudad)
VALUES (3, 'MC-003', '5811-4567-8910-1112-2223', 3); 

