import { useEffect, useState } from 'react';
import { listarHabitos, criarHabito, atualizarHabito, deletarHabito, concluirHabito } from '../../lib/habito';
import type { Habito } from '../../lib/habito';
import { getToken, logout, fetchCurrentUser } from '../../lib/Auth';
import './dashboard.css';

export default function Dashboard() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formNome, setFormNome] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const token = getToken();

  const handleUnauthorized = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore
    }
    window.location.href = '/login';
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarHabitos();
      setHabitos(data || []);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar hábitos. Tente novamente.');
      // Se devolveu erro de autorização, redireciona para login
      if (String(err).includes('401')) {
        await handleUnauthorized();
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const u = await fetchCurrentUser();
        if (!u) {
          await handleUnauthorized();
          return;
        }
        setUser(u);
        await load();
      } catch (err: any) {
        console.error(err);
        setError('Erro ao obter dados do usuário.');
        if (String(err).includes('401')) {
          await handleUnauthorized();
        }
      }
    })();
  }, [token]);

  const handleCreate = async () => {
    if (!formNome.trim()) return;
    setCreating(true);
    setError(null);
    setInfo(null);
    try {
      const novo = await criarHabito({ nome: formNome });
      setHabitos(prev => [novo, ...prev]);
      setFormNome('');
      setInfo('Hábito criado com sucesso.');
    } catch (err: any) {
      console.error(err);
      setError('Erro ao criar hábito.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deletarHabito(id);
      setHabitos(prev => prev.filter(h => h.id !== id));
      setInfo('Hábito removido.');
    } catch (err) {
      console.error(err);
      setError('Erro ao remover hábito.');
    }
  };

  const handleConcluir = async (id?: string) => {
    if (!id) return;
    try {
      const updated = await concluirHabito(id);
      setHabitos(prev => prev.map(h => (h.id === updated.id ? updated : h)));
      setInfo('Hábito marcado como concluído.');
    } catch (err) {
      console.error(err);
      setError('Erro ao concluir hábito.');
    }
  };

  const startEdit = (h: Habito) => {
    setEditingId(h.id || null);
    setFormNome(h.nome);
  };

  const submitEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await atualizarHabito(editingId, { nome: formNome });
      setHabitos(prev => prev.map(h => (h.id === updated.id ? updated : h)));
      setEditingId(null);
      setFormNome('');
      setInfo('Hábito atualizado.');
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar hábito.');
    }
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingId) submitEdit();
      else handleCreate();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      window.location.href = '/login';
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h2>MindFocus - Meus Hábitos</h2>
        <div className="actions">
          {user && <span className="user">{user.nome || user.email}</span>}
          <button onClick={handleLogout} className="btn-ghost">Sair</button>
        </div>
      </header>

      <main>
        {error && <div className="toast error">{error}</div>}
        {info && <div className="toast success">{info}</div>}
        <section className="create">
          <input value={formNome} onChange={e => setFormNome(e.target.value)} onKeyDown={handleInputKey} placeholder="Novo hábito" />
          {editingId ? (
            <>
              <button onClick={submitEdit} className="btn-primary">Salvar</button>
              <button onClick={() => { setEditingId(null); setFormNome(''); }} className="btn-ghost">Cancelar</button>
            </>
          ) : (
            <button onClick={handleCreate} className="btn-primary" disabled={creating}>{creating ? 'Criando...' : 'Criar'}</button>
          )}
        </section>

        <section className="list">
          {loading ? (
            <div className="spinner">Carregando...</div>
          ) : (
            <> 
              {habitos.length === 0 ? (
                <div className="empty">Nenhum hábito encontrado. Crie o seu primeiro hábito!</div>
              ) : (
                <ul>
                  {habitos.map(h => (
                    <li key={h.id} className={h.concluido ? 'done' : ''}>
                      <div className="item">
                        <div>
                          <strong>{h.nome}</strong>
                          {h.descricao && <p className="desc">{h.descricao}</p>}
                        </div>
                        <div className="item-actions">
                          <button onClick={() => startEdit(h)} className="btn-ghost">Editar</button>
                          <button onClick={() => handleConcluir(h.id)} className="btn-primary small">Concluir</button>
                          <button onClick={() => handleDelete(h.id)} className="btn-danger small">Remover</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
