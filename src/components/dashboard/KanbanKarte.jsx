import { useNavigate } from 'react-router-dom';
import KINoteBadge from '../shared/KINoteBadge.jsx';

function tageAlt(datum) {
  if (!datum) return 0;
  return Math.floor((Date.now() - new Date(datum)) / (1000 * 60 * 60 * 24));
}

function formatDatum(datum) {
  if (!datum) return '–';
  return new Date(datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatGehalt(gehalt) {
  if (!gehalt) return null;
  const zahl = parseFloat(String(gehalt).replace(/[^0-9.]/g, ''));
  if (isNaN(zahl)) return gehalt;
  return `${zahl.toLocaleString('de-DE')} EUR`;
}

const EMPFEHLUNG_CONFIG = {
  'Einladen': { bg: 'bg-green-100', text: 'text-green-700', label: '💡 Einladen empfohlen' },
  'Absagen': { bg: 'bg-red-100', text: 'text-red-700', label: '🚫 Absage empfohlen' },
  'Prüfen': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🔍 Weitere Prüfung empfohlen' },
};

export default function KanbanKarte({ bewerber, auswahlModus, ausgewaehlt, onToggle }) {
  const navigate = useNavigate();
  const alter = tageAlt(bewerber.Eingangsdatum);
  const istWarnend = alter > 7 && bewerber.Status !== 'Eingeladen' && bewerber.Status !== 'Abgesagt';
  const empfehlung = EMPFEHLUNG_CONFIG[bewerber.KI_Empfehlung];

  function handleClick() {
    if (auswahlModus) {
      onToggle(bewerber);
    } else {
      navigate(`/bewerbung/${bewerber.Id}`);
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md space-y-2 ${
        istWarnend ? 'border-red-400' : 'border-transparent'
      } ${ausgewaehlt ? 'ring-2 ring-primary' : ''}`}
    >
      {/* Warn-Header */}
      {istWarnend && (
        <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
          ⚠️ Wartet seit {alter} Tagen
        </div>
      )}

      {/* Name + Stelle */}
      <div>
        <div className="font-semibold text-text-dark text-sm">{bewerber.Name}</div>
        <div className="text-xs text-text-muted">{bewerber.Stelle}</div>
      </div>

      {/* KI Note */}
      <div className="flex flex-wrap gap-1">
        <KINoteBadge note={bewerber.KI_Note} />
        {empfehlung && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${empfehlung.bg} ${empfehlung.text}`}>
            {empfehlung.label}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span>📅 {formatDatum(bewerber.Eingangsdatum)}</span>
        {bewerber.Gehaltsvorstellung && (
          <span>💰 {formatGehalt(bewerber.Gehaltsvorstellung)}</span>
        )}
      </div>

      {/* Auswahl-Modus Checkbox */}
      {auswahlModus && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1 border-t">
          <input
            type="checkbox"
            checked={ausgewaehlt}
            onChange={() => onToggle(bewerber)}
            onClick={e => e.stopPropagation()}
            className="rounded"
          />
          <span>Auswählen</span>
        </div>
      )}
    </div>
  );
}
