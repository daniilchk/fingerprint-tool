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
  fingerprintAdd: readFileSync(
    `${sqlPath}/fingerprint_add.sql`,
    'utf-8',
  ),
  deviceRequestAdd: readFileSync(
    `${sqlPath}/device_request_add.sql`,
    'utf-8',
  ),
}
