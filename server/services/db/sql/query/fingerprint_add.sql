INSERT INTO public.DeviceFingerprints (hash, data)
VALUES ($1::VARCHAR(64), $2::jsonb)
RETURNING *;
