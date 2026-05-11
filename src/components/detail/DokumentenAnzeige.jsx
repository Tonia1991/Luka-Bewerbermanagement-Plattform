import { useState } from 'react';

const DOKUMENTE_NAMEN = [
  { key: 'lebenslauf', name: 'Lebenslauf.pdf', datei: 'Lebenslauf.pdf' },
  { key: 'unterlagen', name: 'Weitere Unterlagen.pdf', datei: 'WeitereUnterlagen.pdf' },
  { key: 'ki_bericht', name: 'KI Screening Bericht.pdf', datei: 'KI_Screening_Bericht.pdf' },
];

export default function DokumentenAnzeige({ bewerber }) {
  const [aktivePDF, setAktivePDF] = useState(null);

  const nextcloudOrdner = bewerber.Nextcloud_Ordner || bewerber.NextcloudOrdner || '';
  const nextcloudBase = bewerber.Nextcloud_Base || '';

  function pdfUrl(datei) {
    const pfad = nextcloudOrdner ? `${nextcloudOrdner}/${datei}` : datei;
    return `/api/dokument?pfad=${encodeURIComponent(pfad)}`;
  }

  function nextcloudLink() {
    if (!nextcloudOrdner) return '#';
    return `${nextcloudBase || ''}/index.php/apps/files/?dir=${encodeURIComponent('/' + nextcloudOrdner)}`;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h2 className="text-sm font-semibold text-text-dark">📄 Bewerbungsunterlagen</h2>

      {!nextcloudOrdner ? (
        <p className="text-sm text-gray-400">Kein Nextcloud-Ordner verknüpft.</p>
      ) : (
        <>
          <div className="space-y-2">
            {DOKUMENTE_NAMEN.map(dok => (
              <div
                key={dok.key}
                className={`flex items-center justify-between gap-2 p-2.5 border rounded-lg transition-colors ${
                  aktivePDF === dok.datei ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm text-text-dark flex items-center gap-2">
                  📋 {dok.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAktivePDF(aktivePDF === dok.datei ? null : dok.datei)}
                    className="text-lg hover:scale-110 transition-transform"
                    title="Anzeigen"
                  >
                    👁
                  </button>
                  <a
                    href={nextcloudLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:scale-110 transition-transform"
                    title="In Nextcloud öffnen"
                  >
                    🔗
                  </a>
                </div>
              </div>
            ))}
          </div>

          {aktivePDF && (
            <div className="space-y-2">
              <p className="text-xs text-text-muted">Dokument anzeigen:</p>
              <iframe
                src={pdfUrl(aktivePDF)}
                width="100%"
                height="600"
                className="border border-gray-200 rounded-lg"
                title="Dokument"
              />
            </div>
          )}

          <a
            href={nextcloudLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            📂 In Nextcloud öffnen
          </a>
        </>
      )}
    </div>
  );
}
