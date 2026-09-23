import React, { useState } from 'react';
import './LoginForm.css'; 
import iconLogin from '../login/assets/logo.png'; 
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Agora utiliza os valores do estado (o que o usuário digitou)
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, senha: password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.mensagem);
        console.log('Login bem-sucedido!');
        // ✅ Redireciona para o painel de admin após o sucesso
        navigate('/admin');
      } else {
        setMessage(data.mensagem);
        console.error('Login falhou:', data);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setMessage('Falha ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-container">       
      <div className="login-form">
        <img className='login-image' src={iconLogin} width={130} alt="Logo" />
        <h2>Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">Entrar</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginForm;