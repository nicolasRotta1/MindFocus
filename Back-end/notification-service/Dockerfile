# Multi-stage build para otimizar tamanho da imagem
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar arquivos de configuração do Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Baixar dependências (cache layer)
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação
RUN ./mvnw clean package -DskipTests

# Stage final - imagem runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Instalar wget para health checks
RUN apk add --no-cache wget

# Criar usuário não-root para segurança
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Expor porta
EXPOSE 8090

# Health check (requer Spring Boot Actuator ou endpoint /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8090/actuator/health 2>/dev/null || wget --no-verbose --tries=1 --spider http://localhost:8090/health 2>/dev/null || exit 1

# Executar aplicação com profile docker
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]

