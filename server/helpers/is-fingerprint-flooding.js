import { dbService } from "../services/db/index.js";

export const isFingerprintFlooding = async (fingerprintId) => {
  try {
    const res = await dbService.getRequestCountInMinuteById(fingerprintId);
    const count = parseInt(res.request_count, 10);
    return count >= 19;
  } catch (err) {
    throw err;
  }
}
