import { useState, useEffect } from 'react';
import axios from 'axios';

function formatDatum(datum) {
  if (!datum) return '';
  return new Date(datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function EmailVerlauf({ bewerber }) {
  const [emails, setEmails] = useState([]);
  const [laden, setLaden] = useState(false);
  const [fehler, setFehler] = useState(null);

  const bewerberEmail = bewerber?.Email || '';

  useEffect(() => {
    if (!bewerberEmail) return;
    setLaden(true);
    setFehler(null);
    axios.get(`/api/emails?email=${encodeURIComponent(bewerberEmail)}`)
      .then(r => setEmails(r.data.emails || []))
      .catch(err => setFehler(err.response?.data?.error || err.message))
      .finally(() => setLaden(false));
  }, [bewerberEmail]);

  if (!bewerberEmail) return null;

  return (
    <div className="card-light p-5 space-y-3">
      <span className="tag-blue">Email-Verlauf</span>

      {laden && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Lade Emails...</p>}
      {fehler && <p className="text-xs" style={{ color: '#dc2626' }}>{fehler}</p>}

      {!laden && !fehler && emails.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Keine Emails gefunden.</p>
      )}

      {emails.map(email => (
        <div
          key={email.uid}
          className="px-3 py-2.5 rounded space-y-1"
          style={{
            border: '1px solid var(--border-l)',
            background: email.richtung === 'ausgehend' ? 'rgba(74,140,200,0.03)' : 'var(--light)',
            borderLeft: `3px solid ${email.richtung === 'ausgehend' ? 'rgba(74,140,200,0.4)' : 'rgba(22,163,74,0.4)'}`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-d)' }}>{email.betreff}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
              style={{
                background: email.richtung === 'ausgehend' ? 'rgba(74,140,200,0.1)' : 'rgba(22,163,74,0.1)',
                color: email.richtung === 'ausgehend' ? 'var(--blue)' : '#16a34a',
              }}
            >
              {email.richtung === 'ausgehend' ? '↑ Gesendet' : '↓ Empfangen'}
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {email.richtung === 'ausgehend' ? `An: ${email.an}` : `Von: ${email.von}`}
            <span className="ml-2">{formatDatum(email.datum)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
