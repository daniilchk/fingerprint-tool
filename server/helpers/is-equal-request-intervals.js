import { dbService } from "../services/db/index.js";

export const isEqualRequestIntervals = async (fingerprintId) => {
  try {
    const res = await dbService.getRequestIntervals(fingerprintId);
    return res.unique_intervals <= 1;
  } catch (err) {
    throw err;
  }
}
