# ------------ Build stage ------------
FROM maven:3.9-amazoncorretto-21-alpine AS build
WORKDIR /workspace

# Pre-copy pom to leverage cache
COPY backend/pom.xml backend/pom.xml
RUN --mount=type=cache,target=/root/.m2 mvn -f backend/pom.xml -q -DskipTests dependency:go-offline

# Copy sources and build
COPY backend/ backend/
RUN --mount=type=cache,target=/root/.m2 mvn -f backend/pom.xml -q -DskipTests package

# ------------ Runtime stage ------------
FROM amazoncorretto:21-alpine AS runtime
WORKDIR /app

# Copy the built jar
COPY --from=build /workspace/backend/target/*.jar /app/app.jar

# Environment variables used by Spring configuration
ENV BACKEND_PORT=8080 \
    PROFILE=dev \
    DB_HOST=localhost \
    DB_PORT=5432 \
    DB_NAME=optifact_db \
    DB_USERNAME=optifact \
    DB_PASSWORD=optifact2025! \
    FRONTEND_HOST=localhost \
    FRONTEND_PORT=4200 \
    CLAIM_FILE_ROOT_DIR=/data/claims \
    JAVA_OPTS=""

# Expose the app port (can be overridden by BACKEND_PORT)
EXPOSE ${BACKEND_PORT}

# Run the application (ensure env vars are honored as fallbacks too)
CMD java \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -Dspring.profiles.active=${PROFILE} \
    -Dserver.port=${BACKEND_PORT} \
    -Dspring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} \
    -Dspring.datasource.username=${DB_USER} \
    -Dspring.datasource.password=${DB_PASSWORD} \
    -Dveloxia.data.access.adapter=${DATA_ACCESS_ADAPTER} \
    -Dveloxia.host=${VELOXIA_HOST} \
    -Dveloxia.frontend.port=${FRONTEND_PORT} \
    -jar /app/app.jar
