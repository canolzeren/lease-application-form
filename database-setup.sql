-- Database setup voor Lease Aanvraagformulier
-- Voer dit uit in de Supabase SQL Editor

-- Maak de lease_aanvragen tabel
CREATE TABLE IF NOT EXISTS lease_aanvragen (
  id BIGSERIAL PRIMARY KEY,
  
  -- Financial Lease specifieke velden
  voorletters TEXT,
  achternaam TEXT,
  email TEXT,
  telefoonnummer TEXT,
  bedrijfsnaam TEXT,
  kvk_nummer TEXT,
  
  -- Lease gegevens
  lease_type TEXT NOT NULL,
  voertuig TEXT,
  aanbetaling DECIMAL(10,2) DEFAULT 0,
  slotsom DECIMAL(10,2) DEFAULT 0,
  looptijd INTEGER DEFAULT 0,
  maandbedrag DECIMAL(10,2) DEFAULT 0,
  
  -- Extra opties
  laadpaal BOOLEAN DEFAULT false,
  zonnepanelen BOOLEAN DEFAULT false,
  verzekering BOOLEAN DEFAULT false,
  tankpas BOOLEAN DEFAULT false,
  inrichting_bedrijfsauto BOOLEAN DEFAULT false,
  auto_belettering BOOLEAN DEFAULT false,
  totaal_opties DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  aanvraagdatum TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Nieuw',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maak indexes voor betere performance
CREATE INDEX IF NOT EXISTS idx_lease_aanvragen_email ON lease_aanvragen(email);
CREATE INDEX IF NOT EXISTS idx_lease_aanvragen_status ON lease_aanvragen(status);
CREATE INDEX IF NOT EXISTS idx_lease_aanvragen_aanvraagdatum ON lease_aanvragen(aanvraagdatum);

-- Maak een functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Voeg trigger toe voor updated_at (als deze nog niet bestaat)
DROP TRIGGER IF EXISTS update_lease_aanvragen_updated_at ON lease_aanvragen;
CREATE TRIGGER update_lease_aanvragen_updated_at 
    BEFORE UPDATE ON lease_aanvragen 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Schakel RLS in voor security
ALTER TABLE lease_aanvragen ENABLE ROW LEVEL SECURITY;

-- Maak een policy die alle operaties toestaat (voor development)
-- In productie zou je specifiekere policies willen
DROP POLICY IF EXISTS "Allow all operations" ON lease_aanvragen;
CREATE POLICY "Allow all operations" ON lease_aanvragen
  FOR ALL USING (true);

-- Test data invoegen (optioneel)
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
SELECT 'Database setup completed successfully!' as status; 