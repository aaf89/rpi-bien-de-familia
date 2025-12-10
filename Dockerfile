# ---------- Etapa 1: build ----------
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copiamos el pom primero para aprovechar cache
COPY pom.xml .

# Descargamos dependencias
RUN mvn dependency:go-offline -B

# Ahora copiamos el resto del código
COPY src ./src

# Construimos el JAR
RUN mvn clean package -DskipTests

# ---------- Etapa 2: runtime ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiamos solo el .jar final desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Exponer puerto del backend
EXPOSE 8080

# SQLite va a quedar afuera, montado como volumen
VOLUME ["/data"]

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
