import { dbService } from "../../services/db/index.js";
import crypto from "crypto";

class FingerprintController {
  async handleFingerprint(req, res, next) {
    try {
      const { staticData } = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const hash = crypto.createHash('sha256').update(JSON.stringify(staticData)).digest('hex');

      let currentFingerprint = await dbService.getFingerprint(hash);

      if (!currentFingerprint) {
        currentFingerprint = await dbService.addFingerprint(hash, staticData);
      }

      await dbService.addDeviceRequest(currentFingerprint.id, ip);

      if (currentFingerprint.risk_score > 75) {
        return res.status(403).json({ message: "Access denied"});
      } else {
        return res.status(200).json({ status: 'ok' });
      }
    } catch(e) {
      next(e);
    }
  }
}

export const fingerprintController = new FingerprintController();

