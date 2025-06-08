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

  async updateThreshold(req, res, next) {
    try {
      const newValue = Number(req.body.threshold);

      if (isNaN(newValue)) {
        return res.status(400).json({ error: 'Number is required' });
      }

      const updatedValue = await dbService.updateThreshold(newValue);

      return res.status(200).json({ data: updatedValue});
    } catch(e) {
      next(e);
    }
  }

  async getThreshold(req, res, next) {
    try {
      const threshold = await dbService.getThreshold();

      return res.status(200).json({ data: threshold.value });
    } catch(e) {
      next(e);
    }
  }
}

export const configController = new ConfigController();
