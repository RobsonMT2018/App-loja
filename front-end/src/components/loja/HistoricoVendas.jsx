import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import './HistoricoVendas.css';
import { API_URL as BACKEND_URL } from '../../api';

const API_URL = `${BACKEND_URL}/pedidos`;

function HistoricoVendas() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  
  // Novos estados para o filtro de datas
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    };
    carregarPedidos();
  }, []);

  // Lógica de filtragem combinada (Texto + Intervalo de Datas)
  const pedidosFiltrados = pedidos.filter(p => {
    const idPedido = p.id ? p.id.toString() : '';
    const nomeCliente = p.clienteNome || p.cliente || p.nomeCliente || p.nome || p.client || p.nome_cliente || "Cliente Anônimo";
    
    const matchTexto = (
      idPedido.includes(filtro) || 
      nomeCliente.toLowerCase().includes(filtro.toLowerCase())
    );

    // Filtro por data
    const dataPedidoStr = p.data || p.dataHora || p.createdAt;
    let matchData = true;

    if (dataPedidoStr) {
      const dataPedidoObj = new Date(dataPedidoStr);
      // Zera as horas para comparar apenas os dias
      dataPedidoObj.setHours(0, 0, 0, 0);

      if (dataInicio) {
        const dInicio = new Date(dataInicio + 'T00:00:00');
        if (dataPedidoObj < dInicio) matchData = false;
      }

      if (dataFim) {
        const dFim = new Date(dataFim + 'T23:59:59');
        if (dataPedidoObj > dFim) matchData = false;
      }
    }

    return matchTexto && matchData;
  });

  // Cálculo das métricas para os cards de resumo
  const totalFaturado = pedidosFiltrados.reduce((acc, p) => {
    return acc + Number(p.valorTotal || p.total || p.valor || 0);
  }, 0);

  const qtdPedidos = pedidosFiltrados.length;
  const ticketMedio = qtdPedidos > 0 ? totalFaturado / qtdPedidos : 0;

  return (
    <div className="historico-container">
      <button className="btn-voltar" onClick={() => navigate('/admin')}>
        <ArrowLeft size={20} /> Voltar ao Painel
      </button>

      <h2>Histórico de Vendas</h2>

      {/* Cards de Resumo / Totais do Período */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        margin: '20px 0' 
      }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Total Faturado</span>
          <strong style={{ fontSize: '1.25rem', color: '#111827' }}>R$ {totalFaturado.toFixed(2)}</strong>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Qtd. Pedidos</span>
          <strong style={{ fontSize: '1.25rem', color: '#111827' }}>{qtdPedidos}</strong>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Ticket Médio</span>
          <strong style={{ fontSize: '1.25rem', color: '#111827' }}>R$ {ticketMedio.toFixed(2)}</strong>
        </div>
      </div>

      {/* Seção de Filtros (Texto e Datas) */}
      <div className="pesquisa-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="Pesquisar por ID ou Cliente..." 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value)} 
          style={{ flex: '1', minWidth: '200px' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
          <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>De:</span>
          <input 
            type="date" 
            value={dataInicio} 
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
          <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Até:</span>
          <input 
            type="date" 
            value={dataFim} 
            onChange={(e) => setDataFim(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Carregando histórico...</p>
      ) : (
        <div className="historico-grid">
          {pedidosFiltrados.length > 0 ? (
            [...pedidosFiltrados].reverse().map((pedido, index) => {
              const nomeCliente = pedido.clienteNome || pedido.cliente || pedido.nomeCliente || pedido.nome || pedido.client || pedido.nome_cliente || "Cliente Anônimo";
              const itensLista = pedido.produtos || pedido.itens || pedido.carrinho || [];
              const valorTotal = Number(pedido.valorTotal || pedido.total || pedido.valor || 0);
              const formaPagamento = pedido.formaPagamento || "Não especificado";
              
              const dataPedido = pedido.data || pedido.dataHora || pedido.createdAt;
              const dataFormatada = dataPedido ? new Date(dataPedido).toLocaleString('pt-BR') : 'Data Indisponível';

              return (
                <div key={pedido.id || index} className="pedido-card">
                  <div className="pedido-card-header">
                    <span><strong>ID Pedido:</strong> {pedido.id || index + 1}</span>
                    <span>{dataFormatada}</span>
                  </div>
                  
                  <div className="pedido-cliente-info">
                    <strong>Cliente:</strong> {nomeCliente}
                  </div>

                  <div className="pedido-pagamento-info" style={{ fontSize: '0.85rem', marginTop: '4px', color: '#4b5563' }}>
                    <strong>Pagamento:</strong> {formaPagamento}
                  </div>

                  <table className="tabela-itens-pedido" style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th style={{ textAlign: 'center' }}>Qtd</th>
                        <th style={{ textAlign: 'right' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensLista.length > 0 ? (
                        itensLista.map((item, idx) => {
                          const nomeItem = item.nome || item.name || item.titulo || "Produto";
                          const qtdItem = item.qtd || item.quantidade || 1;
                          const precoUnitario = Number(item.valor || item.preco || item.price || 0);
                          const subtotal = precoUnitario * qtdItem;

                          return (
                            <tr key={idx}>
                              <td>{nomeItem}</td>
                              <td style={{ textAlign: 'center' }}>{qtdItem}x</td>
                              <td style={{ textAlign: 'right' }}>R$ {subtotal.toFixed(2)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', color: '#9ca3af', padding: '12px 0' }}>
                            Nenhum item registrado neste pedido.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="pedido-card-footer">
                    <strong>Total: R$ {valorTotal.toFixed(2)}</strong>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="vazio-text">Nenhum pedido encontrado para o filtro selecionado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoricoVendas;