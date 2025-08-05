# Lease Aanvraagformulier

Een complete lease management applicatie met formulier en CRM functionaliteit.

## 🚀 URLs

- **SuperForm**: http://localhost:5173/superform
- **CRM**: http://localhost:5173/crm
- **Homepage**: http://localhost:5173 (redirects naar /superform)

## 📋 Functionaliteiten

### SuperForm (/superform)
- **Stap 1**: Voertuig selectie
- **Stap 2**: Extra opties (laadpaal, verzekering, etc.)
- **Stap 3**: Persoonlijke gegevens
- **Stap 4**: Succes pagina

### CRM (/crm)
- **Dashboard** met statistieken
- **Overzichtstabel** van alle aanvragen
- **Zoek & filter** functionaliteit
- **Detail modal** voor elke aanvraag
- **Status tracking** (Nieuw, In behandeling, Goedgekeurd, Afgewezen)

## 🛠️ Technische Details

- **Frontend**: React.js met Vite
- **Styling**: CSS met Material-UI icons
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **State Management**: React useState

## 📊 Database Schema

De applicatie slaat op in Supabase:
- Persoonlijke gegevens (naam, email, telefoon)
- Lease gegevens (voertuig, maandbedrag, looptijd)
- Extra opties (laadpaal, verzekering, tankpas, etc.)
- Status en timestamps

## 🎯 Gebruik

1. **Start de applicatie**: `npm run dev`
2. **Ga naar**: http://localhost:5173
3. **Vul een formulier in**: Klik "SuperForm" of ga naar /superform
4. **Bekijk aanvragen**: Klik "CRM" of ga naar /crm

## 🔧 Development

```bash
npm install
npm run dev
```

De applicatie draait op http://localhost:5173 (of volgende beschikbare poort)
