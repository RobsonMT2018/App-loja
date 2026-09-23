import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CardapioAdmin.css";

export default function CardapioAdmin() {
  const navigate = useNavigate();
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const [lanches, setLanches] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [lancheEditando, setLancheEditando] = useState(null);

  const SENHA_ADM = "123456";

  useEffect(() => {
    if (autenticado) {
      carregarDados();
    }
  }, [autenticado]);

  const carregarDados = async () => {
    try {
      const resLanches = await fetch("http://localhost:3000/lanches");
      const dataLanches = await resLanches.json();
      setLanches(dataLanches);

      const resEstoque = await fetch("http://localhost:3000/estoque");
      const dataEstoque = await resEstoque.json();
      setEstoque(dataEstoque);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const fazerLogin = (e) => {
    e.preventDefault();
    if (senhaInput === SENHA_ADM) {
      setAutenticado(true);
    } else {
      alert("Senha de administrador incorreta!");
    }
  };

  const abrirEdicao = (lanche) => {
    const ingredientesAtuais = lanche.ingredientes || [];

    const ingredientesMapeados = estoque.map((itemEstoque) => {
      const ingredienteExistente = ingredientesAtuais.find(
        (ing) => ing.id.toString() === itemEstoque.id.toString(),
      );
      return {
        id: itemEstoque.id,
        nome: itemEstoque.nome,
        qtd: ingredienteExistente ? ingredienteExistente.qtd : 0,
      };
    });

    setLancheEditando({
      ...lanche,
      ingredientes: ingredientesMapeados,
    });
  };

  const alterarQtdIngrediente = (idEstoque, delta) => {
    setLancheEditando((prev) => {
      const novosIngredientes = prev.ingredientes.map((ing) => {
        if (ing.id.toString() === idEstoque.toString()) {
          const novaQtd = Math.max(0, Number(ing.qtd) + delta);
          return { ...ing, qtd: novaQtd };
        }
        return ing;
      });
      return { ...prev, ingredientes: novosIngredientes };
    });
  };

  const salvarAlteracoes = async () => {
    try {
      const ingredientesFiltrados = lancheEditando.ingredientes
        .filter((ing) => ing.qtd > 0)
        .map((ing) => ({ id: ing.id, qtd: ing.qtd }));

      const dadosAtualizados = {
        nome: lancheEditando.nome,
        valor: lancheEditando.valor,
        ingredientes: ingredientesFiltrados,
      };

      const res = await fetch(
        `http://localhost:3000/lanches/${lancheEditando.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizados),
        },
      );

      if (res.ok) {
        alert("Lanche atualizado com sucesso!");
        setLancheEditando(null);
        carregarDados();
      } else {
        alert("Erro ao atualizar lanche.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  if (!autenticado) {
    return (
      <div className="login-adm-container">
        <div className="login-card">
          <h2>🔒 Área Restrita</h2>
          <p>Digite a senha de administrador para gerenciar o Cardápio:</p>
          <form onSubmit={fazerLogin}>
            <input
              type="password"
              placeholder="Senha ADM (ex: 123456)"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              autoFocus
            />
            <button type="submit">Entrar no Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="cardapio-admin-page">
      <div className="admin-header">
        <button onClick={() => navigate(-1)} className="btn-voltar">
          SAIR
        </button>
        <h1>Painel Administrativo do Cardápio</h1>
      </div>
      <div className="cardapio-header">
        <h2>Gerenciamento de Cardápio e Receitas</h2>
        <p>
          Configure os ingredientes que compõem cada lanche para o abatimento
          automático no estoque.
        </p>
      </div>

      {lancheEditando ? (
        <div className="painel-edicao">
          <div className="edicao-topo">
            <h3>
              Editando Receita: <span>{lancheEditando.nome}</span>
            </h3>
            <span className="id-badge">ID: {lancheEditando.id}</span>
          </div>

          <div className="ingredientes-grid">
            {lancheEditando.ingredientes.map((ing) => (
              <div key={ing.id} className="ingrediente-card-item">
                <span className="ingrediente-nome">{ing.nome}</span>
                <div className="controle-qtd">
                  <button
                    type="button"
                    onClick={() => alterarQtdIngrediente(ing.id, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={ing.qtd}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setLancheEditando((prev) => ({
                        ...prev,
                        ingredientes: prev.ingredientes.map((i) =>
                          i.id === ing.id ? { ...i, qtd: val } : i,
                        ),
                      }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => alterarQtdIngrediente(ing.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="botoes-acao">
            <button
              className="btn-cancelar"
              onClick={() => setLancheEditando(null)}
            >
              Cancelar
            </button>
            <button className="btn-atualizar" onClick={salvarAlteracoes}>
              Salvar Alterações
            </button>
          </div>
        </div>
      ) : (
        <div className="lista-cardapio">
          {lanches.map((lanche) => {
            const descricaoIngredientes =
              lanche.ingredientes && lanche.ingredientes.length > 0
                ? lanche.ingredientes
                    .map((ing) => {
                      const itemEstoque = estoque.find(
                        (e) => e.id.toString() === ing.id.toString(),
                      );
                      return `${ing.qtd}x ${itemEstoque ? itemEstoque.nome : "Item"} `;
                    })
                    .join(", ")
                : "Nenhum ingrediente vinculado no estoque";

            // Define a imagem com fallback seguro caso o lanche não tenha foto
            const imagemUrl =
              lanche.urlImagem ||
              "https://via.placeholder.com/150?text=Sem+Imagem";
            return (
              <div key={lanche.id} className="lanche-card">
                <div className="lanche-info-container">
                  <img
                    src={imagemUrl}
                    alt={lanche.nome}
                    className="lanche-thumbnail"
                  />
                  <div className="lanche-detalhes">
                    <div className="lanche-titulo-area">
                      <span className="lanche-id-tag">#{lanche.id}</span>
                      <h4>{lanche.nome}</h4>
                      {lanche.valor && (
                        <span className="lanche-preco">
                          R$ {Number(lanche.valor).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="lanche-ingredientes-texto">
                      <strong>Receita:</strong> {descricaoIngredientes}
                    </p>
                  </div>
                </div>
                <button
                  className="btn-editar"
                  onClick={() => abrirEdicao(lanche)}
                >
                  EDITAR
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
