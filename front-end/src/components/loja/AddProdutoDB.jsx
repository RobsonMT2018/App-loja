import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProdutoDB.css'; 
import { API_URL as BACKEND_URL } from '../../api';

// Apontando para a nova rota unificada de insumos da lanchonete
const API_URL = `${BACKEND_URL}/estoque`;
const ADD_URL = `${BACKEND_URL}/formproduto`;

function AddProdutoDB() {
  const [editingProduct, setEditingProduct] = useState(null); 
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
  nome: '',
  valor: '',
  descricao: '',
  data_fabrica: '',
  data_venci: '',
  quantidade: ''
});

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carrega os insumos do servidor local
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setMessage('Erro ao carregar os insumos.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Monitora as mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [id]: value
    }));
  };

 // 2. Função de envio padronizada
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validação simples para garantir que os campos obrigatórios estão preenchidos
  if (!newProduct.nome || !newProduct.quantidade) {
    setMessage('Por favor, preencha pelo menos o Nome e a Quantidade.');
    setMessageType('error');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        // Garantimos que quantidade seja enviada como número
        quantidade: Number(newProduct.quantidade),
        valor: Number(newProduct.valor)
      }),
    });

    if (response.ok) {
      setMessage('Produto adicionado com sucesso!');
      setMessageType('success');
      // Limpa o formulário
      setNewProduct({ nome: '', valor: '', descricao: '', data_fabrica: '', data_venci: '', quantidade: '' });
      fetchProducts(); // Atualiza a lista automaticamente
    } else {
      throw new Error('Erro ao salvar no servidor.');
    }
  } catch (error) {
    console.error("Erro:", error);
    setMessage('Erro ao adicionar produto.');
    setMessageType('error');
  }
};

  // Preenche o formulário para edição caso clique em algum item da lista interna
  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setNewProduct({
      nome: product.nome || '',
      valor: product.valor || '',
      descricao: product.descricao || '',
      data_fabrica: product.data_fabrica || '',
      data_venci: product.data_venci || '',
      quantidade: product.quantidade || ''
    });
    setMessage('');
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Deseja realmente excluir este insumo?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage('Insumo removido com sucesso!');
        setMessageType('success');
        fetchProducts();
      } else {
        setMessage('Erro ao deletar o insumo.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor.');
      setMessageType('error');
    }
  };

  return (
    <div className="add-produto-container">
      <header className="page-header">
        <h2>{editingProduct ? '📝 Editar Insumo' : '📥 Cadastrar Novo Insumo'}</h2>
        <button className="nav-button" onClick={() => navigate('/admin')}>
          Voltar ao Painel
        </button>
      </header>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="nome">Nome do Insumo:</label>
            <input
              id="nome"
              type="text"
              value={newProduct.nome}
              onChange={handleInputChange}
              placeholder="Ex: Pão de Hambúrguer, Queijo Prato"
              required
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="valor">Preço de Custo (R$):</label>
              <input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.valor}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="quantidade">Quantidade Inicial:</label>
              <input
                id="quantidade"
                type="number"
                min="0"
                value={newProduct.quantidade}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Marca / Fornecedor:</label>
            <input
              id="descricao"
              type="text"
              value={newProduct.descricao}
              onChange={handleInputChange}
              placeholder="Ex: Aurora Alimentos, Wickbold, Sadia"
              required
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="data_fabrica">Data de Fabricação:</label>
              <input
                id="data_fabrica"
                type="text"
                value={newProduct.data_fabrica}
                onChange={handleInputChange}
                placeholder="Ex: 22/05/26"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="data_venci">Data de Vencimento:</label>
              <input
                id="data_venci"
                type="text"
                value={newProduct.data_venci}
                onChange={handleInputChange}
                placeholder="Ex: 22/08/27"
              />
            </div>
          </div>
          
          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="submit-button" style={{ flex: 1 }}>
              {editingProduct ? 'Salvar Edição' : 'Adicionar ao Estoque'}
            </button>
            {editingProduct && (
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ nome: '', valor: '', descricao: '', data_fabrica: '', data_venci: '', quantidade: '' });
                  setMessage('');
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '40px 0' }} />


<div className="historico-container">
  <h3>🕒 Histórico de Produtos Adicionados Recentemente</h3>
  <table className="historico-table">
    <thead>
      <tr>
        <th>Data</th>
        <th>Produto</th>
        <th>Qtd</th>
      </tr>
    </thead>
    <tbody>
      {/* Exibe os produtos invertidos (do último para o primeiro) */}
      {[...products].reverse().slice(0, 5).map((produto) => (
        <tr key={produto.id}>
          <td>{new Date().toLocaleDateString()}</td> {/* Se tiveres data no objeto, usa-a aqui */}
          <td>{produto.nome}</td>
          <td>{produto.quantidade} un.</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  
    </div>
  );
}

export default AddProdutoDB;