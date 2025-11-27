import { useState } from 'react';
import { Brain, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import './cadastro.css';
import { useNavigate } from 'react-router-dom';
import { registerUser, queryUser, setToken } from '../../Services/Auth';
import type { IdentifierType } from '../../Services/Auth';

type AuthMethod = 'email' | 'phone';

interface FormErrors {
  name?: string;
  contact?: string;
  password?: string;
  general?: string;
}

type CadastroProps = {
  onBackClick?: () => void;
};

export default function Cadastro({ onBackClick }: CadastroProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const validateEmail = (email: string): boolean => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\+?\d{10,15}$/.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (authMethod === 'email') {
      if (!formData.email.trim()) {
        newErrors.contact = 'Email é obrigatório';
      } else if (!validateEmail(formData.email)) {
        newErrors.contact = 'Email inválido';
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.contact = 'Telefone é obrigatório';
      } else if (!validatePhone(formData.phone)) {
        newErrors.contact = 'Telefone inválido (formato: +55 ou 10-15 dígitos)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const payload: any = {
        nome: formData.name.trim(),
        senha: formData.password,
      };

      if (authMethod === 'email' && formData.email.trim()) {
        payload.email = formData.email.trim();
      }
      if (authMethod === 'phone' && formData.phone.trim()) {
        // enviar telefone apenas com dígitos e opcional +
        const cleaned = formData.phone.replace(/[^+\d]/g, '');
        payload.telefone = cleaned;
      }

      // Call backend register
      await registerUser(payload);

      // Try to log in automatically after register
      const identifier = authMethod === 'email' ? formData.email : formData.phone;
      const identifierType: IdentifierType = authMethod === 'email' ? 'email' : 'telefone';

      const loginResult = await queryUser({ identifier, identifierType, senha: formData.password });

      if (loginResult && loginResult.token) {
        setToken(loginResult.token);
        // navigate to dashboard
        navigate('/dashboard');
        return;
      }

      // If backend didn't return token on register, show success and navigate to login/back
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', password: '' });
      setTimeout(() => {
        setSuccess(false);
        if (onBackClick) onBackClick();
        else navigate('/login');
      }, 2500);
    } catch (err: any) {
      console.error('Cadastro error', err);
      const message = err?.message || 'Erro ao criar conta. Tente novamente.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if ((errors as any)[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (name === 'contact') {
      setErrors((prev) => ({
        ...prev,
        contact: undefined,
      }));
    }
  };

  return (
    <div className="cadastro-bg">
      <div className="cadastro-wrapper">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <div className="cadastro-logo-bg">
              <Brain className="cadastro-logo-icon" size={32} />
            </div>
            <h1 className="cadastro-title">MindFocus</h1>
            <h2 className="cadastro-subtitle">Criar conta</h2>
            <p className="cadastro-text">Comece sua jornada de transformação</p>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-form" noValidate>
            {success && (
              <div className="cadastro-success-box" role="status" aria-live="polite">
                <CheckCircle className="cadastro-success-icon" size={20} />
                <p className="cadastro-success-text">Conta criada com sucesso!</p>
              </div>
            )}

            {errors.general && (
              <div className="cadastro-error-box" role="alert">
                <AlertCircle className="cadastro-error-icon" size={20} />
                <p className="cadastro-error-text">{errors.general}</p>
              </div>
            )}

            <div className="cadastro-input-group">
              <label htmlFor="name" className="cadastro-label">
                Nome completo
              </label>
              <div className="cadastro-input-wrapper">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="João Silva"
                  className={`cadastro-input ${errors.name ? 'cadastro-input-error' : ''}`}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  required
                />
              </div>
              {errors.name && <p id="name-error" className="cadastro-input-error-text">{errors.name}</p>}
            </div>

            <div className="cadastro-input-group">
              <label className="cadastro-label">Registrar com</label>
              <div className="cadastro-switch-wrapper" role="tablist" aria-label="Método de autenticação">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`cadastro-switch-btn ${authMethod === 'email' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={authMethod === 'email'}
                  aria-controls="email-panel"
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`cadastro-switch-btn ${authMethod === 'phone' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={authMethod === 'phone'}
                  aria-controls="phone-panel"
                >
                  Telefone
                </button>
              </div>
            </div>

            {authMethod === 'email' && (
              <div id="email-panel" role="tabpanel" className="cadastro-input-group">
                <label htmlFor="email" className="cadastro-label">
                  Email
                </label>
                <div className="cadastro-input-wrapper">
                  <div className="cadastro-input-icon">
                    <Mail size={20} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className={`cadastro-input ${errors.contact ? 'cadastro-input-error' : ''}`}
                    autoComplete="email"
                    aria-invalid={!!errors.contact}
                    aria-describedby={errors.contact ? 'contact-error' : undefined}
                    required
                  />
                </div>
                {errors.contact && <p id="contact-error" className="cadastro-input-error-text">{errors.contact}</p>}
              </div>
            )}

            {authMethod === 'phone' && (
              <div id="phone-panel" role="tabpanel" className="cadastro-input-group">
                <label htmlFor="phone" className="cadastro-label">
                  Telefone
                </label>
                <div className="cadastro-input-wrapper">
                  <div className="cadastro-input-icon">
                    <Phone size={20} />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+55 11 99999-9999"
                    className={`cadastro-input ${errors.contact ? 'cadastro-input-error' : ''}`}
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={!!errors.contact}
                    aria-describedby={errors.contact ? 'contact-error' : undefined}
                    required
                  />
                </div>
                {errors.contact && <p id="contact-error" className="cadastro-input-error-text">{errors.contact}</p>}
              </div>
            )}

            <div className="cadastro-input-group">
              <label htmlFor="password" className="cadastro-label">
                Senha
              </label>
              <div className="cadastro-input-wrapper">
                <div className="cadastro-input-icon">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 8 caracteres"
                  className={`cadastro-input ${errors.password ? 'cadastro-input-error' : ''}`}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cadastro-input-eye"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="cadastro-input-error-text">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cadastro-btn"
              aria-disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="cadastro-footer">
            <p>
              Já possui uma conta?{' '}
              <button
                onClick={() => {
                  if (onBackClick) onBackClick();
                  else navigate('/login');
                }}
                className="cadastro-login-btn"
                aria-label="Entrar"
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}