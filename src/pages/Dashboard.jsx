import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/layout/Sidebar.jsx';
import TopBar from '../components/layout/TopBar.jsx';
import StatistikLeiste from '../components/dashboard/StatistikLeiste.jsx';
import TagesaufgabenBox from '../components/dashboard/TagesaufgabenBox.jsx';
import FilterLeiste from '../components/dashboard/FilterLeiste.jsx';
import KanbanBoard from '../components/dashboard/KanbanBoard.jsx';
import TabellenAnsicht from '../components/dashboard/TabellenAnsicht.jsx';
import MassenAktionModal from '../components/shared/MassenAktionModal.jsx';

const STANDARD_FILTER = { stelle: 'Alle', note: 'Alle', zeitraum: 'Alle', sort: 'Neueste', suche: '' };

function berechneTagesaufgaben(bewerbungen) {
  const aufgaben = [];
  const wartenAuf = bewerbungen.filter(b => {
    const tageAlt = (Date.now() - new Date(b.Eingangsdatum)) / (1000 * 60 * 60 * 24);
    return b.Status === 'Screening abgeschlossen' && tageAlt > 7;
  });
  if (wartenAuf.length > 0) {
    aufgaben.push(`⚠️ ${wartenAuf.length} Bewerbung(en) warten seit über 7 Tagen auf Entscheidung`);
  }

  const keinScreening = bewerbungen.filter(b => {
    const stundenAlt = (Date.now() - new Date(b.Eingangsdatum)) / (1000 * 60 * 60);
    return b.Status === 'Neu' && stundenAlt > 24;
  });
  if (keinScreening.length > 0) {
    aufgaben.push(`🤖 ${keinScreening.length} Bewerbung(en) noch ohne KI-Screening`);
  }

  const baldLoeschen = bewerbungen.filter(b => {
    if (!b.Loeschdatum) return false;
    const tageNoch = (new Date(b.Loeschdatum) - Date.now()) / (1000 * 60 * 60 * 24);
    return tageNoch <= 7 && tageNoch > 0;
  });
  if (baldLoeschen.length > 0) {
    aufgaben.push(`🗑️ ${baldLoeschen.length} Bewerbung(en): Löschfrist in weniger als 7 Tagen`);
  }

  return aufgaben;
}

function berechneStats(bewerbungen) {
  const mitNote = bewerbungen.filter(b => b.KI_Note);
  const avgNote = mitNote.length > 0
    ? (mitNote.reduce((s, b) => s + b.KI_Note, 0) / mitNote.length).toFixed(1)
    : null;

  const wocheAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return {
    gesamt: bewerbungen.length,
    neu: bewerbungen.filter(b => b.Status === 'Neu').length,
    screening: bewerbungen.filter(b => b.Status === 'Screening abgeschlossen').length,
    inBearbeitung: bewerbungen.filter(b => b.Status === 'In Bearbeitung').length,
    eingeladen: bewerbungen.filter(b => b.Status === 'Eingeladen').length,
    abgesagt: bewerbungen.filter(b => b.Status === 'Abgesagt').length,
    avgNote,
    dieseWoche: bewerbungen.filter(b => new Date(b.Eingangsdatum) > wocheAgo).length,
  };
}

function filtereBewerbungen(bewerbungen, filter) {
  return bewerbungen.filter(b => {
    if (filter.stelle !== 'Alle' && b.Stelle !== filter.stelle) return false;

    if (filter.note === 'gut' && (b.KI_Note > 2 || !b.KI_Note)) return false;
    if (filter.note === 'befriedigend' && b.KI_Note !== 3) return false;
    if (filter.note === 'kritisch' && (!b.KI_Note || b.KI_Note < 4)) return false;

    if (filter.zeitraum !== 'Alle' && b.Eingangsdatum) {
      const d = new Date(b.Eingangsdatum);
      const now = new Date();
      if (filter.zeitraum === 'Heute') {
        const heute = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (d < heute) return false;
      } else if (filter.zeitraum === 'Woche') {
        if (d < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) return false;
      } else if (filter.zeitraum === 'Monat') {
        if (d < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) return false;
      } else if (filter.zeitraum === 'Alt') {
        if (d >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) return false;
      }
    }

    if (filter.suche) {
      const suche = filter.suche.toLowerCase();
      if (!b.Name?.toLowerCase().includes(suche) && !b.Stelle?.toLowerCase().includes(suche)) return false;
    }

    return true;
  });
}

export default function Dashboard() {
  const [bewerbungen, setBewerbungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fehler, setFehler] = useState(null);
  const [ansicht, setAnsicht] = useState('kanban');
  const [filter, setFilter] = useState(STANDARD_FILTER);
  const [auswahlModus, setAuswahlModus] = useState(false);
  const [ausgewaehlte, setAusgewaehlte] = useState([]);
  const [massenModal, setMassenModal] = useState(false);

  useEffect(() => { ladeBewerbungen(); }, []);

  async function ladeBewerbungen() {
    setLoading(true);
    setFehler(null);
    try {
      const res = await axios.get('/api/bewerbungen');
      setBewerbungen(res.data);
    } catch {
      setFehler('Fehler beim Laden der Bewerbungen.');
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => berechneStats(bewerbungen), [bewerbungen]);
  const tagesaufgaben = useMemo(() => berechneTagesaufgaben(bewerbungen), [bewerbungen]);
  const gefilterteBewerbungen = useMemo(() => filtereBewerbungen(bewerbungen, filter), [bewerbungen, filter]);

  function toggleAuswahl(bewerber) {
    setAusgewaehlte(prev =>
      prev.some(a => a.Id === bewerber.Id)
        ? prev.filter(a => a.Id !== bewerber.Id)
        : [...prev, bewerber]
    );
  }

  function toggleAuswahlModus() {
    setAuswahlModus(prev => !prev);
    setAusgewaehlte([]);
  }

  return (
    <div className="flex min-h-screen bg-bg-light">
      <Sidebar stats={stats} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          titel="📊 Dashboard"
          rechts={
            <button
              onClick={ladeBewerbungen}
              className="text-sm text-gray-500 hover:text-primary"
              title="Aktualisieren"
            >
              🔄
            </button>
          }
        />

        <main className="flex-1 overflow-auto p-6 space-y-4">
          <StatistikLeiste stats={stats} />
          <TagesaufgabenBox aufgaben={tagesaufgaben} />

          {/* Massenauswahl Banner */}
          {auswahlModus && ausgewaehlte.length > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-red-700">
                {ausgewaehlte.length} Bewerbung(en) ausgewählt
              </span>
              <button
                onClick={() => setMassenModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                ❌ Alle absagen
              </button>
            </div>
          )}

          {/* Filter + Ansichts-Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <FilterLeiste
                filter={filter}
                onChange={setFilter}
                auswahlModus={auswahlModus}
                onAuswahlModusToggle={toggleAuswahlModus}
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => setAnsicht('tabelle')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  ansicht === 'tabelle' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Tabelle
              </button>
              <button
                onClick={() => setAnsicht('kanban')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  ansicht === 'kanban' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🗂️ Kanban
              </button>
            </div>
          </div>

          {/* Fehler */}
          {fehler && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {fehler}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : ansicht === 'kanban' ? (
            <KanbanBoard
              bewerbungen={gefilterteBewerbungen}
              auswahlModus={auswahlModus}
              ausgewaehlte={ausgewaehlte}
              onToggle={toggleAuswahl}
            />
          ) : (
            <TabellenAnsicht
              bewerbungen={gefilterteBewerbungen}
              auswahlModus={auswahlModus}
              ausgewaehlte={ausgewaehlte}
              onToggle={toggleAuswahl}
            />
          )}
        </main>
      </div>

      {massenModal && (
        <MassenAktionModal
          ausgewaehlte={ausgewaehlte}
          onClose={() => setMassenModal(false)}
          onErfolg={() => {
            setAusgewaehlte([]);
            setAuswahlModus(false);
            ladeBewerbungen();
          }}
        />
      )}
    </div>
  );
}
