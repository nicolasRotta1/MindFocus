
import './dashboard.css';
import { getHabits, concludeHabit, deleteHabit, updateHabit } from '../../Services/HabitsService';
import type { HabitResponse } from '../../Types';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar/sidebar';
import Header from '../../components/Header/header';
import StatsCards from '../../components/StatCard/statcard';
import HabitCard from '../../components/HabitCard/habitcard';
import ProgressSection from '../../components/ProgressSection/progresssection';
import FloatingButton from '../../components/FloatingButton/floatingbutton';
import NewHabitModal from '../../components/NewHabitModal/newhabitmodal';

export default function Dashboard() {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<HabitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      console.error('Erro ao carregar hábitos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleConclude = async (id: number) => {
    try {
      await concludeHabit(id);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  // Como não existe "PAUSADO" no backend, vamos usar ATRASADO como pausa
  const handlePause = async (id: number) => {
    try {
      await updateHabit(id, { status: 'ATRASADO' });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
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
        <Header />
        <main className="mf-main-padded">
          <StatsCards />
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
              <ProgressSection />
            </aside>
          </div>
        </main>
      </div>

      <FloatingButton onClick={() => { setEditing(null); setIsModalOpen(true); }} />
      <NewHabitModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditing(null); }}
        editing={editing}
        onSaved={(_) => { load(); }}
      />
    </div>
  );
}
