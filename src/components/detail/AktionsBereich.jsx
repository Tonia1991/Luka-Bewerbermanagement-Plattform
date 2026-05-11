import { useState } from 'react';
import axios from 'axios';
import EmailModal from '../shared/EmailModal.jsx';

export default function AktionsBereich({ bewerber, onAktualisieren }) {
  const [emailModal, setEmailModal] = useState(null); // null | 'einladen' | 'absagen'
  const [statusLoading, setStatusLoading] = useState(false);
  const [fehler, setFehler] = useState(null);

  async function handleStatusAendern(neuerStatus) {
    setStatusLoading(true);
    setFehler(null);
    try {
      await axios.patch(`/api/notizen/${bewerber.Id}/status`, { status: neuerStatus });
      onAktualisieren();
    } catch {
      setFehler('Fehler beim Ändern des Status.');
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleEntscheidung({ betreff, text }) {
    const aktion = emailModal;
    await axios.post('/api/entscheidung', {
      nocodb_id: bewerber.Id,
      aktion,
      email_betreff: betreff,
      email_text: text,
    });
    onAktualisieren();
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 sticky top-4">
        <h2 className="text-sm font-semibold text-text-dark">Entscheidung treffen:</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setEmailModal('einladen')}
            disabled={bewerber.Status === 'Eingeladen'}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ✅ Einladen
          </button>
          <button
            onClick={() => setEmailModal('absagen')}
            disabled={bewerber.Status === 'Abgesagt'}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ❌ Absagen
          </button>
        </div>

        <div className="border-t pt-3 space-y-2">
          <p className="text-xs text-text-muted font-medium">Status ändern:</p>
          <button
            onClick={() => handleStatusAendern('In Bearbeitung')}
            disabled={statusLoading || bewerber.Status === 'In Bearbeitung'}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ⏳ In Bearbeitung setzen
          </button>
        </div>

        {fehler && <p className="text-xs text-red-500">{fehler}</p>}
      </div>

      {emailModal && (
        <EmailModal
          bewerber={bewerber}
          aktion={emailModal}
          onClose={() => setEmailModal(null)}
          onSend={handleEntscheidung}
        />
      )}
    </>
  );
}
