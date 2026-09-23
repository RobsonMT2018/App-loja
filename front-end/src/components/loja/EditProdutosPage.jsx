import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2 } from "lucide-react"; // Adicionando ícones para melhor UX
import "./EditProduto.css";
import ProductEditForm from "./EditProduto";

const API_URL = "http://localhost:3000/estoque";

function EditProdutosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

 /* const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  */
  // Filtro inteligente que busca por nome ou descrição
  const filteredProducts = products.filter(p => 
    p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const  handleExit = () => {
    window.location.href = "/admin"; // Redireciona para o dashboard
  };

//A Função de Validação

const getValidadeStatus = (dataVenci) => {
  if (!dataVenci) return { texto: "---", cor: "black" };

  const hoje = new Date();
  const dataValidade = new Date(dataVenci);
  
  // Ajuste para evitar problemas de fuso horário
  dataValidade.setDate(dataValidade.getDate() + 1);

  // Calcula a diferença em milissegundos
  const diffTime = dataValidade - hoje;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Lógica:
  // Vermelho: Se a data já passou (diffDays < 0)
  // Amarelo: Se faltam 60 dias ou menos (diffDays <= 60)
  if (diffDays < 0) {
    return {cor: "#ef4444"}; // Vermelho
  } else if (diffDays <= 60) {
    return {cor: "#eab308"}; // Amarelo
  }

  return {cor: "#22c55e"}; // Verde (opcional)
};


 // Utilize as classes que já definimos no CSS de gestão
return (
    <div className="produtos-page-container">
      <div className="produtos-header">
        <h2>Gestão de Estoque</h2>
        <div className="header-actions">
          {/* Vinculado às funções de navegação */}
          <button className="btn-action btn-sair" onClick={handleExit}>Sair</button>
        </div>
      </div>

    <div className="search-container">
      <input 
        className="search-input" 
        placeholder="Buscar produto ou marca..." 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
    </div>

    <div className="table-scroll-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Qtd</th>
            <th>Valor</th>
            <th>Fabricação</th>
            <th>Validade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
         
         {filteredProducts.map((p) => {
  const status = getValidadeStatus(p.data_venci);
  return (
    <tr key={p.id}>
    
      <td>{p.nome}</td>
      <td className={Number(p.quantidade) < 10 ? "estoque-baixo" : ""}>{p.quantidade} un</td>
      <td>R$ {Number(p.valor).toFixed(2)}</td>      
      <td style={{ font: "bold", fontSize: "14px", color: "green"}}>{p.data_fabrica || "---"}</td>
      <td style={{ color: status.cor }}>{p.data_venci}</td>
      
      <td>
        <button onClick={() => setEditingProduct(p)} className="editar-btn-tabela">Editar</button>
        {/* <button onClick={() => handleDelete(p.id)} className="excluir-btn-tabela">Excluir</button> */}
      </td>
    </tr>
  );
})}

        </tbody>
      </table>
    </div>
    
    {editingProduct && (
      <ProductEditForm
        product={editingProduct}
        onSave={() => { setEditingProduct(null); fetchProducts(); }}
        onCancel={() => setEditingProduct(null)}
      />
    )}
  </div>
);
}

export default EditProdutosPage;