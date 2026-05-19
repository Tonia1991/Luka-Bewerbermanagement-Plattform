import { Router } from 'express';
import { ImapFlow } from 'imapflow';

const router = Router();

function gmailClient() {
  return new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, ''),
    },
    logger: false,
  });
}

router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email fehlt.' });
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Gmail nicht konfiguriert.' });
  }

  const client = gmailClient();
  try {
    await client.connect();
    // Deutschen und englischen Ordnernamen probieren
    try {
      await client.mailboxOpen('[Gmail]/Alle Nachrichten');
    } catch {
      await client.mailboxOpen('[Gmail]/All Mail');
    }

    const uids = await client.search({ or: [{ from: email }, { to: email }] }, { uid: true });

    const messages = [];
    if (uids.length > 0) {
      const limited = uids.slice(-50);
      for await (const msg of client.fetch(limited, { envelope: true }, { uid: true })) {
        if (!msg.envelope) continue;
        messages.push({
          uid: msg.uid,
          datum: msg.envelope.date,
          betreff: msg.envelope.subject || '(kein Betreff)',
          von: msg.envelope.from?.[0]?.address || '',
          an: msg.envelope.to?.map(t => t.address).join(', ') || '',
          richtung: msg.envelope.from?.[0]?.address?.toLowerCase() === process.env.GMAIL_USER?.toLowerCase() ? 'ausgehend' : 'eingehend',
        });
      }
    }

    messages.sort((a, b) => new Date(b.datum) - new Date(a.datum));
    res.json({ emails: messages.slice(0, 30) });
  } catch (err) {
    console.error('Gmail IMAP Fehler:', err.message);
    res.status(500).json({ error: 'Fehler beim Laden der Emails.', detail: err.message });
  } finally {
    await client.logout().catch(() => {});
  }
});

export default router;
