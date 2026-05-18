import { useState, useEffect } from 'react';
import axios from 'axios';

const VORLAGE_EINLADUNG_BETREFF = () => `Einladung zum Gespräch – Biohacking Club Berlin`;
const VORLAGE_EINLADUNG_TEXT = (vorname, nachname, stelle) => `Hey ${vorname},

danke für deine Bewerbung als ${stelle} bei uns im Biohacking Club – wir haben uns deine Unterlagen genau angeschaut und sind begeistert!

Wir würden dich gerne persönlich kennenlernen und laden dich herzlich zu einem ersten Gespräch ein. Such dir gerne direkt einen passenden Termin aus:

https://calcom.antoniabutze.de/calender

Wir freuen uns auf dich!

Dein Team vom Biohacking Club`;

const VORLAGE_ABSAGE_BETREFF = () => `Deine Bewerbung beim Biohacking Club Berlin`;
const VORLAGE_ABSAGE_TEXT = (vorname, nachname, stelle) => `Hey ${vorname},

danke, dass du dir die Zeit genommen hast, dich als ${stelle} bei uns zu bewerben – das wissen wir wirklich zu schätzen.

Nach sorgfältiger Prüfung deiner Unterlagen haben wir uns leider gegen eine Einladung zum Gespräch entschieden. Das war keine leichte Entscheidung, da wir viele tolle Bewerbungen erhalten haben.

Wir wünschen dir alles Gute für deinen weiteren Weg und hoffen, dass du die richtige Stelle findest!

Das Team vom Biohacking Club Berlin

---
Datenschutzhinweis: Deine Bewerbungsunterlagen werden gemäß DSGVO innerhalb von 30 Tagen nach dieser Mitteilung vollständig gelöscht.`;

const tabStyle = (aktiv) => ({
  padding: '5px 12px', borderRadius: 4, fontSize: 13, fontWeight: 500,
  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
  background: aktiv ? 'var(--dark)' : 'transparent',
  color: aktiv ? '#fff' : 'var(--text-muted)',
});

const inputStyle = {
  width: '100%', background: 'var(--light)', border: '1px solid var(--border-l)',
  borderRadius: 6, color: 'var(--text-d)', padding: '10px 12px', fontSize: 13,
  outline: 'none', transition: 'border-color 0.2s',
};

export default function EmailModal({ bewerber, aktion, onClose, onSend }) {
  const [tab, setTab] = useState('ki');
  const [betreff, setBetreff] = useState('');
  const [text, setText] = useState('');
  const [kiLoading, setKiLoading] = useState(false);
  const [kiError, setKiError] = useState(null);
  const [sending, setSending] = useState(false);

  const vorname = bewerber?.Vorname || bewerber?.Name?.split(' ')[0] || '';
  const nachname = bewerber?.Nachname || bewerber?.Name?.split(' ').slice(1).join(' ') || '';
  const stelle = bewerber?.Stelle || '';

  useEffect(() => { ladeKIVorschlag(); }, []);

  useEffect(() => {
    if (tab === 'einladung') { setBetreff(VORLAGE_EINLADUNG_BETREFF()); setText(VORLAGE_EINLADUNG_TEXT(vorname, nachname, stelle)); }
    else if (tab === 'absage') { setBetreff(VORLAGE_ABSAGE_BETREFF()); setText(VORLAGE_ABSAGE_TEXT(vorname, nachname, stelle)); }
  }, [tab]);

  async function ladeKIVorschlag() {
    setKiLoading(true); setKiError(null);
    try {
      const res = await axios.post('/api/email-vorschlag', {
        aktion, vorname, nachname, stelle,
        ki_zusammenfassung: bewerber?.KI_Zusammenfassung || '',
        ki_staerken: bewerber?.KI_Staerken || '',
        ki_schwaechen: bewerber?.KI_Schwaechen || '',
      });
      setBetreff(res.data.betreff); setText(res.data.text);
    } catch {
      setKiError('KI-Vorschlag nicht verfügbar.');
      setTab(aktion === 'einladen' ? 'einladung' : 'absage');
    } finally { setKiLoading(false); }
  }

  async function handleSenden() {
    setSending(true);
    try { await onSend({ betreff, text }); onClose(); }
    finally { setSending(false); }
  }

  const name = bewerber?.Name || `${vorname} ${nachname}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(15,30,58,0.45)' }}>
      <div style={{ background: 'var(--light-card)', borderRadius: 10, width: '100%', maxWidth: 640, boxShadow: '0 16px 48px rgba(15,30,58,0.18)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-l)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-d)' }}>Email an {name} senden</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)', lineHeight: 1, padding: '2px 6px' }}>×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3" style={{ borderBottom: '1px solid var(--border-l)', background: 'var(--light)' }}>
          {[{ key: 'ki', label: 'KI-Vorschlag' }, { key: 'einladung', label: 'Einladung' }, { key: 'absage', label: 'Absage' }].map(t => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                if (t.key === 'ki') ladeKIVorschlag();
              }}
              style={tabStyle(tab === t.key)}
            >{t.label}</button>
          ))}
        </div>

        <div className="px-6 py-4 space-y-3">
          {tab === 'ki' && kiLoading && (
            <div className="flex items-center gap-2 text-sm py-2" style={{ color: 'var(--text-muted)' }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 flex-shrink-0" style={{ borderColor: 'var(--blue)' }}></div>
              KI-Vorschlag wird generiert...
            </div>
          )}
          {kiError && <p className="text-xs" style={{ color: '#dc2626' }}>{kiError}</p>}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-sub)' }}>Betreff</label>
            <input
              type="text" value={betreff} onChange={e => setBetreff(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(74,140,200,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-l)'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-sub)' }}>Email-Text</label>
            <textarea
              value={text} onChange={e => setText(e.target.value)} rows={11}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'monospace', fontSize: 12 }}
              onFocus={e => e.target.style.borderColor = 'rgba(74,140,200,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-l)'}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid var(--border-l)', background: 'var(--light)', borderRadius: '0 0 10px 10px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
            Abbrechen
          </button>
          <button
            onClick={handleSenden}
            disabled={sending || !betreff || !text}
            className="flex items-center gap-2 font-semibold text-sm transition-all disabled:opacity-50"
            style={{ background: 'var(--dark)', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer' }}
            onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#162d55'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--dark)'; }}
          >
            {sending ? <><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white flex-shrink-0"></div> Senden...</> : <>Email senden</>}
          </button>
        </div>
      </div>
    </div>
  );
}
