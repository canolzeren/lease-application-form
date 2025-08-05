// Test alleen de Supabase connectie
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcnvjrnlfsjughfhqnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y252anJubGZzanVnaGZocW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA1NzAsImV4cCI6MjA2NTk0NjU3MH0.9Nb-Q36tGiVprfMSSQjKYARyE-XowerwPc0mq6f6bJU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection only...')
  
  try {
    // Test 1: Check if we can connect
    console.log('1️⃣ Testing basic connection...')
    const { data, error } = await supabase
      .from('lease_aanvragen')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      console.log('📊 Error details:', error)
    } else {
      console.log('✅ Connection successful')
      console.log('📊 Response:', data)
    }
    
    // Test 2: Check table structure
    console.log('2️⃣ Testing table structure...')
    const { data: structureData, error: structureError } = await supabase
      .from('lease_aanvragen')
      .select('*')
      .limit(0)
    
    if (structureError) {
      console.log('❌ Structure check failed:', structureError.message)
    } else {
      console.log('✅ Table structure accessible')
    }
    
    // Test 3: Check RLS status
    console.log('3️⃣ Checking RLS status...')
    console.log('💡 If you see RLS errors, the policy needs to be updated')
    console.log('💡 Try running the RLS disable script in Supabase dashboard')
    
  } catch (error) {
    console.log('❌ General error:', error.message)
  }
}

// Run the test
testConnection() 