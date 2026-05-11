import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function NotizenFeld({ bewerber, onNotizGespeichert }) {
  const [notiz, setNotiz] = useState(bewerber.Notizen || '');
  const [status, setStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const timerRef = useRef(null);

  useEffect(() => {
    setNotiz(bewerber.Notizen || '');
  }, [bewerber.Notizen]);

  function handleChange(e) {
    const wert = e.target.value;
    setNotiz(wert);
    setStatus(null);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => speichern(wert), 2000);
  }

  async function speichern(wert) {
    setStatus('saving');
    try {
      await axios.patch(`/api/notizen/${bewerber.Id}`, { notiz: wert });
      setStatus('saved');
      onNotizGespeichert?.();
    } catch {
      setStatus('error');
    }
  }

  async function handleManuellSpeichern() {
    if (timerRef.current) clearTimeout(timerRef.current);
    await speichern(notiz);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h2 className="text-sm font-semibold text-text-dark">📝 Meine Notizen</h2>

      <textarea
        value={notiz}
        onChange={handleChange}
        rows={4}
        placeholder="Notizen zur Bewerbung..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handleManuellSpeichern}
          disabled={status === 'saving'}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {status === 'saving' ? (
            <><span className="animate-spin">⏳</span> Speichern...</>
          ) : (
            <>💾 Speichern</>
          )}
        </button>

        {status === 'saved' && (
          <span className="text-xs text-green-600">✓ Gespeichert</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-red-500">Fehler beim Speichern</span>
        )}
      </div>
    </div>
  );
}
