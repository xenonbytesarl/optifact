# Frontend Dockerfile - Angular 20 with SSR (client + server) and Nginx

# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy sources and build (browser + server bundles)
COPY frontend/. ./
# Build browser and server bundles for SSR
RUN npx ng build && npx ng run frontend:server

# ---------- SSR runtime (Node) ----------
FROM node:20-alpine AS ssr
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Copy server and browser artifacts
COPY --from=build /app/dist/frontend/server ./dist/server
COPY --from=build /app/dist/frontend/browser ./dist/browser

# Expose SSR port and run server
EXPOSE 4000
CMD ["node", "dist/server/server.mjs"]

# ---------- Web runtime (Nginx) ----------
FROM nginx:1.27-alpine AS web

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy browser build artifacts for static serving
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
