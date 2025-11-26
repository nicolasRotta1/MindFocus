import { Bell, Flame } from 'lucide-react';
import './headerdashboard.css';
import { api } from '../../config/api';
import { useEffect, useState } from 'react';

export default function HeaderDashboard() {
  const [userName, setUserName] = useState('Usuário');
  const [streak, setStreak] = useState<number | null>(7);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/usuario/atual');
        if (!mounted) return;
        setUserName(data?.nome || 'Usuário');
        if (data?.streak) setStreak(data.streak);
      } catch (err) {
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header className="mf-header">
      <div>
        <h2 className="mf-header-title">Olá, {userName}</h2>
        <p className="mf-header-sub">Bem-vindo de volta ao seu espaço de hábitos</p>
      </div>

      <div className="mf-header-right">
        <div className="mf-streak">
          <Flame size={16} />
          <span className="mf-streak-text">{streak ?? '-' } dias de streak</span>
        </div>

        <button className="mf-icon-notif" aria-label="Notificações">
          <Bell size={18} />
          <span className="mf-notif-dot" />
        </button>

        <div className="mf-avatar">U</div>
      </div>
    </header>
  );
}
