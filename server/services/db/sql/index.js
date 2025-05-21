import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlPath = resolve(__dirname, './', 'query')

export default {
  fingerprintGet: readFileSync(
    `${sqlPath}/fingerprint_get.sql`,
    'utf-8',
  ),
  fingerprintsGet: readFileSync(
    `${sqlPath}/fingerprints_get.sql`,
    'utf-8',
  ),
  fingerprintAdd: readFileSync(
    `${sqlPath}/fingerprint_add.sql`,
    'utf-8',
  ),
  deviceRequestAdd: readFileSync(
    `${sqlPath}/device_request_add.sql`,
    'utf-8',
  ),
  deviceRequestsGet: readFileSync(
    `${sqlPath}/device_requests_get.sql`,
    'utf-8',
  ),
  configGetEnabledCriterion: readFileSync(
    `${sqlPath}/config_get_enabled_criterion.sql`,
    'utf-8',
  ),
  configGetAllCriterion: readFileSync(
    `${sqlPath}/config_get_all_criterion.sql`,
    'utf-8',
  ),
}
