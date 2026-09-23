import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginADM.css';

function LoginADM() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Senha do administrador (você pode mudar isso para uma variável de ambiente)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Aguarda um pouco para simular validação no servidor
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Senha correta - redireciona para a página de edição
        navigate('/editar-produtos');
      } else {
        // Senha incorreta
        setError('Senha de administrador incorreta!');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="login-adm-container">
      <div className="login-adm-box">
        <h2>Autenticação de Administrador</h2>
        <p>Digite a senha para acessar a edição de produtos</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Senha do Administrador:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Acessar'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginADM;
