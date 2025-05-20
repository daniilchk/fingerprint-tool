import { Router } from "express";
import { router as fingerprintRouter } from "./fingerprint.js";
import { router as authRouter } from "./auth-router.js";
import { ensureAuth } from '../middlwares/auth-middlware.js';

export const router = new Router();

router.use("/api", fingerprintRouter);
router.use("/auth", authRouter);

router.get('/api/me', ensureAuth, (req, res) => {
  // req.user выставляется в ensureAuth
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
});
