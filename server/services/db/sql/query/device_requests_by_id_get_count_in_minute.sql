SELECT COUNT(*) as request_count
FROM public.RecordedDeviceRequest
WHERE fingerprint_id = $1
    AND created_at >= NOW() - INTERVAL '1 minute';
