import { pool } from "./pool.js";
import SQL from "./sql/index.js";

export class PgDatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "PgDatabaseError";
  }
}

class DbService {
  constructor(pool) {
    this.pool = pool;
  }

  async makeRequestToDb(options) {
    const { query, values = [], errorMessage, isSingle = false} = options;

    try {
      const result = await this.pool.query(query, values);
      return isSingle ? this._getSingleResult(result) : this._getDbResult(result);
    } catch (error) {
      throw new PgDatabaseError(`[DB error] ${errorMessage}: ${error.message}`);
    }
  }

  _getSingleResult(result) {
    return result.rows[0] || null;
  }

  _getDbResult(result) {
    return result.rows;
  }

  async checkConnection() {
    return await this.makeRequestToDb({
      query: "SELECT NOW() as timestamp",
      errorMessage: 'checkDatabaseConnection',
      isSingle: true,
    })
  }

  async getFingerprint(hash) {
    return await this.makeRequestToDb({
      query: SQL.fingerprintGet,
      errorMessage: 'fingerprintGet',
      values: [ hash ],
      isSingle: true,
    })
  }

  async addFingerprint(hash, data) {
    return  await this.makeRequestToDb({
      query: SQL.fingerprintAdd,
      errorMessage: 'fingerprintAdd',
      values: [hash, data],
      isSingle: true,
    });
  }

  async addDeviceRequest(fingerprintId, ip) {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestAdd,
      errorMessage: 'deviceRequestAdd',
      values: [ fingerprintId, ip ],
      isSingle: true,
    })
  }

  async getConfigEnabledCriterion() {
    return await this.makeRequestToDb({
      query: SQL.configGetEnabledCriterion,
      errorMessage: 'getConfigEnabledCriterion',
      isSingle: false,
    })
  }

  async getConfigAllCriterion() {
    return await this.makeRequestToDb({
      query: SQL.configGetAllCriterion,
      errorMessage: 'getConfigAllCriterion',
      isSingle: false,
    })
  }

  async updateFingerprint(id, updates) {
    const keys = Object.keys(updates);

    const setClauses = keys
      .map((col, idx) => `"${col}" = $${idx + 2}`)
      .join(', ');

    const values = [id, ...keys.map(k => updates[k])];

    const query = `
      UPDATE public.DeviceFingerprints
      SET ${setClauses}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async getFingerprints() {
    return await this.makeRequestToDb({
      query: SQL.fingerprintsGet,
      errorMessage: 'fingerprintsGet',
      isSingle: false,
    })
  }

  async getDeviceRequests() {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestsGet,
      errorMessage: 'deviceRequestGet',
      isSingle: false,
    })
  }

  async getRequestCountInMinuteById(id) {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestsByIdGetCountInMinute,
      errorMessage: 'requestsCountGet',
      values: [ id ],
      isSingle: true,
    })
  }

  async getRequestIntervals(id) {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestsIntervals,
      errorMessage: 'getRequestIntervals',
      values: [ id ],
      isSingle: true,
    })
  }

  async getRequestCountInHourByIp(ip) {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestsByIpGetCountInHour,
      errorMessage: 'requestsCountByIpGet',
      values: [ ip ],
      isSingle: true,
    })
  }

  async getRequestsByIdWithDifferentIpCount(id) {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestsByIdWithDifferentIpCount,
      errorMessage: 'getRequestsByIdWithDifferentIpCount',
      values: [ id ],
      isSingle: true,
    })
  }
}

export const dbService = new DbService(pool);
