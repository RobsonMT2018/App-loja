<img src="https://komarev.com/ghpvc/?username=robsonmt2018&label=PROFILE+VIEWS&color=00D9FF&style=for-the-badge" alt="Profile Views"/><img src="https://img.shields.io/github/followers/robsonmt2018?label=FOLLOWERS&style=for-the-badge&color=0066FF&labelColor=080B18" alt="GitHub Followers"/>
---
# App Loja - Sistema Completo de Gerenciamento

Aplicação completa para gerenciar uma loja de copos personalizados com área de administração, vitrine para clientes e aplicativo mobile (Expo).

### LINK : https://robsonmt2018.github.io/App-loja/
## 📦 Funcionalidades

### Área de Administração
- ✅ Login com e-mail e senha
- ✅ Dashboard de produtos cadastrados
- ✅ Adicionar produto (nome, valor, descrição e imagem)
- ✅ Editar e remover produtos
- ✅ Gestão de clientes
- ✅ Histórico de vendas
- ✅ Controle de estoque

### Área do Cliente
- ✅ Página inicial com vitrine de produtos
- ✅ Detalhes do produto com descrição completa e preço
- ✅ Navegação sem necessidade de login
- ✅ Processamento de pedidos

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| **Frontend Web** | React 19, Vite, React Router, Lucide React, Firebase |
| **Backend** | Node.js, Express 5, CORS |
| **Aplicativo Mobile** | React Native 0.86, Expo 57, Axios |
| **Banco de Dados** | JSON Server / db.json |

## 📁 Estrutura do Projeto (Otimizada)


<img width="1447" height="797" alt="image" align = "center" src="https://github.com/user-attachments/assets/f2fc0415-a4b4-4e00-b8fe-7096928d3aff" />


```
app-loja/
├── backend/                    # Servidor Backend
│   ├── dados/
│   │   └── db.json            # Banco de dados JSON
│   ├── node_modules/
│   ├── package.json
│   ├── server.js              # Servidor principal
│   ├── limparBanco.js         # Limpeza de dados
│   └── padronizar_db.js       # Padronização DB
│
├── front-end/                 # Aplicação Web React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── login/         # Componentes de login
│   │   │   └── loja/          # Componentes principais
│   │   ├── App.jsx
│   │   ├── firebase.js
│   │   ├── main.jsx
│   │   └── main.css
│   ├── node_modules/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local             # Variáveis de ambiente
│
├── app-loja-mobile/           # Aplicação Mobile (Expo)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   └── assets/
│   ├── node_modules/
│   ├── package.json
│   ├── app.json
│   ├── tsconfig.json
│   └── expo-env.d.ts
│
├── App-loja.code-workspace    # Configuração do workspace
├── package.json               # Gerenciador de scripts raiz
└── README.md                  # Este arquivo
```

## 🚀 Guia de Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn instalado
- Conta Firebase configurada (opcional, para autenticação avançada)

### 1️⃣ Instalação de Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../front-end
npm install

# Mobile
cd ../app-loja-mobile
npm install
```

### 2️⃣ Configuração de Variáveis de Ambiente

#### Frontend - Criar arquivo `.env.local`:
```env
VITE_FIREBASE_API_KEY=seu_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_id
VITE_FIREBASE_APP_ID=seu_app_id

# API local durante o desenvolvimento
VITE_API_URL=http://localhost:3000
```

Para publicar o front-end, defina `VITE_API_URL` com uma URL HTTPS acessível
publicamente. O valor é incorporado no build pelo Vite.

### 3️⃣ Execução Local

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Servidor rodando em http://localhost:3000
```

`npm run dev` também pode ser usado quando o executável do `nodemon` estiver
disponível.

**Terminal 2 - Frontend:**
```bash
cd front-end
npm run dev
# Aplicação rodando em http://localhost:5173
```

**Terminal 3 - Mobile (opcional):**
```bash
cd app-loja-mobile
npm start
```

## 📋 Scripts Disponíveis

### Backend
```bash
npm run dev          # Inicia com nodemon (reload automático)
npm start            # Inicia o servidor normalmente
```

### Frontend
```bash
npm run dev          # Inicia servidor de desenvolvimento Vite
npm run build        # Build para produção
npm run preview      # Visualiza build de produção
npm run deploy       # Gera o build e publica na branch gh-pages
```

### Mobile
```bash
npm start            # Inicia Expo
npm run android      # Emulador Android
npm run ios          # Emulador iOS
npm run web          # Versão web
```

## 🌍 Publicação no GitHub Pages

O front-end publicado usa `front-end/src/App.jsx` e está disponível em:

<https://robsonmt2018.github.io/App-loja/>

Para publicar uma nova versão:

```bash
cd front-end
VITE_API_URL=https://sua-api-publica.example.com npm run deploy
```

O comando executa o build e envia `dist/` para a branch `gh-pages`. A API não
pode usar `localhost` em produção: esse endereço aponta para o computador do
visitante. Durante o desenvolvimento local, mantenha `VITE_API_URL` como
`http://localhost:3000`.

## 🔐 Credenciais Padrão

**Admin Login:**
- Email: `meu@dominio.com`
- Senha: `123456`

⚠️ **Alterar em produção!** Edite `backend/server.js`

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Login do administrador |
| GET | `/estoque` | Lista produtos |
| POST | `/estoque` | Adiciona produto |
| PUT | `/estoque/:id` | Atualiza produto |
| PATCH | `/estoque/:id` | Atualiza estoque |
| DELETE | `/estoque/:id` | Remove produto |
| GET | `/clientes` | Lista clientes |
| POST | `/clientes` | Cadastra cliente |
| GET | `/pedidos` | Lista pedidos |
| POST | `/pedidos` | Cria pedido |

## 🧹 Limpeza do Projeto

Remova node_modules em qualquer subdiretório:
```bash
# Windows
Remove-Item -Recurse -Force node_modules

# macOS/Linux
rm -rf node_modules
```

## 📊 Monitoramento e Logs

O backend registra todas as requisições:
```
Tentativa de acesso: GET /estoque
Tentativa de acesso: POST /login
```

## 🐛 Troubleshooting

### "Não consigo acessar o backend do frontend"
- Verifique se o backend está rodando em `http://localhost:3000`
- Confirme se `front-end/.env.local` contém `VITE_API_URL=http://localhost:3000`
- Confira o CORS configurado em `backend/server.js`

### "O login público informa falha de conexão"
- Hospede o backend em uma URL HTTPS pública
- Gere o deploy novamente informando `VITE_API_URL` com essa URL
- Não use `localhost` no build publicado

### "Firebase não funciona"
- Verifique as credenciais no `.env.local`
- Certifique-se de usar `import.meta.env` (Vite) e não `process.env`

### "Erro de porta já em uso"
```bash
# Windows - Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## 📝 Próximas Melhorias

- [ ] Adicionar testes automatizados
- [ ] Implementar autenticação JWT
- [ ] Documentação Swagger/OpenAPI
- [ ] Deploy em produção (Vercel/Heroku)
- [ ] Banco de dados real (MongoDB/PostgreSQL)
- [ ] CI/CD com GitHub Actions

## 📄 Licença

ISC

## 👨‍💻 Autor

Desenvolvido com ❤️ para SENAC-SP

```


## Observações

* Dependências adicionais que podem ser usadas:
  * `react-router-dom` para rotas no frontend.
  * `mongoose` se usar MongoDB.
  * `jsonwebtoken` para autenticação.
  * `firebase` se conectar com Firebase.
  * `vite` para execução do front-end.

* Ajuste os comandos de acordo com a estrutura real das pastas do seu projeto.

```
## 📁Capturas de tela

<div align="center">

# *Login*
  <img width="585" height="745" alt="image" align = "center"  src="https://github.com/user-attachments/assets/bfefd636-d54c-416a-a07b-becf09bff72a" />

---

# *Dashboard do Administrador*
  <img width="1313" height="1403" alt="image" align = "center"  src="https://github.com/user-attachments/assets/e9e7ccee-7a0d-412a-86f1-ce6bd6d63534" />

---

# *Lista de produtos*
  <img width="1289" height="1435" alt="image" align = "center" src="https://github.com/user-attachments/assets/d60b0886-af77-485e-9dcf-a58e913489c6" />

---

# *Cadastrar Produtos*
  <img width="1277" height="1435" alt="image" align = "center" src="https://github.com/user-attachments/assets/0af6284a-ff9c-4e95-9e81-736fcfc764a9" />

---

# *Editar Produtos*
  <img width="1281" height="1431" alt="image" align = "center" src="https://github.com/user-attachments/assets/deb5b53b-d2a4-4a2d-bd99-ccd843ea4f41" />

</div>


## Funcionalidades

* **Área Administrativa**: Login seguro, Dashboard de produtos, CRUD completo (Criar, Ler, Editar, Remover).
* **Área do Cliente**: Vitrine de produtos com visualização detalhada e navegação livre.

***

### O que eu corrigi/melhorei:

1.  **Estrutura de Pastas**: Atualizei o diagrama para refletir a sua estrutura real (`backend/dados/`, `src/components/loja/`, etc.), removendo pastas genéricas que não existem no seu projeto.
2.  **Tecnologias**: Adicionei o **Firebase**, que está presente na sua estrutura, e removi a menção ao `json-server` (já que você está usando uma estrutura de `backend/dados/` personalizada).
3.  **Comandos**: Ajustei os comandos para condizer com os arquivos que você tem (`server.js`).
4.  **Limpeza**: Removi seções de dependências que não são estritamente necessárias agora, mantendo o arquivo focado no que seu projeto realmente utiliza.

Você pode copiar este conteúdo, substituir no seu `README.md` e realizar os *commits*!




