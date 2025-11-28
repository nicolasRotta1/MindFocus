import { Brain } from 'lucide-react';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-logo">
              <Brain className="footer-logo-icon" />
              <span className="footer-logo-text">MindFocus</span>
            </div>
            <p className="footer-description">
              Transforme sua vida através de hábitos consistentes.
              Clareza mental e progresso contínuo ao seu alcance.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2025 MindFocus. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
