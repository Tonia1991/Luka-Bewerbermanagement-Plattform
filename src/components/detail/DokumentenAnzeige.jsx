import { useState, useEffect } from 'react';
import axios from 'axios';

const DOKUMENTE = [
  { key: 'lebenslauf', name: 'Lebenslauf.pdf', datei: 'Lebenslauf.pdf' },
  { key: 'unterlagen', name: 'Weitere Unterlagen.pdf', datei: 'WeitereUnterlagen.pdf' },
  { key: 'ki_bericht', name: 'KI Screening Bericht.pdf', datei: 'KI_Screening_Bericht.pdf' },
];

export default function DokumentenAnzeige({ bewerber }) {
  const [aktivePDF, setAktivePDF] = useState(null);
  const [nextcloudBase, setNextcloudBase] = useState('');

  const nextcloudOrdner = bewerber.NextcloudOrdner_Pfad || bewerber.Nextcloud_Ordner || bewerber.NextcloudOrdner || '';

  useEffect(() => {
    axios.get('/api/config').then(r => setNextcloudBase(r.data.nextcloudBaseUrl || '')).catch(() => {});
  }, []);

  function pdfUrl(datei) {
    const pfad = nextcloudOrdner ? `${nextcloudOrdner}/${datei}` : datei;
    return `/api/dokument?pfad=${encodeURIComponent(pfad)}`;
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
      ) : (
        <>
          <div className="space-y-1.5">
            {DOKUMENTE.map(dok => (
              <div
                key={dok.key}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded transition-all"
                style={{
                  border: `1px solid ${aktivePDF === dok.datei ? 'rgba(74,140,200,0.3)' : 'var(--border-l)'}`,
                  background: aktivePDF === dok.datei ? 'rgba(74,140,200,0.04)' : 'var(--light)',
                }}
              >
                <span className="text-sm" style={{ color: 'var(--text-d)' }}>{dok.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAktivePDF(aktivePDF === dok.datei ? null : dok.datei)}
                    className="text-xs font-medium transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)' }}
                  >
                    {aktivePDF === dok.datei ? 'Schließen' : 'Anzeigen'}
                  </button>
                  {nextcloudBase && (
                    <a
                      href={nextcloudLink()} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                    >
                      Nextcloud
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {aktivePDF && (
            <div className="space-y-2">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Dokument anzeigen:</p>
              <iframe
                src={pdfUrl(aktivePDF)} width="100%" height="600"
                style={{ border: '1px solid var(--border-l)', borderRadius: 6 }}
                title="Dokument"
              />
            </div>
          )}

          {nextcloudBase && (
            <a
              href={nextcloudLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: 'var(--blue)', textDecoration: 'none' }}
            >
              In Nextcloud öffnen
            </a>
          )}
        </>
      )}
    </div>
  );
}
