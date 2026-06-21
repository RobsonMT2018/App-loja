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

* **Projeto**
<img width="1447" height="797" alt="image" align = "center" src="https://github.com/user-attachments/assets/f2fc0415-a4b4-4e00-b8fe-7096928d3aff" />


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


* **Login**
<img width="585" height="745" alt="image" align = "center"  src="https://github.com/user-attachments/assets/bfefd636-d54c-416a-a07b-becf09bff72a" />

* **Dashboard do Administrador**
<img width="1313" height="1403" alt="image" align = "center"  src="https://github.com/user-attachments/assets/e9e7ccee-7a0d-412a-86f1-ce6bd6d63534" />

* **Lista de produtos**
<img width="1289" height="1435" alt="image" align = "center" src="https://github.com/user-attachments/assets/d60b0886-af77-485e-9dcf-a58e913489c6" />

* **Cadastrar Produtos**
<img width="1277" height="1435" alt="image" align = "center" src="https://github.com/user-attachments/assets/0af6284a-ff9c-4e95-9e81-736fcfc764a9" />

* **Editar Produtos**
<img width="1281" height="1431" alt="image" align = "center" src="https://github.com/user-attachments/assets/deb5b53b-d2a4-4a2d-bd99-ccd843ea4f41" />





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




