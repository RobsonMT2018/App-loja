
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/login/LoginForm'; //--Login Usuario
import Dashboard from './components/loja/Dashboard'; //-- Dashboard
import AddProdutoDB from './components/loja/AddProdutoDB'; // --Cadastro de produtos
import EstoqueDB from './components/loja/ProdutosDB'; // listagem de produtos do banco de dados
import LoginADM from './components/loja/LoginADM'; // Autenticação do administrador
import EditProdutosPage from './components/loja/EditProdutosPage'; // Página de edição de produtos
import CadastroCliente from './components/loja/CadastroCliente'; // Cadastro de clientes
import ListaClientes from './components/loja/ListaClientes'; // Listagem de clientes
import HistoricoVendas from './components/loja/HistoricoVendas'; // Página de histórico de vendas
import Vendas from './components/loja/Vendas'; // Página de vendas de produtos
import CardapioAdmin from './components/loja/CardapioAdmin';
import './App.css';


function App() {
  return (
    <div className="App">
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />  
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/formproduto" element={<AddProdutoDB />} />
          <Route path="/login-admin" element={<LoginADM />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/editar-produtos" element={<EditProdutosPage />} />
          <Route path="/estoque" element={<EstoqueDB />} />
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/historico-vendas" element={<HistoricoVendas />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/cardapio" element={<CardapioAdmin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;