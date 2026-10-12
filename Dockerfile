# ==============================================================================
# Stage 1: Build React Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Build Spring Boot Backend with Static Assets
# ==============================================================================
FROM maven:3.9.8-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
# Cache Maven dependencies
RUN mvn dependency:go-offline -B || true

COPY backend/src ./src
# Embed built React frontend into Spring Boot's static classpath folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# ==============================================================================
# Stage 3: Lightweight Production JRE Runtime
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as dedicated unprivileged user for security
RUN addgroup -S spendwise && adduser -S spendwise -G spendwise
USER spendwise

COPY --from=backend-builder /app/backend/target/spendwise-backend-1.0.0.jar app.jar

ENV PORT=8085
EXPOSE 8085

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
