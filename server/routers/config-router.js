import { Router } from 'express';
import { configController } from "../controllers/config/index.js";
import { ensureAuth } from "../middlwares/auth-middlware.js";

export const router = new Router();

router.get("/config", ensureAuth, configController.getConfig);
router.put("/config", ensureAuth, configController.updateConfig);
