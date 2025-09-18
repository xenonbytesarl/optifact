# Frontend Dockerfile - Angular 20 (SPA only) served by Nginx

# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy sources and build (browser bundle only)
COPY frontend/. ./
RUN npx ng build

# ---------- Web runtime (Nginx) ----------
FROM nginx:1.27-alpine AS web

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy browser build artifacts for static serving
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
