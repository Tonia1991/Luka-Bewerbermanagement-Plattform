import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/layout/Sidebar.jsx';
import TopBar from '../components/layout/TopBar.jsx';
import BewerberStammdaten from '../components/detail/BewerberStammdaten.jsx';
import KIBewertung from '../components/detail/KIBewertung.jsx';
import DokumentenAnzeige from '../components/detail/DokumentenAnzeige.jsx';
import EmailVerlauf from '../components/detail/EmailVerlauf.jsx';
import NotizenFeld from '../components/detail/NotizenFeld.jsx';
import AktionsBereich from '../components/detail/AktionsBereich.jsx';

export default function BewerbungDetail() {
  const { id } = useParams();
  const [bewerber, setBewerber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fehler, setFehler] = useState(null);

  useEffect(() => { ladeBewerbung(); }, [id]);

  async function ladeBewerbung() {
    setLoading(true);
    setFehler(null);
    try {
      const res = await axios.get(`/api/bewerbungen/${id}`);
      setBewerber(res.data);
    } catch {
      setFehler('Bewerbung konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg-light">
        <Sidebar stats={null} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (fehler || !bewerber) {
    return (
      <div className="flex min-h-screen bg-bg-light">
        <Sidebar stats={null} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{fehler || 'Bewerbung nicht gefunden.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-light">
      <Sidebar stats={null} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar titel={`👤 ${bewerber.Name}`} />

        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-[1fr_400px] gap-6 max-w-7xl">
            {/* Linke Spalte (60%) */}
            <div className="space-y-4">
              <BewerberStammdaten bewerber={bewerber} />
              <KIBewertung bewerber={bewerber} />
              <NotizenFeld bewerber={bewerber} onNotizGespeichert={ladeBewerbung} />
              <EmailVerlauf bewerber={bewerber} />
            </div>

            {/* Rechte Spalte (40%) */}
            <div className="space-y-4">
              <DokumentenAnzeige bewerber={bewerber} />
              <AktionsBereich bewerber={bewerber} onAktualisieren={ladeBewerbung} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
