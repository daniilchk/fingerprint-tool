import { dbService } from "../../services/db/index.js";
import crypto from "crypto";

class FingerprintController {
  async handleFingerprint(req, res, next) {
    try {
      const {...data} = req.body;
      const hash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');

      let currentFingerprint = await dbService.getFingerprint(hash);

      if (!currentFingerprint) {
        currentFingerprint = await dbService.addFingerprint(hash, data);
      }
      console.log(currentFingerprint);

      await dbService.addDeviceRequest(currentFingerprint.id);

      if (currentFingerprint.is_block) {
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

