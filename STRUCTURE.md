# 📁 Estrutura Otimizada do Projeto App-Loja

## Visão Geral

Este documento descreve a estrutura do projeto após otimização e limpeza.

## Estrutura Raiz

```
app-loja/
├── backend/                       # 🖥️ Servidor Node.js + Express
├── front-end/                     # 🌐 Aplicação Web React + Vite
├── app-loja-mobile/              # 📱 Aplicativo Mobile com Expo
├── App-loja.code-workspace       # Workspace do VS Code
├── package.json                  # Scripts raiz
├── README.md                      # Guia principal
├── STRUCTURE.md                  # Este arquivo
└── .gitignore                    # Configuração Git
```

## 🖥️ Backend (`/backend`)

Servidor Express para gerenciar produtos, clientes e pedidos.

```
backend/
├── server.js                     # Arquivo principal do servidor
├── package.json                  # Dependências (Express, CORS)
├── dados/
│   └── db.json                   # Banco de dados JSON
├── limparBanco.js               # Script para limpar dados
├── padronizar_db.js             # Script para padronizar DB
└── node_modules/                # Dependências instaladas
```

### Dependências do Backend
- **express** ^5.1.0 - Framework web
- **cors** ^2.8.5 - Compartilhamento de recursos entre origens
- **nodemon** ^3.1.10 (dev) - Recarga automática em desenvolvimento

### Rotas Principais
```
POST   /login                 - Autenticar admin
GET    /estoque              - Listar produtos
POST   /estoque              - Criar produto
PUT    /estoque/:id          - Atualizar produto
PATCH  /estoque/:id          - Atualizar estoque
DELETE /estoque/:id          - Remover produto
GET    /clientes             - Listar clientes
POST   /clientes             - Criar cliente
GET    /pedidos              - Listar pedidos
POST   /pedidos              - Criar pedido
```

## 🌐 Frontend (`/front-end`)

Aplicação React web usando Vite para build rápido.

```
front-end/
├── src/
│   ├── App.jsx                   # Componente raiz com Router
│   ├── main.jsx                  # Entry point
│   ├── App.css                   # Estilos globais
│   ├── firebase.js               # Configuração Firebase
│   ├── components/
│   │   ├── login/
│   │   │   ├── LoginForm.jsx     # Formulário de login
│   │   │   ├── LoginForm.css
│   │   │   └── assets/
│   │   │       └── logo.png
│   │   └── loja/
│   │       ├── Dashboard.jsx     # Painel de controle
│   │       ├── AddProdutoDB.jsx  # Adicionar produto
│   │       ├── EditProdutosPage.jsx # Editar produtos
│   │       ├── ProdutosDB.jsx    # Listar produtos
│   │       ├── LoginADM.jsx      # Login admin
│   │       ├── CadastroCliente.jsx # Cadastro cliente
│   │       ├── ListaClientes.jsx # Listar clientes
│   │       ├── AreaVendas.jsx    # Área de vendas/reembolso
│   │       ├── Vendas.jsx        # Página de vendas
│   │       ├── HistoricoVendas.jsx # Histórico
│   │       └── *.css             # Estilos específicos
│   └── index.css                 # Estilos base
├── public/                       # Arquivos estáticos
├── .env.example                  # Exemplo de variáveis de ambiente
├── .env.local                    # Variáveis de ambiente (não versionado)
├── index.html                    # HTML principal
├── vite.config.js               # Configuração Vite
├── package.json                 # Dependências React
└── node_modules/                # Dependências instaladas
```

### Dependências do Frontend
- **react** ^19.1.1 - Framework UI
- **react-dom** ^19.1.1 - Renderização DOM
- **react-router-dom** ^7.8.2 - Roteamento
- **firebase** ^12.1.0 - Autenticação e serviços
- **lucide-react** ^0.542.0 - Ícones SVG
- **recharts** ^3.8.1 - Gráficos (opcional)

### Rotas da Aplicação
```
/login                  - Login de usuário
/login-admin           - Login de administrador
/admin                 - Dashboard administrativo
/formproduto           - Adicionar produto
/editar-produtos       - Editar produtos
/estoque               - Listar produtos/estoque
/cadastro-cliente      - Cadastrar cliente
/clientes              - Listar clientes
/vendas                - Página de vendas
/reembolso             - Processamento de reembolsos
/historico-vendas      - Histórico de vendas
```

## 📱 Mobile (`/app-loja-mobile`)

Aplicativo React Native com Expo para iOS e Android.

```
app-loja-mobile/
├── src/
│   ├── app/
│   │   ├── index.tsx             # Tela inicial
│   │   ├── admin.tsx             # Área administrativa
│   │   ├── dashboard.tsx         # Dashboard
│   │   └── _layout.tsx           # Layout global
│   ├── components/
│   │   ├── animated-icon.tsx
│   │   ├── app-tabs.tsx          # Abas da aplicação
│   │   ├── themed-text.tsx
│   │   ├── themed-view.tsx
│   │   ├── ui/
│   │   │   └── collapsible.tsx
│   │   └── *.css / *.tsx
│   ├── constants/
│   │   └── theme.ts              # Configurações de tema
│   ├── hooks/
│   │   ├── use-color-scheme.ts
│   │   └── use-theme.ts
│   ├── global.css                # Estilos globais
│   └── assets/
│       ├── images/
│       │   └── tabIcons/
│       └── expo.icon/
├── public/                       # Arquivos estáticos
├── app.json                      # Configuração Expo
├── expo-env.d.ts                # Tipos TypeScript
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências
└── node_modules/                # Dependências instaladas
```

### Dependências do Mobile
- **expo** ~57.0.13 - Framework React Native
- **react** 19.2.3 - Framework UI
- **react-native** 0.86.2 - Framework nativo
- **expo-router** ~57.0.13 - Roteamento
- **axios** ^1.19.0 - Cliente HTTP
- **react-native-reanimated** 4.5.1 - Animações

## 🔧 Remoções Realizadas

Na otimização, os seguintes itens foram removidos:

### Duplicação
- ❌ Removido: `Sistema/app-server/app-loja-page/` (template vazio do Vite)

### Dependências Não Utilizadas (Frontend)
- ❌ ESLint e plugins (dev - não utilizado)
- ❌ Vitest (test - sem testes implementados)
- ❌ Testing Library (sem testes)
- ❌ jsdom (sem testes)

### Dependências Não Utilizadas (Mobile)
- ❌ `@expo/ui` (UI estendida não usada)
- ❌ `expo-glass-effect` (efeito não implementado)
- ❌ `expo-image` (não utilizado)
- ❌ `react-native-worklets` (não utilizado)
- ❌ Script `reset-project` (não necessário)
- ❌ Script `lint` (sem ESLint)

### Configurações Desnecessárias (Backend)
- ❌ Removido: configurações React/ESLint (copiadas por engano)
- ❌ Removido: configuração Expo (não é projeto mobile)
- ❌ Removido: browserslist (backend não é web)

## 📊 Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Pastas principais | 4 (duplicação) | 3 (consolidado) |
| Package.json do frontend | 34 linhas | 20 linhas |
| Package.json do backend | 50+ linhas | 17 linhas |
| Package.json do mobile | 36 linhas | 25 linhas |
| Dependências desnecessárias | ~15 | 0 |
| Documentação | Básica | Completa |

## 🚀 Como Usar

### Instalar tudo
```bash
npm run install:all
```

### Desenvolvimento (3 terminais)
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend

# Terminal 3
npm run dev:mobile
```

### Limpeza
```bash
npm run clean
```

## 📝 Notas Importantes

1. **Firebase**: Configure `.env.local` com suas credenciais
2. **Backend**: Mude as credenciais padrão em produção
3. **Database**: Use PostgreSQL/MongoDB para produção
4. **Mobile**: Precisa do Expo Go instalado no telefone para testes

## ✅ Checklist de Limpeza

- ✅ Removida duplicação de código
- ✅ Limpas dependências desnecessárias
- ✅ Criado `.env.example`
- ✅ Criado `.gitignore`
- ✅ Atualizado README.md
- ✅ Documentada estrutura (este arquivo)
- ✅ Adicionados scripts raiz úteis
- ✅ Consolidado workspace

---

**Versão**: 1.0.0 (Otimizado)
**Data**: 16/08/2026
