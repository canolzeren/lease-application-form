-- Contact berichten tabel voor SuperForm contact formulier
CREATE TABLE IF NOT EXISTS contact_berichten (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefoon VARCHAR(50),
    onderwerp VARCHAR(255) NOT NULL,
    bericht TEXT NOT NULL,
    datum TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'Nieuw',
    beantwoord_op TIMESTAMP WITH TIME ZONE,
    beantwoord_door VARCHAR(255),
    notities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexen voor betere prestaties
CREATE INDEX IF NOT EXISTS idx_contact_berichten_datum ON contact_berichten(datum DESC);
CREATE INDEX IF NOT EXISTS idx_contact_berichten_status ON contact_berichten(status);
CREATE INDEX IF NOT EXISTS idx_contact_berichten_email ON contact_berichten(email);

-- RLS (Row Level Security) inschakelen
ALTER TABLE contact_berichten ENABLE ROW LEVEL SECURITY;

-- Policy voor alle operaties (voor nu simpel, later kan dit verfijnd worden)
CREATE POLICY "Enable all operations for contact_berichten" ON contact_berichten
    FOR ALL USING (true);

COMMENT ON TABLE contact_berichten IS 'Contact formulier berichten van SuperForm bezoekers';
COMMENT ON COLUMN contact_berichten.status IS 'Status: Nieuw, In behandeling, Beantwoord, Gesloten';
