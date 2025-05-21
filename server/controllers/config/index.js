import { dbService } from "../../services/db/index.js";

class ConfigController {
  handleFingerprint = async (req, res, next) => {
    try {
      const config = await dbService.getConfigAllCriterion();

      return res.status(200).json({ data: config });
    } catch(e) {
      next(e);
    }
  }
}

export const configController = new ConfigController();
