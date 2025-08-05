# Supabase Setup voor Lease Aanvraagformulier

## Stap 1: Supabase Project Aanmaken

1. Ga naar [supabase.com](https://supabase.com)
2. Maak een account aan of log in
3. Klik op "New Project"
4. Kies je organisatie en geef het project een naam (bijv. "lease-aanvragen")
5. Kies een database wachtwoord
6. Klik op "Create new project"

## Stap 2: Database Tabel Aanmaken

Nadat je project is aangemaakt, ga naar de SQL Editor en voer het volgende uit:

```sql
-- Maak de lease_aanvragen tabel
CREATE TABLE lease_aanvragen (
  id BIGSERIAL PRIMARY KEY,
  
  -- Algemene gegevens
  lease_type TEXT NOT NULL,
  voertuig TEXT,
  aanbetaling DECIMAL(10,2) DEFAULT 0,
  slotsom DECIMAL(10,2) DEFAULT 0,
  inruil DECIMAL(10,2) DEFAULT 0,
  looptijd INTEGER DEFAULT 0,
  maandbedrag DECIMAL(10,2) DEFAULT 0,
  totaal_maandbedrag DECIMAL(10,2) DEFAULT 0,
  
  -- Zakelijke gegevens
  voornaam TEXT,
  achternaam TEXT,
  email TEXT,
  telefoon TEXT,
  bedrijfsnaam TEXT,
  
  -- Persoonlijke gegevens
  geboortedatum DATE,
  burgerlijke_staat TEXT,
  bsn TEXT,
  
  -- Adresgegevens
  straat TEXT,
  huisnummer TEXT,
  postcode TEXT,
  woonplaats TEXT,
  
  -- Financiële gegevens
  dienstverband TEXT,
  ingangsdatum_dienstverband DATE,
  bruto_inkomen DECIMAL(10,2) DEFAULT 0,
  woonsituatie TEXT,
  maandelijkse_woonlasten DECIMAL(10,2) DEFAULT 0,
  
  -- Extra producten
  geselecteerde_producten JSONB DEFAULT '[]',
  extra_producten_kosten JSONB DEFAULT '{"eenmaligeKosten": 0, "maandelijkseKosten": 0}',
  
  -- Metadata
  aanvraagdatum TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Nieuw',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maak indexes voor betere performance
CREATE INDEX idx_lease_aanvragen_email ON lease_aanvragen(email);
CREATE INDEX idx_lease_aanvragen_status ON lease_aanvragen(status);
CREATE INDEX idx_lease_aanvragen_aanvraagdatum ON lease_aanvragen(aanvraagdatum);

-- Maak een functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Voeg trigger toe voor updated_at
CREATE TRIGGER update_lease_aanvragen_updated_at 
    BEFORE UPDATE ON lease_aanvragen 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Stap 3: RLS (Row Level Security) Instellen

Voor productie moet je RLS inschakelen. Voer dit uit in de SQL Editor:

```sql
-- Schakel RLS in
ALTER TABLE lease_aanvragen ENABLE ROW LEVEL SECURITY;

-- Maak een policy die alle operaties toestaat (voor development)
-- In productie zou je specifiekere policies willen
CREATE POLICY "Allow all operations" ON lease_aanvragen
  FOR ALL USING (true);
```

## Stap 4: API Keys Ophalen

1. Ga naar Settings > API in je Supabase dashboard
2. Kopieer de "Project URL" en "anon public" key
3. Maak een `.env` bestand aan in je project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Stap 5: Test de Integratie

1. Start je development server: `npm run dev`
2. Vul een lease aanvraag in
3. Controleer in de Supabase dashboard of de data is opgeslagen

## Database Schema Overzicht

### lease_aanvragen tabel

| Kolom | Type | Beschrijving |
|-------|------|--------------|
| id | BIGSERIAL | Unieke ID (auto-increment) |
| lease_type | TEXT | 'Zakelijk' of 'Particulier' |
| voertuig | TEXT | Geselecteerd voertuig |
| aanbetaling | DECIMAL | Aanbetaling bedrag |
| slotsom | DECIMAL | Slotsom bedrag |
| inruil | DECIMAL | Inruil waarde |
| looptijd | INTEGER | Lease looptijd in maanden |
| maandbedrag | DECIMAL | Basis maandbedrag |
| totaal_maandbedrag | DECIMAL | Totaal maandbedrag incl. extra's |
| voornaam | TEXT | Voornaam aanvrager |
| achternaam | TEXT | Achternaam aanvrager |
| email | TEXT | E-mailadres |
| telefoon | TEXT | Telefoonnummer |
| bedrijfsnaam | TEXT | Bedrijfsnaam (alleen zakelijk) |
| geboortedatum | DATE | Geboortedatum (alleen particulier) |
| burgerlijke_staat | TEXT | Burgerlijke staat (alleen particulier) |
| bsn | TEXT | BSN nummer (alleen particulier) |
| straat | TEXT | Straatnaam (alleen particulier) |
| huisnummer | TEXT | Huisnummer (alleen particulier) |
| postcode | TEXT | Postcode (alleen particulier) |
| woonplaats | TEXT | Woonplaats (alleen particulier) |
| dienstverband | TEXT | Type dienstverband (alleen particulier) |
| ingangsdatum_dienstverband | DATE | Startdatum werk (alleen particulier) |
| bruto_inkomen | DECIMAL | Bruto inkomen (alleen particulier) |
| woonsituatie | TEXT | Koop/huur (alleen particulier) |
| maandelijkse_woonlasten | DECIMAL | Maandelijkse woonlasten (alleen particulier) |
| geselecteerde_producten | JSONB | Array van geselecteerde extra producten |
| extra_producten_kosten | JSONB | Kosten breakdown van extra producten |
| aanvraagdatum | TIMESTAMP | Datum van aanvraag |
| status | TEXT | Status van aanvraag ('Nieuw', 'In behandeling', etc.) |
| created_at | TIMESTAMP | Aanmaakdatum record |
| updated_at | TIMESTAMP | Laatste update datum |

## Voordelen van Supabase

1. **Real-time updates**: Mogelijkheid om real-time updates te ontvangen
2. **Authentication**: Ingebouwde auth systeem
3. **Storage**: Bestand uploads mogelijk
4. **Edge Functions**: Serverless functions
5. **Dashboard**: Mooie interface om data te bekijken
6. **API**: Automatisch gegenereerde REST API
7. **PostgreSQL**: Krachtige database met alle features

## Volgende Stappen

1. **Authentication toevoegen**: Voor beheerders login
2. **Real-time dashboard**: Voor live aanvragen monitoring
3. **Email notifications**: Automatische emails bij nieuwe aanvragen
4. **File uploads**: Voor documenten uploaden
5. **Status updates**: Voor het bijwerken van aanvraag status 