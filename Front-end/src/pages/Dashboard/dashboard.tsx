import './dashboard.css';
import {
  getHabits,
  concludeHabit,
  deleteHabit,
  updateHabit,
  getDashboardUsuario,
  getHabitStats,
  isHabitCompletedToday,
} from '../../Services/HabitsService';
import type { HabitResponse } from '../../Types';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar/sidebar';
import StatsCards from '../../components/StatCard/statcard';
import HabitCard from '../../components/HabitCard/habitcard';
import ProgressSection from '../../components/ProgressSection/progresssection';
import FloatingButton from '../../components/FloatingButton/floatingbutton';
import NewHabitModal from '../../components/NewHabitModal/newhabitmodal';
import HeaderDashboard from '../../components/HeaderDashboard/headerdashboard';

export default function Dashboard() {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [habitsStats, setHabitsStats] = useState<Record<string, any>>({});
  const [dashboard, setDashboard] = useState<any>(null);
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<HabitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // 1 - pega hábitos do usuário
      const data = await getHabits();
      setHabits(data);

      // 2 - pega overview por usuário (endpoint do backend)
      const dash = await getDashboardUsuario();
      setDashboard(dash);

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

  useEffect(() => { load(); }, []);

  const handleConclude = async (id: number | string) => {
    try {
      await concludeHabit(id);
      await load();
    } catch (err) {
      console.error(err);
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
                  {habits.map((h) => (
                    <HabitCard
                      key={h.id}
                      {...h}
                      streak={habitsStats[h.id]?.streakAtual ?? 0}
                      totalConcluidos={habitsStats[h.id]?.totalConcluido ?? 0}
                      concluidoHoje={completedToday[h.id] ?? false}
                      onConclude={handleConclude}
                      onEdit={handleEdit}
                      onPause={handlePause}
                      onDelete={handleDelete}
                    />
                  ))}
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
