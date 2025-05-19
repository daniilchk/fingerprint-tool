INSERT INTO public.DeviceFingerprints (
  hash,
  user_agent,
  platform,
  hardware_concurrency,
  device_memory,
  available_resolution,
  color_depth,
  pixel_ratio,
  timezone,
  timezone_offset,
  cookies_enabled,
  local_storage,
  session_storage,
  indexed_db,
  webgl_vendor,
  webgl_renderer,
  webdriver,
  canvas_fingerprint,
  plugins,
  mime_types,
  media_devices_count
)
SELECT
  $1::VARCHAR(64) AS hash,
  j.user_agent AS user_agent,
  j.platform AS platform,
  j.hardware_concurrency::INT AS hardware_concurrency,
  j.device_memory::NUMERIC AS device_memory,
  j.available_resolution AS available_resolution,
  j.color_depth::INT AS color_depth,
  j.pixel_ratio::NUMERIC AS pixel_ratio,
  j.timezone AS timezone,
  j.timezone_offset::INT AS timezone_offset,
  j.cookies_enabled::BOOLEAN AS cookies_enabled,
  j.local_storage::BOOLEAN AS local_storage,
  j.session_storage::BOOLEAN AS session_storage,
  j.indexed_db::BOOLEAN AS indexed_db,
  j.webgl_vendor AS webgl_vendor,
  j.webgl_renderer AS webgl_renderer,
  j.webdriver::BOOLEAN AS webdriver,
  j.canvas_fingerprint AS canvas_fingerprint,
  (
    SELECT ARRAY_AGG(elem)
    FROM jsonb_array_elements_text(j.plugins) AS elem
  ) AS plugins,
  (
    SELECT ARRAY_AGG(elem)
    FROM jsonb_array_elements_text(j.mime_types) AS elem
  ) AS mime_types,
  j.media_devices_count::INT AS media_devices_count
FROM
  jsonb_to_record($2::JSONB) AS j(
    user_agent               TEXT,
    platform                 TEXT,
    hardware_concurrency     TEXT,
    device_memory            TEXT,
    available_resolution     TEXT,
    color_depth              TEXT,
    pixel_ratio              TEXT,
    timezone                 TEXT,
    timezone_offset          TEXT,
    cookies_enabled          TEXT,
    local_storage            TEXT,
    session_storage          TEXT,
    indexed_db               TEXT,
    webgl_vendor             TEXT,
    webgl_renderer           TEXT,
    webdriver                TEXT,
    canvas_fingerprint       TEXT,
    plugins                  JSONB,
    mime_types               JSONB,
    media_devices_count      TEXT
  )
  RETURNING *;
