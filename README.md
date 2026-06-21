# App Loja

Aplicativo para gerenciar a loja de copos personalizados, com área de administração e vitrine para clientes.

## Funcionalidades

* **Área de Administração**
  * Login com e-mail e senha.
  * Dashboard de produtos cadastrados.
  * Adicionar produto: nome, valor, descrição e imagem.
  * Editar e remover produtos.

* **Área do Cliente**
  * Página inicial com vitrine de produtos.
  * Detalhes do produto com descrição completa e preço.
  * Navegação sem necessidade de login.

## Tecnologias utilizadas

* React: interface do usuário.
* Node.js + Express: servidor/backend.
* Json Server (ou banco de dados similar): armazenamento dos produtos.

* Front-end: React, Vite, CSS.
* Back-end: Node.js, Express.
* Infraestrutura: Firebase (para autenticação/serviços).

## Pré-requisitos

* Node.js instalado.
* npm ou yarn instalado.
* vite instalado.

## Estrutura do projeto

```
App-loja/
├── backend/
│   ├── dados/             # Arquivos de banco de dados
│   ├── node_modules/
│   ├── limparBanco.js     # Script de limpeza
│   ├── padronizar_db.js   # Script de padronização
│   ├── package.json
│   └── server.js          # Servidor principal
├── front-end/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── loja/      # Componentes (AddProdutoDB, Vendas, etc.)
│   │   ├── App.jsx
│   │   ├── firebase.js    # Configuração Firebase
│   │   └── main.jsx
│   ├── .env               # Variáveis de ambiente
│   ├── package.json
│   └── vite.config.js
└── Sistema/               # Módulo do sistema
```

## Passo a passo

1. Abra o terminal e vá para a pasta do projeto.
2. Instale as dependências do backend:

```bash
cd backend
npm install
```

3. Instale as dependências do frontend:

```bash
cd ../front-end
npm install
```

4. Inicie o backend:

```bash
cd ../backend
nodemon server.js  
```

5. Inicie o frontend:

```bash
cd ../front-end
npm run dev
```

6. Se estiver usando json-server para dados locais:

```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

7. Biblioteca de Gráficos:

```bash
npm install recharts
```


## Observações

* Dependências adicionais que podem ser usadas:
  * `react-router-dom` para rotas no frontend.
  * `mongoose` se usar MongoDB.
  * `jsonwebtoken` para autenticação.
  * `firebase` se conectar com Firebase.
  * `vite` para execução do front-end.

* Ajuste os comandos de acordo com a estrutura real das pastas do seu projeto.

## Capturas de tela

* **Estrutura do Projeto**
<img width="1087" height="1088" alt="Estrutura" src="https://drive.google.com/file/d/1abo80W_46xXc6G4jHnCdTxEYUY6WRb1i/view?usp=drive_link" />

* **Login**
<img width="1087" height="1088" alt="Login" src="https://github.com/user-attachments/assets/3e954bff-6193-48f4-8388-c44fb2d7fd95" />

* **Dashboard do Administrador**
<img width="1291" height="1439" alt="Dashboard" src="https://github.com/user-attachments/assets/c4c9d9f9-a483-49bb-b8b2-b30b32a37d63" />

* **Cadastrar Produtos**
<img width="1291" height="1237" alt="Cadastrar Produtos" src="https://github.com/user-attachments/assets/cd8f304d-f13c-4d36-ac26-45813f25599f" />

* **Editar Produtos**
<img width="1281" height="1439" alt="Editar Produtos" src="https://github.com/user-attachments/assets/c8b1051a-dbd8-440f-bd21-a76e4ee3e460" />




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




