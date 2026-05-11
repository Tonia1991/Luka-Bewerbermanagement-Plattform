import { Router } from 'express';
import axios from 'axios';

const router = Router();
const TABLE_ID = process.env.NOCODB_TABLE_ID || 'YOUR_TABLE_ID';

function nocoHeaders() {
  return { 'xc-auth': process.env.NOCODB_API_TOKEN };
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
    conditions.push(`(KI_Note,lte,${query.note_max})`);
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
    'NoteAuf': 'KI_Note',
    'NoteAb': '-KI_Note',
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
      params.where = (params.where ? params.where + '~and' : '') +
        `(Name,like,%${req.query.suche}%)`;
    }

    const response = await axios.get(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records`,
      { headers: nocoHeaders(), params }
    );

    res.json(response.data?.list || []);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Bewerbungen.', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.NOCODB_API_URL}/api/v2/tables/${TABLE_ID}/records/${req.params.id}`,
      { headers: nocoHeaders() }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Bewerbung.', detail: err.message });
  }
});

export default router;
