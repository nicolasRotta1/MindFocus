import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getHabitProgressHistory, getDashboardHistory } from '../../Services/HabitsService';
import type { ProgressHistoryItem } from '../../Services/HabitsService';
import './habithistory.css';
import Sidebar from '../../components/SideBar/sidebar';

export default function HabitHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [history, setHistory] = useState<ProgressHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadHistory();
  }, [startDate, endDate]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      let data: ProgressHistoryItem[] = [];

      if (id) {
        // Histórico de um hábito específico
        data = await getHabitProgressHistory(id, startDate, endDate);
      } else {
        // Histórico do dashboard: percentual de hábitos concluídos por dia
        data = await getDashboardHistory(startDate, endDate);
      }

      setHistory(data || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico do hábito');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retorna a cor de fundo conforme o progresso:
   * 100% = verde (#10b981)
   * 50-99% = amarelo (#f59e0b)
   * 25-49% = laranja (#ff9500)
   * < 25% = vermelho (#ef4444)
   */
  const getProgressColor = (progresso: number): string => {
    if (progresso === 100) return '#10b981';
    if (progresso >= 50) return '#f59e0b';
    if (progresso >= 25) return '#ff9500';
    return '#ef4444';
  };

  const generateCalendarDays = () => {
    const year = new Date(startDate).getFullYear();
    const month = new Date(startDate).getMonth();
    const date = new Date(year, month, 1);
    const days = [];

    // Criar mapa de progresso por data
    const progressMap = new Map<string, number>();
    history.forEach(item => {
      progressMap.set(item.data, item.progresso);
    });

    while (date.getMonth() === month) {
      const dateStr = date.toISOString().split('T')[0];
      const progresso = progressMap.get(dateStr);
      days.push({
        date: dateStr,
        day: date.getDate(),
        progresso: progresso ?? 0,
        hasProgress: progresso !== undefined && progresso > 0,
      });
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const completedCount = history.filter(h => h.progresso === 100).length;
  const totalPossibleDays = calendarDays.length;
  const totalWithProgress = history.length;

  if (loading && history.length === 0) {
    return (
      <div className="mf-app-root">
        <Sidebar />
        <div className="mf-main-content">
          <main className="mf-main-padded">
            <div className="history-loading">
              <p>Carregando histórico...</p>
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
          <div className="history-header">
            <button className="history-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1>Histórico de Conclusões</h1>
          </div>

          {error && <div className="history-error">{error}</div>}

          <div className="history-container">
            {/* Estatísticas */}
            <div className="history-stats">
              <div className="history-stat">
                <span className="history-stat-label">100% Concluído</span>
                <span className="history-stat-value">{completedCount}</span>
              </div>
              <div className="history-stat">
                <span className="history-stat-label">Com Progresso</span>
                <span className="history-stat-value">{totalWithProgress}</span>
              </div>
              <div className="history-stat">
                <span className="history-stat-label">Taxa Completa</span>
                <span className="history-stat-value">
                  {totalPossibleDays > 0 ? Math.round((completedCount / totalPossibleDays) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Filtros de Data */}
            <div className="history-filters">
              <div className="history-filter-group">
                <label htmlFor="startDate">De</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="history-date-input"
                />
              </div>
              <div className="history-filter-group">
                <label htmlFor="endDate">Até</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="history-date-input"
                />
              </div>
            </div>

            {/* Calendário */}
            <div className="history-calendar">
              <h3 className="history-calendar-title">
                {new Date(startDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>

              <div className="history-weekdays">
                <div className="history-weekday">Dom</div>
                <div className="history-weekday">Seg</div>
                <div className="history-weekday">Ter</div>
                <div className="history-weekday">Qua</div>
                <div className="history-weekday">Qui</div>
                <div className="history-weekday">Sex</div>
                <div className="history-weekday">Sab</div>
              </div>

              <div className="history-days">
                {/* Preencher dias vazios do início */}
                {Array(new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(), 1).getDay())
                  .fill(null)
                  .map((_, i) => (
                    <div key={`empty-${i}`} className="history-day history-day-empty" />
                  ))}

                {/* Dias do mês */}
                {calendarDays.map((day) => (
                  <div
                    key={day.date}
                    className={`history-day ${day.hasProgress ? 'history-day-progress' : ''}`}
                    style={day.hasProgress ? { backgroundColor: getProgressColor(day.progresso) } : {}}
                    title={`${day.date}: ${day.progresso}%`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>

              <div className="history-legend">
                <div className="history-legend-item">
                  <div className="history-legend-box" style={{ backgroundColor: '#10b981' }} />
                  <span>100% Completo</span>
                </div>
                <div className="history-legend-item">
                  <div className="history-legend-box" style={{ backgroundColor: '#f59e0b' }} />
                  <span>50-99%</span>
                </div>
                <div className="history-legend-item">
                  <div className="history-legend-box" style={{ backgroundColor: '#ff9500' }} />
                  <span>25-49%</span>
                </div>
                <div className="history-legend-item">
                  <div className="history-legend-box" style={{ backgroundColor: '#ef4444' }} />
                  <span>&lt; 25%</span>
                </div>
              </div>
            </div>

            {/* Lista de Datas */}
            <div className="history-list">
              <h3>Progresso Registrado</h3>
              {history.length > 0 ? (
                <div className="history-dates">
                  {history
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((item) => (
                      <div key={item.data} className="history-date-item" style={{ borderLeft: `4px solid ${getProgressColor(item.progresso)}` }}>
                        <Calendar size={16} />
                        <div className="history-date-content">
                          <span className="history-date-label">
                            {new Date(item.data).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="history-date-progress">{item.progresso}% {item.valor ? `(${item.valor})` : ''}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="history-empty">Nenhuma conclusão registrada neste período.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
