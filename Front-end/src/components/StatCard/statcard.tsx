import { Target, CheckCircle, Flame, TrendingUp } from 'lucide-react';
import './statcard.css';

export default function StatsCards() {
  return (
    <div className="mf-stats-grid">
      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-blue-light">
          <Target size={24} />
        </div>
        <p className="mf-stat-value">12</p>
        <p className="mf-stat-label">Hábitos Ativos</p>
      </div>

      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-green-light">
          <CheckCircle size={24} />
        </div>
        <p className="mf-stat-value">45</p>
        <p className="mf-stat-label">Concluídos no Mês</p>
      </div>

      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-orange-light">
          <Flame size={24} />
        </div>
        <p className="mf-stat-value">7</p>
        <p className="mf-stat-label">Dias de Streak</p>
      </div>

      <div className="mf-stat-card">
        <div className="mf-stat-icon bg-purple-light">
          <TrendingUp size={24} />
        </div>
        <p className="mf-stat-value">85%</p>
        <p className="mf-stat-label">Taxa de Consistência</p>
      </div>
    </div>
  );
}
