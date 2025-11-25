import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { queryUser, setToken } from '../../lib/Auth';
import type { IdentifierType } from '../../lib/Auth';
import './Login.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isEmail = identifier.includes('@');
  const identifierType: IdentifierType = isEmail ? 'email' : 'telefone';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await queryUser({ identifier: identifier.trim(), identifierType, senha: password });
      if (!result || !result.token) {
        setError('Credenciais inválidas. Verifique e tente novamente.');
        setIsLoading(false);
        return;
      }

      setToken(result.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error', err);
      const message = err?.message || 'Erro ao conectar com o servidor. Tente mais tarde.';
      setError(message);
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
            <h2 className="login-subtitle">Bem-vindo de volta 👋</h2>
            <p className="login-text">Continue sua jornada de evolução pessoal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-input-wrapper">
              <label htmlFor="identifier" className="sr-only">Email ou telefone</label>
              <div className="login-input-icon" aria-hidden>
                {isEmail ? <Mail /> : <Phone />}
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@exemplo.com ou +551199999999"
                className={`login-input ${error && !identifier ? 'login-input-error' : ''}`}
                autoComplete="username"
                aria-invalid={!!error && !identifier}
              />
            </div>

            <div className="login-input-wrapper">
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="login-input-icon" aria-hidden>
                <Lock />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className={`login-input ${error && !password ? 'login-input-error' : ''}`}
                autoComplete="current-password"
                aria-invalid={!!error && !password}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="login-input-eye"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
                <span className="sr-only">{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
              </button>
            </div>

            {error && (
              <div className="login-error-box" role="alert">
                <AlertCircle className="login-error-icon" />
                <p className="login-error-text">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Não possui conta?{' '}
              <button
                className="login-register-btn"
                onClick={() => navigate('/cadastro')}
                aria-label="Criar conta"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        <div className="login-back-wrapper">
          <button className="login-back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}