// Test script met juiste kolom namen
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcnvjrnlfsjughfhqnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y252anJubGZzanVnaGZocW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA1NzAsImV4cCI6MjA2NTk0NjU3MH0.9Nb-Q36tGiVprfMSSQjKYARyE-XowerwPc0mq6f6bJU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCorrectColumns() {
  console.log('🧪 Testing Supabase with correct column names...')
  
  try {
    // Test 1: Probeer insert met juiste kolom namen
    console.log('1️⃣ Testing insert with correct columns...')
    const testData = {
      voornaam: 'J.M.',
      achternaam: 'Test',
      email: 'test@example.com',
      telefoon: '0612345678',
      lease_type: 'Financial Lease',
      status: 'Nieuw'
    }
    
    const { data, error } = await supabase
      .from('lease_aanvragen')
      .insert([testData])
      .select()
    
    if (error) {
      console.log('❌ Insert failed:', error.message)
      console.log('📊 Error details:', error)
      
      // Test 2: Probeer alleen basis kolommen
      console.log('2️⃣ Testing with minimal columns...')
      const minimalData = {
        lease_type: 'Financial Lease',
        status: 'Nieuw'
      }
      
      const { data: minData, error: minError } = await supabase
        .from('lease_aanvragen')
        .insert([minimalData])
        .select()
        
      if (minError) {
        console.log('❌ Minimal insert also failed:', minError.message)
        console.log('💡 RLS is still blocking inserts')
      } else {
        console.log('✅ Minimal insert successful:', minData)
      }
    } else {
      console.log('✅ Insert successful with correct columns')
      console.log('📊 Inserted data:', data)
    }
    
    // Test 3: Lees bestaande data
    console.log('3️⃣ Reading existing data...')
    const { data: readData, error: readError } = await supabase
      .from('lease_aanvragen')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (readError) {
      console.log('❌ Read failed:', readError.message)
    } else {
      console.log('✅ Read successful')
      console.log('📊 Retrieved data:', readData)
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message)
  }
}

// Run the test
testCorrectColumns() 