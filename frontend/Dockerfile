# ---- STAGE 1: build (Vite) ----
FROM node:20-alpine AS build
WORKDIR /app

# cache migliore
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# sorgenti
COPY . .

# variabili per Vite (devono iniziare con VITE_)
ARG VITE_API_BASE_URL=/
ARG VITE_AUTH_SERVICE_URL=/api/auth
ARG VITE_PATIENT_SERVICE_URL=/api/pazienti
ARG VITE_FOOD_SERVICE_URL=/api/foods
ARG VITE_DIET_SERVICE_URL=/api/diet-plans
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_AUTH_SERVICE_URL=${VITE_AUTH_SERVICE_URL} \
    VITE_PATIENT_SERVICE_URL=${VITE_PATIENT_SERVICE_URL} \
    VITE_FOOD_SERVICE_URL=${VITE_FOOD_SERVICE_URL} \
    VITE_DIET_SERVICE_URL=${VITE_DIET_SERVICE_URL}

# build produzione => dist/
RUN npm run build

# ---- STAGE 2: runtime (nginx) ----
FROM nginx:1.27-alpine
# usa il tuo nginx.conf (quello con i blocchi /api/…)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# ATTENZIONE: Vite produce dist/
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx","-g","daemon off;"]