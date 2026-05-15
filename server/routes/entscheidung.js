import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';

const router = Router();

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
    const webhookUrl = process.env.NODE_ENV !== 'production' && process.env.N8N_WEBHOOK_ENTSCHEIDUNG_TEST
      ? process.env.N8N_WEBHOOK_ENTSCHEIDUNG_TEST
      : process.env.N8N_WEBHOOK_ENTSCHEIDUNG;

    const webhookResponse = await axios.post(
      webhookUrl,
      { nocodb_id, aktion, email_betreff, email_text },
      { timeout: 30000 }
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
        { timeout: 30000 }
      );
      ergebnisse.push({ id, success: true });
    } catch (err) {
      fehler.push({ id, error: err.message });
    }
  }

  res.json({ ergebnisse, fehler });
});

export default router;
