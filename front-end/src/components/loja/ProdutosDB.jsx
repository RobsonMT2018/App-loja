import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProdutosDB.css';
import { API_URL as BACKEND_URL } from '../../api';

const API_URL = `${BACKEND_URL}/estoque`;

function ProdutosDB() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL); 
        if (!response.ok) throw new Error('Erro ao carregar os produtos.');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); 

  // Funções de navegação
  const handleExit = () => navigate('/admin');
  const handleEditItems = () => navigate('/login-admin');

  // Lógica de filtragem baseada no termo de busca
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    return (
      product.nome?.toLowerCase().includes(searchLower) ||
      product.descricao?.toLowerCase().includes(searchLower) ||
      product.id?.toString() === searchLower
    );
  });

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="produtos-page-container">
      <div className="produtos-header">
        <h2>Gestão de Estoque</h2>
        <div className="header-actions">
          {/* Vinculado às funções de navegação */}
          <button className="btn-action" onClick={handleEditItems}>Editar Itens</button>
          <button className="btn-action btn-sair" onClick={handleExit}>Sair</button>
        </div>
      </div>

      <div className="search-container">
        <input 
          className="search-input" 
          placeholder="Buscar por nome ou ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
      </div>

      <div className="table-scroll-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Estoque</th>
              <th>MARCA</th>
              <th>Validade</th>
            </tr>
          </thead>
          <tbody>
            {/* Usando filteredProducts em vez de products para exibir os resultados da busca */}
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.quantidade} un</td>
                <td>{p.descricao}</td>
                <td>{p.data_venci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProdutosDB;