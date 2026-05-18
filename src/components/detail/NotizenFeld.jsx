import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function NotizenFeld({ bewerber, onNotizGespeichert }) {
  const [notiz, setNotiz] = useState(bewerber.Notizen || '');
  const [status, setStatus] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => { setNotiz(bewerber.Notizen || ''); }, [bewerber.Notizen]);

  function handleChange(e) {
    setNotiz(e.target.value);
    setStatus(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => speichern(e.target.value), 2000);
  }

  async function speichern(wert) {
    setStatus('saving');
    try {
      await axios.patch(`/api/notizen/${bewerber.Id}`, { notiz: wert });
      setStatus('saved');
    } catch { setStatus('error'); }
  }

  async function handleManuell() {
    if (timerRef.current) clearTimeout(timerRef.current);
    await speichern(notiz);
  }

  return (
    <div className="card-light p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="tag-blue">Notizen</span>
      </div>

      <textarea
        value={notiz} onChange={handleChange} rows={4}
        placeholder="Notizen zur Bewerbung..."
        className="w-full text-sm resize-none transition-colors"
        style={{
          background: 'var(--light)', border: '1px solid var(--border-l)',
          borderRadius: 6, color: 'var(--text-d)', padding: '9px 12px', outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(74,140,200,0.5)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-l)'}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handleManuell} disabled={status === 'saving'}
          className="flex items-center gap-1.5 text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: 'var(--dark)', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}
          onMouseEnter={e => { if (status !== 'saving') e.currentTarget.style.background = '#162d55'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--dark)'; }}
        >
          {status === 'saving' ? 'Speichern...' : 'Speichern'}
        </button>
        {status === 'saved' && <span className="text-xs" style={{ color: '#16a34a' }}>Gespeichert</span>}
        {status === 'error' && <span className="text-xs" style={{ color: '#dc2626' }}>Fehler beim Speichern</span>}
      </div>
    </div>
  );
}
