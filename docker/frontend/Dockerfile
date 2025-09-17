# ------------ Build stage ------------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (leverage Docker cache)
COPY frontend/package*.json ./
RUN npm ci

# Copy sources and build (SSR output)
COPY frontend/ ./
RUN npm run build

# ------------ Runtime stage (Node SSR) ------------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /app

# Copy Angular build output (both browser and server)
COPY --from=build /app/dist/frontend /app/dist/frontend

EXPOSE 4000
# Start Angular SSR server
CMD ["node", "/app/dist/frontend/server/server.mjs"]
