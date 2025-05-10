INSERT INTO public.RecordedDeviceRequest (fingerprint_id, ip)
VALUES ($1::bigint, $2::INET)
RETURNING *;
