import React, { useState, useEffect } from "react";
import "./Vendas.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api";

const Vendas = () => {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Lanches");
  const [busca, setBusca] = useState("");
  const [dadosPedido, setDadosPedido] = useState({ 
    nomeCliente: "", 
    formaPagamento: "Dinheiro" 
  });
  const [enviando, setEnviando] = useState(false);
  
  // Estados para o Modal de Confirmação e o Comprovante
  const [modalAberto, setModalAberto] = useState(false);
  const [ultimoPedido, setUltimoPedido] = useState(null);

  const navigate = useNavigate();

  const categorias = ["Lanches", "Combos", "Acompanhamentos", "Bebidas"];

  useEffect(() => {
    fetch(`${API_URL}/lanches`)
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao carregar produtos:", err));

    fetch(`${API_URL}/clientes`)
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria = 
      categoriaAtiva === "Lanches" ? p.categoria === "Lanches" :
      categoriaAtiva === "Combos" ? p.categoria === "Combos" :
      categoriaAtiva === "Acompanhamentos" ? p.categoria === "Acompanhamentos" :
      categoriaAtiva === "Bebidas" ? p.categoria === "Bebidas" : false;

    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());

    return matchCategoria && matchBusca;
  });

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item,
        );
      }
      return [...prev, { ...produto, qtd: 1 }];
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === produtoId ? { ...item, qtd: item.qtd - 1 } : item,
        )
        .filter((item) => item.qtd > 0),
    );
  };

  const limparCarrinho = () => {
    if (carrinho.length === 0) return;
    if (window.confirm("Deseja realmente limpar o carrinho?")) {
      setCarrinho([]);
    }
  };

  const calcularTotal = () =>
    carrinho.reduce((acc, item) => acc + item.valor * item.qtd, 0);

  const handleAbrirModal = () => {
    if (!dadosPedido.nomeCliente) {
      alert("Erro: Selecione um cliente antes de finalizar o pedido!");
      return;
    }
    if (carrinho.length === 0) {
      alert("Erro: O carrinho está vazio!");
      return;
    }
    setModalAberto(true);
  };

  const realizarPedido = async () => {
    setEnviando(true);

    const dadosNovoPedido = {
      cliente: dadosPedido.nomeCliente,
      clienteNome: dadosPedido.nomeCliente,
      produtos: carrinho,
      valorTotal: calcularTotal(),
      total: calcularTotal(),
      formaPagamento: dadosPedido.formaPagamento,
      data: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosNovoPedido),
      });

      if (response.ok) {
        const pedidoCriado = await response.json();
        setUltimoPedido(pedidoCriado.id ? pedidoCriado : { ...dadosNovoPedido, id: "NOVO" });
        setCarrinho([]);
        setModalAberto(false);
      } else {
        alert("Erro ao enviar pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pdv-container">
      {/* Topo unificado contendo Botão Voltar, Título e Seletor de Cliente */}
      <header className="header-vendas">
        <button className="btn-voltar" onClick={() => navigate("/admin")}>
          Voltar
        </button>
        <h1 className="header-title">Seleção de Vendas</h1>
        <div className="container-cliente">
          <label htmlFor="cliente">Pedido para:</label>
          <select
            id="cliente"
            onChange={(e) =>
              setDadosPedido((prev) => ({ ...prev, nomeCliente: e.target.value }))
            }
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Menu Lateral de Categorias */}
      <aside className="menu-vertical">
        <h4>MENU</h4>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={categoriaAtiva === cat ? "ativo" : ""}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* Área de Produtos */}
      <main className="area-produtos">
        <div className="area-busca-produtos">
          <input
            className="input-busca"
            type="text"
            placeholder="Pesquisar produto pelo nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="grid-produtos">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((item) => {
              const semEstoque = item.estoque !== undefined && item.estoque <= 0;

              return (
                <div
                  key={item.id}
                  className={`card-produto ${semEstoque ? "produto-esgotado" : ""}`}
                  onClick={() => !semEstoque && adicionarAoCarrinho(item)}
                  style={{
                    opacity: semEstoque ? 0.5 : 1,
                    cursor: semEstoque ? "not-allowed" : "pointer",
                    position: "relative"
                  }}
                >
                  {semEstoque && (
                    <span style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#ef4444",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "bold"
                    }}>
                      Esgotado
                    </span>
                  )}
                  {item.urlImagem && <img src={item.urlImagem} alt={item.nome} />}
                  <h4>{item.nome}</h4>
                  <p>R$ {item.valor?.toFixed(2)}</p>
                </div>
              );
            })
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", marginTop: "20px" }}>
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      </main>

      {/* Carrinho / Resumo */}
      <section className="checkout">
        <div className="header-checkout">
          <h3>Resumo da Venda</h3>
          {carrinho.length > 0 && (
            <button className="btn-limpar-carrinho" onClick={limparCarrinho}>
              Limpar Carrinho
            </button>
          )}
        </div>
        
        <div className="cliente-resumo-info" style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
          <span><strong>Cliente:</strong> {dadosPedido.nomeCliente || "Nenhum selecionado"}</span>
        </div>

        <div className="resumo-lista">
          {carrinho.map((item) => (
            <div key={item.id} className="item-carrinho">
              <div className="controles-qtd">
                <button
                  className="btn-qtd remover"
                  onClick={() => removerDoCarrinho(item.id)}
                >
                  -
                </button>
                <span
                  style={{
                    minWidth: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {item.qtd}
                </span>
                <button
                  className="btn-qtd"
                  onClick={() => adicionarAoCarrinho(item)}
                >
                  +
                </button>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>
                {item.nome}
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                R$ {(item.valor * item.qtd).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Forma de Pagamento */}
        <div className="container-pagamento" style={{ margin: "12px 0", fontSize: "0.9rem" }}>
          <label htmlFor="pagamento" style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
            Forma de Pagamento:
          </label>
          <select
            id="pagamento"
            value={dadosPedido.formaPagamento}
            onChange={(e) =>
              setDadosPedido((prev) => ({ ...prev, formaPagamento: e.target.value }))
            }
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
          </select>
        </div>

        <div className="rodape-checkout">
          <div className="total-valor">
            <strong>Total:</strong>
            <strong>R$ {calcularTotal().toFixed(2)}</strong>
          </div>
          <button
            onClick={handleAbrirModal}
            disabled={carrinho.length === 0}
            className="btn-finalizar"
          >
            Finalizar Venda
          </button>
        </div>
      </section>

      {/* MODAL DE CONFIRMAÇÃO */}
      {modalAberto && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ marginBottom: "16px", color: "#a51c30", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
              Confirmar Pedido
            </h3>
            
            <p style={{ marginBottom: "8px", fontSize: "0.95rem" }}>
              <strong>Cliente:</strong> {dadosPedido.nomeCliente}
            </p>
            <p style={{ marginBottom: "12px", fontSize: "0.95rem" }}>
              <strong>Forma de Pagamento:</strong> {dadosPedido.formaPagamento}
            </p>

            <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #eee", borderRadius: "6px", padding: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Itens do Pedido:</span>
              {carrinho.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                  <span>{item.qtd}x {item.nome}</span>
                  <span>R$ {(item.valor * item.qtd).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "1.1rem" }}>
              <strong>Total a Pagar:</strong>
              <strong style={{ color: "#a51c30" }}>R$ {calcularTotal().toFixed(2)}</strong>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setModalAberto(false)}
                disabled={enviando}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Voltar
              </button>
              <button
                onClick={realizarPedido}
                disabled={enviando}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#a51c30",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {enviando ? "Enviando..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COMPROVANTE / IMPRESSÃO */}
      {ultimoPedido && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            width: "350px",
            maxWidth: "90%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "8px", color: "#16a34a" }}>Pedido Realizado!</h3>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "16px" }}>Comprovante de Venda</p>

            <div style={{ textAlign: "left", background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.85rem" }}>
              <p><strong>Pedido ID:</strong> {ultimoPedido.id}</p>
              <p><strong>Cliente:</strong> {ultimoPedido.cliente || ultimoPedido.clienteNome}</p>
              <p><strong>Data:</strong> {new Date(ultimoPedido.data).toLocaleString('pt-BR')}</p>
              <p><strong>Pagamento:</strong> {ultimoPedido.formaPagamento}</p>
              
              <div style={{ borderTop: "1px dashed #ccc", margin: "8px 0", paddingTop: "8px" }}>
                {(ultimoPedido.produtos || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>{item.qtd}x {item.nome}</span>
                    <span>R$ {((item.valor || item.preco || 0) * item.qtd).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #ccc", marginTop: "8px", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Total:</span>
                <span>R$ {Number(ultimoPedido.valorTotal || ultimoPedido.total || 0).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Imprimir
              </button>
              <button
                onClick={() => setUltimoPedido(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendas;