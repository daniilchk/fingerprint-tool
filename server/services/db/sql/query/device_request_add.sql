INSERT INTO public.RecorderedDeviceRequest (hash_id)
VALUES ($1::bigint)
RETURNING *;
