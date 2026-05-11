function formatZeitstempel(datum) {
  if (!datum) return '';
  return new Date(datum).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function EmailVerlauf({ bewerber }) {
  const verlauf = bewerber.Email_Verlauf || bewerber.AuditLog || [];
  const eintraege = Array.isArray(verlauf) ? verlauf : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h2 className="text-sm font-semibold text-text-dark">📧 Gesendete Emails</h2>

      {eintraege.length === 0 ? (
        <p className="text-sm text-gray-400">Noch keine Emails gesendet.</p>
      ) : (
        <div className="space-y-2">
          {eintraege.map((eintrag, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <span className="text-text-muted">{formatZeitstempel(eintrag.datum || eintrag.Datum)}</span>
                <p className="text-text-dark">{eintrag.text || eintrag.Text || eintrag.aktion || eintrag.Aktion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
