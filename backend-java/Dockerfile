# Build stage
FROM maven:3.9-eclipse-temurin-17 as build

WORKDIR /app

# Copy pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Run stage
FROM openjdk:21

WORKDIR /app

# Copy JAR file
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Start the application
CMD ["java", "-jar", "app.jar"]