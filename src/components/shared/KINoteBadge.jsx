const NOTE_CONFIG = {
  1: { bg: 'bg-green-800', text: 'text-white', label: '⭐ Note 1 – Hervorragend' },
  2: { bg: 'bg-green-500', text: 'text-white', label: '✅ Note 2 – Gut' },
  3: { bg: 'bg-yellow-400', text: 'text-gray-900', label: '🟡 Note 3 – Befriedigend' },
  4: { bg: 'bg-orange-400', text: 'text-white', label: '⚠️ Note 4 – Ausreichend' },
  5: { bg: 'bg-red-500', text: 'text-white', label: '🔴 Note 5 – Mangelhaft' },
  6: { bg: 'bg-red-900', text: 'text-white', label: '❌ Note 6 – Ungenügend' },
};

export default function KINoteBadge({ note, size = 'sm' }) {
  if (!note) return <span className="text-xs text-gray-400">Kein Screening</span>;

  const config = NOTE_CONFIG[note] || { bg: 'bg-gray-200', text: 'text-gray-700', label: `Note ${note}` };
  const padding = size === 'lg' ? 'px-4 py-2 text-base' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center ${padding} rounded-full font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
