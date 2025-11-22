import { CheckSquare, Clock, Calendar } from 'lucide-react';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <header className="header">
        <div className="container">
          <div className="logo">
            <CheckSquare className="icon-large indigo" strokeWidth={2.5} aria-hidden="true" />
            <h1>MindFocus</h1>
          </div>
          <nav className="header-nav" aria-label="Navegação principal">
            <button className="btn btn-login" aria-label="Fazer login">Login</button>
            <button className="btn btn-signup" aria-label="Cadastrar-se">Cadastrar-se</button>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="icons-group">
              <CheckSquare className="icon-xl indigo" strokeWidth={1.5} aria-hidden="true" />
              <Clock className="icon-xl indigo-light" strokeWidth={1.5} aria-hidden="true" />
              <Calendar className="icon-xl indigo" strokeWidth={1.5} aria-hidden="true" />
            </div>

            <h2 id="hero-title" className="main-title">
              Organize seus hábitos e aumente sua produtividade
            </h2>

            <p className="main-text">
              Transforme suas metas em realidade com uma plataforma simples e eficiente para gerenciar seus hábitos diários
            </p>

            <div className="main-buttons">
              <button className="btn btn-primary" aria-label="Entrar na plataforma">Entrar</button>
              <button className="btn btn-secondary" aria-label="Cadastrar-se na plataforma">Cadastrar-se</button>
            </div>
          </div>
        </section>

        <section className="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="sr-only">Funcionalidades</h2>
            <div className="features-grid">
              <div className="feature-card">
                <CheckSquare className="icon-medium indigo" strokeWidth={2} aria-hidden="true" />
                <h3>Organize Tarefas</h3>
                <p>Mantenha todos os seus hábitos em um só lugar</p>
              </div>

              <div className="feature-card">
                <Clock className="icon-medium indigo" strokeWidth={2} aria-hidden="true" />
                <h3>Acompanhe Progresso</h3>
                <p>Visualize sua evolução ao longo do tempo</p>
              </div>

              <div className="feature-card">
                <Calendar className="icon-medium indigo" strokeWidth={2} aria-hidden="true" />
                <h3>Crie Rotinas</h3>
                <p>Construa hábitos consistentes e duradouros</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}