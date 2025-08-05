import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('=== SUPABASE CONNECTION TEST ===');
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Supabase Key:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('🔄 Testing Supabase connection...');
        
        // Test basic connection by trying to fetch data
        const { data, error } = await supabase
            .from('lease_aanvragen')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Connection failed:', error.message);
            console.log('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
        } else {
            console.log('✅ Connection successful!');
            console.log('📊 Found', data.length, 'records');
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

testConnection(); 