import { PgDatabaseError } from "../services/db/index.js";

export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err instanceof PgDatabaseError) {
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(500).json({ error: 'Something went wrong' });
}
