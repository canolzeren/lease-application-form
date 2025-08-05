-- Volledig uitschakelen van RLS voor lease_aanvragen tabel
-- Voer dit uit in de Supabase SQL Editor

-- Schakel RLS uit
ALTER TABLE lease_aanvragen DISABLE ROW LEVEL SECURITY;

-- Verwijder alle bestaande policies
DROP POLICY IF EXISTS "Allow all operations" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable read access for all users" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable insert for all users" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable update for all users" ON lease_aanvragen;
DROP POLICY IF EXISTS "Enable delete for all users" ON lease_aanvragen;

-- Test insert
INSERT INTO lease_aanvragen (
  lease_type,
  status
) VALUES (
  'Financial Lease',
  'Nieuw'
) RETURNING *;

-- Toon resultaat
SELECT 'RLS disabled successfully!' as status; 