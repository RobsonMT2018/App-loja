// server.js
// ==========================================================================
// 1. IMPORTAR AS BIBLIOTECAS
// ==========================================================================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ==========================================================================
// 2. DADOS FIXOS DO ADMINISTRADOR
// ==========================================================================
const ADMIN_EMAIL = 'meu@dominio.com';
const ADMIN_SENHA = '123456'; 

// ==========================================================================
// 3. CRIAR A APLICAÇÃO EXPRESS E CONFIGURAÇÕES
// ==========================================================================
const app = express();
const port = 3000; 
const DB_FILE = path.join(__dirname, 'dados', 'db.json');

// Middleware para JSON e CORS configurado para aceitar qualquer origem
app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

// Middleware de log para rastrear requisições
app.use((req, res, next) => {
    console.log(`Tentativa de acesso: ${req.method} ${req.url}`);
    next();
});

// ==========================================================================
// 4. FUNÇÕES AUXILIARES DE LEITURA E ESCRITA NO BANCO (db.json)
// ==========================================================================
const readDb = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler o arquivo db.json:', err);
    return { clientes: [], pedidos: [], estoque: [], fornecedores: [], lanches: [] };
  }
};

const writeDb = (data) => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Erro ao escrever no arquivo db.json:', err);
  }
};

// Rota de Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  console.log("Tentativa de login recebida:", { email, senha });

  if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
    res.json({ sucesso: true, mensagem: 'Login bem-sucedido!' });
  } else {
    res.status(401).json({ sucesso: false, mensagem: 'Email ou senha incorretos.' });
  }
});

// ==========================================================================
// 5. ROTAS DE ESTOQUE / PRODUTOS
// ==========================================================================

// Listar todo o estoque
app.get('/estoque', (req, res) => {
  const db = readDb();
  res.json(db.estoque || []);
});

// Atualizar o estoque de um produto específico via PATCH (Corrigido para usar readDb/writeDb)
app.patch('/estoque/:id', (req, res) => {
    const id = req.params.id;
    const { quantidade } = req.body;

    const db = readDb();
    const itemIndex = db.estoque.findIndex(item => item.id.toString() === id.toString());

    if (itemIndex !== -1) {
        db.estoque[itemIndex].quantidade = quantidade;
        writeDb(db);
        res.status(200).json({ message: 'Estoque atualizado com sucesso!' });
    } else {
        res.status(404).json({ message: 'Produto não encontrado.' });
    }
});

// Cadastrar ou Atualizar Produto (Formulário)
app.post('/formproduto', (req, res) => {
  const body = req.body;
  const db = readDb();

  if (!db.estoque) db.estoque = [];

  const produtoNormalizado = {
    id: body.id ? body.id.toString() : Date.now().toString(),
    nome: body.nome || body.name || '',
    valor: Number(body.valor !== undefined ? body.valor : (body.value || 0)),
    descricao: body.descricao || body.description || '',
    imagem: body.imagem || body.image || '',
    quantidade: Number(body.quantidade !== undefined ? body.quantidade : (body.quantity || 0)),
    data_fabrica: body.data_fabrica || body.dataFabrica || "", 
    data_venci: body.data_venci || body.dataVenci || ""       
  };

  if (body.id) {
    const index = db.estoque.findIndex(p => p.id.toString() === body.id.toString());
    if (index !== -1) {
      db.estoque[index] = produtoNormalizado;
      writeDb(db);
      return res.json({ mensagem: 'Produto atualizado com sucesso!', produto: produtoNormalizado });
    }
  }

  db.estoque.push(produtoNormalizado);
  writeDb(db);
  res.status(201).json({ mensagem: 'Produto adicionado com sucesso!', produto: produtoNormalizado });
});

app.delete('/estoque/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();

  if (!db.estoque) db.estoque = [];
  
  const novosProdutos = db.estoque.filter(p => p.id.toString() !== id.toString());
  
  if (novosProdutos.length === db.estoque.length) {
    return res.status(404).json({ mensagem: 'Produto não encontrado no estoque.' });
  }

  db.estoque = novosProdutos;
  writeDb(db);
  res.json({ mensagem: 'Produto removido com sucesso!' });
});

app.put('/estoque/:id', (req, res) => {
  const { id } = req.params;
  const produtoAtualizado = req.body;
  const db = readDb(); 

  const index = db.estoque.findIndex(p => p.id.toString() === id.toString());
  if (index === -1) {
      return res.status(404).json({ erro: "Produto não encontrado" });
  }

  db.estoque[index] = { ...db.estoque[index], ...produtoAtualizado, id: id };
  writeDb(db);

  res.json({ mensagem: 'Produto atualizado com sucesso!', produto: db.estoque[index] });
});

// ==========================================================================
// 6. ROTAS DE PEDIDOS / VENDAS (UNIFICADAS)
// ==========================================================================
app.get('/pedidos', (req, res) => {
  const db = readDb();
  res.json(db.pedidos || []);
});

// Rota unificada para registrar vendas/pedidos e dar baixa no estoque
const processarVendaOuPedido = (req, res) => {
    try {
        const db = readDb();
        if (!db.pedidos) db.pedidos = [];
        if (!db.estoque) db.estoque = [];
        
        const { clienteNome, produtos, valorTotal, formaPagamento } = req.body;
        
        // Baixa automática no estoque
        if (produtos && Array.isArray(produtos)) {
            produtos.forEach(itemVendido => {
                const indexEstoque = db.estoque.findIndex(
                    e => e.id.toString() === itemVendido.id.toString()
                );
                
                if (indexEstoque !== -1) {
                    const qtdVendida = Number(itemVendido.qtd || itemVendido.quantidade || 1);
                    db.estoque[indexEstoque].quantidade = Math.max(
                        0, 
                        Number(db.estoque[indexEstoque].quantidade || 0) - qtdVendida
                    );
                }
            });
        }

        const novoPedido = {
            id: Date.now().toString(),
            clienteNome: clienteNome || "Cliente Anônimo",
            produtos: produtos || [],
            valorTotal: valorTotal || 0,
            formaPagamento: formaPagamento || "Dinheiro",
            dataHora: new Date().toISOString()
        };
        
        db.pedidos.push(novoPedido);
        writeDb(db);
        
        res.status(201).json({ mensagem: 'Venda realizada com sucesso!', pedido: novoPedido });
        
    } catch (error) {
        console.error("ERRO NO SERVIDOR:", error);
        res.status(500).json({ mensagem: 'Erro interno ao processar venda', detalhe: error.message });
    }
};

app.post('/pedidos', processarVendaOuPedido);
app.post('/vendas', processarVendaOuPedido);

app.get('/vendas', (req, res) => {
  const db = readDb();
  res.json(db.pedidos || []);
});

app.put('/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;
  const db = readDb();

  const index = db.pedidos.findIndex(p => p.id.toString() === id.toString());
  if (index === -1) return res.status(404).json({ mensagem: 'Pedido não encontrado.' });

  db.pedidos[index] = { ...db.pedidos[index], ...dadosAtualizados };
  writeDb(db);
  res.json({ mensagem: 'Pedido atualizado com sucesso!', pedido: db.pedidos[index] });
});

// ==========================================================================
// 7. ROTAS DE CLIENTES
// ==========================================================================
app.get('/clientes', (req, res) => {
  const db = readDb();
  res.json(db.clientes || []);
});

app.post('/clientes', (req, res) => {
  const { nome, email, cpf, telefone, dataNascimento, endereco } = req.body;
  const db = readDb();

  if (!db.clientes) db.clientes = [];
  
  const novoCliente = {
    id: Date.now().toString(),
    nome: nome || "Sem nome",
    email: email || "",
    cpf: cpf || "",
    telefone: telefone || "",
    dataNascimento: dataNascimento || "",
    endereco: {
      rua: endereco?.rua || "",
      numero: endereco?.numero || "",
      bairro: endereco?.bairro || "",
      cidade: endereco?.cidade || "",
      estado: endereco?.estado || "",
      cep: endereco?.cep || ""
    }
  };

  db.clientes.push(novoCliente);
  writeDb(db);
  res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;
  const db = readDb();
  
  const index = db.clientes.findIndex(c => c.id.toString() === id.toString());
  
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Cliente não encontrado!' });
  }

  db.clientes[index] = { ...db.clientes[index], ...dadosAtualizados };
  writeDb(db);
  
  res.json({ mensagem: 'Cliente atualizado com sucesso!', cliente: db.clientes[index] });
});

// ==========================================================================
// 8. ROTAS DE FORNECEDORES E LANCHES
// ==========================================================================
app.get('/fornecedores', (req, res) => {
  const db = readDb();
  res.json(db.fornecedores || []);
});

app.post('/fornecedores', (req, res) => {
  const novoFornecedor = req.body;
  const db = readDb();

  if (!db.fornecedores) db.fornecedores = [];
  
  novoFornecedor.id = Date.now().toString();
  db.fornecedores.push(novoFornecedor);
  writeDb(db);
  res.status(201).json({ mensagem: 'Fornecedor cadastrado com sucesso!', fornecedor: novoFornecedor });
});

app.get('/lanches', (req, res) => {
  const db = readDb();
  res.json(db.lanches || []);
});

// Rota para atualizar/cadastrar a receita de um lanche específico
// Adicione esta rota no seu server.js, junto às outras rotas de /lanches
// Substitua a rota /lanches/:id no seu server.js por esta:
app.put('/lanches/:id', (req, res) => {
    const { id } = req.params;
    const { nome, ingredientes, valor } = req.body;
    const db = readDb();

    if (!db.lanches) db.lanches = [];

    // Procura o lanche convertendo ambos para string para evitar erro de tipo
    const index = db.lanches.findIndex(l => l.id.toString() === id.toString());

    if (index !== -1) {
        // Atualiza o lanche existente
        db.lanches[index] = {
            ...db.lanches[index],
            nome: nome || db.lanches[index].nome,
            valor: valor !== undefined ? valor : (db.lanches[index].valor || 0),
            ingredientes: ingredientes || []
        };
    } else {
        // Se o lanche não existir no db.json, cria ele automaticamente na hora!
        db.lanches.push({
            id: id.toString(),
            nome: nome || "Lanche " + id,
            valor: valor || 0,
            ingredientes: ingredientes || []
        });
    }

    writeDb(db);
    res.json({ mensagem: 'Cardápio atualizado com sucesso!' });
});

app.get('/produtos', (req, res) => {
  const db = readDb();
  res.json(db.estoque || []);
});

// ==========================================================================
// 9. INICIALIZAÇÃO DO SERVIDOR
// ==========================================================================
app.listen(port, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📱 Para acessar no mobile, use o IP da sua máquina na mesma rede.`);
  console.log(`📁 Banco de dados local apontado para: ${DB_FILE}`);
  console.log(`====================================================`);
});