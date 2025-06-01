import { dbService } from "../services/db/index.js";

export const isSharedIP = async (ipAddress) => {
  try {
    const res = await dbService.getRequestCountInHourByIp(ipAddress);
    return res.unique_fingerprints >= 9;
  } catch (err) {
    throw err;
  }
}
