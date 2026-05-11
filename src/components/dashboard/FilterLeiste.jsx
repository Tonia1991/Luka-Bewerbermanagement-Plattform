export default function FilterLeiste({ filter, onChange, auswahlModus, onAuswahlModusToggle }) {
  function handleChange(key, value) {
    onChange({ ...filter, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filter.stelle}
        onChange={e => handleChange('stelle', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="Alle">Alle Stellen</option>
        <option value="Physiotherapeut/in">Physiotherapeut/in</option>
        <option value="Osteopath/in">Osteopath/in</option>
        <option value="Empfangsmitarbeiter/in">Empfangsmitarbeiter/in</option>
      </select>

      <select
        value={filter.note}
        onChange={e => handleChange('note', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="Alle">Alle Noten</option>
        <option value="gut">Note 1–2 (Gut)</option>
        <option value="befriedigend">Note 3 (Befriedigend)</option>
        <option value="kritisch">Note 4+ (Kritisch)</option>
      </select>

      <select
        value={filter.zeitraum}
        onChange={e => handleChange('zeitraum', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="Alle">Zeitraum</option>
        <option value="Heute">Heute</option>
        <option value="Woche">Diese Woche</option>
        <option value="Monat">Diesen Monat</option>
        <option value="Alt">Älter als 1 Monat</option>
      </select>

      <select
        value={filter.sort}
        onChange={e => handleChange('sort', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="Neueste">Neueste zuerst</option>
        <option value="Aelteste">Älteste zuerst</option>
        <option value="NoteAuf">Note aufsteigend</option>
        <option value="NoteAb">Note absteigend</option>
      </select>

      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Name suchen..."
          value={filter.suche}
          onChange={e => handleChange('suche', e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        onClick={onAuswahlModusToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
          auswahlModus
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
        }`}
      >
        ☑ Auswahl-Modus
      </button>
    </div>
  );
}
