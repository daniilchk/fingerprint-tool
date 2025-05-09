import { Router } from "express";
import { router as fingerprintRouter } from "./fingerprint.js";

export const router = new Router();

router.use("/api", fingerprintRouter);
