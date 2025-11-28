#  Execução com Docker / Docker Compose

##  Subir todo o sistema com um comando

```
docker-compose up -d
```

Isso irá subir:

✔ PostgreSQL (banco)
✔ Habito-service (Spring Boot)
✔ notification-service(Spring boot)
✔ Frontend (React)

---

# Portas utilizadas

| Serviço             | Porta Interna | Porta Exposta | Acessível em                                     |
| ------------------- | ------------- | ------------- | ------------------------------------------------ |
| PostgreSQL          | 5432          | 5432          | localhost:5432                                   |
| Habito-service      | 8080          | 8080          | [http://localhost:8080](http://localhost:8080)   |
| notification-service| 8090          | 8090          | [http://localhost:8090](http://localhost:8090)   |
| Front-end           | 5173          | 5173          | [http://localhost:5173](http://localhost:5173)   |
| RabbitMQ (opcional) | 5672 / 15672  | 5672 / 15672  | [http://localhost:15672](http://localhost:15672) |

---

# docker-compose.yml 

```yaml
version: "3.9"

services:
  # ============================================
  # Database - MySQL
  # ============================================
  mysql:
    image: mysql:8.0
    container_name: mindfocus-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-admin}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-mindfocus}
      MYSQL_USER: ${MYSQL_USER:-mindfocus_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-mindfocus_pass}
    # Porta comentada - MySQL local pode estar usando 3306
    # Descomente se quiser expor a porta
    # ports:
    #   - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d
    networks:
      - mindfocus-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-padmin"]
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
      - "5672:5672"   # AMQP port
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
      context: ../Back-end/habito-service
      dockerfile: Dockerfile
    container_name: mindfocus-habito-service
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: ${SPRING_DATASOURCE_URL:-jdbc:mysql://mysql:3306/mindfocus?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
      SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME:-root}
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
      mysql:
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
      context: ../Back-end/notification-service
      dockerfile: Dockerfile
    container_name: mindfocus-notification-service
    restart: unless-stopped
    environment:
      SPRING_RABBITMQ_HOST: ${SPRING_RABBITMQ_HOST:-rabbitmq}
      SPRING_RABBITMQ_PORT: ${SPRING_RABBITMQ_PORT:-5672}
      SPRING_RABBITMQ_USERNAME: ${SPRING_RABBITMQ_USERNAME:-guest}
      SPRING_RABBITMQ_PASSWORD: ${SPRING_RABBITMQ_PASSWORD:-guest}
      SPRING_MAIL_HOST: ${SPRING_MAIL_HOST:-}
      SPRING_MAIL_PORT: ${SPRING_MAIL_PORT:-}
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
      context: ../Front-end
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
  mysql_data:
    driver: local
  rabbitmq_data:
    driver: local
```
---

# ✔ Como subir com Docker

### 1) Rodar:

```bash
docker-compose up --build -d
```

---

#  Resultado

✔ Banco sobe primeiro
✔ Backend sobe após banco estar disponível
✔ Frontend sobe após o backend

✔ Habito-service acessível em:

```
http://localhost:8080
```
✔ notification-service acessível em:

```
http://localhost:8090
```

✔ Front acessível em:

```
http://localhost:5173
```

✔ RabbitMQ opcional em:

```
http://localhost:15672
```

---

````
## Subindo com Docker

Para subir o sistema todo:

```bash
docker-compose up -d
````

O Habito-service ficará em: [http://localhost:8080](http://localhost:8080)
O notification-service ficará em: [http://localhost:8090](http://localhost:8090)
O Frontend ficará em: [http://localhost:5173](http://localhost:5173)
O Banco ficará disponível em localhost:5432
RabbitMQ em: [http://localhost:15672](http://localhost:15672)

```

