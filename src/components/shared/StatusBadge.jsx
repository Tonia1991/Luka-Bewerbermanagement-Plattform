const STATUS_CONFIG = {
  'offen':      { bg: 'rgba(74,140,200,0.1)',  text: '#4A8CC8',  border: 'rgba(74,140,200,0.25)',  label: 'Offen' },
  'eingeladen': { bg: 'rgba(22,163,74,0.1)',   text: '#16a34a',  border: 'rgba(22,163,74,0.25)',   label: 'Eingeladen' },
  'abgesagt':   { bg: 'rgba(107,114,128,0.1)', text: '#6b7280',  border: 'rgba(107,114,128,0.2)',  label: 'Abgesagt' },
};

export default function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', border: 'rgba(107,114,128,0.2)', label: status };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  );
}
