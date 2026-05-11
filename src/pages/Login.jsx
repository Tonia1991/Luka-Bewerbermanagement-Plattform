import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

export default function Login() {
  const [passwort, setPasswort] = useState('');
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
        const msg = err.response?.data?.error || '';

        if (status === 429) {
          setGesperrt(true);
          setFehler('Zu viele Fehlversuche. Bitte 15 Minuten warten.');
        } else if (status === 401) {
          setFehler('Falsches Passwort.');
        } else {
          setFehler(msg || 'Anmeldung fehlgeschlagen.');
        }
      } else {
        setFehler('Verbindungsfehler.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="text-2xl font-bold text-primary">Biohacking Club</h1>
          <p className="text-sm text-text-muted mt-1">Bewerbermanagement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </label>
            <input
              type="password"
              value={passwort}
              onChange={e => setPasswort(e.target.value)}
              disabled={gesperrt || loading}
              placeholder="Passwort eingeben..."
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          {fehler && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {fehler}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || gesperrt || !passwort}
            className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Anmelden...
              </span>
            ) : (
              'Anmelden'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
