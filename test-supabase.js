// Test script voor Supabase connectie
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcnvjrnlfsjughfhqnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y252anJubGZzanVnaGZocW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA1NzAsImV4cCI6MjA2NTk0NjU3MH0.9Nb-Q36tGiVprfMSSQjKYARyE-XowerwPc0mq6f6bJU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
  console.log('🧪 Testing Supabase connection...')
  
  try {
    // Test 1: Check if table exists
    console.log('1️⃣ Testing table existence...')
    const { data: tableTest, error: tableError } = await supabase
      .from('lease_aanvragen')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Table test failed:', tableError.message)
      console.log('💡 You need to create the lease_aanvragen table')
      return
    }
    
    console.log('✅ Table exists and is accessible')
    
    // Test 2: Try to insert test data
    console.log('2️⃣ Testing data insertion...')
    const testData = {
      voorletters: 'T.E.',
      achternaam: 'Test',
      email: 'test@example.com',
      telefoonnummer: '0612345678',
      lease_type: 'Financial Lease',
      voertuig: 'Test Voertuig',
      status: 'Nieuw'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('lease_aanvragen')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message)
      console.log('📊 Error details:', insertError)
    } else {
      console.log('✅ Insert test successful')
      console.log('📊 Inserted data:', insertData)
    }
    
    // Test 3: Try to read data
    console.log('3️⃣ Testing data retrieval...')
    const { data: readData, error: readError } = await supabase
      .from('lease_aanvragen')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (readError) {
      console.log('❌ Read test failed:', readError.message)
    } else {
      console.log('✅ Read test successful')
      console.log('📊 Retrieved data:', readData)
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message)
  }
}

// Run the test
testSupabase() 