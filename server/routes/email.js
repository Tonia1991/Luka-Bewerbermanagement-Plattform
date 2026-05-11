import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';

const router = Router();

router.post('/', [
  body('aktion').isIn(['einladen', 'absagen']).withMessage('Ungültige Aktion.'),
  body('vorname').isString().trim().notEmpty(),
  body('nachname').isString().trim().notEmpty(),
  body('stelle').isString().trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { aktion, vorname, nachname, stelle, ki_zusammenfassung, ki_staerken, ki_schwaechen } = req.body;

  const systemPrompt = `Du bist ein professioneller HR-Assistent des Biohacking Clubs.
Schreibe professionelle, warmherzige und präzise Emails auf Deutsch.
Halte den Ton freundlich, respektvoll und professionell.
Nutze keine Floskeln und komme auf den Punkt.`;

  const userPrompt = aktion === 'einladen'
    ? `Schreibe eine Einladungs-Email zum Vorstellungsgespräch für:
Name: ${vorname} ${nachname}
Stelle: ${stelle}
KI-Zusammenfassung: ${ki_zusammenfassung || 'nicht verfügbar'}
KI-Stärken: ${ki_staerken || 'nicht verfügbar'}

Betreff und Email-Text getrennt ausgeben. Format:
BETREFF: [Betreff hier]
EMAIL: [Email-Text hier]`
    : `Schreibe eine einfühlsame Absage-Email für:
Name: ${vorname} ${nachname}
Stelle: ${stelle}
KI-Zusammenfassung: ${ki_zusammenfassung || 'nicht verfügbar'}

Erwähne am Ende den DSGVO-Hinweis zur Datenlöschung innerhalb von 30 Tagen.
Format:
BETREFF: [Betreff hier]
EMAIL: [Email-Text hier]`;

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    const response = await axios.post(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`,
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.7,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const text = response.data.choices[0].message.content;

    const betreffMatch = text.match(/BETREFF:\s*(.+)/);
    const emailMatch = text.match(/EMAIL:\s*([\s\S]+)/);

    res.json({
      betreff: betreffMatch ? betreffMatch[1].trim() : `Ihre Bewerbung beim Biohacking Club`,
      text: emailMatch ? emailMatch[1].trim() : text,
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Generieren des Email-Vorschlags.', detail: err.message });
  }
});

export default router;
