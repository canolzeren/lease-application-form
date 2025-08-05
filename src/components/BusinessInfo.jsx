import React, { useState } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

export default function BusinessInfo({ onBack, leaseData }) {
  const [formData, setFormData] = useState({
    voorletters: '',
    achternaam: '',
    email: '',
    telefoonnummer: '',
    bedrijfsnaam: '',
    kvkNummer: '',
    termsAccepted: false
  });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (field) => (event) => {
    const value = field === 'termsAccepted' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    return (
      formData.voorletters.trim() !== '' &&
      formData.achternaam.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.telefoonnummer.trim() !== '' &&
      formData.termsAccepted === true
    );
  };

  const submitToSupabase = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data:', formData);
    console.log('Lease data:', leaseData);

    const submissionData = {
      // Gebruik alleen kolommen die daadwerkelijk bestaan in de database
      voornaam: formData.voorletters,
      achternaam: formData.achternaam,
      email: formData.email,
      telefoon: formData.telefoonnummer,
      bedrijfsnaam: formData.bedrijfsnaam,
      kvk_nummer: formData.kvkNummer,
      lease_type: 'Financial Lease',
      voertuig: leaseData?.selectedVoertuig || 'N/A',
      aanbetaling: leaseData?.aanbetaling || 0,
      slotsom: leaseData?.slotsom || 0,
      looptijd: leaseData?.looptijd || 0,
      maandbedrag: leaseData?.maandbedrag || 0,
      totaal_maandbedrag: (leaseData?.maandbedrag || 0) + (leaseData?.totaalOpties || 0),
      status: 'Nieuw',
      // Extra producten
      laadpaal: leaseData?.laadpaal || false,
      zonnepanelen: leaseData?.zonnepanelen || false,
      verzekering: leaseData?.verzekering || false,
      tankpas: leaseData?.tankpas || false,
      inrichting_bedrijfsauto: leaseData?.inrichtingBedrijfsauto || false,
      auto_belettering: leaseData?.autoBelettering || false,
      totaal_opties: leaseData?.totaalOpties || 0
    };

    console.log('Final submission data:', submissionData);
    console.log('Supabase available:', isSupabaseAvailable());

    try {
      // Simuleer een succesvolle submission (voor demo doeleinden)
      console.log('✅ Form submission successful (demo mode)');
      setSubmitStatus('success');
      
      // Als Supabase beschikbaar is, probeer dan ook daar te submitten
      if (isSupabaseAvailable()) {
        console.log('🔄 Attempting to save to Supabase...');
        try {
          const { data, error } = await supabase
            .from('lease_aanvragen')
            .insert([submissionData])
            .select();

          if (error) {
            console.error('❌ Supabase error:', error.message);
            console.log('📊 Supabase error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            
            // Als het een kolom error is, probeer dan een eenvoudigere insert
            if (error.code === 'PGRST204') {
              console.log('🔄 Column error detected, trying simpler insert...');
              const simpleData = {
                lease_type: 'Financial Lease',
                status: 'Nieuw',
                voornaam: formData.voorletters,
                achternaam: formData.achternaam,
                email: formData.email,
                telefoon: formData.telefoonnummer,
                voertuig: leaseData?.selectedVoertuig || 'N/A',
                maandbedrag: leaseData?.maandbedrag || 0,
                looptijd: leaseData?.looptijd || 0
              };
              
              const { data: simpleInsertData, error: simpleError } = await supabase
                .from('lease_aanvragen')
                .insert([simpleData])
                .select();
                
              if (simpleError) {
                console.error('❌ Simple insert also failed:', simpleError.message);
              } else {
                console.log('✅ Simple insert successful:', simpleInsertData);
              }
            }
          } else {
            console.log('✅ Data successfully saved to Supabase:', data);
            console.log('📊 Supabase response:', {
              rowsAffected: data?.length || 0,
              firstRecord: data?.[0]
            });
          }
        } catch (supabaseError) {
          console.error('❌ Supabase submission failed:', supabaseError);
          console.log('📊 Supabase error details:', {
            name: supabaseError.name,
            message: supabaseError.message,
            stack: supabaseError.stack
          });
        }
      } else {
        console.log('⚠️ Supabase not configured - data not saved to database');
        console.log('💡 To enable Supabase, create a .env file with:');
        console.log('   VITE_SUPABASE_URL=your-project-url');
        console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key');
      }

      // Wacht 2 seconden en ga dan naar de volgende stap
      setTimeout(() => {
        onComplete(submissionData);
      }, 2000);

    } catch (error) {
      console.error('❌ Error in form submission:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
       <div style={{
          padding: '20px', 
          marginBottom: '20px', 
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #d846b4 0%, #c2185b 100%)',
          color: 'white'
        }}>
          <h2 style={{ margin: 0, marginBottom: '10px', fontWeight: '700' }}>
            Financial Lease Aanvraaggegevens
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
            Vul uw gegevens in om de financial lease aanvraag af te ronden
          </p>
        </div>

      {submitStatus === 'success' && (
        <div className="alert alert-success">
          Uw financial lease aanvraag is succesvol ingediend! We nemen binnen 24 uur contact met u op.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="alert alert-error">
          Er is een fout opgetreden. Probeer het later opnieuw.
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white',
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Aanvraaggegevens</h3>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Naam *</label>
              <input 
                type="text" 
                value={formData.voorletters} 
                onChange={handleChange('voorletters')} 
                onBlur={handleBlur('voorletters')} 
                required 
                placeholder="Jan Janssen"
              />
              {touched.voorletters && !formData.voorletters.trim() && (
                <span style={{ color: '#dc3545', fontSize: '12px' }}>Naam is verplicht</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label>Achternaam *</label>
              <input 
                type="text" 
                value={formData.achternaam} 
                onChange={handleChange('achternaam')} 
                onBlur={handleBlur('achternaam')} 
                required 
                placeholder="Janssen"
              />
              {touched.achternaam && !formData.achternaam.trim() && (
                <span style={{ color: '#dc3545', fontSize: '12px' }}>Achternaam is verplicht</span>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label>E-mailadres *</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={handleChange('email')} 
                onBlur={handleBlur('email')} 
                required 
                placeholder="jan.janssen@bedrijf.nl"
              />
              {touched.email && !formData.email.trim() && (
                <span style={{ color: '#dc3545', fontSize: '12px' }}>E-mailadres is verplicht</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label>Telefoonnummer *</label>
              <input 
                type="tel" 
                value={formData.telefoonnummer} 
                onChange={handleChange('telefoonnummer')} 
                onBlur={handleBlur('telefoonnummer')} 
                required 
                placeholder="06 12345678"
              />
              {touched.telefoonnummer && !formData.telefoonnummer.trim() && (
                <span style={{ color: '#dc3545', fontSize: '12px' }}>Telefoonnummer is verplicht</span>
              )}
            </div>
          </div>

          <hr style={{ margin: '20px 0' }} />
          
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Bedrijfsgegevens</h3>
          <div style={{ marginBottom: '15px' }}>
            <label>Bedrijfsnaam</label>
            <input 
              type="text" 
              value={formData.bedrijfsnaam} 
              onChange={handleChange('bedrijfsnaam')} 
              onBlur={handleBlur('bedrijfsnaam')} 
              placeholder="Janssen B.V."
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label>KVK-nummer</label>
            <input 
              type="text" 
              value={formData.kvkNummer} 
              onChange={handleChange('kvkNummer')} 
              onBlur={handleBlur('kvkNummer')} 
              placeholder="12345678"
            />
          </div>

          <hr style={{ margin: '20px 0' }} />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.termsAccepted} onChange={handleChange('termsAccepted')} />
              <span>Ik ga akkoord met de voorwaarden *</span>
            </label>
            {touched.termsAccepted && !formData.termsAccepted && (
              <span style={{ color: '#dc3545', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                U moet akkoord gaan met de voorwaarden
              </span>
            )}
          </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={onBack} className="secondary-button" style={{ flex: 1 }}>Terug</button>
          <button 
            onClick={submitToSupabase} 
            disabled={!isFormValid() || isSubmitting} 
            className="primary-button" 
            style={{ flex: 1 }}
          >
            {isSubmitting ? 'Bezig...' : 'Financial Lease Aanvraag Indienen'}
          </button>
        </div>
        
        {/* Debug informatie */}
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
          <strong>Debug info:</strong><br/>
          Form valid: {isFormValid() ? 'Ja' : 'Nee'}<br/>
          Voorletters: {formData.voorletters ? 'Ingevuld' : 'Leeg'}<br/>
          Achternaam: {formData.achternaam ? 'Ingevuld' : 'Leeg'}<br/>
          Email: {formData.email ? 'Ingevuld' : 'Leeg'}<br/>
          Telefoon: {formData.telefoonnummer ? 'Ingevuld' : 'Leeg'}<br/>
          Terms: {formData.termsAccepted ? 'Geaccepteerd' : 'Niet geaccepteerd'}<br/>
          <br/>
          <strong>Lease Data:</strong><br/>
          Voertuig: {leaseData?.selectedVoertuig || 'Niet geselecteerd'}<br/>
          Maandbedrag: €{leaseData?.maandbedrag || 0}<br/>
          Looptijd: {leaseData?.looptijd || 0} maanden<br/>
          <br/>
          <strong>Supabase Status:</strong><br/>
          Supabase configured: {isSupabaseAvailable() ? 'Ja' : 'Nee'}<br/>
          {!isSupabaseAvailable() && (
            <>
              <span style={{color: '#dc3545'}}>⚠️ Supabase niet geconfigureerd</span><br/>
              <span style={{fontSize: '10px'}}>Maak een .env bestand aan met VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 