import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';

const router = Router();

function textToHtml(text) {
  if (!text) return '';
  return text.split(/\n\n/).map(p => {
    const trimmed = p.trim();
    if (trimmed === '---') return '<hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">';
    const escaped = trimmed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#4a8cc8;">$1</a>');
    return `<p style="margin:0 0 16px 0;font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${escaped}</p>`;
  }).join('');
}

const validateEntscheidung = [
  body('nocodb_id').notEmpty().withMessage('nocodb_id fehlt.'),
  body('aktion').isIn(['einladen', 'absagen']).withMessage('Ungültige Aktion.'),
  body('email_betreff').optional().isString().trim().isLength({ max: 500 }),
  body('email_text').optional().isString().trim().isLength({ max: 5000 }),
];

router.post('/', validateEntscheidung, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { nocodb_id, aktion, email_betreff, email_text } = req.body;

  try {
    const webhookUrl = process.env.N8N_USE_TEST_WEBHOOK === 'true' && process.env.N8N_WEBHOOK_ENTSCHEIDUNG_TEST
      ? process.env.N8N_WEBHOOK_ENTSCHEIDUNG_TEST
      : process.env.N8N_WEBHOOK_ENTSCHEIDUNG;

    const webhookResponse = await axios.post(
      webhookUrl,
      { nocodb_id, aktion, email_betreff, email_text, email_html: textToHtml(email_text) },
      {
        timeout: 30000,
        headers: process.env.N8N_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}` }
          : {},
      }
    );
    res.json({ success: true, data: webhookResponse.data });
  } catch (err) {
    console.error('Entscheidung Webhook Fehler:', err.message);
    res.status(500).json({ error: 'Fehler beim Senden der Entscheidung.', detail: err.message });
  }
});

router.post('/massen', async (req, res) => {
  const { nocodb_ids, email_betreff, email_text } = req.body;
  if (!Array.isArray(nocodb_ids) || nocodb_ids.length === 0) {
    return res.status(400).json({ error: 'nocodb_ids muss ein nicht-leeres Array sein.' });
  }

  const ergebnisse = [];
  const fehler = [];

  for (const id of nocodb_ids) {
    try {
      await axios.post(
        process.env.N8N_WEBHOOK_ENTSCHEIDUNG,
        { nocodb_id: id, aktion: 'absagen', email_betreff, email_text },
        {
          timeout: 30000,
          headers: process.env.N8N_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}` }
            : {},
        }
      );
      ergebnisse.push({ id, success: true });
    } catch (err) {
      fehler.push({ id, error: err.message });
    }
  }

  res.json({ ergebnisse, fehler });
});

export default router;
