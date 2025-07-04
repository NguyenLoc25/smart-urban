// pages/api/control-light.js
import { ref, set } from 'firebase/database';
import { db } from '@/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { path, value } = req.body;
  if (!path) return res.status(400).json({ error: 'Yêu cầu path' });

  try {
    await set(ref(db, path), value);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
