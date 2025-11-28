import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { login } from '../../Services/Auth';

import './Login.css';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isEmail = identifier.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="lf-container">
      <div className="lf-card">
        <div className="lf-left">
          <div className="lf-left-inner">
            <div className="lf-brand-row">
              <div className="lf-brand-icon">
                <Brain className="lf-brand-svg" />
              </div>
              <h1 className="lf-brand-title">MindFocus</h1>
            </div>

            <p className="lf-hero-text">
              Organize seus hábitos, mantenha o foco e transforme sua rotina.
            </p>

            <div className="lf-features">
              <div className="lf-feature">
                <span className="lf-feature-dot" />
                <p>Acompanhe seus objetivos diários</p>
              </div>
              <div className="lf-feature">
                <span className="lf-feature-dot" />
                <p>Visualize seu progresso</p>
              </div>
              <div className="lf-feature">
                <span className="lf-feature-dot" />
                <p>Mantenha a consistência</p>
              </div>
            </div>
          </div>

          <div className="lf-blur-circle top-right" />
          <div className="lf-blur-circle bottom-left" />
        </div>

        <div className="lf-right">
          <a href="/" className="lf-back-link" aria-label="Voltar para a página inicial">
            <ArrowLeft className="lf-back-icon" />
            <span className="lf-back-text">Voltar para a página inicial</span>
          </a>

          <div className="lf-form-wrap">
            <h2 className="lf-title">Bem-vindo de volta</h2>
            <p className="lf-sub">Entre para continuar sua jornada</p>

            <form className="lf-form" onSubmit={handleSubmit} noValidate>
              <div className="lf-field">
                <label htmlFor="identifier" className="lf-label">
                  Identificador
                </label>
                <div className="lf-input-wrap">
                  <div className="lf-left-icon" aria-hidden>
                    {isEmail ? <Mail /> : <Phone />}
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email ou usuário"
                    className="lf-input"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="lf-field">
                <label htmlFor="password" className="lf-label">
                  Senha
                </label>
                <div className="lf-input-wrap">
                  <div className="lf-left-icon" aria-hidden>
                    <Lock />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="lf-input"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lf-eye-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="lf-error" role="alert">
                  <AlertCircle className="lf-error-icon" />
                  <p className="lf-error-text">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="lf-submit"
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="lf-register">
              Não tem uma conta?{' '}
              <button
                type="button"
                className="lf-register-link"
                onClick={() => navigate('/cadastro')}
              >
                Registrar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
