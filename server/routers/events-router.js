import { Router } from 'express';
import { ensureAuth } from "../middlwares/auth-middlware.js";
import { dbService } from "../services/db/index.js";

export const router = new Router();

router.get("/events", ensureAuth, async (req, res, next) => {
  try {
    const { rows } = await dbService.getDeviceRequests();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});
