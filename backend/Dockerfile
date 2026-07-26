# Build Stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production JAR (skip unit tests for fast docker build)
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security on Hugging Face
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Hugging Face Spaces exposes port 7860 by default
ENV PORT=7860
ENV SERVER_PORT=7860
EXPOSE 7860

USER appuser

# Run Spring Boot Application
ENTRYPOINT ["java", "-Dserver.port=7860", "-jar", "app.jar"]
