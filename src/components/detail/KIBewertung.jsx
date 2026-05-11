import KINoteBadge from '../shared/KINoteBadge.jsx';

function Abschnitt({ icon, label, text }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1">{icon} {label}:</p>
      <p className="text-sm text-text-dark">{text}</p>
    </div>
  );
}

export default function KIBewertung({ bewerber }) {
  const hatScreening = bewerber.KI_Note || bewerber.KI_Zusammenfassung;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-text-dark flex items-center gap-2">
        🤖 KI-Screening Ergebnis
      </h2>

      {!hatScreening ? (
        <p className="text-sm text-gray-400">Noch kein KI-Screening vorhanden.</p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <KINoteBadge note={bewerber.KI_Note} size="lg" />
          </div>

          <div className="space-y-3 divide-y divide-gray-100 pt-2">
            <Abschnitt icon="✅" label="Stärken" text={bewerber.KI_Staerken} />
            {bewerber.KI_Schwaechen && <div className="pt-3"><Abschnitt icon="⚠️" label="Schwächen" text={bewerber.KI_Schwaechen} /></div>}
            {bewerber.KI_Fehlende_Qualifikationen && <div className="pt-3"><Abschnitt icon="❓" label="Fehlende Qualifikationen" text={bewerber.KI_Fehlende_Qualifikationen} /></div>}
            {bewerber.KI_Risiken && <div className="pt-3"><Abschnitt icon="🔍" label="Risiken" text={bewerber.KI_Risiken} /></div>}
            {bewerber.KI_Zusammenfassung && <div className="pt-3"><Abschnitt icon="📋" label="Zusammenfassung" text={bewerber.KI_Zusammenfassung} /></div>}
          </div>

          {bewerber.KI_Empfehlung && (
            <div className="bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-700 font-medium">
              💡 KI-Empfehlung: {bewerber.KI_Empfehlung}
            </div>
          )}

          <p className="text-xs text-gray-400 italic border-t pt-3">
            ⚠️ Diese Bewertung wurde durch KI erstellt. Die Entscheidung liegt beim Menschen. (EU AI Act)
          </p>
        </>
      )}
    </div>
  );
}
