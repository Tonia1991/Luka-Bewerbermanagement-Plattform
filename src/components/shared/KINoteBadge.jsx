const NOTE_CONFIG = {
  1: { bg: 'rgba(22,163,74,0.08)',  text: '#16a34a', border: 'rgba(22,163,74,0.2)',  label: 'Note 1 – Hervorragend' },
  2: { bg: 'rgba(34,197,94,0.08)',  text: '#15803d', border: 'rgba(34,197,94,0.2)',  label: 'Note 2 – Gut' },
  3: { bg: 'rgba(234,179,8,0.08)',  text: '#a16207', border: 'rgba(234,179,8,0.2)',  label: 'Note 3 – Befriedigend' },
  4: { bg: 'rgba(249,115,22,0.08)', text: '#c2410c', border: 'rgba(249,115,22,0.2)', label: 'Note 4 – Ausreichend' },
  5: { bg: 'rgba(239,68,68,0.08)',  text: '#dc2626', border: 'rgba(239,68,68,0.2)',  label: 'Note 5 – Mangelhaft' },
  6: { bg: 'rgba(153,27,27,0.08)',  text: '#991b1b', border: 'rgba(153,27,27,0.2)',  label: 'Note 6 – Ungenügend' },
};

export default function KINoteBadge({ note, size = 'sm' }) {
  if (!note) return (
    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Kein Screening</span>
  );

  const c = NOTE_CONFIG[note] || { bg: 'rgba(107,114,128,0.08)', text: '#6b7280', border: 'rgba(107,114,128,0.2)', label: `Note ${note}` };
  const padding = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center ${padding} rounded font-semibold`}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  );
}
