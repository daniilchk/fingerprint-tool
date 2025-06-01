import { dbService } from "../services/db/index.js";

export const isIpInstability = async (fingerprintId) => {
  try {
    const res = await dbService.getRequestsByIdWithDifferentIpCount(fingerprintId);
    return res.unique_ips >= 4;
  } catch (err) {
    throw err;
  }
}
