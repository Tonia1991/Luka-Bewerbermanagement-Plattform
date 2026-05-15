import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import nodemailer from 'nodemailer';

const router = Router();
const TABLE_ID = process.env.NOCODB_TABLE_ID || 'YOUR_TABLE_ID';

function nocoHeaders() {
  return { 'xc-token': process.env.NOCODB_API_TOKEN };
}

function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
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
  const neuerStatus = aktion === 'einladen' ? 'eingeladen' : 'abgesagt';

  try {
    // Bewerber laden (für Email-Adresse)
    const recordRes = await axios.get(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records/${nocodb_id}`,
      { headers: nocoHeaders() }
    );
    const bewerber = recordRes.data;

    // Status in NocoDB aktualisieren
    await axios.patch(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`,
      { Id: parseInt(nocodb_id), Status: neuerStatus },
      { headers: nocoHeaders() }
    );

    // Email senden
    if (bewerber.Email && email_text && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Biohacking Club Recruiting" <${process.env.GMAIL_USER}>`,
        to: bewerber.Email,
        subject: email_betreff || 'Ihre Bewerbung beim Biohacking Club',
        text: email_text,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Entscheidung Fehler:', err.message);
    res.status(500).json({ error: 'Fehler beim Verarbeiten der Entscheidung.', detail: err.message });
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
      await axios.patch(
        `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`,
        { Id: parseInt(id), Status: 'abgesagt' },
        { headers: nocoHeaders() }
      );

      if (email_text && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const recordRes = await axios.get(
          `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records/${id}`,
          { headers: nocoHeaders() }
        );
        if (recordRes.data.Email) {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: `"Biohacking Club Recruiting" <${process.env.GMAIL_USER}>`,
            to: recordRes.data.Email,
            subject: email_betreff || 'Ihre Bewerbung beim Biohacking Club',
            text: email_text,
          });
        }
      }

      ergebnisse.push({ id, success: true });
    } catch (err) {
      fehler.push({ id, error: err.message });
    }
  }

  res.json({ ergebnisse, fehler });
});

export default router;
