# frontend/Dockerfile
# Multi-stage build per ottimizzare le dimensioni dell'immagine

# ==========================================
# Stage 1: Build dell'applicazione
# ==========================================
FROM node:18-alpine AS builder

LABEL maintainer="Francesco - NutriHouse Team"
LABEL description="Frontend Build Stage"

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione delle dipendenze
COPY package.json package-lock.json ./

# Installa le dipendenze
RUN npm ci --only=production --silent

# Copia tutto il codice sorgente
COPY . .

# Argomenti per configurazione build-time
ARG REACT_APP_API_BASE_URL=http://localhost
ARG REACT_APP_AUTH_SERVICE_URL=http://localhost/api/auth
ARG REACT_APP_PATIENT_SERVICE_URL=http://localhost/api/pazienti
ARG REACT_APP_FOOD_SERVICE_URL=http://localhost/api/foods
ARG REACT_APP_DIET_SERVICE_URL=http://localhost/api/diet-plans

# Imposta le variabili d'ambiente per il build
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_AUTH_SERVICE_URL=$REACT_APP_AUTH_SERVICE_URL
ENV REACT_APP_PATIENT_SERVICE_URL=$REACT_APP_PATIENT_SERVICE_URL
ENV REACT_APP_FOOD_SERVICE_URL=$REACT_APP_FOOD_SERVICE_URL
ENV REACT_APP_DIET_SERVICE_URL=$REACT_APP_DIET_SERVICE_URL

# Build dell'applicazione per produzione
RUN npm run build

# ==========================================
# Stage 2: Nginx per servire l'app
# ==========================================
FROM nginx:alpine AS production

LABEL maintainer="Francesco - NutriHouse Team"
LABEL description="NutriHouse Frontend - Production"

# Installa curl per health checks
RUN apk add --no-cache curl

# Rimuovi la configurazione di default di nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia la configurazione nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/

# Copia i file buildati dal stage precedente
COPY --from=builder /app/build /usr/share/nginx/html

# Copia script di avvio personalizzato (opzionale)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Crea utente non-root per sicurezza
RUN addgroup -g 101 -S nginx && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Imposta ownership dei file
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /etc/nginx

# Espone la porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Usa utente non-root
USER nginx

# Script di avvio
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]