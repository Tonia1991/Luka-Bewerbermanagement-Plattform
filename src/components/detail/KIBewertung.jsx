import KINoteBadge from '../shared/KINoteBadge.jsx';

const NOTE_CONFIG = {
  1: { label: 'Sehr gut',     color: '#16a34a', bg: 'rgba(22,163,74,0.07)',   border: 'rgba(22,163,74,0.2)' },
  2: { label: 'Gut',          color: '#16a34a', bg: 'rgba(22,163,74,0.07)',   border: 'rgba(22,163,74,0.2)' },
  3: { label: 'Befriedigend', color: '#B8962A', bg: 'rgba(184,150,42,0.07)', border: 'rgba(184,150,42,0.2)' },
  4: { label: 'Ausreichend',  color: '#d97706', bg: 'rgba(217,119,6,0.07)',   border: 'rgba(217,119,6,0.2)' },
  5: { label: 'Mangelhaft',   color: '#dc2626', bg: 'rgba(220,38,38,0.07)',   border: 'rgba(220,38,38,0.2)' },
  6: { label: 'Ungenügend',   color: '#dc2626', bg: 'rgba(220,38,38,0.07)',   border: 'rgba(220,38,38,0.2)' },
};

function parseKIBewertung(text) {
  if (!text) return null;
  const result = { empfehlung: '', zusammenfassung: '', kriterien: [] };
  const blocks = text.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (!lines[0]) continue;
    const first = lines[0].trim();

    if (first === 'Empfehlung:') {
      result.empfehlung = lines.slice(1).join(' ').trim();
    } else if (first === 'Zusammenfassung:') {
      result.zusammenfassung = lines.slice(1).join(' ').trim();
    } else if (first.startsWith('Kriterium:')) {
      const k = { name: '', note: null, begruendung: '' };
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('Kriterium:')) k.name = t.slice('Kriterium:'.length).trim();
        else if (t.startsWith('Note:')) k.note = parseInt(t.slice('Note:'.length).trim());
        else if (t.startsWith('Begründung:')) k.begruendung = t.slice('Begründung:'.length).trim();
      }
      if (k.name) result.kriterien.push(k);
    }
  }
  return result;
}

function NoteChip({ note }) {
  const cfg = NOTE_CONFIG[note] || { label: `Note ${note}`, color: 'var(--text-muted)', bg: 'var(--light)', border: 'var(--border-l)' };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
      {note} – {cfg.label}
    </span>
  );
}

export default function KIBewertung({ bewerber }) {
  const hatScreening = bewerber.KI_Score || bewerber.KI_Bewertung_Volltext;
  const parsed = parseKIBewertung(bewerber.KI_Bewertung_Volltext);

  const istNegativ = parsed?.empfehlung &&
    (parsed.empfehlung.toLowerCase().includes('nicht zu empfehlen') ||
     parsed.empfehlung.toLowerCase().includes('nicht empfohlen') ||
     parsed.empfehlung.toLowerCase().includes('absage'));

  const empCfg = istNegativ
    ? { bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.18)', color: '#dc2626', label: 'Absage empfohlen' }
    : { bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.18)', color: '#16a34a', label: 'Einladen empfohlen' };

  return (
    <div className="card-light p-5 space-y-4">
      <span className="tag-blue">KI-Screening</span>

      {!hatScreening ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Noch kein KI-Screening vorhanden.</p>
      ) : (
        <>
          {/* Score + Empfehlungs-Label */}
          <div className="flex items-center gap-3 flex-wrap">
            <KINoteBadge note={bewerber.KI_Score} size="lg" />
            {parsed?.empfehlung && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded" style={{ background: empCfg.bg, color: empCfg.color, border: `1px solid ${empCfg.border}` }}>
                {empCfg.label}
              </span>
            )}
          </div>

          {/* Empfehlung Box */}
          {parsed?.empfehlung && (
            <div className="rounded-lg px-4 py-3 text-sm leading-relaxed" style={{ background: empCfg.bg, border: `1px solid ${empCfg.border}` }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: empCfg.color }}>Empfehlung</p>
              <p style={{ color: 'var(--text-d)' }}>{parsed.empfehlung}</p>
            </div>
          )}

          {/* Zusammenfassung */}
          {parsed?.zusammenfassung && (
            <div style={{ borderTop: '1px solid var(--border-l)', paddingTop: 14 }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Zusammenfassung</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-d)' }}>{parsed.zusammenfassung}</p>
            </div>
          )}

          {/* Kriterien */}
          {parsed?.kriterien?.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-l)', paddingTop: 14 }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Einzelkriterien ({parsed.kriterien.length})
              </p>
              <div className="space-y-2">
                {parsed.kriterien.map((k, i) => {
                  const cfg = k.note ? NOTE_CONFIG[k.note] : null;
                  return (
                    <div key={i} className="rounded-lg p-3" style={{ background: cfg ? cfg.bg : 'var(--light)', border: `1px solid ${cfg ? cfg.border : 'var(--border-l)'}` }}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-d)' }}>{k.name}</span>
                        {k.note && <NoteChip note={k.note} />}
                      </div>
                      {k.begruendung && (
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>{k.begruendung}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback wenn kein parsebares Format */}
          {!parsed?.empfehlung && !parsed?.zusammenfassung && !parsed?.kriterien?.length && (
            <div style={{ borderTop: '1px solid var(--border-l)', paddingTop: 14 }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-d)' }}>{bewerber.KI_Bewertung_Volltext}</p>
            </div>
          )}

          <p className="text-xs italic" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-l)', paddingTop: 12 }}>
            KI-generierte Bewertung — Entscheidung liegt beim Menschen. (EU AI Act)
          </p>
        </>
      )}
    </div>
  );
}
