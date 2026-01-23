-- 1. Ensure Buckets Exist and are Public
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to avoid conflicts (clean slate for specific policies)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Select Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Images" ON storage.objects;

-- 3. Create Policy: ALLOW PUBLIC READ (Select) for 'images' and 'videos'
CREATE POLICY "Public Select Images"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('images', 'videos') );

-- 4. Create Policy: ALLOW AUTHENTICATED INSERT/UPDATE (Upload)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id IN ('images', 'videos') );

CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id IN ('images', 'videos') );

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id IN ('images', 'videos') );
