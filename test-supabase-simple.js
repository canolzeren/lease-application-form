// Eenvoudige test voor Supabase connectie
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcnvjrnlfsjughfhqnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y252anJubGZzanVnaGZocW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA1NzAsImV4cCI6MjA2NTk0NjU3MH0.9Nb-Q36tGiVprfMSSQjKYARyE-XowerwPc0mq6f6bJU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSimpleInsert() {
  console.log('🧪 Testing simple Supabase insert...')
  
  try {
    // Probeer een eenvoudige insert met minimale data
    console.log('1️⃣ Testing simple insert...')
    const simpleData = {
      lease_type: 'Financial Lease',
      status: 'Nieuw'
    }
    
    const { data, error } = await supabase
      .from('lease_aanvragen')
      .insert([simpleData])
      .select()
    
    if (error) {
      console.log('❌ Simple insert failed:', error.message)
      console.log('📊 Error details:', error)
      
      // Probeer te lezen wat er wel in de tabel staat
      console.log('2️⃣ Checking existing data...')
      const { data: readData, error: readError } = await supabase
        .from('lease_aanvragen')
        .select('*')
        .limit(5)
      
      if (readError) {
        console.log('❌ Read failed:', readError.message)
      } else {
        console.log('✅ Read successful')
        console.log('📊 Existing data:', readData)
      }
    } else {
      console.log('✅ Simple insert successful')
      console.log('📊 Inserted data:', data)
    }
    
  } catch (error) {
    console.log('❌ General error:', error.message)
  }
}

// Run the test
testSimpleInsert() 