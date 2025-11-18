# 🧠 MindFocus - Sistema de Gerenciamento de Hábitos

Sistema fullstack completo para gerenciamento de hábitos, desenvolvido com Spring Boot, React e RabbitMQ.

---

## 📋 Sobre o Projeto

O MindFocus é um sistema completo para ajudar usuários a gerenciar e acompanhar seus hábitos diários, com notificações automáticas e interface moderna.

---

## 🏗️ Arquitetura

O projeto é composto por:

- **Back-end:** 2 serviços Spring Boot (habito-service e notification-service)
- **Front-end:** React com TypeScript e Vite
- **Banco de Dados:** MySQL
- **Mensageria:** RabbitMQ
- **Infraestrutura:** Docker e Docker Compose

---

## 📁 Estrutura do Projeto

```
MindFocus/
├── Back-end/
│   ├── habito-service/        # API principal (porta 8080)
│   ├── notification-service/  # Serviço de notificações (porta 8090)
│   └── README.md              # Documentação do back-end
├── Front-end/                 # Interface React (porta 3000)
│   └── README.md              # Documentação do front-end
├── infra/                     # Infraestrutura Docker
│   ├── docker-compose.yml     # Orquestração de serviços
│   └── README.md              # Documentação Docker
└── README.md                  # Este arquivo
```

---

## 🚀 Como Executar

### Pré-requisitos

- Docker Desktop instalado e rodando
- Portas disponíveis: 3000, 3306, 5672, 8080, 8090, 15672

### Execução Rápida

```bash
# 1. Entrar na pasta infra
cd infra

# 2. (Opcional) Configurar variáveis de ambiente
cp .env.example .env

# 3. Subir todos os serviços
docker-compose up -d

# 4. Verificar status
docker-compose ps
```

### Acessar os Serviços

- **Frontend:** http://localhost:3000
- **API (Habito Service):** http://localhost:8080
- **Notification Service:** http://localhost:8090
- **RabbitMQ Management:** http://localhost:15672 (guest/guest)
- **MySQL:** localhost:3306 (root/admin)

---

## 📦 Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **Frontend** | 3000 | Interface React |
| **Habito Service** | 8080 | API principal |
| **Notification Service** | 8090 | Serviço de notificações |
| **MySQL** | 3306 | Banco de dados |
| **RabbitMQ** | 5672 | Message broker |
| **RabbitMQ Management** | 15672 | Interface web |

---

## 🛠️ Tecnologias

### Back-end
- Spring Boot 3.5.7
- Spring Security
- Spring Data JPA
- Spring AMQP (RabbitMQ)
- MySQL
- JWT (Auth0)

### Front-end
- React 19
- TypeScript
- Vite
- Nginx (produção)

### Infraestrutura
- Docker
- Docker Compose
- MySQL 8.0
- RabbitMQ 3

---

## 📚 Documentação

- **[Back-end README](Back-end/README.md)** - Documentação completa do back-end
- **[Front-end README](Front-end/README.md)** - Documentação do front-end
- **[Infra README](infra/README.md)** - Guia completo de Docker e infraestrutura

---

## 🔧 Comandos Úteis

### Docker

```bash
# Ver logs
cd infra
docker-compose logs -f

# Parar serviços
docker-compose down

# Reconstruir imagens
docker-compose build
docker-compose up -d
```

---

## ✅ Requisitos Atendidos

### Back-end
- ✅ Spring Boot
- ✅ API REST (GET/POST/PUT/DELETE)
- ✅ Banco relacional (MySQL)
- ✅ Camadas organizadas

### Mensageria
- ✅ RabbitMQ configurado
- ✅ 2 serviços separados
- ✅ Produção e consumo de mensagens
- ✅ Fluxo de negócio real

### Front-end
- ✅ React com TypeScript
- ✅ Consome API do back-end
- ✅ CRUD completo
- ✅ Interface organizada

### Docker
- ✅ Dockerfile para cada serviço
- ✅ docker-compose.yml
- ✅ Containerização completa
- ✅ Documentação

---

## 🎯 Funcionalidades

- ✅ Autenticação e autorização (JWT)
- ✅ CRUD de hábitos
- ✅ Gerenciamento de usuários
- ✅ Notificações automáticas via RabbitMQ
- ✅ Interface moderna e responsiva

---

## 📝 Notas

- Os dados são persistidos em volumes Docker
- Health checks configurados em todos os serviços
- Variáveis de ambiente configuráveis via `.env`
- Spring Boot Actuator para monitoramento

---

## 🚀 Próximos Passos

1. Acessar frontend em http://localhost:3000
2. Testar API em http://localhost:8080
3. Verificar RabbitMQ em http://localhost:15672

---

**Desenvolvido para o Trabalho Final - Projeto Fullstack com Spring + RabbitMQ** 🎓

