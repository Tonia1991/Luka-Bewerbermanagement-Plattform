import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DokumentenAnzeige({ bewerber }) {
  const [aktivePDF, setAktivePDF] = useState(null);
  const [dateien, setDateien] = useState([]);
  const [ladeFehler, setLadeFehler] = useState(false);
  const [nextcloudBase, setNextcloudBase] = useState('');

  const nextcloudOrdner = bewerber.NextcloudOrdner_Pfad || bewerber.Nextcloud_Ordner || bewerber.NextcloudOrdner || '';

  useEffect(() => {
    axios.get('/api/config').then(r => setNextcloudBase(r.data.nextcloudBaseUrl || '')).catch(() => {});
  }, []);

  useEffect(() => {
    if (!nextcloudOrdner) return;
    setDateien([]);
    setLadeFehler(false);
    axios.get(`/api/dokument/liste?pfad=${encodeURIComponent(nextcloudOrdner)}`)
      .then(r => setDateien(r.data.dateien || []))
      .catch(() => setLadeFehler(true));
  }, [nextcloudOrdner]);

  function pdfUrl(datei) {
    return `/api/dokument?pfad=${encodeURIComponent(`${nextcloudOrdner}/${datei}`)}`;
  }

  function nextcloudLink() {
    if (!nextcloudOrdner || !nextcloudBase) return '#';
    return `${nextcloudBase}/index.php/apps/files/?dir=${encodeURIComponent('/' + nextcloudOrdner)}`;
  }

  return (
    <div className="card-light p-5 space-y-3">
      <span className="tag-blue">Bewerbungsunterlagen</span>

      {!nextcloudOrdner ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kein Nextcloud-Ordner verknüpft.</p>
      ) : ladeFehler ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ordner nicht erreichbar.</p>
      ) : dateien.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Keine Dateien im Ordner.</p>
      ) : (
        <>
          <div className="space-y-1.5">
            {dateien.map(datei => (
              <div
                key={datei}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded transition-all"
                style={{
                  border: `1px solid ${aktivePDF === datei ? 'rgba(74,140,200,0.3)' : 'var(--border-l)'}`,
                  background: aktivePDF === datei ? 'rgba(74,140,200,0.04)' : 'var(--light)',
                }}
              >
                <span className="text-sm" style={{ color: 'var(--text-d)' }}>{datei}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAktivePDF(aktivePDF === datei ? null : datei)}
                    className="text-xs font-medium"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)' }}
                  >
                    {aktivePDF === datei ? 'Schließen' : 'Anzeigen'}
                  </button>
                  <a
                    href={pdfUrl(datei)} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          {aktivePDF && (
            <div className="space-y-2">
              <iframe
                src={pdfUrl(aktivePDF)} width="100%" height="600"
                style={{ border: '1px solid var(--border-l)', borderRadius: 6, display: 'block' }}
                title={aktivePDF}
              />
            </div>
          )}

          {nextcloudBase && (
            <a
              href={nextcloudLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: 'var(--blue)', textDecoration: 'none' }}
            >
              In Nextcloud öffnen →
            </a>
          )}
        </>
      )}
    </div>
  );
}
