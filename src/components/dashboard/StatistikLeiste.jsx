function StatCard({ label, wert, farbe }) {
  return (
    <div
      className="card-light p-4 flex flex-col gap-2"
      style={{ cursor: 'default', pointerEvents: 'none' }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span className="text-2xl font-bold" style={{ color: farbe, letterSpacing: '-0.03em' }}>
        {wert ?? '–'}
      </span>
    </div>
  );
}

export default function StatistikLeiste({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Gesamt"     wert={stats.gesamt}     farbe="var(--text-d)" />
        <StatCard label="Neu"        wert={stats.neu}        farbe="var(--blue)" />
        <StatCard label="Screening"  wert={stats.screening}  farbe="#7c3aed" />
        <StatCard label="Eingeladen" wert={stats.eingeladen} farbe="#16a34a" />
        <StatCard label="Abgesagt"   wert={stats.abgesagt}   farbe="var(--text-muted)" />
      </div>
      <div className="flex items-center gap-3 text-xs px-1" style={{ color: 'var(--text-muted)' }}>
        <span className="live-dot"></span>
        <span>Ø KI-Note: <strong style={{ color: 'var(--text-d)' }}>{stats.avgNote || '–'}</strong></span>
        <span style={{ color: 'var(--border-l)' }}>|</span>
        <span>Diese Woche: <strong style={{ color: 'var(--text-d)' }}>{stats.dieseWoche}</strong> neue Bewerbungen</span>
      </div>
    </div>
  );
}
