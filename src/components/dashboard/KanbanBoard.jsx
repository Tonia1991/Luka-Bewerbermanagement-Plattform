import KanbanKarte from './KanbanKarte.jsx';

const SPALTEN = [
  { status: 'offen',      label: 'Offen',      headerBg: 'rgba(74,140,200,0.05)',   headerBorder: 'rgba(74,140,200,0.12)' },
  { status: 'eingeladen', label: 'Eingeladen', headerBg: 'rgba(22,163,74,0.05)',    headerBorder: 'rgba(22,163,74,0.12)' },
  { status: 'abgesagt',   label: 'Abgesagt',   headerBg: 'rgba(107,114,128,0.05)', headerBorder: 'rgba(107,114,128,0.12)' },
];

export default function KanbanBoard({ bewerbungen, auswahlModus, ausgewaehlte, onToggle }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {SPALTEN.map(spalte => {
        const karten = bewerbungen.filter(b => b.Status === spalte.status);

        return (
          <div key={spalte.status} className="flex-shrink-0 w-72">
            <div
              style={{
                background: 'var(--light-card)',
                border: '1px solid var(--border-l)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {/* Spalten-Header */}
              <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{
                  background: spalte.headerBg,
                  borderBottom: `1px solid ${spalte.headerBorder}`,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-sub)', letterSpacing: '0.08em' }}>
                  {spalte.label}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.8)', color: 'var(--text-muted)', border: '1px solid var(--border-l)' }}
                >
                  {karten.length}
                </span>
              </div>

              {/* Karten */}
              <div className="p-3 space-y-2 min-h-[200px]">
                {karten.length === 0 ? (
                  <div className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>
                    Keine Bewerbungen
                  </div>
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
