WITH recent_requests AS (
  SELECT ip
  FROM public.RecordedDeviceRequest
  WHERE fingerprint_id = $1
  ORDER BY created_at DESC
  LIMIT 10
)
SELECT COUNT(DISTINCT ip) AS unique_ips
FROM recent_requests;
