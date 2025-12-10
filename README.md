RPI – Sistema de Gestión de Bien de Familia
🏛️ Descripción del Proyecto
El sistema RPI – Gestión de Bien de Familia es una aplicación full-stack desarrollada como proyecto integrador para el Registro de la Propiedad Inmueble (Neuquén).

Permite la administración completa de:
Personas
Inmuebles
Titularidades (persona–inmueble)
Actos registrales (p. ej., Bien de Familia)
Estadísticas por año y departamento
Incluye validaciones de negocio, numerador/denominador para titularidades, historial de actos y manejo de relaciones complejas (acto–inmueble–persona).

Tecnologías Utilizadas
Backend
Java 21
Spring Boot 4 (Web MVC, JPA, Validation)
Hibernate ORM
SQLite (mediante JDBC + Hibernate Community Dialects)
Maven
Lombok

Frontend
React 19
Vite
TypeScript
Ant Design

Bonus
Docker (Dockerfile + docker-compose)

🚀 Cómo Ejecutar el Proyecto
A continuación se presentan tres formas válidas de ejecución:
vía Maven + Spring Boot
vía JAR ejecutable
vía Docker 

0. Descargar el proyecto (clonar el repositorio)
Antes de ejecutar la aplicación, clonar el repositorio:
git clone https://github.com/aaf89/rpi-bien-de-familia.git
cd rpi-bien-de-familia

1. Ejecución del Backend
Opción A: usando Maven
Requisitos:
Maven instalado
JDK 21 instalado

En la raíz del proyecto:
mvn clean package
mvn spring-boot:run
El backend quedará disponible en:
http://localhost:8080

Opción B: ejecutando el JAR
Después de compilar el proyecto:
mvn clean package
Esto genera:
target\rpi_bien_de_familia-0.0.1-SNAPSHOT.jar
Para ejecutarlo:
java -jar target\rpi_bien_de_familia-0.0.1-SNAPSHOT.jar

2. Ejecución del Frontend
En la carpeta frontend/:
cd frontend
npm install
npm run dev
Aplicación disponible en:
 http://localhost:5173

3. Ejecución con Docker 
⚠️ Requisito: para usar esta opción se debe tener Docker instalado.
En la raíz del proyecto:
docker compose up --build
Esto levanta:
Backend en http://localhost:8080
Frontend en http://localhost:5173
Base SQLite embebida dentro del contenedor


Estructura del Proyecto
/rpi_bien_de_familia
 ├── src/main/java/com/rpi_bien_de_familia
 │    ├── Controller/
 │    ├── Service/
 │    ├── Repository/
 │    ├── Entity/
 │    ├── Dto/
 │    ├── Exception/
 │    └── Config/
 ├── src/main/resources
 │    ├── application.properties
 │    └── data.sql
 ├── frontend/
 ├── target/
 ├── Dockerfile
 ├── docker-compose.yml
 └── README.md

Datos Iniciales (data.sql)
El sistema utiliza SQLite, embebida localmente, sin necesidad de instalar motor externo.
Incluye:
✔ Departamentos
✔ Ciudades
✔ Actos registrales
✔ Tipos de participación
✔ Personas de ejemplo
✔ Inmuebles de ejemplo
✔ Titularidades base

❌ No contiene datos de:
actos_inmuebles
actos_inmuebles_personas
Estos deben generarse mediante la aplicación.

Características Destacadas
Validaciones de negocio

Personas
El CUIT/CUIL debe respetar un formato válido.
No se permiten personas con CUIT/CUIL duplicado.

Inmuebles
La matrícula del inmueble es única en el sistema.
La nomenclatura es única y debe respetar un formato válido.
Para constituir un Bien de Familia, el inmueble debe tener al menos un titular asociado.
Titularidades (personas_inmuebles)
Las personas vinculadas a un inmueble no pueden repetirse (no se duplica la misma persona como titular del mismo inmueble).
Control de numerador/denominador para las titularidades: la suma de las partes no puede superar la unidad (1).

Actos registrales – Bien de Familia
Una persona no puede estar asociada a más de un Bien de Familia activo simultáneamente.
Las personas involucradas en el acto deben ser titulares del inmueble.
En el alta de un Bien de Familia se ejecutan las validaciones de unicidad y titulares; en la edición no se vuelven a disparar las mismas validaciones de alta.

📊 Estadísticas
Estadísticas por año/departamento.

🖥️ Interfaz
Diseño limpio con Ant Design.
Modales de alta/edición.
Tablas con botones de acceso directo a Titulares y Bien de Familia.

Licencia
Proyecto académico / institucional sin licencia pública.

Autoría
Desarrollado por Ayelén Figueroa – 2025
Proyecto final para evaluación técnica del RPI.
