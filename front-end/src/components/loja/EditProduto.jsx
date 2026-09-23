import React, { useState, useEffect } from "react";
import "./EditProduto.css";
import { API_URL } from "../../api";

function ProductEditForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    valor: "",
    data_fabrica: "", // Novo campo
    data_venci: "",
    descricao: "",
    quantidade: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || "",
        nome: product.nome || "",
        valor: product.valor || "",
        data_fabrica: product.data_fabrica || "", // Novo campo
        data_venci: product.data_venci || "",
        descricao: product.descricao || "",
        quantidade: product.quantidade || "",
      });
    }
  }, [product]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (productData) => {
    try {
      const response = await fetch(
        `${API_URL}/estoque/${productData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        },
      );

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      onSave(); // Fecha o modal e recarrega a lista no componente pai
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Falha ao salvar. Verifique o console.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const qtd = Number(formData.quantidade);

    // Validação extra para impedir negativos
    if (qtd < 0) {
      alert("A quantidade não pode ser negativa.");
      return;
    }

    const updatedProduct = {
      ...formData,
      valor: Number(formData.valor),
      quantidade: Number(formData.quantidade),
      data_fabrica: formData.data_fabrica, // Incluído
      data_venci: formData.data_venci,
    };

    handleUpdate(updatedProduct);
  };

  return (
    <div className="modal-overlay">
      <div className="edit-form-card">
        <h3 className="form-title">Editar Produto</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>Nome do Produto</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Data de Fabricação</label>
            <input
              type="date"
              name="data_fabrica"
              value={formData.data_fabrica}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Data de Validade</label>
            <input
              type="date"
              name="data_venci"
              value={formData.data_venci}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              name="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions" style={{ gridColumn: "span 2" }}>
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductEditForm;
