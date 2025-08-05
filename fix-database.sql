-- Fix database schema voor lease_aanvragen tabel
-- Voer dit uit in de Supabase SQL Editor

-- Voeg ontbrekende kolommen toe aan de bestaande tabel
ALTER TABLE lease_aanvragen 
ADD COLUMN IF NOT EXISTS voorletters TEXT,
ADD COLUMN IF NOT EXISTS achternaam TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS telefoonnummer TEXT,
ADD COLUMN IF NOT EXISTS bedrijfsnaam TEXT,
ADD COLUMN IF NOT EXISTS kvk_nummer TEXT,
ADD COLUMN IF NOT EXISTS lease_type TEXT DEFAULT 'Financial Lease',
ADD COLUMN IF NOT EXISTS voertuig TEXT,
ADD COLUMN IF NOT EXISTS aanbetaling DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS slotsom DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS looptijd INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS maandbedrag DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS laadpaal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS zonnepanelen BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verzekering BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tankpas BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS inrichting_bedrijfsauto BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_belettering BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS totaal_opties DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS aanvraagdatum TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Nieuw';

-- Toon de huidige tabel structuur
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'lease_aanvragen' 
ORDER BY ordinal_position;

-- Test data invoegen
INSERT INTO lease_aanvragen (
  voorletters, 
  achternaam, 
  email, 
  telefoonnummer, 
  lease_type, 
  voertuig, 
  status
) VALUES (
  'J.M.',
  'Test',
  'test@example.com',
  '0612345678',
  'Financial Lease',
  'BMW X3 xDrive20i',
  'Nieuw'
) ON CONFLICT DO NOTHING;

-- Toon resultaat
SELECT 'Database schema updated successfully!' as status; 