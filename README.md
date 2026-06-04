# 🐦 Growtwitter

> Projeto Full Stack III - Uma rede social estilo Twitter/X desenvolvida com tecnologias modernas

Uma Single Page Application (SPA) completa que replica as principais funcionalidades do Twitter/X, incluindo autenticação JWT, feed de tweets, interações sociais, perfis de usuário e suporte a temas claro/escuro.

---

## 🚀 Tecnologias

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-9.0-007FFF?style=flat&logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?style=flat&logo=redux&logoColor=white)

### Stack Principal

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript 6** - Superset JavaScript com tipagem estática
- **Vite 8** - Build tool e dev server ultrarrápido
- **Material-UI (MUI) 9** - Biblioteca de componentes React
- **Redux Toolkit 2.11** - Gerenciamento de estado global
- **RTK Query** - Data fetching e caching
- **React Router DOM 7** - Roteamento client-side
- **date-fns 4** - Manipulação de datas

---

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Cadastro de novos usuários
- ✅ Login com JWT
- ✅ Persistência de sessão (localStorage)
- ✅ Rotas protegidas e públicas
- ✅ Redirecionamento automático baseado em autenticação

### 📱 Feed de Tweets
- ✅ Aba "Para você" - todos os tweets
- ✅ Aba "Seguindo" - tweets de usuários seguidos
- ✅ Visualização de tweets com respostas (thread visual)
- ✅ Linha conectando tweet pai e respostas
- ✅ Loading skeletons durante carregamento

### 💬 Interações
- ✅ Criar tweets (até 280 caracteres)
- ✅ Responder tweets
- ✅ Curtir/descurtir tweets
- ✅ Contador de likes e respostas em tempo real
- ✅ Modal de criação/resposta de tweets
- ✅ Validação de conteúdo não vazio

### 👤 Perfil de Usuário
- ✅ Visualizar perfil próprio e de outros usuários
- ✅ Abas: Tweets e Respostas
- ✅ Informações: nome, username, data de ingresso
- ✅ Contadores de seguidores e seguindo
- ✅ Seguir/deixar de seguir usuários
- ✅ Modais de lista de seguidores e seguindo

### 🎨 Tema e UI/UX
- ✅ Tema claro e escuro (inspirado no Twitter/X)
- ✅ Persistência de preferência de tema
- ✅ Design responsivo para mobile e desktop
- ✅ Navegação com sidebar e menu inferior
- ✅ Painel "O que está acontecendo" (trending topics)
- ✅ Avatars com iniciais geradas automaticamente
- ✅ Timestamps relativos (ex: "há 2 horas")

### 🔍 Navegação
- ✅ Página Explorar com trending topics
- ✅ Indicação visual de página ativa
- ✅ Navegação por clique nos avatares e usernames

---

## 📁 Estrutura do Projeto

```
growtwitter/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizáveis
│   │   │   ├── AuthInitializer.tsx
│   │   │   ├── CustomAvatar.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── PublicRoute.tsx
│   │   │   ├── RelativeTimestamp.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── layout/          # Layouts da aplicação
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TrendingPanel.tsx
│   │   ├── tweet/           # Componentes de tweet
│   │   │   ├── TweetCard.tsx
│   │   │   ├── TweetDetailModal.tsx
│   │   │   ├── TweetModal.tsx
│   │   │   └── TweetWithReplies.tsx
│   │   └── user/            # Componentes de usuário
│   │       ├── FollowersModal.tsx
│   │       └── FollowingModal.tsx
│   ├── pages/               # Páginas da aplicação
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── Explore/
│   │   │   └── ExplorePage.tsx
│   │   ├── Feed/
│   │   │   └── FeedPage.tsx
│   │   └── Profile/
│   │       └── ProfilePage.tsx
│   ├── store/               # Redux store
│   │   ├── api/
│   │   │   └── apiSlice.ts  # RTK Query endpoints
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── themeSlice.ts
│   │   │   ├── tweetSlice.ts
│   │   │   └── userSlice.ts
│   │   └── index.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useSyncLoggedUser.ts
│   │   └── useTheme.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts
│   │   ├── base.ts
│   │   ├── tweet.ts
│   │   └── user.ts
│   ├── constants/           # Constantes da aplicação
│   │   ├── api.ts
│   │   ├── routes.ts
│   │   └── theme.ts
│   ├── config/              # Configurações
│   │   └── theme.ts
│   ├── services/            # Serviços auxiliares
│   │   ├── apiUtils.ts
│   │   └── errorHandler.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd growtwitter
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Edite o arquivo .env e adicione a URL da API
# VITE_API_BASE_URL=https://api-growtwitter.onrender.com
```

4. **Rode o projeto em modo desenvolvimento:**
```bash
npm run dev
```

5. **Acesse no navegador:**
```
http://localhost:5173
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (Vite)

# Build
npm run build            # Gera build de produção na pasta dist/
npm run preview          # Preview do build de produção

# Linting e Formatação
npm run lint             # Executa ESLint para verificar código
npm run format           # Formata código com Prettier

# Testes
npm run test             # Executa testes com Vitest (se configurado)
```

---

## 🔌 Integração com API

O projeto consome a API do Growtwitter através do Redux Toolkit Query (RTK Query).

### Configuração da API

A URL base da API é configurada através da variável de ambiente:

```env
VITE_API_BASE_URL=
```

### Endpoints Utilizados

#### Autenticação
- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/login` - Login de usuário

#### Tweets
- `GET /tweets/feed` - Lista todos os tweets do feed
- `GET /tweets/:id` - Busca tweet por ID com respostas
- `POST /tweets` - Cria novo tweet
- `POST /tweets/:id/like` - Curtir tweet
- `DELETE /tweets/:id/like` - Descurtir tweet

#### Usuários
- `GET /users/:id` - Busca usuário por ID
- `POST /users/:id/follow` - Seguir usuário
- `DELETE /users/:id/follow` - Deixar de seguir usuário
- `GET /users/:id/followers` - Lista seguidores do usuário
- `GET /users/:id/following` - Lista usuários que o usuário segue

### Autenticação JWT

O token JWT é automaticamente incluído em todas as requisições através de um interceptor configurado no RTK Query:

```typescript
prepareHeaders: (headers, { getState }) => {
  const token = (getState() as RootState).auth.token;
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
}
```

---

## 🎨 Sistema de Temas

O projeto implementa temas claro e escuro inspirados no Twitter/X usando Material-UI.

### Paleta de Cores

**Tema Claro:**
- Background: `#FFFFFF`
- Surface: `#F7F9F9`
- Primary: `#1DA1F2` (Twitter Blue)
- Text: `#0F1419`

**Tema Escuro:**
- Background: `#000000`
- Surface: `#16181C`
- Primary: `#1DA1F2` (Twitter Blue)
- Text: `#E7E9EA`

### Persistência

A preferência de tema é salva no `localStorage` e restaurada automaticamente ao recarregar a página.

---

## 🏗️ Arquitetura

### Gerenciamento de Estado

- **Redux Toolkit** para estado global
- **RTK Query** para cache de dados da API
- **Slices separados** para auth, theme, tweets e users
- **Optimistic updates** para melhor UX (likes, follows)

### Roteamento

```typescript
/ (public)             → Redireciona para /login ou /feed
/login (public)        → Página de login
/register (public)     → Página de cadastro
/feed (protected)      → Feed principal
/explore (protected)   → Página explorar
/profile/:id (protected) → Perfil do usuário
```

### Proteção de Rotas

- **ProtectedRoute**: Requer autenticação (redireciona para /login)
- **PublicRoute**: Apenas para não autenticados (redireciona para /feed)

---

## 🚀 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`:

- HTML, CSS e JavaScript minificados
- Assets otimizados
- Code splitting automático
- Tree shaking aplicado

Para testar o build localmente:

```bash
npm run preview
```

---

## 📝 Convenções de Código

- **TypeScript strict mode** habilitado
- **ESLint** para qualidade de código
- **Prettier** para formatação consistente
- **Imports organizados** com path aliases (`@/`)
- **Componentes funcionais** com hooks
- **Props tipadas** com TypeScript interfaces
- **Nomenclatura em inglês** para código

---

## 📄 Licença

Este projeto foi desenvolvido como parte do curso Full Stack da Growdev.

---

## 👨‍💻 Autor

Desenvolvido por Rafael Schenkel de Souza - Projeto Full Stack III

---

## 🐛 Problemas Conhecidos

- A funcionalidade de "Curtidas" no perfil ainda não está implementada
- A funcionalidade de "Excluir tweets" ainda não está implementada ( Back  | Front)
- Trending topics são estáticos (não vêm da API)

---

## 🔮 Próximas Funcionalidades

- [ ] Excluir tweets
- [ ] Busca de usuários e tweets
- [ ] Edição de perfil
- [ ] Retweets
- [ ] Trending topics dinâmicos
