function StatCard({ label, wert, farbe }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1 shadow-sm">
      <span className="text-2xl font-bold" style={{ color: farbe }}>{wert ?? '–'}</span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
}

export default function StatistikLeiste({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Gesamt" wert={stats.gesamt} farbe="#1A1F6B" />
        <StatCard label="Neu" wert={stats.neu} farbe="#3b82f6" />
        <StatCard label="Screening" wert={stats.screening} farbe="#8b5cf6" />
        <StatCard label="Eingeladen" wert={stats.eingeladen} farbe="#22c55e" />
        <StatCard label="Abgesagt" wert={stats.abgesagt} farbe="#6b7280" />
      </div>
      <div className="text-sm text-text-muted flex items-center gap-4">
        <span>⌀ KI-Note: <strong className="text-text-dark">{stats.avgNote || '–'}</strong></span>
        <span>|</span>
        <span>Diese Woche: <strong className="text-text-dark">{stats.dieseWoche}</strong> neue Bewerbungen</span>
      </div>
    </div>
  );
}
