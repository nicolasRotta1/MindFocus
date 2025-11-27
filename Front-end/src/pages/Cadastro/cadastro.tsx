import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Phone } from 'lucide-react';
import { register } from '../../Services/Auth';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

function Cadastro() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    identifier: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
      nome: formData.fullName,
      senha: formData.password,
      ...(identifierType === 'email'
      ? { email: formData.identifier }
      : { telefone: formData.identifier })
  };

  await register(payload);
  navigate('/login');
} catch (err: any) {
  console.error(err);
  setError(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="app-container">
      <div className="card-wrapper">

        <div className="left-panel">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>

          <div className="panel-content">
            <h1 className="brand-title">MindFocus</h1>
            <div className="line"></div>

            <p className="description">
              "Crie sua conta, organize seus hábitos e transforme sua rotina."
            </p>

            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <p>Acompanhe seu progresso diário</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <p>Crie hábitos consistentes</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <p>Alcance suas metas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <a href="/" className="back-link">
            <ArrowLeft className="icon-sm" />
            Voltar para a página inicial
          </a>

          <div className="form-wrapper">
            <div className="header-text">
              <h2>Criar conta</h2>
              <p>Comece sua jornada de transformação hoje</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="fullName">Nome completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-switch-container">
                  <label htmlFor="identifier">
                    {identifierType === 'email' ? 'Email' : 'Telefone'}
                  </label>
                  <div className="switch-buttons">
                    <button
                      type="button"
                      className={identifierType === 'email' ? 'switch-active' : 'switch-inactive'}
                      onClick={() => setIdentifierType('email')}
                    >
                      <Mail className="icon-xs" /> Email
                    </button>
                    <button
                      type="button"
                      className={identifierType === 'phone' ? 'switch-active' : 'switch-inactive'}
                      onClick={() => setIdentifierType('phone')}
                    >
                      <Phone className="icon-xs" /> Telefone
                    </button>
                  </div>
                </div>

                <input
                  type={identifierType === 'email' ? 'email' : 'tel'}
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder={identifierType === 'email' ? 'Digite seu email' : 'Digite seu telefone'}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Crie uma senha"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <div className="footer-link">
              Já tem conta? <a href="/login">Fazer login</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cadastro;
