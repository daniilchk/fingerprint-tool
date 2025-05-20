import jwt from 'jsonwebtoken';
import { pool } from "../services/db/pool.js";
import { COOKIE_NAME, JWT_SECRET } from "../config.js";

export async function ensureAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT id, username, role FROM public.users WHERE id = $1',
      [payload.sub]
    );
    if (!rows[0]) throw new Error();
    req.user = rows[0];
    next();
  } catch {
    res.clearCookie(COOKIE_NAME);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
