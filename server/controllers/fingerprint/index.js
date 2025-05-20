import { dbService } from "../../services/db/index.js";
import crypto from "crypto";
import { CRITERIA, FINE_CRITERION_DATA, MAX_FINE_BY_CRITERION } from "../../constants/index.js";

class FingerprintController {
  handleFingerprint = async (req, res, next) => {
    try {
      const { staticData } = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const hash = crypto.createHash('sha256').update(JSON.stringify(staticData)).digest('hex');

      let currentFingerprint = await dbService.getFingerprint(hash);

      if (!currentFingerprint) {
        const fines = this.collectFines(staticData, FINE_CRITERION_DATA[CRITERIA.device_and_browser_signals]);
        currentFingerprint = await dbService.addFingerprint(hash, {...staticData, ...fines});
      }

      await dbService.addDeviceRequest(currentFingerprint.id, ip);

      const riskScore = await this.calcRisk(currentFingerprint);

      if (riskScore > 75) {
        return res.status(403).json({ message: "Access denied"});
      } else {
        return res.status(200).json({ status: 'ok' });
      }
    } catch(e) {
      next(e);
    }
  }

  collectFines(fingerprint, fines)  {
    const data = {};
    for (const fine of fines) {
      if (fingerprint[fine.column] != null) continue;
      if (fine.evaluate(fingerprint)) {
        data[fine.column] = fine.fineValue;
      }
    }
    return data;
  }

  async calcRisk(fingerprint) {
    const enabledCriteria = await dbService.getConfigEnabledCriterion();

    let maxRisk = 0;
    let currentRisk = 0;

    enabledCriteria?.forEach((criterion) => {
      maxRisk = maxRisk + (MAX_FINE_BY_CRITERION[criterion.criterion_name] ?? 0);
      criterion.fields?.forEach((field) => {
        currentRisk = currentRisk + (Number(fingerprint[field]) ?? 0)
      })
    })

    const normalizeRiskScore = Math.round((currentRisk / maxRisk) * 100);

    if (normalizeRiskScore !== Number(fingerprint.risk_score)) {
      const updatedFingerprint = await dbService.updateFingerprint(fingerprint.id, { risk_score: normalizeRiskScore })
      return Number(updatedFingerprint.risk_score);
    }

    return Number(fingerprint.risk_score);
  }
}

export const fingerprintController = new FingerprintController();

