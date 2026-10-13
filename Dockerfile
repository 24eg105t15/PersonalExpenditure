# ==============================================================================
# Dedicated Java 21 Backend Dockerfile (Optimized for Render 512MB Free Tier)
# ==============================================================================
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Restrict Maven heap during build to stay safely within Render's 512MB RAM limit
ENV MAVEN_OPTS="-Xmx384m -XX:+UseG1GC"

COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B || true

COPY backend/src ./src
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# ==============================================================================
# Lightweight Alpine JRE Runtime
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user
RUN addgroup -S spendwise && adduser -S spendwise -G spendwise
USER spendwise

COPY --from=builder /app/target/spendwise-backend-1.0.0.jar app.jar

ENV PORT=8085
ENV JAVA_OPTS="-Xmx350m -Xms128m -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"
EXPOSE 8085

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT:-8085}"]
