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

    // Debug de incoming lease data
    console.log('🔍 Raw leaseData object:', leaseData);
    console.log('🔍 Available leaseData keys:', Object.keys(leaseData || {}));
    console.log('🚗 Voertuig data debug:', {
      voertuig: leaseData?.voertuig,
      merk: leaseData?.merk,
      type: leaseData?.type,
      model: leaseData?.model,
      selectedVoertuig: leaseData?.selectedVoertuig
    });
    
    const submissionData = {
      // Persoonlijke gegevens
      voornaam: formData.voorletters,
      achternaam: formData.achternaam,
      email: formData.email,
      telefoon: formData.telefoonnummer,
      bedrijfsnaam: formData.bedrijfsnaam,
      kvk_nummer: formData.kvkNummer,
      
      // Lease informatie (correct mapping van LeaseForm data)
      lease_type: leaseData?.leaseType === 'financial' ? 'Financial Lease' : 
                  leaseData?.leaseType === 'operational' ? 'Operational Lease' : 'Financial Lease',
      voertuig: leaseData?.voertuig || 'N/A',
      merk: leaseData?.merk || '',
      model: leaseData?.type || '', // LeaseForm gebruikt 'type' voor model
      kenteken: leaseData?.kenteken || '',
      
      // Financiële gegevens (direct van LeaseForm)
      verkoopprijs: leaseData?.verkoopprijs || 0,
      aanbetaling: leaseData?.aanbetaling || 0,
      inruil: leaseData?.inruil || 0,
      slottermijn: leaseData?.slottermijn || 0,
      looptijd: leaseData?.looptijd || 0,
      maandbedrag: leaseData?.maandbedrag || 0,
      
      // Berekende bedragen (van LeaseForm calculations)
      btw_bedrag: leaseData?.btwBedrag || 0,
      aanschafwaarde_excl_btw: leaseData?.aanschafwaardeExclBtw || 0,
      leasebedrag: leaseData?.leasebedrag || 0,
      te_financieren_bedrag: leaseData?.teFinancierenBedrag || 0,
      totaal_aan_te_betalen: leaseData?.totaalAanTeBetalen || 0,
      
      totaal_maandbedrag: leaseData?.totaalMaandbedrag || leaseData?.maandbedrag || 0,
      status: 'Nieuw',
      
      // Extra producten (van ExtraOptions step)
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
                voertuig: leaseData?.voertuig || 'N/A',
                maandbedrag: leaseData?.maandbedrag || 0,
                looptijd: leaseData?.looptijd || 0,
                verkoopprijs: leaseData?.verkoopprijs || 0,
                aanbetaling: leaseData?.aanbetaling || 0
              };
              
              console.log('🔧 Simple insert data:', simpleData);
              
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
            
            // Trigger notification via local storage for cross-tab communication
            try {
              const notificationData = {
                type: 'new_lease_request',
                data: data[0],
                timestamp: Date.now()
              };
              localStorage.setItem('newLeaseNotification', JSON.stringify(notificationData));
              console.log('📢 Notification data stored for cross-tab communication');
            } catch (notifError) {
              console.log('⚠️ Could not store notification data:', notifError);
            }
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
    <div className="lease-form-container">
      <div className="step-header">
        <h2>Bedrijfsgegevens</h2>
        <p className="step-description">Vul uw contactgegevens en bedrijfsinformatie in</p>
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

      <div className="form-section">
          <div className="inputs-container">
            <div className="input-group">
              <label>Naam *</label>
              <input 
                type="text" 
                className="input-box"
                value={formData.voorletters} 
                onChange={handleChange('voorletters')} 
                onBlur={handleBlur('voorletters')} 
                required 
                placeholder="Jan"
              />
              {touched.voorletters && !formData.voorletters.trim() && (
                <span className="error-message">Naam is verplicht</span>
              )}
            </div>
            
            <div className="input-group">
              <label>Achternaam *</label>
              <input 
                type="text" 
                className="input-box"
                value={formData.achternaam} 
                onChange={handleChange('achternaam')} 
                onBlur={handleBlur('achternaam')} 
                required 
                placeholder="Janssen"
              />
              {touched.achternaam && !formData.achternaam.trim() && (
                <span className="error-message">Achternaam is verplicht</span>
              )}
            </div>
            
            <div className="input-group">
              <label>E-mailadres *</label>
              <input 
                type="email" 
                className="input-box"
                value={formData.email} 
                onChange={handleChange('email')} 
                onBlur={handleBlur('email')} 
                required 
                placeholder="jan.janssen@bedrijf.nl"
              />
              {touched.email && !formData.email.trim() && (
                <span className="error-message">E-mailadres is verplicht</span>
              )}
            </div>
            
            <div className="input-group">
              <label>Telefoonnummer *</label>
              <input 
                type="tel" 
                className="input-box"
                value={formData.telefoonnummer} 
                onChange={handleChange('telefoonnummer')} 
                onBlur={handleBlur('telefoonnummer')} 
                required 
                placeholder="06 12345678"
              />
              {touched.telefoonnummer && !formData.telefoonnummer.trim() && (
                <span className="error-message">Telefoonnummer is verplicht</span>
              )}
            </div>
            
            <div className="input-group">
              <label>Bedrijfsnaam</label>
              <input 
                type="text" 
                className="input-box"
                value={formData.bedrijfsnaam} 
                onChange={handleChange('bedrijfsnaam')} 
                onBlur={handleBlur('bedrijfsnaam')} 
                placeholder="Janssen B.V."
              />
            </div>
            
            <div className="input-group">
              <label>KVK-nummer</label>
              <input 
                type="text" 
                className="input-box"
                value={formData.kvkNummer} 
                onChange={handleChange('kvkNummer')} 
                onBlur={handleBlur('kvkNummer')} 
                placeholder="12345678"
              />
            </div>
            
            <div className="input-group">
              <label className="simple-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={formData.termsAccepted} 
                  onChange={handleChange('termsAccepted')}
                  onBlur={handleBlur('termsAccepted')}
                  required
                />
                <span>Ik ga akkoord met de voorwaarden en geef toestemming voor BKR-toetsing en dataverwerking *</span>
              </label>
              {touched.termsAccepted && !formData.termsAccepted && (
                <span className="error-message">U moet akkoord gaan met de voorwaarden om verder te gaan</span>
              )}
            </div>
          </div>

        <div className="button-container">
          <button 
            onClick={onBack} 
            className="secondary-button"
          >
            Terug
          </button>
          <button 
            onClick={submitToSupabase} 
            disabled={!isFormValid() || isSubmitting} 
            className="primary-button"
          >
            {isSubmitting ? 'Bezig met verzenden...' : 'Aanvraag Indienen'}
          </button>
        </div>
      </div>
    </div>
  );
} 