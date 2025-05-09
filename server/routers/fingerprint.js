import { Router } from "express";
import { fingerprintController } from "../controllers/fingerprint/index.js";

export const router = new Router();

router.post("/fingerprint", fingerprintController.handleFingerprint);
