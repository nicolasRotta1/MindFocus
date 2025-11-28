# MindFocus - Sistema de Gerenciamento de Hábitos

## Integrantes do Grupo
- Nicolas Rotta (Front-end, Back-end, Mensageria e Docker)

## Descrição do Sistema
O MindFocus é um aplicativo web para gerenciamento de hábitos diários, projetado para ajudar usuários a construir rotinas consistentes e produtivas. Ele permite criar, rastrear e concluir hábitos, com recursos como streaks (sequências de dias consecutivos). O sistema resolve o problema de falta de motivação e organização em rotinas pessoais, oferecendo notificações para lembretes .

**Público Alvo**: Pessoas interessadas em desenvolvimento pessoal, produtividade e bem-estar, como profissionais ocupados, estudantes ou qualquer um buscando hábitos saudáveis (ex: exercícios, leitura, hidratação).

## Tecnologias Usadas
- **Back-end**: Spring Boot (Java 17), Spring security para segurança, validation para validações, JPA/Hibernate para persistência, RabbitMQ para mensageria assíncrona.
- **Front-end**: React TS (com Vite para build), Axios para chamadas API.
- **Banco de Dados**: MySQL.
- **Mensageria**: RabbitMQ para eventos (produzidos pelo habito-service e consumidos pelo notification-service).
- **Containerização**: Docker e Docker Compose para deploy e ambiente de desenvolvimento.
- **Outros**: JWT para autenticação, Spring Mail para emails, SLF4J para logs.

## Como Rodar o Back-end
O back-end consiste em dois serviços: `habito-service` (gerenciamento de hábitos) e `notification-service` (notificações).

### Pré-requisitos
- Java 17+ (JDK).
- Maven 3.8+.
- MySQL rodando localmente (crie banco `mindfocus`).
- RabbitMQ rodando (use Docker ou instale localmente).

### Passos
1. Clone o repositório: `git clone <repo-url>`.
2. Vá para cada pasta de serviço:
   - Para `habito-service`:
     ```
     cd Back-end/habito-service
     mvn clean install
     mvn spring-boot:run
     ```
   - Para `notification-service`:
     ```
     cd Back-end/notification-service
     mvn clean install
     mvn spring-boot:run
     ```
3. Configure `application.properties` com credenciais de banco, RabbitMQ e email.
4. Acesse: `habito-service` em http://localhost:8080, `notification-service` em http://localhost:8090.

## Como Rodar o Front-end
O front-end é um app React.

### Pré-requisitos
- Node.js 18+ e npm/yarn.

### Passos
1. Vá para a pasta: `cd Front-end`.
2. Instale dependências: `npm install`.
3. Rode o dev server: `npm run dev`).
4. Acesse em http://localhost:5173.
5. Configure o Axios para apontar para o back-end (ex: baseURL = 'http://localhost:8080').

## Execução com Docker / Docker Compose
Para subir o sistema completo de forma integrada, use Docker Compose. Isso inclui banco, RabbitMQ, back-end e front-end.

### Passo 1: acesse a pasta infra usando o comando
```
cd infra
```
### Passo 2: De build e suba os containers com o comando:
```
docker compose up -d --build
```
Isso irá subir:
- PostgreSQL (banco)
- RabbitMQ (mensageria)
- Habito-service (Spring Boot)
- Notification-service (Spring Boot)
- Frontend (React)

### Portas Utilizadas
| Serviço             | Porta Interna | Porta Exposta | Acessível em                          |
|---------------------|---------------|---------------|---------------------------------------|
| PostgreSQL          | 5432          | 5432          | localhost:5432                        |
| RabbitMQ            | 5672 / 15672  | 5672 / 15672  | http://localhost:15672 (UI)           |
| Habito-service      | 8080          | 8080          | http://localhost:8080                 |
| Notification-service| 8090          | 8090          | http://localhost:8090                 |
| Front-end           | 5173          | 5173          | http://localhost:5173                 |

### docker-compose.yml
```yaml
version: "3.9"
services:
  # ============================================
  # Database - PostgreSQL (ajustado para consistência; use MySQL se preferir)
  # ============================================
  postgres:
    image: postgres:16-alpine
    container_name: mindfocus-postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-admin}
      POSTGRES_DB: ${POSTGRES_DB:-mindfocus}
      POSTGRES_USER: ${POSTGRES_USER:-mindfocus_user}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mindfocus-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mindfocus_user -d mindfocus"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ============================================
  # Message Broker - RabbitMQ
  # ============================================
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: mindfocus-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_DEFAULT_USER:-guest}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_DEFAULT_PASS:-guest}
    ports:
      - "5672:5672" # AMQP port
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - mindfocus-network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ============================================
  # Backend - Habito Service
  # ============================================
  habito-service:
    build:
      context: ./Back-end/habito-service
      dockerfile: Dockerfile
    container_name: mindfocus-habito-service
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: ${SPRING_DATASOURCE_URL:-jdbc:postgresql://postgres:5432/mindfocus}
      SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME:-mindfocus_user}
      SPRING_DATASOURCE_PASSWORD: ${SPRING_DATASOURCE_PASSWORD:-admin}
      SPRING_RABBITMQ_HOST: ${SPRING_RABBITMQ_HOST:-rabbitmq}
      SPRING_RABBITMQ_PORT: ${SPRING_RABBITMQ_PORT:-5672}
      SPRING_RABBITMQ_USERNAME: ${SPRING_RABBITMQ_USERNAME:-guest}
      SPRING_RABBITMQ_PASSWORD: ${SPRING_RABBITMQ_PASSWORD:-guest}
      JWT_SECRET: ${JWT_SECRET:-nicolocoloco}
      JWT_ISSUER: ${JWT_ISSUER:-mindfocus-backend}
      JWT_EXPIRATION_HOURS: ${JWT_EXPIRATION_HOURS:-24}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - mindfocus-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # ============================================
  # Backend - Notification Service
  # ============================================
  notification-service:
    build:
      context: ./Back-end/notification-service
      dockerfile: Dockerfile
    container_name: mindfocus-notification-service
    restart: unless-stopped
    environment:
      SPRING_RABBITMQ_HOST: ${SPRING_RABBITMQ_HOST:-rabbitmq}
      SPRING_RABBITMQ_PORT: ${SPRING_RABBITMQ_PORT:-5672}
      SPRING_RABBITMQ_USERNAME: ${SPRING_RABBITMQ_USERNAME:-guest}
      SPRING_RABBITMQ_PASSWORD: ${SPRING_RABBITMQ_PASSWORD:-guest}
      SPRING_MAIL_HOST: ${SPRING_MAIL_HOST:-smtp.gmail.com}
      SPRING_MAIL_PORT: ${SPRING_MAIL_PORT:-587}
      SPRING_MAIL_USERNAME: ${SPRING_MAIL_USERNAME:-}
      SPRING_MAIL_PASSWORD: ${SPRING_MAIL_PASSWORD:-}
    ports:
      - "8090:8090"
    depends_on:
      rabbitmq:
        condition: service_healthy
    networks:
      - mindfocus-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8090/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # ============================================
  # Frontend - React
  # ============================================
  frontend:
    build:
      context: ./Front-end
      dockerfile: Dockerfile
    container_name: mindfocus-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
    networks:
      - mindfocus-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 5s
      retries: 3

# ============================================
# Networks
# ============================================
networks:
  mindfocus-network:
    driver: bridge

# ============================================
# Volumes
# ============================================
volumes:
  postgres_data:
    driver: local
  rabbitmq_data:
    driver: local
```

## Explicação Simples da Mensageria
A mensageria é usada para comunicação assíncrona entre serviços via RabbitMQ.

- **Quem Produz**: O `habito-service` produz eventos (ex: "hábito criado", "hábito concluído") e envia para filas no RabbitMQ.
- **Quem Consome**: O `notification-service` consome esses eventos das filas e envia notificações (ex: email ou push) para o usuário.
