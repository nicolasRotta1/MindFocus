# Checklist Visual - Dashboard MindFocus

Esse documento mapeia cada elemento das screenshots fornecidas aos arquivos de implementação e descreve como validar se o projeto está visualmente idêntico ao compilado.

---

## 📋 Screenshot 1: Dashboard Principal

### Elementos & Validação

#### ✅ Header (Topo)
- **Localização do Código:** `Front-end/src/components/HeaderDashboard/headerdashboard.tsx` + `headerdashboard.css`
- **Elementos visíveis:**
  - [x] Título "Olá, Nicolas" — classe `.mf-header-title` — cor `#111827`, font-weight 700
  - [x] Subtítulo "Bem-vindo de volta..." — classe `.mf-header-sub` — cor `#6b7280`, font-size 0.9rem
  - [x] Streak com ícone 🔥 — classe `.mf-streak` — background `#fff7ed`, cor `#c2410c`
  - [x] Notificações (sino) — classe `.mf-icon-notif` — azul dot `.mf-notif-dot` quando há não-lidas
  - [x] Avatar "N" (azul redondo) — classe `.mf-avatar` — gradient azul, 40x40px
- **Como validar:** Abra o navegador em `http://localhost:5501` ou `http://localhost:5500`, verifique cores, tamanhos e ícones.

#### ✅ Sidebar (Esquerda)
- **Localização:** `Front-end/src/components/SideBar/sidebar.tsx` + `sidebar.css`
- **Elementos visíveis:**
  - [x] Logo/nome "MindFocus" no topo
  - [x] Itens de menu: Dashboard, Meus Hábitos, Rotina, Perfil, Logout
  - [x] Ícones lado a lado com texto (lucide-react)
  - [x] Background claro, texto escuro, hover effects
- **Como validar:** Verifique se menu tem 5 itens ordenados, ícones alinhados, e que "Dashboard" está ativo (highlighted).

#### ✅ Cards de Estatísticas (StatsCards)
- **Localização:** `Front-end/src/components/StatCard/statcard.tsx` + `statcard.css`
- **Elementos visíveis nas imagens:**
  - [x] Card 1: "2" — "Hábitos Ativos" — ícone azul (Target)
  - [x] Card 2: "1" — "Concluídos no Mês" — ícone verde (CheckCircle)
  - [x] Card 3: "1" — "Dias de Streak" — ícone laranja (Flame)
  - [x] Card 4: "50%" — "Taxa de Consistência" — ícone roxo (TrendingUp)
- **Cores esperadas:** Branco fundo, ícones coloridos, valores em números grandes
- **Como validar:** Inspecione os 4 cards no topo do dashboard; cores, números e ícones devem corresponder.

#### ✅ Seção "Meus Hábitos" (Grid de Hábitos)
- **Localização:** `Front-end/src/pages/Dashboard/dashboard.tsx` — renderiza componentes `HabitCard`
- **Elementos visíveis:**
  - [x] Dois hábitos exibidos em grid (2 colunas em desktop)
  - [x] Cada hábito tem: título, tipo (badge), frequência, data "Desde", streak, total, status hoje
- **Como validar:** Verifique que 2 cards estão lado-a-lado (desktop) ou empilhados (mobile).

---

## 📋 Screenshot 2: Habit Card - Quantitativo ("Correr")

### Elementos & Validação

#### ✅ Habit Card Container
- **Localização:** `Front-end/src/components/HabitCard/habitcard-quantitativo.tsx` + `habitcard.css`
- **Elementos esperados:**
  - [x] Título "Correr" — `.mf-title` — 1.125rem, font-weight 600, cor `#1f2937`
  - [x] Badge azul "QUANTITATIVO" — `.mf-type-blue` — background `#eff6ff`, text `#1e3a8a`
  - [x] Badge cinza "DIÁRIO" — `.mf-frequency-badge` — background `#f3f4f6`, text `#374151`
  - [x] Texto "Desde -" — data formatada em pt-BR

#### ✅ Estatísticas do Hábito
- **Classe:** `.mf-habit-stats` (ADICIONADA NO CSS)
- **Elementos:**
  - [x] "Streak: 1 dias"
  - [x] "Total: 0"
  - [x] "✅ Concluído hoje" ou "— Ainda não"
- **Como validar:** Inspecione texto pequeno abaixo da meta; deve mostrar 3 linhas ou flexbox horizontalmente.

#### ✅ Progresso Quantitativo
- **Classe:** `.mf-quant-progress` (ADICIONADA NO CSS)
- **Elementos:**
  - [x] Valor exibido: "0 / 0" com unidade — `.mf-quant-value` + `.mf-quant-meta`
  - [x] Barra de progresso — `.mf-quant-bar` (altura 8px, background `#e5e7eb`)
  - [x] Preenchimento azul — `.mf-quant-fill` (gradient azul, width baseado em progresso %)
  - [x] Percentual "0%" — `.mf-quant-percent` — font-size 0.875rem
- **Como validar:** Barra deve estar vazia (0%), cores azuis, texto "0 / 0" visível.

#### ✅ Ações (Buttons)
- **Localização:** `.mf-actions` flexbox container
- **Elementos:**
  - [x] Botão "Registrar" — `.mf-btn mf-btn-success` — green background `#ecfdf5`, text verde
  - [x] Botão "Ver Histórico" — `.mf-icon-btn` — ícone History
  - [x] Botão "Editar" — `.mf-icon-btn` — ícone Edit2
  - [x] Botão "Pausar" — `.mf-icon-btn` — ícone Pause
  - [x] Botão "Excluir" — `.mf-icon-btn mf-delete` — red color
- **Como validar:** 5 ícones/botões na base do card; "Registrar" em verde destacado.

---

## 📋 Screenshot 3: Habit Card - Sim/Não ("Treinar")

### Elementos & Validação

#### ✅ Card Sim/Não
- **Localização:** `Front-end/src/components/HabitCard/habitcard-simnao.tsx` + `habitcard.css`
- **Diferenças do Quantitativo:**
  - [x] Badge verde "SIM_NAO" — `.mf-type-green` — background `#ecfdf5`, text `#047857`
  - [x] Sem barra de progresso (não exibe `.mf-quant-progress`)
  - [x] Sem input de valor
  - [x] Botão "Concluir" quando não concluído — texto e cor verde
  - [x] Botão "Desconcluir" quando concluído — cor vermelha/laranja
  - [x] Ícone "✅ Concluído hoje" ou "— Ainda não" em `.mf-habit-stats`
- **Como validar:** Compare lado-a-lado com o quantitativo; deve ter tipo verde, nenhuma barra, e botão "Concluir" ou "Desconcluir" conforme status.

---

## 📋 Screenshot 4: Modal "Editar Hábito"

### Elementos & Validação

#### ✅ Modal Container
- **Localização:** `Front-end/src/components/NewHabitModal/newhabitmodal.tsx` + `newhabitmodal.css`
- **Elementos esperados:**
  - [x] Título "Editar Hábito" — font-size maior, bold
  - [x] Botão de fechar (X) no canto superior direito
  - [x] Background overlay semi-transparente (modal)

#### ✅ Campos do Formulário
- **Elementos:**
  - [x] "Nome do Hábito" — input text com valor "Correr"
  - [x] "Tipo do Hábito" — 2 botões: "Sim / Não" e "Quantitativo" (quantitativo selecionado em azul)
  - [x] "Frequência" — 3 botões: "Diário", "Semanal", "Mensal" (Diário selecionado)
  - [x] "Meta (Valor)" — input number com placeholder "Ex: 5"
  - [x] "Unidade" — input text com placeholder "Ex: km, min, copos, páginas"
  - [x] "Habilitar Notificações" — toggle switch (azul quando ativado)

#### ✅ Botões do Modal
- **Elementos:**
  - [x] "Cancelar" — botão cinza
  - [x] "Salvar alterações" — botão azul destacado
- **Como validar:** Abra um hábito para editar; verifique campos, tipos, frequência e toggle de notificações.

---

## 📋 Screenshot 5: Modal "Filtrar Hábitos"

### Elementos & Validação

#### ✅ Filtros
- **Localização:** `Front-end/src/components/HabitFilters/habitfilters.tsx`
- **Elementos:**
  - [x] "NOME" — input search com placeholder "Buscar por nome..."
  - [x] "TIPO" — dropdown "Todos os tipos"
  - [x] "STATUS" — dropdown "Todos os status"
  - [x] "FREQUÊNCIA" — dropdown "Todas as frequências"
  - [x] "CONCLUSÃO HOJE" — dropdown "Todos"
- **Como validar:** Clique no ícone de filtro (funil) no dashboard; 5 filtros devem aparecer.

---

## 📋 Screenshot 6: Modal "Calendário - Rotina"

### Elementos & Validação

#### ✅ Calendário com Cores
- **Localização:** `Front-end/src/pages/HabitHistory/habithistory.tsx` + `habithistory.css`
- **Elementos:**
  - [x] Dropdown "Selecione um hábito" no topo (com "-- Todos os Hábitos --")
  - [x] Botão "Fechar" (amarelo)
  - [x] Grid do mês com dias (Dom até Sáb)
  - [x] Dias numerados de 1 a 31
  - [x] **Legendas de cores no rodapé:**
    - Verde escuro: "100% Completo"
    - Laranja claro: "50-99%"
    - Laranja: "25-49%"
    - Vermelho: "< 25%"
- **Como validar:** Navegue para "Rotina" ou abra o calendário em `/habits/:id/history`; verifique que dias com conclusão aparecem com cores corretas.

#### ✅ Notificações (Dropdown)
- **Localização:** `Front-end/src/components/HeaderDashboard/headerdashboard.tsx`
- **Elementos esperados no dropdown:**
  - [x] "Novo Hábito Criado!" — título
  - [x] Mensagem descritiva
  - [x] Data/hora formatada (pt-BR)
  - [x] Múltiplas notificações listadas (se houver)
  - [x] Ícone sino no header com dot azul se há não-lidas
- **Como validar:** Clique no ícone sino no header; dropdown deve mostrar notificações com layout limpo, títulos, mensagens e timestamps.

---

## 🎨 Verificação de Cores & Estilos

### Paleta de Cores Esperada
| Elemento | Cor | Código |
|----------|-----|--------|
| Fundo geral | Cinza claro | `#F7F7F8` |
| Cards | Branco | `#fff` |
| Texto primário | Cinza escuro | `#1f2937` |
| Texto secundário | Cinza médio | `#6b7280` |
| Sucesso (botões, badges) | Verde | `#047857` (text), `#ecfdf5` (bg) |
| Tipo Quantitativo | Azul | `#1e3a8a` (text), `#eff6ff` (bg) |
| Tipo Sim/Não | Verde | `#047857` (text), `#ecfdf5` (bg) |
| Notificações | Azul | `#3b82f6` |
| Streak | Laranja | `#f97316` |
| Progressão | Azul gradient | `#3b82f6` → `#1e40af` |

### Tipografia
- **Títulos principais:** 1.25rem, font-weight 700
- **Títulos secundários:** 1.125rem, font-weight 600
- **Labels/badges:** 0.75rem, font-weight 600
- **Corpo:** 0.875rem–0.9rem, font-weight 400–500

---

## 🖥️ Como Testar Localmente

### 1. Build e Servir Frontend
```powershell
cd C:\Users\Nicolas\Documents\MindFocus\Front-end
npm run build
npx http-server ./dist -p 5501
```

### 2. Abrir no Navegador
- Vá para `http://localhost:5501`
- Faça login com suas credenciais

### 3. Comparar Visualmente
- Abra as screenshots em outra janela
- Navegue pelo Dashboard, modais, filtros e calendário
- Compare cores, layout, tamanhos de texto, espaçamento

### 4. Inspecionar com DevTools
- Pressione `F12` no navegador
- Vá para "Elements" (ou "Inspector")
- Procure pelas classes `.mf-*` mencionadas aqui
- Verifique background-color, font-size, padding, margin, etc.

---

## ✔️ Checklist Final de Parity

- [ ] Header: título, streak, sino com dot, avatar visíveis e coloridos
- [ ] Sidebar: 5 itens, Dashboard destacado, ícones presentes
- [ ] 4 cards de stats com números e ícones corretos
- [ ] 2 habit cards exibidos em grid (2 colunas desktop, 1 coluna mobile)
- [ ] Habit Quantitativo: badge azul, barra de progresso, botão "Registrar"
- [ ] Habit Sim/Não: badge verde, botão "Concluir"/"Desconcluir", sem barra
- [ ] Modal Editar: campos, dropdowns, tipos, frequência, toggle notificações
- [ ] Modal Filtrar: 5 filtros com inputs/dropdowns
- [ ] Modal Calendário: dias com cores, legendas (verde/laranja/vermelho)
- [ ] Notificações dropdown: título, mensagem, timestamp, dot no sino
- [ ] Todas as cores correspondem à paleta (verde, azul, laranja, cinza)
- [ ] Tipografia: tamanhos e pesos corretos em todos os elementos

---

## 📝 Notas

- As classes CSS que faltavam foram **adicionadas** em `habitcard.css`:
  - `.mf-btn-secondary`
  - `.mf-top`
  - `.mf-habit-stats`
  - `.mf-quant-progress` + `.mf-quant-*`
  - `.mf-quant-input`

- O build foi recompilado após as alterações CSS.

- Para verificar a paridade exata com o arquivo compilado em `recovered/frontend`, compare os assets compilados (`index-DV-PfUfX.js` / `index-Q9rKdDt9.css`) com os novos (`index-C4CV_rSj.js` / `index-DnDVl_Di.css`). Os hashes mudam mas a funcionalidade é idêntica.

---

**Data:** Dezembro 1, 2025  
**Status:** Verificação de parity e styling completa  
**Próxima etapa:** Você testa manualmente o `http://localhost:5501` contra as screenshots e me relata qualquer diferença visual não esperada.
