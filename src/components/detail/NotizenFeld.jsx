import { useState, useEffect } from 'react';
import axios from 'axios';

function parseNotizen(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [{ text: raw, datum: null }];
}

function formatDatum(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function NotizenFeld({ bewerber, onNotizGespeichert }) {
  const [eintraege, setEintraege] = useState(() => parseNotizen(bewerber.Notizen));
  const [neu, setNeu] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setEintraege(parseNotizen(bewerber.Notizen));
  }, [bewerber.Notizen]);

  async function handleHinzufuegen() {
    if (!neu.trim()) return;
    const neuerEintrag = { text: neu.trim(), datum: new Date().toISOString() };
    const aktualisiert = [neuerEintrag, ...eintraege];
    setStatus('saving');
    try {
      await axios.patch(`/api/notizen/${bewerber.Id}`, { notiz: JSON.stringify(aktualisiert) });
      setEintraege(aktualisiert);
      setNeu('');
      setStatus('saved');
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus('error');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleHinzufuegen();
  }

  const inputStyle = {
    width: '100%', background: 'var(--light)', border: '1px solid var(--border-l)',
    borderRadius: 6, color: 'var(--text-d)', padding: '9px 12px', fontSize: 13,
    outline: 'none', resize: 'none',
  };

  return (
    <div className="card-light p-5 space-y-3">
      <span className="tag-blue">Notizen</span>

      <div className="space-y-2">
        <textarea
          value={neu}
          onChange={e => { setNeu(e.target.value); setStatus(null); }}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Neue Notiz... (Strg+Enter zum Speichern)"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(74,140,200,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-l)'}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={handleHinzufuegen}
            disabled={!neu.trim() || status === 'saving'}
            className="text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: 'var(--dark)', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}
            onMouseEnter={e => { if (status !== 'saving') e.currentTarget.style.background = '#162d55'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--dark)'; }}
          >
            {status === 'saving' ? 'Speichern...' : 'Hinzufügen'}
          </button>
          {status === 'saved' && <span className="text-xs" style={{ color: '#16a34a' }}>Gespeichert</span>}
          {status === 'error' && <span className="text-xs" style={{ color: '#dc2626' }}>Fehler beim Speichern</span>}
        </div>
      </div>

      {/* Verlauf */}
      {eintraege.length > 0 && (
        <div className="space-y-2" style={{ borderTop: '1px solid var(--border-l)', paddingTop: 12 }}>
          <p className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Verlauf</p>
          {eintraege.map((eintrag, i) => (
            <div
              key={i}
              style={{
                background: 'var(--light)',
                border: '1px solid var(--border-l)',
                borderLeft: '3px solid rgba(74,140,200,0.35)',
                borderRadius: 6,
                padding: '8px 12px',
              }}
            >
              {eintrag.datum && (
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{formatDatum(eintrag.datum)}</p>
              )}
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-d)', lineHeight: 1.5 }}>{eintrag.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
