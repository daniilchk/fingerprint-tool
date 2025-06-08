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
  deviceRequestsByIdGetCountInMinute: readFileSync(
    `${sqlPath}/device_requests_by_id_get_count_in_minute.sql`,
    'utf-8',
  ),
  deviceRequestsIntervals: readFileSync(
    `${sqlPath}/device_requests_intervals.sql`,
    'utf-8',
  ),
  deviceRequestsByIpGetCountInHour: readFileSync(
    `${sqlPath}/device_requests_by_ip_get_count_in_hour.sql`,
    'utf-8',
  ),
  deviceRequestsByIdWithDifferentIpCount: readFileSync(
    `${sqlPath}/device_requests_by_id_with_different_ip_count.sql`,
    'utf-8',
  ),
  thresholdGet: readFileSync(
    `${sqlPath}/threshold_get.sql`,
    'utf-8',
  ),
}
