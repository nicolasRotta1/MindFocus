import { Home, Target, TrendingUp, Calendar, User, LogOut } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="mf-sidebar">
      <div className="mf-sidebar-top">
        <h1 className="mf-logo">MindFocus</h1>
        <p className="mf-sub">Gerencie seus hábitos</p>
      </div>

      <nav className="mf-nav">
        <a href="#" className="mf-nav-item active"><Home size={18}/> <span>Dashboard</span></a>
        <a href="#" className="mf-nav-item"><Target size={18}/> <span>Meus Hábitos</span></a>
        <a href="#" className="mf-nav-item"><TrendingUp size={18}/> <span>Progresso / Insights</span></a>
        <a href="#" className="mf-nav-item"><Calendar size={18}/> <span>Rotina</span></a>
        <a href="#" className="mf-nav-item"><User size={18}/> <span>Perfil</span></a>
      </nav>

      <div className="mf-sidebar-bottom">
        <button className="mf-logout"><LogOut size={16}/> <span>Sair</span></button>
      </div>
    </aside>
  );
}
