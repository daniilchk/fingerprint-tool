SELECT * FROM public.DeviceFingerprints
WHERE hash = $1::VARCHAR(64)
LIMIT 1;
