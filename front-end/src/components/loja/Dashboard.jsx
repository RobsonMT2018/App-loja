import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Menu,
  Home,
  Package,
  ShoppingBag,
  Users,
  Ban,
  DollarSign,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "./Dashboard.css";
import iconDashboard from "../login/assets/login_user.png";

const API_PEDIDOS = "http://localhost:3000/pedidos";
const API_CLIENTES = "http://localhost:3000/clientes";
const API_ESTOQUE = "http://localhost:3000/estoque";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalVendas: 0,
    totalPedidos: 0,
    totalClientes: 0,
    totalProdutosEstoque: 0,
    valorPrejuizo: 0,
  });

  const [dadosFaturamento, setDadosFaturamento] = useState([]);
  const [dadosEstoque, setDadosEstoque] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosDashboard = async () => {
      try {
        setLoading(true);

        const [resPedidos, resClientes, resEstoque] = await Promise.all([
          fetch(API_PEDIDOS).catch(() => null),
          fetch(API_CLIENTES).catch(() => null),
          fetch(API_ESTOQUE).catch(() => null),
        ]);

        const pedidos = resPedidos?.ok ? await resPedidos.json() : [];
        const clientes = resClientes?.ok ? await resClientes.json() : [];
        const estoque = resEstoque?.ok ? await resEstoque.json() : [];

        setTodosProdutos(estoque);

        let faturamentoTotal = 0;
        let contagemCancelados = 0;
        let valorPrejuizo = 0;

        pedidos.forEach((pedido) => {
          if (pedido.status === "Estornado" || pedido.status === "Cancelado") {
            contagemCancelados++;
            valorPrejuizo += Number(pedido.valorTotal || 0);
          } else {
            faturamentoTotal += Number(pedido.valorTotal || 0);
          }
        });

        const somaQuantidadeEstoque = estoque.reduce((acc, curr) => {
          const qtd = curr.quantity ?? curr.quantidade ?? 0;
          return acc + Number(qtd);
        }, 0);

        setStats({
          totalVendas: faturamentoTotal,
          totalPedidos: pedidos.length - contagemCancelados,
          totalClientes: clientes.length,
          totalProdutosEstoque: somaQuantidadeEstoque,
          valorPrejuizo: valorPrejuizo,
        });

        // Processamento para Gráfico de Faturamento
        const mesesIniciais = { Jan:0, Fev:0, Mar:0, Abr:0, Mai:0, Jun:0, Jul:0, Ago:0, Set:0, Out:0, Nov:0, Dez:0 };
        pedidos.forEach((pedido) => {
          if (pedido.status !== "Estornado" && pedido.status !== "Cancelado") {
            const data = pedido.dataHora ? new Date(pedido.dataHora) : new Date();
            const nomeMes = data.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
            const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
            if (mesesIniciais[mesFormatado] !== undefined) {
              mesesIniciais[mesFormatado] += Number(pedido.valorTotal || 0);
            }
          }
        });

        setDadosFaturamento(Object.keys(mesesIniciais).map(mes => ({ mes, Vendas: mesesIniciais[mes] })));

        // Processamento para Gráfico de Top 5 Produtos
        const top5Estoque = [...estoque]
          .sort((a, b) => (Number(b.quantidade ?? b.quantity ?? 0) - Number(a.quantidade ?? a.quantity ?? 0)))
          .slice(0, 5)
          .map(item => ({ name: item.nome ?? item.name, Quantidade: Number(item.quantidade ?? item.quantity ?? 0) }));

        setDadosEstoque(top5Estoque);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosDashboard();
  }, []);

  const alertas = useMemo(() => {
    const hoje = new Date();
    return todosProdutos.filter((p) => {
      const dataValidade = new Date(p.data_venci);
      const diffDays = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
      return Number(p.quantidade ?? p.quantity ?? 0) <= 15 || diffDays <= 60;
    });
  }, [todosProdutos]);

  const getStatusVencimento = (dataVenci) => {
    if (!dataVenci) return { texto: "Sem data", classe: "badge-success" };
    const hoje = new Date();
    const dataValidade = new Date(dataVenci);
    const diffDays = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { texto: "Vencido", classe: "badge-critical" };
    if (diffDays <= 60) return { texto: `${diffDays} dias`, classe: "badge-warning" };
    return { texto: "Em dia", classe: "badge-success" };
  };

  if (loading) return <div className="dashboard-loading">Sincronizando métricas administrativas...</div>;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-area">
            <img src={iconDashboard} alt="User Admin" className="admin-avatar-img" />
            <div>
              <h3>Robson Maciel</h3>
              <span>Painel Gerencial</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="sidebar-menu">
          {[
            { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
            { name: "Cadastrar Produto", icon: <Package size={20} />, path: "/formproduto" },
            { name: "Estoque Geral", icon: <Database size={20} />, path: "/estoque" },
            { name: "Clientes", icon: <Users size={20} />, path: "/clientes" },
            { name: "Histórico de Vendas", icon: <ShoppingBag size={20} />, path: "/historico-vendas" },
            { name: "Vendas", icon: <Ban size={20} />, path: "/vendas" },
            { name: "Cardápio", icon: <ShoppingBag size={20} />, path: "/cardapio" },
            { name: "Sair", icon: <X size={20} />, path: "/login" },
          ].map((item) => (
            <button
              key={item.name}
              className={`menu-item ${activeItem === item.name ? "active" : ""}`}
              onClick={() => {
                setActiveItem(item.name);
                navigate(item.path);
                setOpen(false);
              }}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>


     
      </div>
      <div className="main-content">
        <header className="main-header">
          <button className="menu-toggle" onClick={() => setOpen(true)}>
    <Menu size={24} />
  </button>
          <h2>Análise de Desempenho Comercial</h2>
          <span>Operação Online: {new Date().toLocaleDateString("pt-BR")}</span>
        </header>

        <div className="metrics-grid">
          <div className="card-kpi kpi-blue">
            <div className="kpi-icon"><DollarSign size={24} /></div>
            <div className="kpi-info"><span>Faturamento de Saída</span><h3>R$ {stats.totalVendas.toFixed(2)}</h3></div>
          </div>
          <div className="card-kpi kpi-green">
            <div className="kpi-icon"><ShoppingBag size={24} /></div>
            <div className="kpi-info"><span>Vendas Concluídas</span><h3>{stats.totalPedidos} u.</h3></div>
          </div>
          <div className="card-kpi kpi-purple">
            <div className="kpi-icon"><Users size={24} /></div>
            <div className="kpi-info"><span>Clientes Ativos</span><h3>{stats.totalClientes}</h3></div>
          </div>
          <div className="card-kpi kpi-orange">
            <div className="kpi-icon"><Package size={24} /></div>
            <div className="kpi-info"><span>Itens em Stock</span><h3>{stats.totalProdutosEstoque} un.</h3></div>
          </div>
          <div className="card-kpi kpi-red">
            <div className="kpi-icon"><Ban size={24} /></div>
            <div className="kpi-info"><span>Prejuízo Cancelados</span><h3>R$ {stats.valorPrejuizo.toFixed(2)}</h3></div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Evolução de Faturamento Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosFaturamento}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="mes" /><YAxis /><Tooltip /><Area type="monotone" dataKey="Vendas" fill="#2ecc71" /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Disponibilidade de Produtos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosEstoque}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="Quantidade" fill="#3498db" /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <section className="alert-section">
          <h3>⏳ Atenção: Alertas Críticos</h3>
          <table className="alert-table">
            <thead><tr><th>Produto</th><th>Status</th><th>Validade</th></tr></thead>
            <tbody>
              {alertas.map((p) => {
                const status = getStatusVencimento(p.data_venci);
                return (
                  <tr key={p.id}>
                    <td>{p.nome ?? p.name}</td>
                    <td>
                      {Number(p.quantidade ?? p.quantity ?? 0) <= 15 && <span className="badge-critical">Stock Baixo</span>}
                      {status.classe === "badge-critical" && <span className="badge-critical">Vencido</span>}
                    </td>
                    <td><span className={status.classe}>{status.texto}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;