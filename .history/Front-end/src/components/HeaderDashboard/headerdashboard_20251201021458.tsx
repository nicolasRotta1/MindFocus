import { Bell, Flame } from 'lucide-react';
import './headerdashboard.css';
import api, { API_ENDPOINTS } from '../../config/api';
import { useEffect, useState } from 'react';
import { getHabits, getHabitStats } from '../../Services/HabitsService';
import { useNavigate } from 'react-router-dom';
import NotificationsService, { type NotificacaoDTO } from '../../Services/NotificationsService';

export default function HeaderDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuário');
  const [streak, setStreak] = useState<number | null>(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notificacoes, setNotificacoes] = useState<NotificacaoDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await api.get(API_ENDPOINTS.USUARIO.ATUAL);
        const data = resp?.data;
        if (!mounted || !data) return;
        setUserName(data?.nome || 'Usuário');

        // se o backend não fornece streak no DTO, calcular a partir dos hábitos
        try {
          const habits = await getHabits();
          if (!mounted || !Array.isArray(habits)) return;
          const statsObj: number[] = [];
          await Promise.all(habits.map(async (h: any) => {
            try {
              const s = await getHabitStats(h.id);
              const st = s?.streakAtual ?? 0;
              statsObj.push(st);
            } catch (e) {
              console.warn('Erro ao buscar stat do hábito', h.id, e);
            }
          }));
          const maxStreak = statsObj.length ? Math.max(...statsObj) : 0;
          setStreak(maxStreak);
        } catch (err) {
          console.error('Erro ao calcular streak a partir dos hábitos:', err);
          setStreak(0);
        }

        try {
          const count = await NotificationsService.getUnreadCount();
          if (mounted) setUnreadCount(count);
        } catch (err) {
          console.error('Erro ao recuperar contador de notificações:', err);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário no header:', err);
        setStreak(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleNotificacaoClick = async () => {
    const newState = !showNotifDropdown;
    setShowNotifDropdown(newState);
    
    if (newState) {
      try {
        const notifs = await NotificationsService.getNotifications();
        setNotificacoes(notifs);
        try {
          const count = await NotificationsService.getUnreadCount();
          setUnreadCount(count);
        } catch {}
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
      }
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      if (notificacoes.find(n => n.id === notifId && !n.lida)) {
        await NotificationsService.markAsRead(notifId);
        const updatedNotifs = await NotificationsService.getNotifications();
        setNotificacoes(updatedNotifs);
        const count = await NotificationsService.getUnreadCount();
        setUnreadCount(count);
      }
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
    }
  };

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  const sanitizeHtml = (html?: string) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  };

  return (
    <header className="mf-header">
      <div>
        <h2 className="mf-header-title">Olá, {userName}</h2>
        <p className="mf-header-sub">Bem-vindo de volta ao seu espaço de hábitos</p>
      </div>

      <div className="mf-header-right">
        <div className="mf-streak" title={`${streak ?? '-'} dias de streak`}>
          <Flame size={16} />
          <span className="mf-streak-text">{streak ?? '-' } dias de streak</span>
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="mf-icon-notif" 
            aria-label="Notificações"
            onClick={handleNotificacaoClick}
          >
            <Bell size={18} />
            <span 
              className="mf-notif-dot" 
              data-count={unreadCount > 0 ? unreadCount : undefined}
            />
          </button>

          {showNotifDropdown && (
            <div className="mf-notif-dropdown" role="menu" aria-label="Notificações">
              {notificacoes.length === 0 ? (
                <div className="mf-notif-empty">Sem notificações</div>
              ) : (
                notificacoes.map(notif => (
                  <div
                    key={notif.id}
                    className="mf-notif-item"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="mf-notif-item-title">{notif.titulo}</div>
                    <div 
                      className="mf-notif-item-msg"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(notif.mensagem) }}
                    />
                    <div className="mf-notif-item-time">
                      {notif.criadaEm ? new Date(notif.criadaEm).toLocaleString() : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button 
          className="mf-avatar"
          aria-label="Ir para perfil"
          onClick={handleAvatarClick}
        >
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </button>
      </div>
    </header>
  );
}
