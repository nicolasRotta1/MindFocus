# 📌 README — API (Back-end) MindFocus

## 🔗 Base URL

```
http://localhost:8080
```

---

# 🟦 Autenticação (`/api/auth`)

### ▶ Registro

```
POST /api/auth/register
```

**Body**

```json
{
  "nome": "Usuario Teste",
  "email": "teste@exemplo.com",
  "senha": "123456"
}
```

**Response**

```json
{
  "token": "jwt-token...",
  "tipo": "Bearer"
}
```

---

### ▶ Login

```
POST /api/auth/login
```

**Body**

```json
{
  "email": "teste@exemplo.com",
  "senha": "123456"
}
```

**Response**

```json
{
  "token": "jwt-token...",
  "tipo": "Bearer"
}
```

---

### ▶ Logout

```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response**

```json
"Logout realizado com sucesso."
```

---

# 👤 Usuários (`/api/usuarios`)

### ▶ Buscar usuário logado

```
GET /api/usuarios/atual
Authorization: Bearer <token>
```

---

### ▶ Atualizar informações do usuário

```
PUT /api/usuarios/atual
Authorization: Bearer <token>
```

**Body**

```json
{
  "nome": "Novo Nome",
  "email": "email@exemplo.com"
}
```

---

### ▶ Remover usuário

```
DELETE /api/usuarios/atual
Authorization: Bearer <token>
```

---

# 🟩 Hábitos (`/api/habitos`)

### ▶ Criar hábito

```
POST /api/habitos
Authorization: Bearer <token>
```

**Body**

```json
{
  "nome": "Ler livros",
  "descricao": "Ler 30 minutos",
  "categoria": "Estudo"
}
```

---

### ▶ Listar hábitos do usuário

```
GET /api/habitos
Authorization: Bearer <token>
```

---

### ▶ Editar hábito

```
PUT /api/habitos/{id}
Authorization: Bearer <token>
```

**Body**

```json
{
  "nome": "Novo nome",
  "descricao": "Nova descrição",
  "categoria": "Saúde"
}
```

---

### ▶ Deletar hábito

```
DELETE /api/habitos/{id}
Authorization: Bearer <token>
```

---

Perfeito! Agora que você enviou o **código real do controller**, vou corrigir o README da API para refletir exatamente os endpoints reais do sistema.

Aqui está a **seção revisada de Hábitos Concluídos**, em Markdown para colar no GitHub:

---

# 🟨 Hábitos Concluídos (`/api/habitos`)

---

## ✅ Concluir hábito hoje

```
POST /api/habitos/{habitoId}/concluir
Authorization: Bearer <token>
```

**Response**

```json
{
  "mensagem": "Hábito marcado como concluído hoje com sucesso!",
  "conclusaoId": "uuid",
  "habitoId": "uuid",
  "data": "2025-01-20"
}
```

---

## ⏳ Verificar se hábito foi concluído hoje

```
GET /api/habitos/{habitoId}/concluido-hoje
Authorization: Bearer <token>
```

**Response**

```json
{
  "concluidoHoje": true
}
```

---

## 📊 Estatísticas do hábito

```
GET /api/habitos/{habitoId}/stats
Authorization: Bearer <token>
```

**Response (exemplo)**

```json
{
  "totalConclusoes": 42,
  "diasSeguidos": 7,
  "melhorSequencia": 14
}
```
---

## 📆 Histórico de conclusão por período

```
GET /api/habitos/{habitoId}/historico?de=2025-01-01&ate=2025-01-31
Authorization: Bearer <token>
```

**Response**

```json
{
  "habitoId": "uuid-do-habito",
  "periodo": {
    "de": "2025-01-01",
    "ate": "2025-01-31"
  },
  "datasConcluidas": [
    "2025-01-01",
    "2025-01-03",
    "2025-01-04",
    "2025-01-10"
  ]
}
```

---

# 🧠 Dashboard (estatísticas globais)

```
GET /api/habitos/dashboard/overview
Authorization: Bearer <token>
```

**Response**

```json
{
  "totalHabitos": 19,
  "dataConsulta": "2025-01-20"
}
```

# 🔐 Autorização / JWT

Toda requisição autenticada deve enviar:

```
Authorization: Bearer <token>
```

---

# ⚠ Códigos de Resposta

| Código | Descrição                       |
| ------ | ------------------------------- |
| 200    | OK                              |
| 201    | Criado                          |
| 400    | Erro de requisição              |
| 401    | Não autorizado (token inválido) |
| 404    | Não encontrado                  |
| 500    | Erro interno                    |

---

# 🔧 Variáveis de Ambiente (Back-end)

```
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
JWT_SECRET=
JWT_ISSUER=
RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
```

---

# 🐇 Integração com RabbitMQ

Ao concluir um hábito, um evento JSON é enviado:

```json
{
  "idHabito": "uuid",
  "idUsuario": "uuid",
  "dataConclusao": "2025-01-20"
}
```

O `notification-service` recebe esse evento e envia notificações.
