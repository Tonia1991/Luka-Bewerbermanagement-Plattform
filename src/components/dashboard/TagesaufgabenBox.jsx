export default function TagesaufgabenBox({ aufgaben }) {
  if (!aufgaben || aufgaben.length === 0) return null;

  return (
    <div
      className="rounded p-4"
      style={{
        background: 'rgba(184,150,42,0.05)',
        border: '1px solid rgba(184,150,42,0.18)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="tag-gold">Heute zu erledigen</span>
      </div>
      <ul className="space-y-1.5">
        {aufgaben.map((aufgabe, i) => (
          <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-sub)' }}>
            <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }}>–</span>
            {aufgabe}
          </li>
        ))}
      </ul>
    </div>
  );
}
