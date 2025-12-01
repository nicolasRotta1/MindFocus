import { Home, Target, Calendar, User, LogOut } from 'lucide-react';
import './sidebar.css';
import { logout } from '../../Services/Auth';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="mf-sidebar">
      <div className="mf-sidebar-top">
        <h1 className="mf-logo">MindFocus</h1>
        <p className="mf-sub">Gerencie seus hábitos</p>
      </div>

      <nav className="mf-nav">
        <button className="mf-nav-item active" onClick={() => navigate('/')}><Home size={20} /> <span>Dashboard</span></button>
        <button className="mf-nav-item" onClick={() => navigate('/meus-habitos')}><Target size={20} /> <span>Meus Hábitos</span></button>
        <button className="mf-nav-item" onClick={() => navigate('/rotina')}><Calendar size={20} /> <span>Rotina</span></button>
        <button className="mf-nav-item" onClick={() => navigate('/profile')}><User size={20} /> <span>Perfil</span></button>
      </nav>

      <div className="mf-sidebar-bottom">
        <button 
  className="mf-logout"
  onClick={async () => {
    await logout();
    window.location.href = '/login';
  }}
>
  <LogOut size={20} /> 
  <span>Sair</span>
</button>

      </div>
    </aside>
  );
}
