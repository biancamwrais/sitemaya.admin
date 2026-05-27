# 🌐 Clínica RPG - Site Admin

Sistema web de gestão para a Dra. Maya Yamamoto e equipe. Permite gerenciar
pacientes, agenda, biblioteca de exercícios, funcionários e perfil profissional.

## 🛠️ Stack

- **React 18** + **Vite** (dev rápido + build otimizado)
- **Material UI 5** (componentes prontos)
- **React Router 6** (rotas)
- **Axios** (HTTP)
- **Recharts** (gráficos — usado nas próximas partes)

## 🚀 Como rodar

### 1. Pré-requisitos

- **Node.js 18+** instalado
- **Backend Node.js do Maya RPG rodando** em `https://backend-maya-cydf-mayarpg.vercel.app
  (com banco MySQL importado)

### 2. Instalar dependências

```bash
cd site-admin
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://backend-maya-cydf-mayarpg.vercel.app
```

> Se o seu backend estiver em outro endereço, ajuste essa URL.

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O site vai abrir em **http://localhost:5173**

### 5. Login

Use as credenciais de teste:

| Email | Senha | Perfil |
|-------|-------|--------|
| `maya@clinica.com` | `maya123` | PROFISSIONAL |
| `admin@clinica.com` | `admin123` | ADMIN |

⚠️ **Pacientes não conseguem logar aqui** — eles usam o app mobile.

## 📂 Estrutura

```
site-admin/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # Componentes reutilizáveis (Sidebar, Layout, Logo...)
│   ├── contexts/          # AuthContext (sessão do usuário)
│   ├── pages/             # Páginas (Login, Dashboard, Pacientes...)
│   ├── services/          # api.js (cliente axios)
│   ├── theme/             # theme.js (cores e tipografia do MUI)
│   ├── App.jsx            # Rotas
│   ├── main.jsx           # Entry point
│   └── styles.css         # CSS global de reset
├── .env.example
├── package.json
└── vite.config.js
```

## 🎨 Identidade visual

Cores principais (mesmas do app mobile):

- **Ciano** `#3DB5B0` — primary (botões, sidebar selecionada)
- **Coral** `#F08372` — secondary (destaques, botões editar)
- **Azul Escuro** `#01577A` — texto principal e info
- **Marrom** `#81542D` — gradiente da logo
- **Bege** `#F5F1EA` — background da página

## ✅ Status de desenvolvimento

### Parte 1 (atual) ✅
- Setup do projeto Vite + React + MUI
- Tema customizado
- Layout principal (sidebar + área de conteúdo)
- Login conectado ao backend
- Dashboard com cards de métricas + próximas consultas + atividade recente

### Parte 2 (próximo)
- Pacientes (lista + detalhes + exercícios prescritos)
- Biblioteca de Exercícios (CRUD)

### Parte 3
- Calendário (com bloqueio de datas)
- Funcionários
- Perfil Profissional

## 🐛 Problemas comuns

### Erro CORS no navegador
- O backend precisa estar com `cors()` habilitado (já está em `backend/src/server.js`)

### "Network Error" / página em branco
- Verifique se o backend está rodando em `https://backend-maya-cydf-mayarpg.vercel.app`
- Verifique se o `.env` tem `VITE_API_URL` correto

### "Acesso restrito a administradores"
- Você tentou logar com conta de PACIENTE — use `maya@clinica.com`
