import { dbService } from "../../services/db/index.js";
import crypto from "crypto";
import { CRITERIA, FINE_CRITERION_DATA, MAX_FINE_BY_CRITERION } from "../../constants/index.js";

class FingerprintController {
  handleFingerprint = async (req, res, next) => {
    try {
      const { static_data, dynamic_data } = req.body;
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const hash = crypto.createHash('sha256').update(JSON.stringify(static_data)).digest('hex');

      let currentFingerprint = await dbService.getFingerprint(hash);

      if (!currentFingerprint) {
        const deviceFines = this.collectFines(static_data, FINE_CRITERION_DATA[CRITERIA.device_and_browser_signals]);
        currentFingerprint = await dbService.addFingerprint(hash, {...static_data, ...deviceFines});
      }

      const otherFines = await this.collectFines(
        {...static_data, ...dynamic_data, id: currentFingerprint?.id},
        [ ...FINE_CRITERION_DATA[CRITERIA.page_behavior], ...FINE_CRITERION_DATA[CRITERIA.session_history]],
      );

      if (otherFines) {
        currentFingerprint = await dbService.updateFingerprint(currentFingerprint.id, otherFines);
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

  async collectFines(fingerprint, fines)  {
    const data = {};
    let hasFines = false;
    for (const fine of fines) {
      if (fingerprint[fine.column] != null) continue;
      if (await fine.evaluate(fingerprint)) {
        hasFines = true;
        data[fine.column] = fine.fineValue;
      }
    }
    return hasFines ? data : null;
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

  getFingerprints = async (req, res, next) => {
    try {
      const data = await dbService.getFingerprints();
      res.json(data);
    } catch(e) {
      next(e);
    }
  }
}

export const fingerprintController = new FingerprintController();

