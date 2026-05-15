import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function NavItem({ to, label, badge, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-all border-l-[3px] ${
          isActive
            ? 'nav-active'
            : 'border-l-transparent text-white/55 hover:bg-white/5 hover:text-white/80'
        }`
      }
    >
      <span>{label}</span>
      {badge !== undefined && badge !== null && badge > 0 && (
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(74,140,200,0.2)', color: '#7ab8e8', minWidth: 20, textAlign: 'center' }}
        >
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
    <aside
      className="w-[220px] min-h-screen flex flex-col flex-shrink-0"
      style={{ background: 'var(--dark)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{
            width: 30, height: 30, borderRadius: 6,
            background: '#4A8CC8',
            color: '#fff',
            letterSpacing: '0.05em',
          }}
        >
          BC
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Biohacking Club</div>
          <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8 }}>
            Recruiting
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>
          Navigation
        </p>
        <NavItem to="/dashboard" label="Dashboard" end />
        <NavItem to="/dashboard" label="Alle Bewerbungen" badge={stats?.gesamt} />

        <div className="pt-3 pb-1">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>
            Status
          </p>
        </div>
        <NavItem to="/dashboard?status=Neu" label="Neu" badge={stats?.neu} />
        <NavItem to="/dashboard?status=In%20Bearbeitung" label="In Bearbeitung" badge={stats?.inBearbeitung} />
        <NavItem to="/dashboard?status=Eingeladen" label="Eingeladen" badge={stats?.eingeladen} />
        <NavItem to="/dashboard?status=Abgesagt" label="Abgesagt" badge={stats?.abgesagt} />
      </nav>

      {/* Abmelden */}
      <div className="px-3 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors border-l-[3px] border-l-transparent"
          style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent'; }}
        >
          Abmelden
        </button>
      </div>
    </aside>
  );
}
