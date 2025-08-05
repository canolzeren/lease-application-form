// Test script om te controleren of environment variables correct worden geladen
console.log('=== BROWSER ENVIRONMENT TEST ===');

// Test of we in een browser environment zijn
if (typeof window !== 'undefined') {
    console.log('✅ Running in browser environment');
    
    // Test environment variables
    console.log('🔍 Environment variables:');
    console.log('import.meta.env:', import.meta.env);
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Test Supabase import
    try {
        const { createClient } = await import('@supabase/supabase-js');
        console.log('✅ Supabase import successful');
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (supabaseUrl && supabaseKey) {
            console.log('✅ Environment variables found');
            const supabase = createClient(supabaseUrl, supabaseKey);
            console.log('✅ Supabase client created');
            
            // Test connection
            const { data, error } = await supabase
                .from('lease_aanvragen')
                .select('*')
                .limit(1);
                
            if (error) {
                console.error('❌ Supabase connection failed:', error.message);
            } else {
                console.log('✅ Supabase connection successful');
                console.log('📊 Found', data.length, 'records');
            }
        } else {
            console.error('❌ Environment variables missing');
            console.log('URL:', supabaseUrl);
            console.log('Key present:', !!supabaseKey);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
} else {
    console.log('❌ Not running in browser environment');
} 