import StatusBadge from '../shared/StatusBadge.jsx';

function tageAlt(datum) {
  if (!datum) return 0;
  return Math.floor((Date.now() - new Date(datum)) / (1000 * 60 * 60 * 24));
}

export default function BewerberStammdaten({ bewerber }) {
  const alter = tageAlt(bewerber.Eingangsdatum);
  const istWarnend = alter > 7 && bewerber.Status !== 'eingeladen' && bewerber.Status !== 'abgesagt';

  return (
    <div className="space-y-3">
      {/* Warn-Box */}
      {istWarnend && (
        <div className="flex items-center gap-2 px-4 py-3 rounded text-sm" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}>
          Diese Bewerbung wartet seit <strong>{alter} Tagen</strong> auf eine Entscheidung.
        </div>
      )}

      {/* Header Card */}
      <div className="card-light p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-d)', letterSpacing: '-0.02em' }}>{bewerber.Vorname} {bewerber.Nachname}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{bewerber.Stelle || bewerber.Position}</p>
          </div>
          <StatusBadge status={bewerber.Status} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-sub)' }}>
          {bewerber.Email && (
            <a href={`mailto:${bewerber.Email}`} className="transition-colors" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              {bewerber.Email}
            </a>
          )}
          {bewerber.Telefon && <span>{bewerber.Telefon}</span>}
          {bewerber.Gehaltsvorstellung && (
            <span>{parseFloat(bewerber.Gehaltsvorstellung).toLocaleString('de-DE')} €/Monat</span>
          )}
          {bewerber.Verfuegbarkeit && <span>ab {bewerber.Verfuegbarkeit}</span>}
          {bewerber.Quelle && <span>{bewerber.Quelle}</span>}
        </div>
      </div>
    </div>
  );
}
