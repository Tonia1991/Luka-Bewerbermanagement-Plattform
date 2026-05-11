import { useNavigate } from 'react-router-dom';
import StatusBadge from '../shared/StatusBadge.jsx';

function tageAlt(datum) {
  if (!datum) return 0;
  return Math.floor((Date.now() - new Date(datum)) / (1000 * 60 * 60 * 24));
}

export default function BewerberStammdaten({ bewerber }) {
  const navigate = useNavigate();
  const alter = tageAlt(bewerber.Eingangsdatum);
  const istWarnend = alter > 7 && bewerber.Status !== 'Eingeladen' && bewerber.Status !== 'Abgesagt';

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted flex items-center gap-2">
        <button onClick={() => navigate('/dashboard')} className="hover:text-primary">Dashboard</button>
        <span>›</span>
        <span>{bewerber.Stelle}</span>
        <span>›</span>
        <span className="text-text-dark font-medium">{bewerber.Name}</span>
      </nav>

      {/* Warn-Box */}
      {istWarnend && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          ⚠️ Diese Bewerbung wartet seit <strong>{alter} Tagen</strong> auf eine Entscheidung.
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-dark">{bewerber.Name}</h1>
            <p className="text-sm text-text-muted">{bewerber.Stelle}</p>
          </div>
          <StatusBadge status={bewerber.Status} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
          {bewerber.Email && (
            <a href={`mailto:${bewerber.Email}`} className="flex items-center gap-1 hover:text-primary">
              📧 {bewerber.Email}
            </a>
          )}
          {bewerber.Telefon && (
            <span className="flex items-center gap-1">📞 {bewerber.Telefon}</span>
          )}
          {bewerber.Gehaltsvorstellung && (
            <span className="flex items-center gap-1">
              💰 {parseFloat(bewerber.Gehaltsvorstellung).toLocaleString('de-DE')} €/Monat
            </span>
          )}
          {bewerber.Verfuegbarkeit && (
            <span className="flex items-center gap-1">📅 ab {bewerber.Verfuegbarkeit}</span>
          )}
          {bewerber.Quelle && (
            <span className="flex items-center gap-1">📍 {bewerber.Quelle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
