import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../../Services/Auth';
import './Login.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Só usado para trocar o ícone (email ↔ telefone)
  const isEmail = identifier.includes('@');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!identifier.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    try {
      await login(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error', err);
      setError('Email/telefone ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-bg">
              <Brain className="login-logo-icon" />
            </div>
            <h1 className="login-title">MindFocus</h1>
            <h2 className="login-subtitle">Bem-vindo de volta</h2>
            <p className="login-text">Continue sua jornada de evolução pessoal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Campo de Email ou Telefone */}
            <div className="login-input-wrapper">
              <label htmlFor="identifier" className="sr-only">
                Email ou telefone
              </label>
              <div className="login-input-icon" aria-hidden="true">
                {isEmail ? <Mail /> : <Phone />}
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@exemplo.com ou +5511999999999"
                className="login-input"
                autoComplete="username"
                required
              />
            </div>

            {/* Campo de Senha */}
            <div className="login-input-wrapper">
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="login-input-icon" aria-hidden="true">
                <Lock />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="login-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="login-input-eye"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
                <span className="sr-only">
                  {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                </span>
              </button>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="login-error-box" role="alert">
                <AlertCircle className="login-error-icon" />
                <p className="login-error-text">{error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
              aria-disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Não possui conta?{' '}
              <button
                type="button"
                className="login-register-btn"
                onClick={() => navigate('/cadastro')}
                aria-label="Criar conta"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="login-back-wrapper">
          <button
            type="button"
            className="login-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}