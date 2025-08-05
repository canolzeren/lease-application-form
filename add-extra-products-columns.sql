-- Voeg kolommen toe voor extra producten
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS laadpaal BOOLEAN DEFAULT FALSE;
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS zonnepanelen BOOLEAN DEFAULT FALSE;
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS verzekering BOOLEAN DEFAULT FALSE;
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS tankpas BOOLEAN DEFAULT FALSE;
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS inrichting_bedrijfsauto BOOLEAN DEFAULT FALSE;
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS auto_belettering BOOLEAN DEFAULT FALSE;
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS totaal_opties DECIMAL(10,2) DEFAULT 0;

-- Voeg ook kvk_nummer toe als die nog niet bestaat
ALTER TABLE lease_aanvragen ADD COLUMN IF NOT EXISTS kvk_nummer VARCHAR(20);

-- Toon de huidige tabel structuur
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lease_aanvragen' 
ORDER BY ordinal_position; 