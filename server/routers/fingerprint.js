import { Router } from "express";
import { fingerprintController } from "../controllers/fingerprint/index.js";
import { ensureAuth } from "../middlwares/auth-middlware.js";

export const router = new Router();

router.post("/fingerprint", fingerprintController.handleFingerprint);
router.get("/fingerprints", ensureAuth, fingerprintController.getFingerprints);
