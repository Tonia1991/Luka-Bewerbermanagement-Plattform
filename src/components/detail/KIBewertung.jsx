import KINoteBadge from '../shared/KINoteBadge.jsx';

function Abschnitt({ label, text }) {
  if (!text) return null;
  return (
    <div className="pt-3" style={{ borderTop: '1px solid var(--border-l)' }}>
      <p className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-d)' }}>{text}</p>
    </div>
  );
}

export default function KIBewertung({ bewerber }) {
  const hatScreening = bewerber.KI_Note || bewerber.KI_Zusammenfassung;

  return (
    <div className="card-light p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="tag-blue">KI-Screening</span>
      </div>

      {!hatScreening ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Noch kein KI-Screening vorhanden.</p>
      ) : (
        <>
          <KINoteBadge note={bewerber.KI_Note} size="lg" />

          <div className="space-y-0">
            <Abschnitt label="Stärken" text={bewerber.KI_Staerken} />
            <Abschnitt label="Schwächen" text={bewerber.KI_Schwaechen} />
            <Abschnitt label="Fehlende Qualifikationen" text={bewerber.KI_Fehlende_Qualifikationen} />
            <Abschnitt label="Risiken" text={bewerber.KI_Risiken} />
            <Abschnitt label="Zusammenfassung" text={bewerber.KI_Zusammenfassung} />
          </div>

          {bewerber.KI_Empfehlung && (
            <div className="rounded px-3 py-2.5 text-sm font-medium" style={{ background: 'rgba(74,140,200,0.06)', color: 'var(--blue)', border: '1px solid rgba(74,140,200,0.18)' }}>
              KI-Empfehlung: {bewerber.KI_Empfehlung}
            </div>
          )}

          <p className="text-xs italic" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-l)', paddingTop: 12 }}>
            Diese Bewertung wurde durch KI erstellt. Die Entscheidung liegt beim Menschen. (EU AI Act)
          </p>
        </>
      )}
    </div>
  );
}
