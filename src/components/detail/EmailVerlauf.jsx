function formatZeitstempel(datum) {
  if (!datum) return '';
  return new Date(datum).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function EmailVerlauf({ bewerber }) {
  const verlauf = bewerber.Email_Verlauf || bewerber.AuditLog || [];
  const eintraege = Array.isArray(verlauf) ? verlauf : [];

  return (
    <div className="card-light p-5 space-y-3">
      <span className="tag-blue">Gesendete Emails</span>

      {eintraege.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Noch keine Emails gesendet.</p>
      ) : (
        <div className="space-y-3">
          {eintraege.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="flex-shrink-0 mt-1"
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }}
              />
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatZeitstempel(e.datum || e.Datum)}</p>
                <p className="text-sm" style={{ color: 'var(--text-d)' }}>{e.text || e.Text || e.aktion || e.Aktion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
