# -------- BUILD STAGE --------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app/backend

COPY backend/pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY backend/src ./src
RUN mvn -q -DskipTests clean package

# -------- RUN STAGE --------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Render provides PORT; Spring reads it via server.port property
ENV PORT=8080
ENV JAVA_OPTS=""

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

CMD ["bash", "-c", "java $JAVA_OPTS -jar app.jar"]
