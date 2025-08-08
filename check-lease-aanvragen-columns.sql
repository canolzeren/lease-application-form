-- Check exact column names in lease_aanvragen table
-- Voer dit uit in de Supabase SQL Editor

SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_name = 'lease_aanvragen' 
ORDER BY ordinal_position;

-- Toon een voorbeeld van bestaande data structuur
SELECT * FROM lease_aanvragen LIMIT 1;
