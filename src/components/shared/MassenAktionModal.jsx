import { useState } from 'react';
import axios from 'axios';

const ABSAGE_BETREFF = 'Ihre Bewerbung beim Biohacking Club';
const ABSAGE_TEXT = `Sehr geehrte/r [Vorname] [Nachname],

vielen Dank für Ihr Interesse an der Stelle als [Stelle] bei uns im Biohacking Club und die Zeit, die Sie in Ihre Bewerbung investiert haben.

Nach sorgfältiger Prüfung Ihrer Unterlagen müssen wir Ihnen leider mitteilen, dass wir Ihre Bewerbung nicht weiterverfolgen können.

Für Ihren weiteren beruflichen Weg wünschen wir Ihnen alles Gute.

Mit freundlichen Grüßen,
Das Team des Biohacking Club

---
Datenschutzhinweis: Ihre Bewerbungsunterlagen werden gemäß DSGVO innerhalb von 30 Tagen nach dieser Mitteilung vollständig gelöscht.`;

const inputStyle = {
  width: '100%', background: 'var(--light)', border: '1px solid var(--border-l)',
  borderRadius: 6, color: 'var(--text-d)', padding: '9px 12px', fontSize: 13, outline: 'none',
};

export default function MassenAktionModal({ ausgewaehlte, onClose, onErfolg }) {
  const [betreff, setBetreff] = useState(ABSAGE_BETREFF);
  const [text, setText] = useState(ABSAGE_TEXT);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleAbsagen() {
    setSending(true); setError(null);
    try {
      await axios.post('/api/entscheidung/massen', {
        nocodb_ids: ausgewaehlte.map(b => b.Id),
        email_betreff: betreff, email_text: text,
      });
      onErfolg(); onClose();
    } catch {
      setError('Fehler beim Senden der Massenabsage.');
    } finally { setSending(false); }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(15,30,58,0.45)' }}>
      <div style={{ background: 'var(--light-card)', borderRadius: 10, width: '100%', maxWidth: 620, boxShadow: '0 16px 48px rgba(15,30,58,0.18)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-l)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-d)' }}>
            Massenabsage ({ausgewaehlte.length} Bewerbungen)
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)', padding: '2px 6px' }}>×</button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="rounded p-3" style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.12)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#dc2626' }}>Absage wird gesendet an:</p>
            <ul className="space-y-1">
              {ausgewaehlte.map(b => (
                <li key={b.Id} className="text-xs" style={{ color: '#dc2626' }}>– {b.Name} · {b.Stelle}</li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-sub)' }}>Betreff</label>
            <input type="text" value={betreff} onChange={e => setBetreff(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-sub)' }}>Email-Vorlage</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={9}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'monospace', fontSize: 12 }} />
          </div>
          {error && <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>}
        </div>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid var(--border-l)', background: 'var(--light)', borderRadius: '0 0 10px 10px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>Abbrechen</button>
          <button
            onClick={handleAbsagen} disabled={sending}
            className="flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-50"
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer' }}
            onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#dc2626'; }}
          >
            {sending ? <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white flex-shrink-0"></div> Senden...</> : <>Alle absagen und Emails versenden</>}
          </button>
        </div>
      </div>
    </div>
  );
}
