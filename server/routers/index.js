import { Router } from "express";
import { router as fingerprintRouter } from "./fingerprint.js";
import { router as authRouter } from "./auth-router.js";
import { router as configRouter } from "./config-router.js";

export const router = new Router();

router.use("/api", fingerprintRouter);
router.use("/auth", authRouter);
router.use("/config", configRouter);

