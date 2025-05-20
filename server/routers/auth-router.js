import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, JWT_EXPIRES_IN, JWT_SECRET } from '../config.js';
import { pool } from '../services/db/pool.js';

export const router = new Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await pool.query(
    'SELECT id, password_hash, role FROM public.users WHERE username = $1',
    [username]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    // secure: true, // включите на HTTPS
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: 'lax',
  });

  res.json({ message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out' });
});
