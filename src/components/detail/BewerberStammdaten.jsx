import StatusBadge from '../shared/StatusBadge.jsx';

function tageAlt(datum) {
  if (!datum) return 0;
  return Math.floor((Date.now() - new Date(datum)) / (1000 * 60 * 60 * 24));
}

function tageVerbleibend(datum) {
  if (!datum) return null;
  return 14 - tageAlt(datum);
}

export default function BewerberStammdaten({ bewerber }) {
  const alter = tageAlt(bewerber.Eingangsdatum);
  const verbleibend = tageVerbleibend(bewerber.Eingangsdatum);
  const istOffen = bewerber.Status !== 'eingeladen' && bewerber.Status !== 'abgesagt';
  const istWarnend = istOffen && alter > 7;

  return (
    <div className="space-y-3">
      {/* Frist-Box */}
      {istOffen && verbleibend !== null && (
        <div className="flex items-center gap-2 px-4 py-3 rounded text-sm" style={{
          background: verbleibend <= 0 ? 'rgba(239,68,68,0.05)' : verbleibend <= 3 ? 'rgba(234,88,12,0.05)' : 'rgba(202,138,4,0.05)',
          border: `1px solid ${verbleibend <= 0 ? 'rgba(239,68,68,0.18)' : verbleibend <= 3 ? 'rgba(234,88,12,0.18)' : 'rgba(202,138,4,0.18)'}`,
          color: verbleibend <= 0 ? '#dc2626' : verbleibend <= 3 ? '#ea580c' : '#ca8a04',
        }}>
          {verbleibend <= 0
            ? <>⚠ Frist abgelaufen — Bewerbung wartet seit <strong>{alter} Tagen</strong> auf eine Entscheidung.</>
            : <>⏱ Noch <strong>{verbleibend} {verbleibend === 1 ? 'Tag' : 'Tage'}</strong> bis zur 14-Tage-Frist.</>}
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

        <div className="grid gap-x-6 gap-y-2 text-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>Email</p>
            {bewerber.Email
              ? <a href={`mailto:${bewerber.Email}`} style={{ color: 'var(--blue)', textDecoration: 'none' }}>{bewerber.Email}</a>
              : <span style={{ color: 'var(--text-muted)' }}>–</span>}
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>Telefon</p>
            <span style={{ color: 'var(--text-sub)' }}>{bewerber.Telefon || '–'}</span>
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>Gehalt</p>
            <span style={{ color: 'var(--text-sub)' }}>
              {bewerber.Gehaltsvorstellung ? `${parseFloat(bewerber.Gehaltsvorstellung).toLocaleString('de-DE')} €/Monat` : '–'}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>Verfügbar ab</p>
            <span style={{ color: 'var(--text-sub)' }}>{bewerber.Verfuegbarkeit || '–'}</span>
          </div>
          {bewerber.Quelle && (
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>Quelle</p>
              <span style={{ color: 'var(--text-sub)' }}>{bewerber.Quelle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
