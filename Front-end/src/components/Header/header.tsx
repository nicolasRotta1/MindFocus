import { CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assumindo que você está usando react-router-dom para navegação. Se não, substitua por <a> tags.
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" aria-label="Ir para a página inicial">
            <CheckSquare className="icon-large indigo" strokeWidth={2.5} aria-hidden="true" />
            <h1>MindFocus</h1>
          </Link>
        </div>
        <nav className="nav" aria-label="Navegação principal">
          <Link to="/" className="nav-link" aria-label="Página Inicial">Início</Link>
          <Link to="/about" className="nav-link" aria-label="Sobre Nós">Sobre</Link> {/* Adicionei 'Sobre' como exemplo de 'etc' */}
          <button className="btn btn-login" aria-label="Fazer login">Login</button>
          <button className="btn btn-signup" aria-label="Cadastrar-se">Cadastrar-se</button>
        </nav>
      </div>
    </header>
  );
}