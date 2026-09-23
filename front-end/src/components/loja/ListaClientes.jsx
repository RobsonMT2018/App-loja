import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import './ListaClientes.css';
import { API_URL as BACKEND_URL } from '../../api';

const API_URL = `${BACKEND_URL}/clientes`;

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);

  // Alinhado com os campos reais que vêm do CadastroCliente.jsx
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    telefone: '', 
    cpf: '' ,
    endereco: ''
  });
  
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Erro do Servidor: ${response.status}`);
      const data = await response.json();
      
      // Garante que o dado recebido é de facto um Array para não quebrar o .map
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao procurar clientes:", err);
      setError(err.message || 'Não foi possível ligar ao servidor local.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditarClick = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome || '',
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      cpf: cliente.cpf || '',
      endereco: cliente.endereco || ''
    });
  };

const handleEditarSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${API_URL}/${editingCliente.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao atualizar');
    }

    // Sucesso: fecha o modal e recarrega a lista
    setEditingCliente(null);
    carregarClientes(); 
  } catch (err) {
    alert("Erro ao atualizar: " + err.message);
  }
};

  return (
    <section className="clientes-container">
      <header className="clientes-header">
        <button className="btn-voltar-painel" onClick={() => navigate('/admin')}>
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>
        {/* Botão adicionado aqui */}
        <button 
          className="btn-novo-cliente" onClick={() => navigate('/cadastro-cliente')}>+ Novo Cliente</button>
        <h2>Gestão de Clientes Ativos</h2>
        <button className="btn-atualizar-lista" onClick={carregarClientes} title="Atualizar Lista">
          <RefreshCw size={18} />
        </button>
      </header>

      {error && (
        <div className="cliente-erro-alert">
          ⚠️ {error} — Certifica-te de que o teu <strong>server.js</strong> está a rodar na porta 3000.
        </div>
      )}

      {loading ? (
        <div className="cliente-loading">Procurando registros de clientes...</div>
      ) : clientes.length === 0 ? (
        <div className="cliente-vazio">
          <User size={48} strokeWidth={1} />
          <p>Nenhum cliente cadastrado no sistema até ao momento.</p>
          <button onClick={() => navigate('/cadastro-cliente')} className="btn-ir-cadastro">
            Cadastrar Primeiro Cliente
          </button>
        </div>
      ) : (
        <div className="cliente-table-wrapper">
          <table className="clientes-tabela-real">
            <thead>
              <tr>
                <th><User size={14} /> Nome</th>
                <th><Mail size={14} /> E-mail</th>
                <th><Phone size={14} /> Telefone</th>
                <th><FileText size={14} /> CPF</th>
                <th><FileText size={14} />CEP</th>
                <th><FileText size={14} /> Endereço</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id || Math.random()}>
                  <td className="cliente-nome-destaque">{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone || <span className="dado-nulo">Não informado</span>}</td>
                  <td>{cliente.cpf || <span className="dado-nulo">Não informado</span>}</td>
                  <td>{cliente.endereco.cep || <span className="dado-nulo">Não informado</span>}</td>
                  <td>{cliente.endereco.rua || <span className="dado-nulo">Não informado</span>}, {cliente.endereco.numero || <span className="dado-nulo">Não informado</span>}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-tabela-editar"
                      onClick={() => handleEditarClick(cliente)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {editingCliente && (
        <div className="cliente-modal-backdrop">
          <div className="cliente-modal-container">
            <h3>Editar Registro (ID: #{editingCliente.id})</h3>
            <form onSubmit={handleEditarSubmit}>
              <div className="form-group-cliente">
                <label>Nome Completo:</label>
                <input 
                  type="text" name="nome" value={formData.nome} 
                  onChange={handleInputChange} required 
                />
              </div>
              <div className="form-group-cliente">
                <label>E-mail Corporativo:</label>
                <input 
                  type="type" name="email" value={formData.email} 
                  onChange={handleInputChange} required 
                />
              </div>
              <div className="form-group-cliente">
                <label>Telefone / WhatsApp:</label>
                <input 
                  type="text" name="telefone" value={formData.telefone} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="modal-actions-cliente">
                <button type="submit" className="btn-salvar-cliente">Salvar</button>
                <button 
                  type="button" className="btn-cancelar-cliente"
                  onClick={() => setEditingCliente(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ListaClientes;