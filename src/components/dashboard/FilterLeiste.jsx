const selectStyle = {
  background: 'var(--light-card)',
  border: '1px solid var(--border-l)',
  borderRadius: 6,
  padding: '7px 10px',
  fontSize: 13,
  color: 'var(--text-d)',
  outline: 'none',
  cursor: 'pointer',
};

export default function FilterLeiste({ filter, onChange, auswahlModus, onAuswahlModusToggle }) {
  function handleChange(key, value) {
    onChange({ ...filter, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={filter.stelle} onChange={e => handleChange('stelle', e.target.value)} style={selectStyle}>
        <option value="Alle">Alle Stellen</option>
        <option value="Physiotherapeut/in">Physiotherapeut/in</option>
        <option value="Osteopath/in">Osteopath/in</option>
        <option value="Empfangsmitarbeiter/in">Empfangsmitarbeiter/in</option>
      </select>

      <select value={filter.note} onChange={e => handleChange('note', e.target.value)} style={selectStyle}>
        <option value="Alle">Alle Noten</option>
        <option value="gut">Note 1–2 (Gut)</option>
        <option value="befriedigend">Note 3 (Befriedigend)</option>
        <option value="kritisch">Note 4+ (Kritisch)</option>
      </select>

      <select value={filter.zeitraum} onChange={e => handleChange('zeitraum', e.target.value)} style={selectStyle}>
        <option value="Alle">Zeitraum</option>
        <option value="Heute">Heute</option>
        <option value="Woche">Diese Woche</option>
        <option value="Monat">Diesen Monat</option>
        <option value="Alt">Älter als 1 Monat</option>
      </select>

      <select value={filter.sort} onChange={e => handleChange('sort', e.target.value)} style={selectStyle}>
        <option value="Neueste">Neueste zuerst</option>
        <option value="Aelteste">Älteste zuerst</option>
        <option value="NoteAuf">Note aufsteigend</option>
        <option value="NoteAb">Note absteigend</option>
      </select>

      <input
        type="text"
        placeholder="Name suchen..."
        value={filter.suche}
        onChange={e => handleChange('suche', e.target.value)}
        style={{ ...selectStyle, minWidth: 160, flex: 1 }}
      />

      <button
        onClick={onAuswahlModusToggle}
        className="flex items-center gap-1.5 text-sm font-medium transition-all"
        style={{
          borderRadius: 6,
          padding: '7px 12px',
          border: auswahlModus ? '1px solid rgba(74,140,200,0.4)' : '1px solid var(--border-l)',
          background: auswahlModus ? 'rgba(74,140,200,0.08)' : 'var(--light-card)',
          color: auswahlModus ? 'var(--blue)' : 'var(--text-sub)',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        Auswahl-Modus
      </button>
    </div>
  );
}
