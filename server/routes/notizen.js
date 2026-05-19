import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import axios from 'axios';

const router = Router();
const TABLE_ID = process.env.NOCODB_TABLE_ID || 'YOUR_TABLE_ID';

function nocoHeaders() {
  return { 'xc-token': process.env.NOCODB_API_TOKEN };
}

router.patch('/:id', [
  param('id').isNumeric().withMessage('Ungültige ID.'),
  body('notiz').isString().isLength({ max: 50000 }).withMessage('Notiz zu lang.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { notiz } = req.body;

  try {
    await axios.patch(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`,
      { Id: parseInt(req.params.id), Notizen: notiz },
      { headers: nocoHeaders() }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern der Notiz.', detail: err.message });
  }
});

router.patch('/:id/status', [
  param('id').isNumeric().withMessage('Ungültige ID.'),
  body('status').isIn(['offen', 'eingeladen', 'abgesagt'])
    .withMessage('Ungültiger Status.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;

  try {
    await axios.patch(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`,
      { Id: parseInt(req.params.id), Status: status },
      { headers: nocoHeaders() }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Status.', detail: err.message });
  }
});

export default router;
