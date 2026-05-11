# 🌿 Biohacking Club – Bewerbermanagementsystem

Passwortgeschütztes Bewerbermanagementsystem für den Biohacking Club.

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** React + Vite + Tailwind CSS
- **Auth:** express-session + bcrypt
- **Deployment:** PM2 + Nginx auf Hetzner

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/Tonia1991/HRRecruitingBiohackingClub.git
cd HRRecruitingBiohackingClub
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
# .env mit echten Werten befüllen
```

### 4. Admin-Passwort-Hash generieren

```bash
node -e "import('bcrypt').then(b => b.default.hash('DEIN_PASSWORT', 12).then(console.log))"
```

Den ausgegebenen Hash in `.env` bei `ADMIN_PASSWORD_HASH` eintragen.

### 5. NocoDB Table ID

Die Table ID aus der NocoDB URL ablesen, wenn die Tabelle offen ist, und in `.env` bei `NOCODB_TABLE_ID` eintragen.

### 6. Entwicklungsmodus starten

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend mit Hot Reload):
```bash
npm run dev
```

App läuft auf: http://localhost:5173 (Frontend-Dev) / http://localhost:3001 (Backend)

### 7. Produktion

```bash
# Build erstellen und Server starten
npm run start

# Oder mit PM2:
npm run build
pm2 start server/index.js --name recruiting-app
pm2 save
pm2 startup
```

## Projektstruktur

```
├── server/
│   ├── index.js              # Express Entry Point
│   ├── auth.js               # Auth Middleware
│   └── routes/
│       ├── bewerbungen.js    # NocoDB API Proxy
│       ├── entscheidung.js   # n8n Webhook Proxy
│       ├── email.js          # KI Email via Azure OpenAI
│       ├── notizen.js        # Notizen & Status
│       └── nextcloud.js      # PDF Proxy
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── BewerbungDetail.jsx
│   └── components/
│       ├── layout/           # Sidebar, TopBar
│       ├── dashboard/        # Kanban, Tabelle, Filter
│       ├── detail/           # Bewerber-Detail-Components
│       └── shared/           # Badges, Modals
└── .env.example
```

## NocoDB Felder

Die App erwartet folgende Felder in der NocoDB-Tabelle:

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `Id` | Number | Primärschlüssel |
| `Name` | Text | Vollständiger Name |
| `Vorname` | Text | Vorname (optional) |
| `Nachname` | Text | Nachname (optional) |
| `Stelle` | Text | Bewerberstelle |
| `Email` | Email | E-Mail-Adresse |
| `Telefon` | Text | Telefonnummer |
| `Status` | Text | Neu / Screening abgeschlossen / In Bearbeitung / Eingeladen / Abgesagt |
| `Eingangsdatum` | Date | Eingangsdatum |
| `Gehaltsvorstellung` | Number | Gehaltsvorstellung in EUR |
| `Verfuegbarkeit` | Text | Verfügbarkeit ab |
| `Quelle` | Text | Bewerbungsquelle |
| `KI_Note` | Number | KI-Note (1–6) |
| `KI_Empfehlung` | Text | Einladen / Absagen / Prüfen |
| `KI_Zusammenfassung` | Text | KI-Zusammenfassung |
| `KI_Staerken` | Text | KI-Stärken |
| `KI_Schwaechen` | Text | KI-Schwächen |
| `KI_Fehlende_Qualifikationen` | Text | Fehlende Qualifikationen |
| `KI_Risiken` | Text | Risiken |
| `Notizen` | Text | Manuelle Notizen |
| `Loeschdatum` | Date | DSGVO Löschdatum |
| `Email_Verlauf` | JSON | Array mit gesendeten Emails |
| `Nextcloud_Ordner` | Text | Nextcloud-Ordnerpfad |

## Sicherheit

- Session-basierte Authentifizierung (httpOnly Cookie)
- Rate Limiting auf Login (5 Versuche / 15 Min)
- Helmet.js Security Headers
- Alle API-Calls via Backend-Proxy (kein Token im Frontend)
- Input Validation auf allen POST-Endpoints
- Pfad-Traversal-Schutz beim Nextcloud-Proxy

## Deployment auf Hetzner

```nginx
# Nginx Konfiguration
server {
    listen 80;
    server_name recruiting.antoniabutze.de;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
