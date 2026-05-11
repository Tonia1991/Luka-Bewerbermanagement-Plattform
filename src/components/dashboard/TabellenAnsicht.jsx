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
    if (sortSpalte === spalte) {
      setSortRichtung(r => r === 'asc' ? 'desc' : 'asc');
    } else {
      setSortSpalte(spalte);
      setSortRichtung('asc');
    }
  }

  const sortiert = [...bewerbungen].sort((a, b) => {
    if (!sortSpalte) return 0;
    let va = a[sortSpalte];
    let vb = b[sortSpalte];
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
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary select-none"
      >
        {label} {aktiv ? (sortRichtung === 'asc' ? '↑' : '↓') : ''}
      </th>
    );
  }

  const alleAusgewaehlt = ausgewaehlte.length === bewerbungen.length && bewerbungen.length > 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {auswahlModus && (
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={alleAusgewaehlt}
                  onChange={() => {
                    if (alleAusgewaehlt) {
                      bewerbungen.forEach(b => ausgewaehlte.some(a => a.Id === b.Id) && onToggle(b));
                    } else {
                      bewerbungen.forEach(b => !ausgewaehlte.some(a => a.Id === b.Id) && onToggle(b));
                    }
                  }}
                  className="rounded"
                />
              </th>
            )}
            <SortHeader label="Name" feld="Name" />
            <SortHeader label="Stelle" feld="Stelle" />
            <SortHeader label="Note" feld="KI_Note" />
            <SortHeader label="Status" feld="Status" />
            <SortHeader label="Datum" feld="Eingangsdatum" />
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gehalt</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">⚠️</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sortiert.map(b => {
            const alter = tageAlt(b.Eingangsdatum);
            const istWarnend = alter > 7 && b.Status !== 'Eingeladen' && b.Status !== 'Abgesagt';
            const ausgewaehlt = ausgewaehlte.some(a => a.Id === b.Id);

            return (
              <tr
                key={b.Id}
                onClick={() => auswahlModus ? onToggle(b) : navigate(`/bewerbung/${b.Id}`)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${ausgewaehlt ? 'bg-primary/5' : ''} ${istWarnend ? 'border-l-2 border-l-red-400' : ''}`}
              >
                {auswahlModus && (
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={ausgewaehlt}
                      onChange={() => onToggle(b)}
                      className="rounded"
                    />
                  </td>
                )}
                <td className="px-4 py-3 text-sm font-medium text-text-dark">{b.Name}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{b.Stelle}</td>
                <td className="px-4 py-3"><KINoteBadge note={b.KI_Note} /></td>
                <td className="px-4 py-3"><StatusBadge status={b.Status} /></td>
                <td className="px-4 py-3 text-sm text-text-muted">{formatDatum(b.Eingangsdatum)}</td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {b.Gehaltsvorstellung ? `${parseFloat(b.Gehaltsvorstellung).toLocaleString('de-DE')} €` : '–'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {istWarnend && <span className="text-red-500" title={`${alter} Tage offen`}>⚠️</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/bewerbung/${b.Id}`); }}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    →
                  </button>
                </td>
              </tr>
            );
          })}
          {sortiert.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">
                Keine Bewerbungen gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
