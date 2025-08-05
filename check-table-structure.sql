-- Check huidige tabel structuur
-- Voer dit uit in de Supabase SQL Editor

-- Toon alle kolommen van de lease_aanvragen tabel
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_name = 'lease_aanvragen' 
ORDER BY ordinal_position;

-- Toon een voorbeeld van bestaande data
SELECT * FROM lease_aanvragen LIMIT 5;

-- Probeer een eenvoudige insert met alleen bestaande kolommen
INSERT INTO lease_aanvragen (
  lease_type,
  status
) VALUES (
  'Financial Lease',
  'Nieuw'
) RETURNING *; 