import { Router } from 'express';
import { ImapFlow } from 'imapflow';

const router = Router();

function decodeQuotedPrintable(str) {
  str = str.replace(/=\r?\n/g, '');
  const bytes = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] === '=' && i + 2 < str.length && /[0-9A-Fa-f]{2}/.test(str.substr(i + 1, 2))) {
      bytes.push(parseInt(str.substr(i + 1, 2), 16));
      i += 3;
    } else {
      bytes.push(str.charCodeAt(i));
      i++;
    }
  }
  return Buffer.from(bytes).toString('utf-8');
}

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
      for await (const msg of client.fetch(limited, { envelope: true, bodyParts: ['1', 'TEXT'] }, { uid: true })) {
        if (!msg.envelope) continue;

        let body = '';
        const part1 = msg.bodyParts?.get('1');
        const partText = msg.bodyParts?.get('text');
        const raw = part1 || partText;
        if (raw) {
          body = raw.toString('utf-8').trim();
          body = decodeQuotedPrintable(body);
          body = body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\r\n/g, '\n').trim();
        }

        messages.push({
          uid: msg.uid,
          datum: msg.envelope.date,
          betreff: msg.envelope.subject || '(kein Betreff)',
          von: msg.envelope.from?.[0]?.address || '',
          an: msg.envelope.to?.map(t => t.address).join(', ') || '',
          richtung: msg.envelope.from?.[0]?.address?.toLowerCase() === process.env.GMAIL_USER?.toLowerCase() ? 'ausgehend' : 'eingehend',
          body,
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
