import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importado para navegação
import './CadastroCliente.css';

const API_CLIENTES = 'http://localhost:3000/clientes';

const CadastroCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    dataNascimento: '',
  });

  const [mensagem, setMensagem] = useState('');
  const [mensagemTipo, setMensagemTipo] = useState(''); // 'success' ou 'error'
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate(); // Hook de navegação inicializado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const novasErros = {};

    if (!formData.nome.trim()) novasErros.nome = 'O nome é obrigatório';
    if (!formData.email.trim()) novasErros.email = 'O e-mail é obrigatório';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) novasErros.email = 'Introduza um e-mail válido';
    if (!formData.telefone.trim()) novasErros.telefone = 'O telefone é obrigatório';
    if (!formData.cpf.trim()) novasErros.cpf = 'O CPF é obrigatório';
    if (!formData.rua.trim()) novasErros.rua = 'A rua é obrigatória';
    if (!formData.numero.trim()) novasErros.numero = 'O número é obrigatório';
    if (!formData.cidade.trim()) novasErros.cidade = 'A cidade é obrigatória';
    if (!formData.estado.trim()) novasErros.estado = 'O estado é obrigatório';
    if (!formData.cep.trim()) novasErros.cep = 'O CEP é obrigatória';

    setErros(novasErros);
    return Object.keys(novasErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setMensagem('⚠️ Por favor, corrija os erros no formulário antes de salvar.');
      setMensagemTipo('error');
      return;
    }

    setEnviando(true);
    setMensagem('');

    const payloadCliente = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      cpf: formData.cpf.trim(),
      telefone: formData.telefone.trim(),
      dataNascimento: formData.dataNascimento,
      endereco: {
        rua: formData.rua.trim(),
        numero: formData.numero.trim(),
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim(),
        cep: formData.cep.trim()
      }
    };

    try {
      const response = await fetch(API_CLIENTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadCliente),
      });

      if (response.ok) {
        setMensagem('🎉 Cliente cadastrado e sincronizado com sucesso!');
        setMensagemTipo('success');
        
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cpf: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
          dataNascimento: '',
        });
      } else {
        setMensagem('❌ Erro no servidor ao tentar registar o cliente.');
        setMensagemTipo('error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setMensagem('❌ Falha crítica de rede. Certifique-se de que o servidor local está ligado.');
      setMensagemTipo('error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="cadastro-cliente-container">
      {/* Cabeçalho flexível contendo o título e o novo botão de voltar */}
      <header className="cadastro-cliente-header">
        <div>
          <h2>👥 Registar Novo Cliente / Ponto de Consumo</h2>
          <p className="subtitulo-modulo">Adicione os dados dos clientes para emissão de comandas e controle de fiado na Área de Vendas.</p>
        </div>
        <button type="button" className="btn-voltar-admin" onClick={() => navigate('/admin')}>
          Painel Administrativo
        </button>
      </header>

      {mensagem && (
        <div className={`mensagem-alerta ${mensagemTipo}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="cadastro-cliente-form">
        <div className="form-section-title">Informações Pessoais</div>
        
        <div className="form-group">
          <label htmlFor="nome">Nome Completo / Identificação do Balcão *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={erros.nome ? 'erro' : ''}
            placeholder="Ex: João Silva ou Mesa 04"
          />
          {erros.nome && <span className="erro-texto">{erros.nome}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={erros.email ? 'erro' : ''}
              placeholder="cliente@email.com"
            />
            {erros.email && <span className="erro-texto">{erros.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone / Telemóvel *</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className={erros.telefone ? 'erro' : ''}
              placeholder="(15) 99999-9999"
            />
            {erros.telefone && <span className="erro-texto">{erros.telefone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className={erros.cpf ? 'erro' : ''}
              placeholder="123.456.789-00"
            />
            {erros.cpf && <span className="erro-texto">{erros.cpf}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section-title" style={{ marginTop: '24px' }}>Endereço de Entrega / Facturação</div>

        <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="form-group">
            <label htmlFor="rua">Logradouro / Rua *</label>
            <input
              type="text"
              id="rua"
              name="rua"
              value={formData.rua}
              onChange={handleChange}
              className={erros.rua ? 'erro' : ''}
              placeholder="Avenida ou Rua..."
            />
            {erros.rua && <span className="erro-texto">{erros.rua}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número *</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className={erros.numero ? 'erro' : ''}
              placeholder="Nº"
            />
            {erros.numero && <span className="erro-texto">{erros.numero}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            id="bairro"
            name="bairro"
            value={formData.bairro}
            placeholder="Nome do Bairro"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cidade">Cidade *</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className={erros.cidade ? 'erro' : ''}
              placeholder="Sorocaba"
            />
            {erros.cidade && <span className="erro-texto">{erros.cidade}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado *</label>
            <input
              type="text"
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={erros.estado ? 'erro' : ''}
              placeholder="SP"
              maxLength="2"
            />
            {erros.estado && <span className="erro-texto">{erros.estado}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP *</label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              className={erros.cep ? 'erro' : ''}
              placeholder="18000-000"
            />
            {erros.cep && <span className="erro-texto">{erros.cep}</span>}
          </div>
        </div>

        <button type="submit" className="btn-enviar-cadastro" disabled={enviando}>
          {enviando ? 'A Sincronizar...' : '💾 Gravar Cliente'}
        </button>
      </form>
    </div>
  );
};

export default CadastroCliente;