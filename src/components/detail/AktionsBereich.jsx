import { useState } from 'react';
import axios from 'axios';
import EmailModal from '../shared/EmailModal.jsx';

export default function AktionsBereich({ bewerber, onAktualisieren }) {
  const [emailModal, setEmailModal] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [fehler, setFehler] = useState(null);

  async function handleStatusAendern(neuerStatus) {
    setStatusLoading(true); setFehler(null);
    try {
      await axios.patch(`/api/notizen/${bewerber.Id}/status`, { status: neuerStatus });
      onAktualisieren();
    } catch { setFehler('Fehler beim Ändern des Status.'); }
    finally { setStatusLoading(false); }
  }

  async function handleEntscheidung({ betreff, text }) {
    try {
      await axios.post('/api/entscheidung', {
        nocodb_id: bewerber.Id, aktion: emailModal,
        email_betreff: betreff, email_text: text,
      });
      onAktualisieren();
    } catch (err) {
      setFehler(`Fehler: ${err.response?.data?.detail || err.response?.data?.error || err.message}`);
      throw err;
    }
  }

  const entschieden = bewerber.Status === 'eingeladen' || bewerber.Status === 'abgesagt';

  return (
    <>
      <div className="card-light p-5 space-y-4 sticky top-4">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Entscheidung treffen</p>

        <div className="flex gap-2">
          <button
            onClick={() => setEmailModal('einladen')}
            disabled={entschieden}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 6, padding: '9px 0', cursor: 'pointer' }}
            onMouseEnter={e => { if (!entschieden) e.currentTarget.style.background = 'rgba(22,163,74,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.08)'; }}
          >
            Einladen
          </button>
          <button
            onClick={() => setEmailModal('absagen')}
            disabled={entschieden}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 6, padding: '9px 0', cursor: 'pointer' }}
            onMouseEnter={e => { if (!entschieden) e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
          >
            Absagen
          </button>
        </div>

        {fehler && <p className="text-xs" style={{ color: '#dc2626' }}>{fehler}</p>}
      </div>

      {emailModal && (
        <EmailModal bewerber={bewerber} aktion={emailModal} onClose={() => setEmailModal(null)} onSend={handleEntscheidung} />
      )}
    </>
  );
}
