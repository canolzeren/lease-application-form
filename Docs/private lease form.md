# Private Lease Aanvraagformulier

Dit formulier wordt gebruikt voor het aanvragen van een Private Lease. Onderstaand worden alle benodigde invoervelden per sectie opgesomd.

## 1. Financiering

- **Verkoopprijs** (numeriek veld)
- **Aanbetaling/inruil bedrag** (numeriek veld)
- **Uw gewenst krediet** (automatisch berekend, niet bewerkbaar)
- **Gewenste looptijd in maanden** (dropdown)

_Resultaat: Maandlast vanaf €xxx,- wordt automatisch getoond._

---

## 2. Voertuiggegevens

- **Merk** (tekstveld)
- **Type** (tekstveld)
- **Kenteken van voertuig** (tekstveld)
In de mvp worden deze gegevens uit Airtable gehaald. De gebruiker selecteert een auto uit een dropdown, die gegevens moeten worden meegenomen

---

## 3. Persoonsgegevens

- **Aanhef** (tekstveld of dropdown, bijv. Dhr./Mevr.)
- **Voorletters*** (verplicht tekstveld)
- **Achternaam*** (verplicht tekstveld)
- **Geboortedatum*** (verplicht, bestaande uit dag, maand, jaar)
- **Burgerlijke staat** (dropdown, bijv. Alleenstaand, Gehuwd, etc.)

---

## 4. Contactgegevens

- **Straatnaam*** (verplicht tekstveld)
- **Huisnummer*** (verplicht numeriek veld)
- **Huisnummer toevoeging** (optioneel tekstveld)
- **Postcode*** (verplicht tekstveld)
- **Woonplaats*** (verplicht tekstveld)
- **Telefoonnummer*** (verplicht tekstveld)
- **Email*** (verplicht tekstveld)

---

## 5. Financiële gegevens

- **Dienstverband** (dropdown, bijv. Vast, Tijdelijk, Zelfstandig, etc.)
- **Beroep** (tekstveld)
- **Ingangsdatum dienstverband** (datumveld)
- **Einddatum dienstverband** (datumveld)
- **Bruto inkomen** (numeriek veld)
- **Woonsituatie** (dropdown, bijv. Koopwoning, Huurwoning, etc.)
- **Maandelijkse woonlast** (numeriek veld)

---

## Navigatie

Elke sectie bevat een knop **"Volgende Stap"** om door het formulier te navigeren. Laatste stap bevat een checkbox met Voorwaarden accepteren en na het versturen worden de gegevens naar Supabase verstuurd

