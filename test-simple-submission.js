// Test script met alleen bestaande kolommen
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcnvjrnlfsjughfhqnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y252anJubGZzanVnaGZocW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA1NzAsImV4cCI6MjA2NTk0NjU3MH0.9Nb-Q36tGiVprfMSSQjKYARyE-XowerwPc0mq6f6bJU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSimpleSubmission() {
  console.log('🧪 Testing simple submission with existing columns...')
  
  try {
    // Gebruik alleen kolommen die daadwerkelijk bestaan
    const submissionData = {
      voornaam: 'J.M.',
      achternaam: 'Test',
      email: 'test@example.com',
      telefoon: '0612345678',
      bedrijfsnaam: 'Test Bedrijf',
      kvk_nummer: '12345678',
      lease_type: 'Financial Lease',
      voertuig: 'BMW 3 Series',
      aanbetaling: 0,
      slotsom: 5000,
      looptijd: 60,
      maandbedrag: 295.54,
      totaal_maandbedrag: 373.54,
      status: 'Nieuw'
    };

    console.log('📊 Submission data:', submissionData);

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
testSimpleSubmission() 