import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function NavItem({ to, label, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-accent text-primary'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <span>{label}</span>
      {badge !== undefined && badge !== null && badge > 0 && (
        <span className="bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ stats }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className="w-[250px] min-h-screen bg-primary flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-2xl font-bold text-white">🌿 Biohacking Club</div>
        <div className="text-xs text-gray-300 mt-1">Bewerbermanagement</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem to="/dashboard" label="📊 Dashboard" />
        <NavItem to="/dashboard?status=Alle" label="👥 Alle Bewerbungen" badge={stats?.gesamt} />
        <NavItem to="/dashboard?status=Neu" label="🆕 Neu" badge={stats?.neu} />
        <NavItem to="/dashboard?status=In%20Bearbeitung" label="⏳ In Bearbeitung" badge={stats?.inBearbeitung} />
        <NavItem to="/dashboard?status=Eingeladen" label="✅ Eingeladen" badge={stats?.eingeladen} />
        <NavItem to="/dashboard?status=Abgesagt" label="❌ Abgesagt" badge={stats?.abgesagt} />
      </nav>

      {/* Abmelden */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          🚪 Abmelden
        </button>
      </div>
    </aside>
  );
}
