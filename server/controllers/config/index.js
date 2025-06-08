import { dbService } from "../../services/db/index.js";

class ConfigController {
  getConfig = async (req, res, next) => {
    try {
      const config = await dbService.getConfigAllCriterion();

      return res.status(200).json({ data: config });
    } catch(e) {
      next(e);
    }
  }

  updateConfig = async (req, res, next) => {
    try {
      const updates = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({ error: 'Expected array of updates' });
      }

      const updatedConfigs = await dbService.batchUpdateConfig(updates);

      return res.status(200).json({
        data: updatedConfigs,
        message: `Updated ${updatedConfigs.length} criteria`
      });
    } catch(e) {
      next(e);
    }
  }
}

export const configController = new ConfigController();
