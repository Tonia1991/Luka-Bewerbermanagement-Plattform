export default function WarnungBadge({ tage }) {
  if (!tage || tage <= 7) return null;

  return (
    <div
      className="flex items-center gap-1 text-xs font-medium"
      style={{ color: '#dc2626' }}
      title={`Wartet seit ${tage} Tagen auf Entscheidung`}
    >
      {tage} Tage offen
    </div>
  );
}
