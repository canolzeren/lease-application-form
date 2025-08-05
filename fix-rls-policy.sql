-- Fix RLS (Row Level Security) policy voor lease_aanvragen tabel
-- Voer dit uit in de Supabase SQL Editor

-- Schakel RLS tijdelijk uit om data te kunnen invoegen
ALTER TABLE lease_aanvragen DISABLE ROW LEVEL SECURITY;

-- Of maak een nieuwe policy die alle operaties toestaat
DROP POLICY IF EXISTS "Allow all operations" ON lease_aanvragen;
CREATE POLICY "Allow all operations" ON lease_aanvragen
  FOR ALL USING (true)
  WITH CHECK (true);

-- Schakel RLS weer in
ALTER TABLE lease_aanvragen ENABLE ROW LEVEL SECURITY;

-- Test de policy met een eenvoudige insert
INSERT INTO lease_aanvragen (
  lease_type,
  status
) VALUES (
  'Financial Lease',
  'Nieuw'
) RETURNING *;

-- Toon resultaat
SELECT 'RLS policy fixed successfully!' as status; 