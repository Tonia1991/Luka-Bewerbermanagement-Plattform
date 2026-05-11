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

export default function MassenAktionModal({ ausgewaehlte, onClose, onErfolg }) {
  const [betreff, setBetreff] = useState(ABSAGE_BETREFF);
  const [text, setText] = useState(ABSAGE_TEXT);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleAbsagen() {
    setSending(true);
    setError(null);
    try {
      await axios.post('/api/entscheidung/massen', {
        nocodb_ids: ausgewaehlte.map(b => b.Id),
        email_betreff: betreff,
        email_text: text,
      });
      onErfolg();
      onClose();
    } catch {
      setError('Fehler beim Senden der Massenabsage.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-text-dark">
            ❌ Massenabsage ({ausgewaehlte.length} Bewerbungen)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-700 mb-2">Absage wird gesendet an:</p>
            <ul className="space-y-1">
              {ausgewaehlte.map(b => (
                <li key={b.Id} className="text-sm text-red-600">
                  • {b.Name} – {b.Stelle}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Betreff:</label>
            <input
              type="text"
              value={betreff}
              onChange={e => setBetreff(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email-Vorlage (wird individuell mit Namen/Stelle befüllt durch n8n):
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={10}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Abbrechen
          </button>
          <button
            onClick={handleAbsagen}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {sending ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Senden...</>
            ) : (
              <>❌ Alle absagen und Emails versenden</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
