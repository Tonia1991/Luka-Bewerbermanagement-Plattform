export default function TagesaufgabenBox({ aufgaben }) {
  if (!aufgaben || aufgaben.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-yellow-800 mb-2">📋 Heute zu erledigen</h3>
      <ul className="space-y-1">
        {aufgaben.map((aufgabe, i) => (
          <li key={i} className="text-sm text-yellow-700">
            {aufgabe}
          </li>
        ))}
      </ul>
    </div>
  );
}
