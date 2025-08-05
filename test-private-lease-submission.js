import { createClient } from '@supabase/supabase-js';

console.log('=== PRIVATE LEASE SUBMISSION TEST ===');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    console.log('Running in browser environment');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
    console.log('Supabase Key:', supabaseKey ? '✅ Found' : '❌ Missing');
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials not found');
        process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test data similar to what the form sends
    const testData = {
        voornaam: 'Test',
        achternaam: 'User',
        email: 'test@example.com',
        telefoon: '0612345678',
        lease_type: 'Private Lease',
        voertuig: 'Test Auto',
        aanbetaling: 5000,
        slotsom: 0,
        looptijd: 60,
        maandbedrag: 350,
        totaal_maandbedrag: 350,
        status: 'Nieuw',
        verkoopprijs: 25000,
        gewenst_krediet: 20000,
        kenteken: 'TEST123',
        aanhef: 'Dhr',
        geboortedatum: '1990-01-01',
        burgerlijke_staat: 'Gehuwd',
        straatnaam: 'Teststraat',
        huisnummer: '123',
        huisnummer_toevoeging: 'A',
        postcode: '1234AB',
        woonplaats: 'Teststad',
        dienstverband: 'Vast',
        beroep: 'Test beroep',
        ingangsdatum_dienstverband: '2020-01-01',
        einddatum_dienstverband: '',
        bruto_inkomen: 50000,
        woonsituatie: 'Eigen woning',
        maandelijkse_woonlast: 1200,
        laadpaal: false,
        zonnepanelen: false,
        verzekering: false,
        tankpas: false,
        inrichting_bedrijfsauto: false,
        auto_belettering: false,
        totaal_opties: 0
    };
    
    async function testSubmission() {
        try {
            console.log('🔄 Testing full submission...');
            const { data: result, error } = await supabase
                .from('lease_aanvragen')
                .insert([testData])
                .select();
    
            if (error) {
                console.error('❌ Full submission failed:', error.message);
                console.log('Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
    
                // Try simpler submission
                console.log('🔄 Trying simpler submission...');
                const simpleData = {
                    voornaam: testData.voornaam,
                    achternaam: testData.achternaam,
                    email: testData.email,
                    telefoon: testData.telefoon,
                    lease_type: testData.lease_type,
                    voertuig: testData.voertuig,
                    maandbedrag: testData.maandbedrag,
                    status: testData.status,
                    straatnaam: testData.straatnaam,
                    huisnummer: testData.huisnummer,
                    postcode: testData.postcode,
                    woonplaats: testData.woonplaats
                };
    
                const { data: simpleResult, error: simpleError } = await supabase
                    .from('lease_aanvragen')
                    .insert([simpleData])
                    .select();
    
                if (simpleError) {
                    console.error('❌ Simple submission also failed:', simpleError.message);
                } else {
                    console.log('✅ Simple submission successful:', simpleResult);
                }
            } else {
                console.log('✅ Full submission successful:', result);
            }
        } catch (error) {
            console.error('❌ Unexpected error:', error);
        }
    }
    
    testSubmission();
} else {
    console.log('❌ This script needs to run in a browser environment');
} 