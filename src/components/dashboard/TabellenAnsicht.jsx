import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../shared/StatusBadge.jsx';
import KINoteBadge from '../shared/KINoteBadge.jsx';

function formatDatum(datum) {
  if (!datum) return '–';
  return new Date(datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function tageAlt(datum) {
  if (!datum) return 0;
  return Math.floor((Date.now() - new Date(datum)) / (1000 * 60 * 60 * 24));
}

export default function TabellenAnsicht({ bewerbungen, auswahlModus, ausgewaehlte, onToggle }) {
  const navigate = useNavigate();
  const [sortSpalte, setSortSpalte] = useState(null);
  const [sortRichtung, setSortRichtung] = useState('asc');

  function handleSort(spalte) {
    if (sortSpalte === spalte) setSortRichtung(r => r === 'asc' ? 'desc' : 'asc');
    else { setSortSpalte(spalte); setSortRichtung('asc'); }
  }

  const sortiert = [...bewerbungen].sort((a, b) => {
    if (!sortSpalte) return 0;
    let va = a[sortSpalte]; let vb = b[sortSpalte];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortRichtung === 'asc' ? -1 : 1;
    if (va > vb) return sortRichtung === 'asc' ? 1 : -1;
    return 0;
  });

  function SortHeader({ label, feld }) {
    const aktiv = sortSpalte === feld;
    return (
      <th
        onClick={() => handleSort(feld)}
        className="px-4 py-3 text-left cursor-pointer select-none transition-colors"
        style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: aktiv ? 'var(--blue)' : 'var(--text-muted)',
        }}
      >
        {label} {aktiv ? (sortRichtung === 'asc' ? '↑' : '↓') : ''}
      </th>
    );
  }

  const alleAusgewaehlt = ausgewaehlte.length === bewerbungen.length && bewerbungen.length > 0;

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-l)', overflow: 'hidden', background: 'var(--light-card)' }}>
      <table className="min-w-full">
        <thead>
          <tr style={{ background: 'var(--light)', borderBottom: '1px solid var(--border-l)' }}>
            {auswahlModus && (
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={alleAusgewaehlt}
                  onChange={() => {
                    if (alleAusgewaehlt) bewerbungen.forEach(b => ausgewaehlte.some(a => a.Id === b.Id) && onToggle(b));
                    else bewerbungen.forEach(b => !ausgewaehlte.some(a => a.Id === b.Id) && onToggle(b));
                  }}
                  className="rounded"
                />
              </th>
            )}
            <SortHeader label="Name" feld="Nachname" />
            <SortHeader label="Stelle" feld="Stelle" />
            <SortHeader label="Note" feld="KI_Score" />
            <SortHeader label="Status" feld="Status" />
            <SortHeader label="Datum" feld="Eingangsdatum" />
            <th className="px-4 py-3 text-left" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Gehalt</th>
            <th className="px-4 py-3 text-left" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Offen</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sortiert.map((b, i) => {
            const alter = tageAlt(b.Eingangsdatum);
            const istWarnend = alter > 7 && b.Status !== 'Eingeladen' && b.Status !== 'Abgesagt';
            const ausgewaehlt = ausgewaehlte.some(a => a.Id === b.Id);

            return (
              <tr
                key={b.Id}
                onClick={() => auswahlModus ? onToggle(b) : navigate(`/bewerbung/${b.Id}`)}
                className="cursor-pointer transition-colors"
                style={{
                  borderBottom: i < sortiert.length - 1 ? '1px solid var(--border-l)' : 'none',
                  background: ausgewaehlt ? 'rgba(74,140,200,0.04)' : 'transparent',
                  borderLeft: istWarnend ? '2.5px solid rgba(239,68,68,0.45)' : '2.5px solid transparent',
                }}
                onMouseEnter={e => { if (!ausgewaehlt) e.currentTarget.style.background = 'var(--light)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ausgewaehlt ? 'rgba(74,140,200,0.04)' : 'transparent'; }}
              >
                {auswahlModus && (
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={ausgewaehlt} onChange={() => onToggle(b)} className="rounded" />
                  </td>
                )}
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-d)' }}>{b.Vorname} {b.Nachname}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-sub)' }}>{b.Stelle || b.Position}</td>
                <td className="px-4 py-3"><KINoteBadge note={b.KI_Score} /></td>
                <td className="px-4 py-3"><StatusBadge status={b.Status} /></td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{formatDatum(b.Eingangsdatum)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {b.Gehaltsvorstellung ? `${parseFloat(b.Gehaltsvorstellung).toLocaleString('de-DE')} €` : '–'}
                </td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: istWarnend ? '#dc2626' : 'var(--text-muted)' }}>
                  {istWarnend ? `${alter} Tage` : '–'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/bewerbung/${b.Id}`); }}
                    className="text-sm font-semibold transition-colors"
                    style={{ color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    →
                  </button>
                </td>
              </tr>
            );
          })}
          {sortiert.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Keine Bewerbungen gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
