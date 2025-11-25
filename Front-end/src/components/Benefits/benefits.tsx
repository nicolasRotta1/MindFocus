import { CheckSquare, Calendar, Target, BarChart3 } from 'lucide-react';
import './benefits.css';

const benefits = [
  {
    icon: CheckSquare,
    title: 'Acompanhe seus hábitos',
    description: 'Registre e monitore seus hábitos diários com facilidade',
  },
  {
    icon: Calendar,
    title: 'Crie rotinas personalizadas',
    description: 'Monte rotinas que se adaptam ao seu estilo de vida',
  },
  {
    icon: Target,
    title: 'Mantenha o foco e a consistência',
    description: 'Ferramentas que ajudam você a manter-se no caminho',
  },
  {
    icon: BarChart3,
    title: 'Veja estatísticas do seu desempenho',
    description: 'Acompanhe seu progresso com visualizações claras',
  },
];

export default function Benefits() {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <div className="benefits-header">
          <h2 className="benefits-title">
            Tudo que você precisa para evoluir
          </h2>
          <p className="benefits-subtitle">
            Ferramentas simples e poderosas para construir uma vida mais focada e produtiva
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefits-card"
            >
              <div className="benefit-icon-wrapper">
                <benefit.icon className="benefit-icon" />
              </div>
              <h3 className="benefit-card-title">
                {benefit.title}
              </h3>
              <p className="benefit-card-description">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
