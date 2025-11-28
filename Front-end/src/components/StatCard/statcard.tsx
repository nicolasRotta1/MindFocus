import { Target, CheckCircle, Flame, TrendingUp } from 'lucide-react';
import './statcard.css';

export default function StatsCards({
  ativos = 0,
  concluidosNoMes = 0,
  streakDias = 0,
  consistencia = 0,
}: {
  ativos?: number;
  concluidosNoMes?: number;
  streakDias?: number;
  consistencia?: number; 
}) {
  return (
    <div className="mf-stats-grid">
      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-blue-light">
          <Target size={24} />
        </div>
        <p className="mf-stat-value">{ativos}</p>
        <p className="mf-stat-label">Hábitos Ativos</p>
      </div>

      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-green-light">
          <CheckCircle size={24} />
        </div>
        <p className="mf-stat-value">{concluidosNoMes}</p>
        <p className="mf-stat-label">Concluídos no Mês</p>
      </div>

      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-orange-light">
          <Flame size={24} />
        </div>
        <p className="mf-stat-value">{streakDias}</p>
        <p className="mf-stat-label">Dias de Streak</p>
      </div>

      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-purple-light">
          <TrendingUp size={24} />
        </div>
        <p className="mf-stat-value">{consistencia}%</p>
        <p className="mf-stat-label">Taxa de Consistência</p>
      </div>
    </div>
  );
}
