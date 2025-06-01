WITH requests AS (
  SELECT created_at
  FROM public.RecordedDeviceRequest
  WHERE fingerprint_id = $1
  ORDER BY created_at DESC
  LIMIT 5
),
intervals AS (
  SELECT
    created_at,
    EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (ORDER BY created_at))) AS interval_seconds
  FROM requests
)
SELECT
  COUNT(DISTINCT ROUND(interval_seconds / (SELECT AVG(interval_seconds) FROM intervals WHERE interval_seconds IS NOT NULL) * 10)) AS unique_intervals
FROM intervals
WHERE interval_seconds IS NOT NULL;
