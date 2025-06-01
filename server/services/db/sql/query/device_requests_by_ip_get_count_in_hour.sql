SELECT COUNT(DISTINCT fingerprint_id) AS unique_fingerprints
FROM public.RecordedDeviceRequest
WHERE ip = $1
 AND created_at >= NOW() - INTERVAL '1 hour'
