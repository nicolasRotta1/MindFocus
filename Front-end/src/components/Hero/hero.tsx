import { CheckCircle2, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Construa hábitos que <span className="hero-highlight">transformam</span> sua vida.
            </h1>

            <p className="hero-subtitle">
              Clareza mental, disciplina diária e progresso contínuo.
            </p>

            <button 
              className="hero-button"
              onClick={() => navigate("/cadastro")}
            >
              Começar agora
            </button>
          </div>

          <div className="hero-cards-wrapper">
            <div className="hero-cards-grid">
              <div className="hero-column">
                <HabitCard title="Meditação" progress={85} streak={12} />
                <HabitCard title="Exercícios" progress={70} streak={8} />
              </div>
              <div className="hero-column offset">
                <HabitCard title="Leitura" progress={95} streak={21} />
                <HabitCard title="Água" progress={60} streak={5} />
              </div>
            </div>

            <div className="hero-progress-box">
              <div className="progress-box-inner">
                <div className="progress-icon">
                  <TrendingUp className="progress-icon-svg" />
                </div>
                <div>
                  <p className="progress-label">Progresso mensal</p>
                  <p className="progress-value">+32%</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}



function HabitCard({ title, progress, streak }: { title: string; progress: number; streak: number }) {
  return (
    <div className="habit-card">
      <div className="habit-header">
        <h3 className="habit-title">{title}</h3>
        <CheckCircle2 className="habit-icon" />
      </div>

      <div className="habit-body">
        <div className="habit-labels">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="habit-bar">
          <div
            className="habit-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="habit-streak">🔥 {streak} dias seguidos</p>
      </div>
    </div>
  );
}
