# eureka_server/Dockerfile
FROM openjdk:21-jdk-slim

LABEL maintainer="Francesco - NutriHouse Team"
LABEL description="Eureka Server per service discovery"

# Installa curl per health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crea utente non-root per sicurezza
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Directory di lavoro
WORKDIR /app

# Copia il JAR dell'applicazione
COPY target/eureka_server-0.0.1-SNAPSHOT.jar app.jar

# Cambia ownership dei file
RUN chown -R spring:spring /app

# Utilizza utente non-root
USER spring

# Espone la porta 8761
EXPOSE 8761

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8761/actuator/health || exit 1

# Avvia l'applicazione
ENTRYPOINT ["java", "-jar", "/app/app.jar"]