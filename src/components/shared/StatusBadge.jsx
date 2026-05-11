const STATUS_CONFIG = {
  'Neu': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Neu' },
  'Screening abgeschlossen': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Screening' },
  'In Bearbeitung': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Bearbeitung' },
  'Eingeladen': { bg: 'bg-green-100', text: 'text-green-700', label: 'Eingeladen' },
  'Abgesagt': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Abgesagt' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
