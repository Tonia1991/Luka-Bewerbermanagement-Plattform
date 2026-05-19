import { Router } from 'express';
import axios from 'axios';

const router = Router();
const TABLE_ID = process.env.NOCODB_TABLE_ID || 'YOUR_TABLE_ID';

function nocoHeaders() {
  return { 'xc-token': process.env.NOCODB_API_TOKEN };
}

function normalizeBewerber(b) {
  if (!b) return b;
  const r = { ...b };
  if ('E-Mail' in r) { r.Email = r['E-Mail']; delete r['E-Mail']; }
  if ('Verfuegbar_ab' in r) { r.Verfuegbarkeit = r['Verfuegbar_ab']; delete r['Verfuegbar_ab']; }
  return r;
}

function buildWhereClause(query) {
  const conditions = [];

  if (query.status && query.status !== 'Alle') {
    conditions.push(`(Status,eq,${query.status})`);
  }

  if (query.stelle && query.stelle !== 'Alle') {
    conditions.push(`(Stelle,eq,${query.stelle})`);
  }

  if (query.note_max) {
    conditions.push(`(KI_Score,lte,${query.note_max})`);
  }

  if (query.zeitraum && query.zeitraum !== 'Alle') {
    const now = new Date();
    let von = null;
    if (query.zeitraum === 'Heute') {
      von = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (query.zeitraum === 'Woche') {
      von = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (query.zeitraum === 'Monat') {
      von = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (query.zeitraum === 'Alt') {
      const bis = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      conditions.push(`(Eingangsdatum,lt,${bis.toISOString()})`);
    }
    if (von) {
      conditions.push(`(Eingangsdatum,gte,${von.toISOString()})`);
    }
  }

  return conditions.join('~and');
}

function buildSortParam(sort) {
  const sortMap = {
    'Neueste': '-Eingangsdatum',
    'Aelteste': 'Eingangsdatum',
    'NoteAuf': 'KI_Score',
    'NoteAb': '-KI_Score',
  };
  return sortMap[sort] || '-Eingangsdatum';
}

router.get('/', async (req, res) => {
  try {
    const params = {
      limit: 200,
    };

    const where = buildWhereClause(req.query);
    if (where) params.where = where;

    if (req.query.sort) {
      params.sort = buildSortParam(req.query.sort);
    }

    if (req.query.suche) {
      const q = req.query.suche;
      params.where = (params.where ? params.where + '~and' : '') +
        `(Vorname,like,%${q}%)~or(Nachname,like,%${q}%)`;
    }

    const response = await axios.get(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`,
      { headers: nocoHeaders(), params }
    );

    res.json((response.data?.list || []).map(normalizeBewerber));
  } catch (err) {
    console.error('NocoDB Fehler:', err.message, err.response?.data);
    res.status(500).json({ error: 'Fehler beim Laden der Bewerbungen.', detail: err.message, nocodb: err.response?.data });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records/${req.params.id}`,
      { headers: nocoHeaders() }
    );
    res.json(normalizeBewerber(response.data));
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Bewerbung.', detail: err.message });
  }
});

export default router;
