import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log to console to verify that env variables are being loaded
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Configuration:')
  console.log('  URL:', supabaseUrl ? '✅ Loaded' : '❌ Not Loaded')
  console.log('  Anon Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Not Loaded')
}

// Only create client if we have valid credentials
let supabase
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: false,
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js/2.x'
      }
    }
  })
  
  if (import.meta.env.DEV) {
    console.log('✅ Supabase client created successfully')
    
    // Test the connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('lease_aanvragen')
          .select('count')
          .limit(1)
        
        if (error) {
          console.log('⚠️ Database connection test:', error.message)
        } else {
          console.log('✅ Database connection successful')
        }
      } catch (err) {
        console.log('❌ Database connection failed:', err.message)
      }
    }
    
    // Test connection after a short delay
    setTimeout(testConnection, 1000)
  }
} else {
  console.warn('⚠️ Supabase credentials are not provided. Application is in fallback mode.')
  supabase = null
}

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return !!supabaseUrl && !!supabaseAnonKey
}

export { supabase } 