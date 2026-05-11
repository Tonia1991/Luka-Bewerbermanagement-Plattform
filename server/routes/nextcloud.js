import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

router.get('/', async (req, res) => {
  const { pfad } = req.query;

  if (!pfad || typeof pfad !== 'string') {
    return res.status(400).json({ error: 'Pfad fehlt.' });
  }

  // Pfad-Traversal verhindern
  if (pfad.includes('..') || pfad.includes('//')) {
    return res.status(400).json({ error: 'Ungültiger Pfad.' });
  }

  const baseUrl = process.env.NEXTCLOUD_BASE_URL;
  const user = process.env.NEXTCLOUD_USER;
  const password = process.env.NEXTCLOUD_PASSWORD;

  if (!baseUrl || !user || !password) {
    return res.status(500).json({ error: 'Nextcloud nicht konfiguriert.' });
  }

  const url = `${baseUrl}/remote.php/dav/files/${user}/${pfad}`;
  const credentials = Buffer.from(`${user}:${password}`).toString('base64');

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Dokument nicht gefunden.' });
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden des Dokuments.', detail: err.message });
  }
});

export default router;
