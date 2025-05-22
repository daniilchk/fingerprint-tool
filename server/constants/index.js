import { hasSuspiciousAssetPatterns } from "../helpers/has-suspicious-asset-patterns.js";

export const CRITERIA = {
  device_and_browser_signals: "device_and_browser_signals",
  page_behavior: "page_behavior",
  session_history: "session_history"
}

export const FINE_CRITERION_DATA = {
  [CRITERIA.device_and_browser_signals]: [
    {
      column: "webdriver_fine",
      evaluate: (fingerprint) => fingerprint?.webdriver ?? false,
      fineValue: 15,
    },
    {
      column: "low_hardware_fine",
      evaluate: (fingerprint) => (fingerprint?.device_memory < 1 || fingerprint?.hardware_concurrency < 2),
      fineValue: 10,
    },
    {
      column: "suspicious_asset_patterns_fine",
      evaluate: hasSuspiciousAssetPatterns,
      fineValue: 20,
    },
  ],
  [CRITERIA.page_behavior]: [
    {
      column: "no_movement_fine",
      evaluate: (fingerprint) => fingerprint?.no_movement,
      fineValue: 10,
    },
    {
      column: "form_speed_fine",
      evaluate: (fingerprint) => fingerprint?.fast_form_speed,
      fineValue: 10,
    }
  ],
  [CRITERIA.session_history]: {
    is_shared_ip_fine: 15,
  },
}

export const MAX_FINE_BY_CRITERION = {
  [CRITERIA.device_and_browser_signals]: 45,
  [CRITERIA.page_behavior]: 20,
  [CRITERIA.session_history]: 15,
}
