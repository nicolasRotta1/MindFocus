import { Sparkles } from 'lucide-react';
import './motivation.css';
import { useNavigate } from 'react-router-dom';

export default function Motivation() {
const navigate = useNavigate();
  return (
    
    <section className="motivation">
      <div className="motivation-container">
        <div className="motivation-box">
          <div className="motivation-icon-wrap">
            <div className="motivation-icon-bg">
              <Sparkles className="motivation-icon" />
            </div>
          </div>

          <h2 className="motivation-title">
            Pequenos passos todos os dias constroem grandes resultados.
          </h2>

          <p className="motivation-subtitle">
            Comece sua jornada de transformação hoje mesmo
          </p>

          <button className="motivation-button" 
          onClick={() => navigate("/cadastro")}>
            Criar minha conta grátis
          </button>
        </div>
      </div>
    </section>
  );
}
