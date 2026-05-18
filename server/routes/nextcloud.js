import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

function nocoCredentials() {
  const user = process.env.NEXTCLOUD_USER;
  const password = process.env.NEXTCLOUD_PASSWORD;
  return { baseUrl: process.env.NEXTCLOUD_BASE_URL, user, password, credentials: Buffer.from(`${user}:${password}`).toString('base64') };
}

function validPfad(pfad) {
  return pfad && typeof pfad === 'string' && !pfad.includes('..') && !pfad.includes('//');
}

function encodePfad(pfad) {
  return pfad.split('/').map(s => encodeURIComponent(s)).join('/');
}

// Datei-Inhalt streamen
router.get('/', async (req, res) => {
  const { pfad } = req.query;
  if (!validPfad(pfad)) return res.status(400).json({ error: 'Ungültiger Pfad.' });

  const { baseUrl, user, credentials } = nocoCredentials();
  if (!baseUrl || !user) return res.status(500).json({ error: 'Nextcloud nicht konfiguriert.' });

  try {
    const url = `${baseUrl}/remote.php/dav/files/${user}/${encodePfad(pfad)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    if (!response.ok) {
      console.error('Nextcloud Datei Fehler:', response.status, url);
      return res.status(response.status).json({ error: 'Dokument nicht gefunden.', status: response.status });
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    response.body.pipe(res);
  } catch (err) {
    console.error('Nextcloud Datei Exception:', err.message);
    res.status(500).json({ error: 'Fehler beim Laden.', detail: err.message });
  }
});

// Dateiliste eines Ordners via WebDAV PROPFIND
router.get('/liste', async (req, res) => {
  const { pfad } = req.query;
  if (!validPfad(pfad)) return res.status(400).json({ error: 'Ungültiger Pfad.' });

  const { baseUrl, user, credentials } = nocoCredentials();
  if (!baseUrl || !user) return res.status(500).json({ error: 'Nextcloud nicht konfiguriert.' });

  try {
    const url = `${baseUrl}/remote.php/dav/files/${user}/${encodePfad(pfad)}/`;
    const response = await fetch(url, {
      method: 'PROPFIND',
      headers: { Authorization: `Basic ${credentials}`, Depth: '1', 'Content-Type': 'application/xml' },
    });

    if (!response.ok) {
      console.error('Nextcloud PROPFIND Fehler:', response.status, url);
    }

    if (!response.ok) return res.status(response.status).json({ error: 'Ordner nicht gefunden.' });

    const xml = await response.text();
    const hrefRegex = /<[^:]*:?href>([^<]+)<\/[^:]*:?href>/g;
    const folderPath = `/remote.php/dav/files/${user}/${pfad}/`;
    const dateien = [];
    let match;

    while ((match = hrefRegex.exec(xml)) !== null) {
      const href = decodeURIComponent(match[1]);
      if (href !== folderPath && !href.endsWith('/')) {
        const name = href.split('/').pop();
        if (name) dateien.push(name);
      }
    }

    res.json({ dateien });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Dateiliste.', detail: err.message });
  }
});

export default router;
