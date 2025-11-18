# 🎨 Front-end - MindFocus

Interface React do projeto MindFocus para gerenciamento de hábitos.

---

## 🛠️ Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Nginx** - Servidor web para produção (Docker)

---

## 📁 Estrutura

```
Front-end/
├── src/
│   ├── App.tsx          # Componente principal
│   ├── App.css          # Estilos do App
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais
├── public/              # Arquivos estáticos
├── nginx.conf          # Configuração Nginx para SPA
├── Dockerfile          # Containerização
└── package.json        # Dependências
```

---

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Docker

```bash
cd infra
docker-compose up -d frontend
```

Acesse: http://localhost:3000

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do Front-end:

```env
VITE_API_URL=http://localhost:8080
```

### Nginx (Produção)

O `nginx.conf` está configurado para:
- ✅ SPA routing (todas as rotas vão para `index.html`)
- ✅ Cache de assets estáticos
- ✅ Gzip compression
- ✅ Headers de segurança

---

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint

---

## 🌐 Integração com Back-end

O front-end consome a API do `habito-service` na porta **8080**.

### Endpoints Principais

- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `GET /api/habitos` - Listar hábitos
- `POST /api/habitos` - Criar hábito
- `PUT /api/habitos/{id}` - Atualizar hábito
- `DELETE /api/habitos/{id}` - Deletar hábito

---

## 🐳 Docker

O front-end é containerizado usando:
- **Multi-stage build** (Node.js para build + Nginx para servir)
- **Nginx Alpine** (imagem leve)
- **Health check** configurado

---

## 📝 Notas

- Interface responsiva
- SPA (Single Page Application)
- Configurado para produção com Nginx
- Health check endpoint: `/health`

---

**Desenvolvido para o projeto MindFocus** 🚀
