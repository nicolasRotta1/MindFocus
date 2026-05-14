import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, User, Trash2, Loader } from 'lucide-react';
import { fetchCurrentUser, updateCurrentUser, deleteCurrentUser } from '../../services/Auth';
import './profile.css';
import Sidebar from '../../components/SideBar/sidebar';

interface UsuarioData {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await fetchCurrentUser();
      if (data) {
        setUsuario(data);
        setFormData({
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          novaSenha: '',
          confirmarSenha: '',
        });
      }
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setIsSaving(true);
    try {
      const updatePayload: Record<string, string> = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      };

      if (formData.novaSenha) {
        updatePayload.senha = formData.novaSenha;
      }

      await updateCurrentUser(updatePayload as any);
      setSuccess('Dados atualizados com sucesso!');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        novaSenha: '',
        confirmarSenha: '',
      }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    if (!confirm('Todos os seus hábitos e dados serão perdidos. Deseja continuar?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCurrentUser();
      navigate('/login');
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      setError('Erro ao deletar conta. Tente novamente.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mf-app-root">
        <Sidebar />
        <div className="mf-main-content">
          <main className="mf-main-padded">
            <div className="profile-loading">
              <Loader className="spinner" />
              <p>Carregando perfil...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="mf-app-root">
      <Sidebar />
      <div className="mf-main-content">
        <main className="mf-main-padded">
          <div className="profile-header">
            <button className="profile-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1>Meu Perfil</h1>
          </div>

          <div className="profile-card">
            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            {!isEditing ? (
              // Visualização
              <div className="profile-view">
                <div className="profile-info-group">
                  <div className="profile-info-item">
                    <label>Nome</label>
                    <div className="profile-value">
                      <User size={18} />
                      <span>{usuario?.nome}</span>
                    </div>
                  </div>

                  {usuario?.email && (
                    <div className="profile-info-item">
                      <label>Email</label>
                      <div className="profile-value">
                        <Mail size={18} />
                        <span>{usuario.email}</span>
                      </div>
                    </div>
                  )}

                  {usuario?.telefone && (
                    <div className="profile-info-item">
                      <label>Telefone</label>
                      <div className="profile-value">
                        <Phone size={18} />
                        <span>{usuario.telefone}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  <button
                    className="profile-btn profile-btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </button>
                  <button
                    className="profile-btn profile-btn-danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 size={18} />
                    {isDeleting ? 'Deletando...' : 'Deletar Conta'}
                  </button>
                </div>
              </div>
            ) : (
              // Edição
              <form className="profile-form" onSubmit={handleSave}>
                <div className="profile-form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="profile-input"
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </div>

                <div className="profile-divider" />

                <div className="profile-form-group">
                  <label htmlFor="novaSenha">Nova Senha (deixe em branco para não mudar)</label>
                  <input
                    id="novaSenha"
                    type="password"
                    name="novaSenha"
                    value={formData.novaSenha}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Digite uma nova senha"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="confirmarSenha">Confirmar Senha</label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-btn profile-btn-outline"
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                    }}
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="profile-btn profile-btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
