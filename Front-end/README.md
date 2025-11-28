# MindFocus — Front-end (React + TS + Vite)

Interface web do sistema MindFocus, permitindo que o usuário:

✔ faça login e registro
✔ crie e gerencie hábitos
✔ conclua hábitos diariamente
✔ visualize estatísticas
✔ acompanhe histórico de hábitos
✔ utilize um dashboard de produtividade

---

# 🧪 Tecnologias Utilizadas

* React
* Vite
* React Router
* Axios
* Context API / Hooks
* localStorage para persistência de token

---

# 📦 Instalação e execução local

```bash
cd frontend
npm install
npm run dev
```

Aplicação rodará em:

```
http://localhost:5173
```

---

# 🔧 Configuração de ambiente

No frontend deve existir um arquivo:

```
/src/config/api.js
```

Contendo:

```js
export const API_URL = "http://localhost:8080";
```
---

# 🔐 Autenticação

* login gera um JWT
* token é armazenado em localStorage
* toda requisição autenticada inclui:

```js
Authorization: `Bearer ${token}`
```

---

# 📁 Estrutura de Pastas

```
Front-end/
└── src/
    ├── assets/               # imagens e ativos estáticos
    │   └── react.svg
    ├── components/           # componentes reutilizáveis (cards, layout, forms, etc.)
    │   ├── Benefits/
    │   ├── HabitCard/
    │   ├── Header/
    │   ├── ProgressSection/
    │   ├── SideBar/
    │   ├── StatCard/
    │   └── cadastro.tsx
    ├── config/               # configuração central da API / axios
    │   └── api.ts
    ├── pages/                # páginas/rotas (cada pasta = uma tela)
    │   ├── Cadastro/
    │   │   └── cadastro.tsx
    │   ├── Dashboard/
    │   │   └── dashboard.tsx
    │   ├── LandingPage/
    │   │   └── landingPage.tsx
    │   └── Login/
    │       └── Login.tsx
    ├── routes/               # definição de rotas do app
    │   └── AppRoutes.tsx
    ├── Services/             # chamadas à API (Axios)
    │   ├── Auth.ts
    │   └── HabitsService.ts
    ├── App.tsx
    ├── main.tsx
    ├── Types.tsx
    ├── App.css
    └── index.css
```
---

#  Rotas do Front-end

| Rota           | Descrição          | Requer login |
| -------------- | ------------------ | ------------ |
| `/`            | landing            | ❌           |
| `/login`       | login              | ❌           |
| `/register`    | registrar          | ❌           |
| `/dashboard`   | visualização geral | ✔            |
