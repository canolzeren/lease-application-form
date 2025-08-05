// Test script om formulier submission te simuleren
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcnvjrnlfsjughfhqnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y252anJubGZzanVnaGZocW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA1NzAsImV4cCI6MjA2NTk0NjU3MH0.9Nb-Q36tGiVprfMSSQjKYARyE-XowerwPc0mq6f6bJU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testFormSubmission() {
  console.log('🧪 Testing form submission with real data...')
  
  try {
    // Simuleer de data die het formulier zou versturen
    const formData = {
      voorletters: 'J.M.',
      achternaam: 'Test',
      email: 'test@example.com',
      telefoonnummer: '0612345678',
      bedrijfsnaam: 'Test Bedrijf',
      kvkNummer: '12345678',
      termsAccepted: true
    };

    const leaseData = {
      selectedVoertuig: 'BMW 3 Series',
      maandbedrag: 295.5434793793781,
      looptijd: 60,
      aanbetaling: 0,
      slotsom: 5000,
      laadpaal: true,
      zonnepanelen: false,
      verzekering: true,
      tankpas: false,
      inrichtingBedrijfsauto: false,
      autoBelettering: false,
      totaalOpties: 78 // 49 + 29
    };

    console.log('📊 Form data:', formData);
    console.log('📊 Lease data:', leaseData);

    const submissionData = {
      // Gebruik de juiste kolom namen die bestaan in de database
      voornaam: formData.voorletters,
      achternaam: formData.achternaam,
      email: formData.email,
      telefoon: formData.telefoonnummer,
      bedrijfsnaam: formData.bedrijfsnaam,
      kvk_nummer: formData.kvkNummer,
      lease_type: 'Financial Lease',
      voertuig: leaseData.selectedVoertuig,
      aanbetaling: leaseData.aanbetaling,
      slotsom: leaseData.slotsom,
      looptijd: leaseData.looptijd,
      maandbedrag: leaseData.maandbedrag,
      totaal_maandbedrag: leaseData.maandbedrag + leaseData.totaalOpties,
      status: 'Nieuw',
      // Extra opties
      laadpaal: leaseData.laadpaal,
      zonnepanelen: leaseData.zonnepanelen,
      verzekering: leaseData.verzekering,
      tankpas: leaseData.tankpas,
      inrichting_bedrijfsauto: leaseData.inrichtingBedrijfsauto,
      auto_belettering: leaseData.autoBelettering,
      totaal_opties: leaseData.totaalOpties
    };

    console.log('📊 Final submission data:', submissionData);

    // Probeer de data in te voegen
    const { data, error } = await supabase
      .from('lease_aanvragen')
      .insert([submissionData])
      .select();

    if (error) {
      console.log('❌ Insert failed:', error.message);
      console.log('📊 Error details:', error);
    } else {
      console.log('✅ Insert successful');
      console.log('📊 Inserted data:', data);
    }

    // Lees alle recente data
    console.log('📊 Reading all recent data...');
    const { data: readData, error: readError } = await supabase
      .from('lease_aanvragen')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (readError) {
      console.log('❌ Read failed:', readError.message);
    } else {
      console.log('✅ Read successful');
      console.log('📊 Recent data:', readData);
    }

  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

// Run the test
testFormSubmission() 