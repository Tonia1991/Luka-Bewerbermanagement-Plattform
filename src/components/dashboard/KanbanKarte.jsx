import { useNavigate } from 'react-router-dom';
import KINoteBadge from '../shared/KINoteBadge.jsx';

function tageAlt(datum) {
  if (!datum) return 0;
  return Math.floor((Date.now() - new Date(datum)) / (1000 * 60 * 60 * 24));
}

function tageVerbleibend(datum) {
  if (!datum) return null;
  return 14 - tageAlt(datum);
}

function formatDatum(datum) {
  if (!datum) return '–';
  return new Date(datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDatumKurz(wert) {
  if (!wert) return null;
  const d = new Date(wert);
  if (!isNaN(d.getTime())) return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return wert;
}

function formatGehalt(gehalt) {
  if (!gehalt) return null;
  const zahl = parseFloat(String(gehalt).replace(/[^0-9.]/g, ''));
  return isNaN(zahl) ? gehalt : `${zahl.toLocaleString('de-DE')} €`;
}

const EMPFEHLUNG_CONFIG = {
  'Einladen': { bg: 'rgba(22,163,74,0.07)', text: '#16a34a', border: 'rgba(22,163,74,0.18)', label: 'Einladen empfohlen' },
  'Absagen':  { bg: 'rgba(220,38,38,0.07)', text: '#dc2626', border: 'rgba(220,38,38,0.18)', label: 'Absage empfohlen' },
  'Prüfen':   { bg: 'rgba(184,150,42,0.07)', text: 'var(--gold)', border: 'rgba(184,150,42,0.18)', label: 'Weitere Prüfung' },
};

export default function KanbanKarte({ bewerber, auswahlModus, ausgewaehlt, onToggle }) {
  const navigate = useNavigate();
  const alter = tageAlt(bewerber.Eingangsdatum);
  const verbleibend = tageVerbleibend(bewerber.Eingangsdatum);
  const istOffen = bewerber.Status !== 'eingeladen' && bewerber.Status !== 'abgesagt';
  const istWarnend = istOffen && verbleibend !== null && verbleibend <= 3;
  const istKritisch = istOffen && verbleibend !== null && verbleibend <= 0;
  const kiEmpfehlung = bewerber.KI_Empfehlung || (bewerber.KI_Bewertung_Volltext?.split('\n')[0]?.trim());
  const empfehlung = EMPFEHLUNG_CONFIG[kiEmpfehlung];

  function handleClick() {
    if (auswahlModus) onToggle(bewerber);
    else navigate(`/bewerbung/${bewerber.Id}`);
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transition-all duration-150"
      style={{
        background: 'var(--light-card)',
        border: `1px solid ${istWarnend ? 'rgba(239,68,68,0.35)' : ausgewaehlt ? 'rgba(74,140,200,0.35)' : 'var(--border-l)'}`,
        borderRadius: 6,
        padding: '12px 14px',
        borderLeft: istWarnend ? '3px solid rgba(239,68,68,0.6)' : ausgewaehlt ? '3px solid rgba(74,140,200,0.6)' : '3px solid transparent',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,30,58,0.08)'; e.currentTarget.style.borderColor = 'rgba(74,140,200,0.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = istWarnend ? 'rgba(239,68,68,0.35)' : ausgewaehlt ? 'rgba(74,140,200,0.35)' : 'var(--border-l)'; }}
    >
      {/* Frist-Countdown */}
      {istOffen && verbleibend !== null && (
        <div className="flex items-center gap-1 font-medium mb-2" style={{
          fontSize: 11,
          color: istKritisch ? '#dc2626' : verbleibend <= 3 ? '#ea580c' : verbleibend <= 7 ? '#ca8a04' : 'var(--text-muted)'
        }}>
          {istKritisch
            ? `⚠ Frist abgelaufen (${Math.abs(verbleibend)} Tage)`
            : `Noch ${verbleibend} ${verbleibend === 1 ? 'Tag' : 'Tage'} bis zur Rückmeldungsfrist`}
        </div>
      )}

      {/* Name + Stelle */}
      <div className="mb-2">
        <div className="font-semibold text-sm" style={{ color: 'var(--text-d)' }}>{bewerber.Vorname} {bewerber.Nachname}</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{bewerber.Stelle || bewerber.Position}</div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <KINoteBadge note={bewerber.KI_Score} />
        {empfehlung && (
          <span
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{ background: empfehlung.bg, color: empfehlung.text, border: `1px solid ${empfehlung.border}` }}
          >
            {empfehlung.label}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="space-y-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div>Bewerbungseingang: {formatDatum(bewerber.Eingangsdatum)}</div>
        {bewerber.Gehaltsvorstellung && <div>Gehalt: {formatGehalt(bewerber.Gehaltsvorstellung)}</div>}
        {bewerber.Verfuegbarkeit && <div>Verfügbar ab: {formatDatumKurz(bewerber.Verfuegbarkeit)}</div>}
      </div>

      {/* Auswahl */}
      {auswahlModus && (
        <div
          className="flex items-center gap-1.5 text-xs mt-3 pt-2"
          style={{ borderTop: '1px solid var(--border-l)', color: 'var(--text-muted)' }}
        >
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
