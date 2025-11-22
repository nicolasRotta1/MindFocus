import { useState } from 'react';
import { Mail, Phone, Lock, User, AlertCircle, CheckCircle, Loader2, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import './cadastro.css';

type ModoCadastro = 'email' | 'phone';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  terms?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
}

export function Cadastro() {
  const [mode, setMode] = useState<ModoCadastro>('email');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false,
    phone: false,
    password: false,
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  };
  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return 0;
    let strength = 0;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (mode === 'email') {
      if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
      else if (!validateEmail(formData.email)) newErrors.email = 'E-mail inválido';
    } else {
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Telefone inválido (10-15 dígitos)';
    }
    if (!formData.password.trim()) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 8) newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    if (!formData.terms) newErrors.terms = 'Você deve aceitar os termos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, value);
  };

  const validateField = (field: keyof FormData, value: string | boolean) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'name':
        if (!String(value).trim()) newErrors.name = 'Nome é obrigatório';
        else delete newErrors.name;
        break;
      case 'email':
        if (!String(value).trim()) newErrors.email = 'E-mail é obrigatório';
        else if (!validateEmail(String(value))) newErrors.email = 'E-mail inválido';
        else delete newErrors.email;
        break;
      case 'phone':
        if (!String(value).trim()) newErrors.phone = 'Telefone é obrigatório';
        else if (!validatePhone(String(value))) newErrors.phone = 'Telefone inválido (10-15 dígitos)';
        else delete newErrors.phone;
        break;
      case 'password':
        if (!String(value).trim()) newErrors.password = 'Senha é obrigatória';
        else if (String(value).length < 8) newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
        else delete newErrors.password;
        break;
      case 'terms':
        if (!value) newErrors.terms = 'Você deve aceitar os termos';
        else delete newErrors.terms;
        break;
    }
    setErrors(newErrors);
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleModeChange = (newMode: ModoCadastro) => {
    setMode(newMode);
    setErrors({});
    setTouched({ name: false, email: false, phone: false, password: false, terms: false });
    setSuccessMessage('');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    handleChange('phone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    Object.keys(formData).forEach(key => setTouched(prev => ({ ...prev, [key]: true })));
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setFormData({ name: '', email: '', phone: '', password: '', terms: false });
      setTouched({ name: false, email: false, phone: false, password: false, terms: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColor = ['#DC2626', '#F59E0B', '#10B981', '#10B981'][strength] || '#DC2626';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/" aria-label="Ir para a página inicial">
              <CheckSquare className="icon-large indigo" strokeWidth={2.5} aria-hidden="true" />
              <h1>MindFocus</h1>
            </Link>
          </div>
          <nav className="nav" aria-label="Navegação principal">
            <Link to="/" className="nav-link" aria-label="Página Inicial">Início</Link>
            <Link to="/about" className="nav-link" aria-label="Sobre Nós">Sobre</Link>
            <button className="btn btn-login" aria-label="Fazer login">Login</button>
            <button className="btn btn-signup" aria-label="Cadastrar-se">Cadastrar-se</button>
          </nav>
        </div>
      </header>

      <div className="signup-container">
        <div className="signup-box">
          <h2>Crie sua conta</h2>

          <div className="mode-toggle">
            <button
              className={mode === 'email' ? 'active' : ''}
              onClick={() => handleModeChange('email')}
              aria-pressed={mode === 'email'}
            >
              <Mail className="icon-small" /> E-mail
            </button>
            <button
              className={mode === 'phone' ? 'active' : ''}
              onClick={() => handleModeChange('phone')}
              aria-pressed={mode === 'phone'}
            >
              <Phone className="icon-small" /> Telefone
            </button>
          </div>

          {successMessage && (
            <div className="success-message" role="alert">
              <CheckCircle aria-hidden="true" /> {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <div className="input-container">
                <User className="icon-input" aria-hidden="true" />
                <input
                  id="name"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="João Silva"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {touched.name && !errors.name && <CheckCircle className="icon-right success" aria-hidden="true" />}
              </div>
              {touched.name && errors.name && (
                <div id="name-error" className="error-message" role="alert">
                  <AlertCircle aria-hidden="true" /> {errors.name}
                </div>
              )}
            </div>

            {mode === 'email' ? (
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <div className="input-container">
                  <Mail className="icon-input" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="seu@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {touched.email && !errors.email && <CheckCircle className="icon-right success" aria-hidden="true" />}
                </div>
                {touched.email && errors.email && (
                  <div id="email-error" className="error-message" role="alert">
                    <AlertCircle aria-hidden="true" /> {errors.email}
                  </div>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="phone">Telefone</label>
                <div className="input-container">
                  <Phone className="icon-input" aria-hidden="true" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={() => handleBlur('phone')}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {touched.phone && !errors.phone && <CheckCircle className="icon-right success" aria-hidden="true" />}
                </div>
                {touched.phone && errors.phone && (
                  <div id="phone-error" className="error-message" role="alert">
                    <AlertCircle aria-hidden="true" /> {errors.phone}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="input-container">
                <Lock className="icon-input" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Mínimo 8 caracteres"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {touched.password && !errors.password && <CheckCircle className="icon-right success" aria-hidden="true" />}
              </div>
              {touched.password && formData.password && (
                <div className="password-strength">
                  <div className="strength-bar" style={{ width: `${(strength / 4) * 100}%`, backgroundColor: strengthColor }} />
                </div>
              )}
              {touched.password && errors.password && (
                <div id="password-error" className="error-message" role="alert">
                  <AlertCircle aria-hidden="true" /> {errors.password}
                </div>
              )}
            </div>

            <div className="form-group terms">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={e => handleChange('terms', e.target.checked)}
                onBlur={() => handleBlur('terms')}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
              />
              <label htmlFor="terms">Aceito os <a href="#">termos de uso</a> e <a href="#">política de privacidade</a></label>
              {touched.terms && errors.terms && (
                <div id="terms-error" className="error-message" role="alert">
                  <AlertCircle aria-hidden="true" /> {errors.terms}
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" /> Cadastrando...
                </>
              ) : (
                'Cadastrar-se'
              )}
            </button>
          </form>

          <p className="login-text">
            Já tem uma conta? <a href="/login">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
}