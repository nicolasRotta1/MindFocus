import './dashboard.css';
import {
  getHabits,
  concludeHabit,
  deleteHabit,
  updateHabit,
  getDashboardUsuario,
  getDashboardHistory,
  getHabitStats,
  isHabitCompletedToday,
} from '../../Services/HabitsService';
import type { HabitResponse, HabitType, HabitFrequency, HabitStatus } from '../../Types';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar/sidebar';
import StatsCards from '../../components/StatCard/statcard';
import HabitCard from '../../components/HabitCard/habitcard';
import HabitCardQuantitativo from '../../components/HabitCard/habitcard-quantitativo';
import ProgressSection from '../../components/ProgressSection/progresssection';
import FloatingButton from '../../components/FloatingButton/floatingbutton';
import NewHabitModal from '../../components/NewHabitModal/newhabitmodal';
import HeaderDashboard from '../../components/HeaderDashboard/headerdashboard';
import HabitoFilter from '../../components/HabitoFilter/habitofilter';

export default function Dashboard() {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [habitsStats, setHabitsStats] = useState<Record<string, any>>({});
  const [dashboard, setDashboard] = useState<any>(null);
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<HabitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filterTipo, setFilterTipo] = useState<HabitType | ''>('');
  const [filterStatus, setFilterStatus] = useState<HabitStatus | ''>('');
  const [filterFrequencia, setFilterFrequencia] = useState<HabitFrequency | ''>('');

  const load = async () => {
    setLoading(true);
    try {
      // 1 - pega hábitos do usuário com filtros
      const data = await getHabits({
        tipo: filterTipo,
        status: filterStatus,
        frequencia: filterFrequencia,
      });
      setHabits(data);

      // 2 - pega overview por usuário (endpoint do backend)
      const dash = await getDashboardUsuario();

      // Preencher dados semanais (weeklyStats e completedDays) usando o endpoint de histórico
      try {
        const today = new Date();
        const end = today.toISOString().split('T')[0];
        const start = new Date();
        start.setDate(today.getDate() - 6); // últimos 7 dias (inclui hoje)
        const de = start.toISOString().split('T')[0];

        const hist = await getDashboardHistory(de, end);

        // Inicializa arrays [Seg,Ter,Qua,Qui,Sex,Sáb,Dom]
        const weeklyStatsArr = [0, 0, 0, 0, 0, 0, 0];
        const completedDaysArr = [false, false, false, false, false, false, false];

        (hist || []).forEach((item: any) => {
          const d = new Date(item.data);
          const jsDay = d.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
          const idx = jsDay === 0 ? 6 : jsDay - 1; // map Mon->0 ... Sun->6
          weeklyStatsArr[idx] = item.progresso ?? 0;
          completedDaysArr[idx] = (item.progresso ?? 0) > 0;
        });

        setDashboard({ ...dash, weeklyStats: weeklyStatsArr, completedDays: completedDaysArr });
      } catch (e) {
        // fallback para dash sem weekly data
        setDashboard(dash);
      }

      // 3 - para cada hábito pega stats individuais e se foi concluído hoje
      const statsObj: any = {};
      const doneObj: any = {};

      await Promise.all(data.map(async (habit) => {
        try {
          statsObj[habit.id] = await getHabitStats(habit.id);
        } catch (e) {
          statsObj[habit.id] = null;
        }
        try {
          doneObj[habit.id] = await isHabitCompletedToday(habit.id);
        } catch (e) {
          doneObj[habit.id] = false;
        }
      }));

      setHabitsStats(statsObj);
      setCompletedToday(doneObj);

    } catch (err) {
      console.error('Erro ao carregar dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterTipo, filterStatus, filterFrequencia]);

  const handleConclude = async (id: number | string, valor?: number) => {
    try {
      await concludeHabit(id, valor);
      // Recarrega após sucesso
      await load();
    } catch (err: any) {
      console.error('Erro ao concluir hábito:', err);
      const errorMsg = 
        err?.response?.data?.mensagem ||
        err?.response?.data?.message ||
        err?.message ||
        (err?.response?.status ? `Erro HTTP ${err.response.status}` : 'Erro desconhecido');
      
      // Tenta recarregar mesmo com erro (pode ter sido salvo no backend)
      await load();
      
      // Mostra erro só após reload
      alert('Aviso: ' + errorMsg);
    }
  };

  const handleUnconclude = async (id: number | string) => {
    try {
      const { unconcludeHabit } = await import('../../Services/HabitsService');
      await unconcludeHabit(id);
      await load();
    } catch (err) {
      console.error('Erro ao desconcluir hábito:', err);
    }
  };

  const handlePause = async (id: number | string) => {
    try {
      await updateHabit(id, { status: 'ATRASADO' });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Deseja realmente excluir este hábito?')) return;
    try {
      await deleteHabit(id);
      await load();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir. Veja o console.');
    }
  };

  const handleEdit = (h: HabitResponse) => {
    setEditing(h);
    setIsModalOpen(true);
  };

  return (
    <div className="mf-app-root">
      <Sidebar />
      <div className="mf-main-content">
        <HeaderDashboard />

        <main className="mf-main-padded">
          <StatsCards
            ativos={dashboard?.totalHabitos ?? habits.length}
            concluidosNoMes={dashboard?.concluidosSemana ?? 0}
            streakDias={Math.max(...Object.values(habitsStats || {}).map((s:any)=>s?.streakAtual ?? 0), 0)}
            consistencia={dashboard?.percentualHoje ?? 0}
          />

          <HabitoFilter
            tipo={filterTipo}
            status={filterStatus}
            frequencia={filterFrequencia}
            onTipoChange={setFilterTipo}
            onStatusChange={setFilterStatus}
            onFrequenciaChange={setFilterFrequencia}
            onClear={() => {
              setFilterTipo('');
              setFilterStatus('');
              setFilterFrequencia('');
            }}
          />

          <div className="mf-grid-layout">
            <div className="mf-left">
              <div className="mf-habits-header">
                <h2>Meus Hábitos</h2>
                <span className="mf-muted">{habits.length} hábitos</span>
              </div>

              {loading ? (
                <p>Carregando...</p>
              ) : (
                <div className="mf-habits-grid">
                  {habits.map((h) => 
                    h.tipo === 'QUANTITATIVO' ? (
                      <HabitCardQuantitativo
                        key={h.id}
                        {...h}
                        streak={habitsStats[h.id]?.streakAtual ?? 0}
                        totalConcluidos={habitsStats[h.id]?.totalConcluido ?? 0}
                        concluidoHoje={completedToday[h.id] ?? false}
                        onConclude={handleConclude}
                        onUnconclude={handleUnconclude}
                        onEdit={handleEdit}
                        onPause={handlePause}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <HabitCard
                        key={h.id}
                        {...h}
                        streak={habitsStats[h.id]?.streakAtual ?? 0}
                        totalConcluidos={habitsStats[h.id]?.totalConcluido ?? 0}
                        concluidoHoje={completedToday[h.id] ?? false}
                        onConclude={handleConclude}
                        onUnconclude={handleUnconclude}
                        onEdit={handleEdit}
                        onPause={handlePause}
                        onDelete={handleDelete}
                      />
                    )
                  )}
                </div>
              )}
            </div>

            <aside className="mf-right">
              <ProgressSection
                completedDays={dashboard?.completedDays ?? [false,false,false,false,false,false,false]}
                weeklyStats={dashboard?.weeklyStats ?? [0,0,0,0,0,0,0]}
                monthProgress={dashboard?.monthProgress ?? dashboard?.percentualHoje ?? 0}
              />
            </aside>
          </div>
        </main>
      </div>

      <FloatingButton onClick={() => { setEditing(null); setIsModalOpen(true); }} />
      <NewHabitModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        editing={editing}
        onSaved={() => load()}
      />
    </div>
  );
}
