import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [bewerber, setBewerber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fehler, setFehler] = useState(null);

  useEffect(() => { ladeBewerbung(); }, [id]);

  async function ladeBewerbung() {
    setLoading(true); setFehler(null);
    try {
      const res = await axios.get(`/api/bewerbungen/${id}`);
      setBewerber(res.data);
    } catch { setFehler('Bewerbung konnte nicht geladen werden.'); }
    finally { setLoading(false); }
  }

  const ladeScreen = (
    <div className="flex min-h-screen" style={{ background: 'var(--light)' }}>
      <Sidebar stats={null} />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2" style={{ borderColor: 'var(--blue)' }}></div>
      </div>
    </div>
  );

  if (loading) return ladeScreen;

  if (fehler || !bewerber) return (
    <div className="flex min-h-screen" style={{ background: 'var(--light)' }}>
      <Sidebar stats={null} />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: '#dc2626' }}>{fehler || 'Bewerbung nicht gefunden.'}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--light)' }}>
      <Sidebar stats={null} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar titel={`${bewerber.Vorname} ${bewerber.Nachname}`} />

        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 12 }}>
              Dashboard
            </button>
            <span>›</span>
            <span>{bewerber.Stelle || bewerber.Position}</span>
            <span>›</span>
            <span style={{ color: 'var(--text-d)', fontWeight: 600 }}>{bewerber.Vorname} {bewerber.Nachname}</span>
          </nav>

          <div className="grid gap-5 max-w-7xl" style={{ gridTemplateColumns: '1fr 360px' }}>
            {/* Linke Spalte */}
            <div className="space-y-4 min-w-0">
              <BewerberStammdaten bewerber={bewerber} />
              <KIBewertung bewerber={bewerber} />
              <NotizenFeld bewerber={bewerber} onNotizGespeichert={ladeBewerbung} />
              {/* <EmailVerlauf bewerber={bewerber} /> */}
            </div>

            {/* Rechte Spalte */}
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
