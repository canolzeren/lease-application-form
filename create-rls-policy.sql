-- Complete RLS Policy voor lease_aanvragen tabel
-- Voer dit uit in de Supabase SQL Editor

-- Schakel RLS in
ALTER TABLE lease_aanvragen ENABLE ROW LEVEL SECURITY;

-- Verwijder bestaande policies
DROP POLICY IF EXISTS "Allow all operations" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable read access for all users" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable insert for all users" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable update for all users" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable delete for all users" ON lease_aanvragen;

-- Maak een policy die ALLE operaties toestaat voor anonieme gebruikers
CREATE POLICY "Allow all operations for anonymous users" ON lease_aanvragen
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Of als alternatief, maak aparte policies voor elke operatie:

-- Policy voor SELECT (lezen)
CREATE POLICY "Enable read access for anonymous users" ON lease_aanvragen
  FOR SELECT
  TO anon
  USING (true);

-- Policy voor INSERT (invoegen)
CREATE POLICY "Enable insert for anonymous users" ON lease_aanvragen
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy voor UPDATE (bijwerken)
CREATE POLICY "Enable update for anonymous users" ON lease_aanvragen
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy voor DELETE (verwijderen)
CREATE POLICY "Enable delete for anonymous users" ON lease_aanvragen
  FOR DELETE
  TO anon
  USING (true);

-- Test de policy met een insert
INSERT INTO lease_aanvragen (
  lease_type,
  status,
  voornaam,
  achternaam,
  email,
  telefoon
) VALUES (
  'Financial Lease',
  'Nieuw',
  'Test',
  'User',
  'test@example.com',
  '0612345678'
) RETURNING *;

-- Toon resultaat
SELECT 'RLS policies created successfully!' as status; 