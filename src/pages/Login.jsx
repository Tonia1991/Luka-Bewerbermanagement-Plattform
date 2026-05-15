import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

export default function Login() {
  const [passwort, setPasswort] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [fehler, setFehler] = useState('');
  const [loading, setLoading] = useState(false);
  const [gesperrt, setGesperrt] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!passwort || loading || gesperrt) return;
    setLoading(true);
    setFehler('');

    try {
      await login(passwort);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 429) {
          setGesperrt(true);
          setFehler('Zu viele Fehlversuche. Bitte 15 Minuten warten.');
        } else {
          setFehler('Falsches Passwort.');
        }
      } else {
        setFehler('Verbindungsfehler.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--light)' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-80 flex-shrink-0 p-10"
        style={{ background: 'var(--dark)' }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 30, height: 30, borderRadius: 6,
              background: '#4A8CC8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}
          >
            BC
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Biohacking Club</div>
            <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}>
              Recruiting
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
            Internes Tool · DSGVO-konform · Hetzner EU
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xs">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              style={{
                width: 30, height: 30, borderRadius: 6,
                background: '#4A8CC8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff',
              }}
            >
              BC
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-d)' }}>Biohacking Club</div>
              <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)' }}>
                Recruiting
              </div>
            </div>
          </div>

          <h1
            className="font-bold mb-1"
            style={{ fontSize: '1.5rem', color: 'var(--text-d)', letterSpacing: '-0.02em' }}
          >
            Anmelden
          </h1>
          <p className="mb-7 text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Zugang zum Bewerbermanagement
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-sub)' }}>
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={passwort}
                  onChange={e => setPasswort(e.target.value)}
                  disabled={gesperrt || loading}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full text-sm pr-20 transition-colors"
                  style={{
                    background: 'var(--light-card)',
                    border: `1px solid ${fehler ? '#ef4444' : 'var(--border-l)'}`,
                    borderRadius: 6,
                    color: 'var(--text-d)',
                    padding: '11px 14px',
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(74,140,200,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = fehler ? '#ef4444' : 'var(--border-l)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPw ? 'Verbergen' : 'Anzeigen'}
                </button>
              </div>
            </div>

            {fehler && (
              <div
                className="text-sm px-3 py-2.5 rounded"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}
              >
                {fehler}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || gesperrt || !passwort}
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--dark)',
                color: '#fff',
                borderRadius: 6,
                padding: '11px 24px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!loading && !gesperrt) e.currentTarget.style.background = '#162d55'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--dark)'; }}
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white flex-shrink-0"></div> Anmelden...</>
              ) : (
                <>Anmelden</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
