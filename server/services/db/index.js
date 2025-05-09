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
    return await this.makeRequestToDb({
      query: SQL.fingerprintAdd,
      errorMessage: 'fingerprintAdd',
      values: [hash, data],
      isSingle: true,
    })
  }

  async addDeviceRequest(hashId) {
    return await this.makeRequestToDb({
      query: SQL.deviceRequestAdd,
      errorMessage: 'deviceRequestAdd',
      values: [ hashId ],
      isSingle: true,
    })
  }
}

export const dbService = new DbService(pool);
