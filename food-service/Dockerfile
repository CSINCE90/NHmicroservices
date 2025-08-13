# food-service/Dockerfile
FROM openjdk:21-jdk-slim

LABEL maintainer="Francesco - NutriHouse Team"
LABEL description="Servizio per la gestione degli alimenti"

# Installa curl per health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crea utente non-root per sicurezza
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Directory di lavoro
WORKDIR /app

# Copia il JAR dell'applicazione
COPY target/food-service-0.0.1-SNAPSHOT.jar app.jar

# Cambia ownership dei file
RUN chown -R spring:spring /app

# Utilizza utente non-root
USER spring

# Espone la porta 8083
EXPOSE 8083

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:8083/actuator/health || exit 1

# Variabili d'ambiente per configurazione
ENV SPRING_PROFILES_ACTIVE=docker
ENV EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql-food:3306/fooddb
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Francesco90

# Avvia l'applicazione
ENTRYPOINT ["java", "-jar", "/app/app.jar"]