# 📚 Back-end - MindFocus

Documentação completa do back-end do projeto MindFocus.

---

## 📁 Estrutura do Projeto

O back-end é composto por **2 serviços Spring Boot**:

### **habito-service** (Porta 8080)

```
com.example.habito_service/
├── config/
│   ├── RabbitConfig.java
│   └── SecurityConfig.java
├── controllers/
│   ├── AuthController.java
│   └── HabitoController.java
├── dto/
│   ├── AuthResponse.java
│   ├── HabitoRequest.java
│   ├── LoginRequest.java
│   └── RegisterRequest.java
├── enums/
│   ├── FrequenciaHabito.java
│   ├── StatusHabito.java
│   └── TipoHabito.java
├── models/
│   ├── Habito.java
│   └── Usuario.java
├── RabbitMQ/
│   └── HabitoProducer.java
├── repositories/
│   ├── HabitoRepository.java
│   └── UsuarioRepository.java
├── security/
│   ├── CustomUserDetailsService.java
│   ├── SecurityFilter.java
│   ├── TokenBlacklistService.java
│   └── TokenService.java
├── services/
│   ├── AuthService.java
│   ├── HabitoService.java
│   └── UsuarioService.java
└── specification/
    └── HabitoSpecification.java
```

### **notification-service** (Porta 8090)

```
com.example.notification_service/
├── config/
│   └── RabbitConfig.java
├── controllers/
│   └── HealthController.java
├── dto/
│   └── HabitoRequest.java
├── RabbitMQ/
│   └── HabitoConsumer.java
├── services/
│   └── NotificationService.java
└── utils/
    └── MailSender.java
```

---

## ✅ Estrutura Padronizada

A estrutura está **100% padronizada** seguindo as convenções Java/Spring Boot:

- ✅ **Nomenclatura consistente** - Todos os pacotes em minúsculo
- ✅ **Separação de camadas** - Controller, Service, Repository, Model
- ✅ **Organização por funcionalidade** - Security, RabbitMQ, Config isolados
- ✅ **DTOs separados** - Objetos de transferência isolados
- ✅ **Enums organizados** - Tipos e status em pacote próprio

### Convenções Seguidas

- ✅ **Minúsculas** - Todos os pacotes em minúsculo
- ✅ **Singular para conceitos** - `dto`, `model`, `enum`
- ✅ **Plural para coleções** - `controllers`, `services`, `repositories`

---

## 🎯 Conformidade com Requisitos do Trabalho

### Back-end

| Requisito | Status | Observação |
|-----------|--------|------------|
| **Spring Boot** | ✅ | Versão 3.5.7 configurada |
| **API REST (GET/POST/PUT/DELETE)** | ✅ | Controllers implementados |
| **Banco relacional (MySQL)** | ✅ | Configurado |
| **Camadas organizadas** | ✅ | Estrutura perfeita |

### Mensageria (RabbitMQ)

| Requisito | Status | Observação |
|-----------|--------|------------|
| **RabbitMQ obrigatório** | ✅ | Dependência adicionada |
| **2 serviços separados** | ✅ | habito-service e notification-service |
| **Produção de mensagens** | ✅ | HabitoProducer implementado |
| **Consumo de mensagens** | ✅ | HabitoConsumer implementado |
| **Fluxo de negócio real** | ✅ | Implementado |

**Fluxo:**
- `habito-service` → produz mensagem quando hábito é criado
- `notification-service` → consome mensagem e envia notificação

---

## 🔒 Segurança

### Implementações

- ✅ **Spring Security** configurado
- ✅ **JWT (JSON Web Tokens)** para autenticação
- ✅ **SecurityFilter** para validação de tokens
- ✅ **CustomUserDetailsService** para autenticação
- ✅ **TokenService** para geração/validação
- ✅ **Endpoints públicos** vs protegidos

### Configurações

- ✅ Endpoints públicos: `/auth/**`
- ✅ Endpoints protegidos: Requerem JWT válido
- ✅ CORS configurado (se necessário)

---

## 🗄️ Banco de Dados

### MySQL

- **Host:** `localhost` (desenvolvimento) / `mysql` (Docker)
- **Porta:** `3306`
- **Database:** `mindfocus`
- **Usuário:** `root`
- **Senha:** `admin` (desenvolvimento)

### Configuração

- ✅ JPA/Hibernate configurado
- ✅ DDL auto: `update` (cria/atualiza tabelas automaticamente)
- ✅ Dialeto: MySQL8Dialect

---

## 🐰 RabbitMQ

### Configuração

- **Host:** `localhost` (desenvolvimento) / `rabbitmq` (Docker)
- **Porta:** `5672`
- **Management UI:** `15672`
- **Usuário:** `guest`
- **Senha:** `guest`

### Fluxo de Mensageria

1. **habito-service** cria um hábito
2. **HabitoProducer** envia mensagem para a exchange `habitoExchange`
3. **notification-service** consome a mensagem da queue `habitoCriadoQueue`
4. **NotificationService** processa e envia notificação

---

## 📦 Dependências Principais

### habito-service

- Spring Boot 3.5.7
- Spring Data JPA
- Spring Security
- Spring AMQP (RabbitMQ)
- MySQL Connector
- JWT (Auth0)
- Spring Boot Actuator

### notification-service

- Spring Boot 3.5.7
- Spring AMQP (RabbitMQ)
- Spring Mail
- Spring Boot Actuator

---

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# habito-service
cd Back-end/habito-service
./mvnw spring-boot:run

# notification-service
cd Back-end/notification-service
./mvnw spring-boot:run
```

### Docker

```bash
cd infra
docker-compose up -d
```

---

## 📝 Profiles

### Desenvolvimento

- `application.properties` - Configurações locais

### Docker

- `application-docker.properties` - Configurações para containers
- Usa variáveis de ambiente do docker-compose

---

## 🔧 Configurações

### application.properties

- Porta do servidor
- Configuração do banco de dados
- Configuração do RabbitMQ
- Configuração JWT
- Logging

### application-docker.properties

- Mesmas configurações, mas usando nomes de serviços Docker
- Variáveis de ambiente suportadas

---

## ✅ Status da Arquitetura

**Estrutura:** ✅ **EXCELENTE**

- ✅ Organização clara e profissional
- ✅ Separação de responsabilidades bem feita
- ✅ Segue padrões Spring Boot
- ✅ Fácil de navegar e entender
- ✅ Escalável e manutenível
- ✅ Conforme requisitos do trabalho

---

**Desenvolvido para o projeto MindFocus** 🚀

