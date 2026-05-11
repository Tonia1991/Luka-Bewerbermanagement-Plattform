import { useState, useEffect } from 'react';
import axios from 'axios';

const VORLAGE_EINLADUNG_BETREFF = (stelle) =>
  `Einladung zum Vorstellungsgespräch – Biohacking Club`;

const VORLAGE_EINLADUNG_TEXT = (vorname, nachname, stelle) => `Sehr geehrte/r ${vorname} ${nachname},

vielen Dank für Ihre Bewerbung als ${stelle} bei uns im Biohacking Club.

Wir freuen uns, Sie zu einem persönlichen Vorstellungsgespräch einzuladen.
Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um einen Termin zu vereinbaren.

Mit freundlichen Grüßen,
Das Team des Biohacking Club
🌿 Biohacking Club`;

const VORLAGE_ABSAGE_BETREFF = () => `Ihre Bewerbung beim Biohacking Club`;

const VORLAGE_ABSAGE_TEXT = (vorname, nachname, stelle) => `Sehr geehrte/r ${vorname} ${nachname},

vielen Dank für Ihr Interesse an der Stelle als ${stelle} bei uns im Biohacking Club und die Zeit, die Sie in Ihre Bewerbung investiert haben.

Nach sorgfältiger Prüfung Ihrer Unterlagen müssen wir Ihnen leider mitteilen, dass wir Ihre Bewerbung nicht weiterverfolgen können.

Für Ihren weiteren beruflichen Weg wünschen wir Ihnen alles Gute.

Mit freundlichen Grüßen,
Das Team des Biohacking Club

---
Datenschutzhinweis: Ihre Bewerbungsunterlagen werden gemäß DSGVO innerhalb von 30 Tagen nach dieser Mitteilung vollständig gelöscht.`;

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

  useEffect(() => {
    ladeKIVorschlag();
  }, []);

  useEffect(() => {
    if (tab === 'einladung') {
      setBetreff(VORLAGE_EINLADUNG_BETREFF(stelle));
      setText(VORLAGE_EINLADUNG_TEXT(vorname, nachname, stelle));
    } else if (tab === 'absage') {
      setBetreff(VORLAGE_ABSAGE_BETREFF());
      setText(VORLAGE_ABSAGE_TEXT(vorname, nachname, stelle));
    }
  }, [tab]);

  async function ladeKIVorschlag() {
    setKiLoading(true);
    setKiError(null);
    try {
      const res = await axios.post('/api/email-vorschlag', {
        aktion,
        vorname,
        nachname,
        stelle,
        ki_zusammenfassung: bewerber?.KI_Zusammenfassung || '',
        ki_staerken: bewerber?.KI_Staerken || '',
        ki_schwaechen: bewerber?.KI_Schwaechen || '',
      });
      setBetreff(res.data.betreff);
      setText(res.data.text);
    } catch {
      setKiError('KI-Vorschlag konnte nicht geladen werden.');
      setTab('einladung');
      setBetreff(aktion === 'einladen' ? VORLAGE_EINLADUNG_BETREFF(stelle) : VORLAGE_ABSAGE_BETREFF());
      setText(aktion === 'einladen'
        ? VORLAGE_EINLADUNG_TEXT(vorname, nachname, stelle)
        : VORLAGE_ABSAGE_TEXT(vorname, nachname, stelle));
    } finally {
      setKiLoading(false);
    }
  }

  async function handleSenden() {
    setSending(true);
    try {
      await onSend({ betreff, text });
      onClose();
    } finally {
      setSending(false);
    }
  }

  const name = bewerber?.Name || `${vorname} ${nachname}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-text-dark">
            Email an {name} senden
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b bg-gray-50">
          {[
            { key: 'ki', label: '🤖 KI-Vorschlag' },
            { key: 'einladung', label: '📋 Einladung' },
            { key: 'absage', label: '📋 Absage' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-4 space-y-4">
          {tab === 'ki' && kiLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              🤖 KI-Vorschlag wird geladen...
            </div>
          )}
          {kiError && tab === 'ki' && (
            <p className="text-sm text-red-500">{kiError}</p>
          )}

          {/* Betreff */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Betreff:</label>
            <input
              type="text"
              value={betreff}
              onChange={e => setBetreff(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Email Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email-Text:</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={12}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSenden}
            disabled={sending || !betreff || !text}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {sending ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Senden...</>
            ) : (
              <>📧 Email senden</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
