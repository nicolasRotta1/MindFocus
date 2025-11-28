import { Brain } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './header.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-inner">
          <div className="header-logo">
            <Brain className="header-logo-icon" />
            <span className="header-logo-text">MindFocus</span>
          </div>

          <div className="header-buttons">
            <button 
              className="header-btn-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button 
              className="header-btn-register"
              onClick={() => navigate("/cadastro")}
            >
              Cadastro
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
