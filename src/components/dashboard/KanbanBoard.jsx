import KanbanKarte from './KanbanKarte.jsx';

const SPALTEN = [
  { status: 'Neu', icon: '🆕', farbe: 'bg-blue-50 border-blue-200' },
  { status: 'Screening abgeschlossen', icon: '⏳', label: 'Screening', farbe: 'bg-purple-50 border-purple-200' },
  { status: 'Eingeladen', icon: '✅', farbe: 'bg-green-50 border-green-200' },
  { status: 'Abgesagt', icon: '❌', farbe: 'bg-gray-50 border-gray-200' },
];

export default function KanbanBoard({ bewerbungen, auswahlModus, ausgewaehlte, onToggle }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {SPALTEN.map(spalte => {
        const karten = bewerbungen.filter(b => b.Status === spalte.status);
        const label = spalte.label || spalte.status;

        return (
          <div key={spalte.status} className="flex-shrink-0 w-72">
            <div className={`border rounded-xl ${spalte.farbe}`}>
              {/* Spalten-Header */}
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <span className="font-semibold text-sm text-text-dark">
                  {spalte.icon} {label}
                </span>
                <span className="text-xs bg-white border rounded-full px-2 py-0.5 text-text-muted font-medium">
                  {karten.length}
                </span>
              </div>

              {/* Karten */}
              <div className="p-3 space-y-3 min-h-[200px]">
                {karten.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-6">Keine Bewerbungen</div>
                ) : (
                  karten.map(b => (
                    <KanbanKarte
                      key={b.Id}
                      bewerber={b}
                      auswahlModus={auswahlModus}
                      ausgewaehlt={ausgewaehlte.some(a => a.Id === b.Id)}
                      onToggle={onToggle}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
