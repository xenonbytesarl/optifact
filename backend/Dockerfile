# Backend Dockerfile - Spring Boot 3.5, Java 21
# Multi-stage: build with Maven, run on JRE image

# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first
COPY backend/pom.xml ./pom.xml
RUN mvn -B -q -e -DskipTests dependency:go-offline

# Copy sources
COPY backend/. ./
# Copy OpenAPI specs so the generator can access ${project.basedir}/../openapi/** paths
COPY openapi /openapi
# Build
RUN mvn -B -q -DskipTests package

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Runtime user for security
RUN useradd -m -u 10001 appuser

# Environment variables (can be overridden at runtime)
ENV BACKEND_PORT=8080 \
    PROFILE=prod \
    DB_HOST=postgres \
    DB_PORT=5432 \
    DB_NAME=optifact \
    DB_USERNAME=optifact \
    DB_PASSWORD=optifact \
    FRONTEND_HOST=frontend \
    FRONTEND_PORT=80 \
    CLAIM_FILE_ROOT_DIR=/data/claimFiles

# Common Spring envs (optional, in case the app reads standard keys)
ENV SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}" \
    SPRING_DATASOURCE_USERNAME="${DB_USERNAME}" \
    SPRING_DATASOURCE_PASSWORD="${DB_PASSWORD}" \
    SERVER_PORT=${BACKEND_PORT}

# Copy built jar
COPY --from=build /app/target/*.jar /app/app.jar

# Create data directory for claim files
RUN mkdir -p ${CLAIM_FILE_ROOT_DIR} && chown -R appuser:appuser ${CLAIM_FILE_ROOT_DIR}

EXPOSE 8080
USER appuser

ENTRYPOINT ["sh", "-c", "java -Dserver.port=$BACKEND_PORT -jar /app/app.jar --spring.profiles.active=$PROFILE"]
