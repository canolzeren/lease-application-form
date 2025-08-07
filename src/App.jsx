import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import LeaseForm from './components/LeaseForm.jsx';
import ExtraOptions from './components/ExtraOptions.jsx';
import BusinessInfo from './components/BusinessInfo.jsx';
import PersonalDetailsExtra from './components/PersonalDetailsExtra.jsx';
import ContactDetails from './components/ContactDetails.jsx';
import FinancialDetails from './components/FinancialDetails.jsx';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAvailable } from './lib/supabase';

// Supabase client for CRM data
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Navigation() {
  const location = useLocation();
  
  return (
    <div style={{
      background: '#f8f9fa',
      padding: '10px 20px',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h3 style={{ margin: 0, color: '#d846b4' }}>Lease Management</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/superform"
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: location.pathname === '/superform' ? '#d846b4' : '#e9ecef',
              color: location.pathname === '/superform' ? 'white' : '#495057',
              cursor: 'pointer',
              fontWeight: location.pathname === '/superform' ? 'bold' : 'normal',
              textDecoration: 'none'
            }}
          >
            SuperForm
          </Link>
          <Link
            to="/crm"
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: location.pathname === '/crm' ? '#d846b4' : '#e9ecef',
              color: location.pathname === '/crm' ? 'white' : '#495057',
              cursor: 'pointer',
              fontWeight: location.pathname === '/crm' ? 'bold' : 'normal',
              textDecoration: 'none'
            }}
          >
            CRM
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuperForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [leaseData, setLeaseData] = React.useState(null);
  const [submittedData, setSubmittedData] = React.useState(null);

  const stepNames = leaseData?.leaseType === 'private' 
    ? ['Voertuig Selectie', 'Persoonlijke Gegevens', 'Contactgegevens', 'Financiële Gegevens']
    : ['Voertuig Selectie', 'Extra Opties', 'Persoonlijke Gegevens'];

  const handleLeaseComplete = (data) => {
    setLeaseData(data);
    // Private Lease gaat direct naar persoonsgegevens, andere lease types naar extra opties
    if (data.leaseType === 'private') {
      setCurrentStep(1); // Private Lease: stap 1 = Persoonlijke Gegevens
    } else {
      setCurrentStep(1); // Financial/Operational gaan naar extra opties
    }
  };

  const handleExtraOptionsComplete = (data) => {
    setLeaseData({ ...leaseData, ...data });
    setCurrentStep(2);
  };

  const handleFormComplete = (data) => {
    setSubmittedData(data);
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Voor Private Lease: stap 4 -> stap 3 -> stap 2 -> stap 1 -> stap 0
      if (leaseData?.leaseType === 'private') {
        setCurrentStep(currentStep - 1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setLeaseData(null);
    setSubmittedData(null);
  };

  const submitPrivateLeaseData = async (data) => {
    console.log('=== PRIVATE LEASE SUBMISSION START ===');
    console.log('Private Lease data:', data);
    console.log('Supabase available:', isSupabaseAvailable());
    console.log('Supabase client:', supabase ? '✅ Created' : '❌ Not created');

    const submissionData = {
      lease_type: 'Private Lease',
      status: 'Nieuw',
      voornaam: data.personalData?.voorletters || '',
      achternaam: data.personalData?.achternaam || '',
      email: data.contactData?.email || '',
      telefoon: data.contactData?.telefoon || '',
      voertuig: data.voertuig || 'N/A',
      maandbedrag: data.maandbedrag || 0,
      looptijd: data.looptijd || 0,
      // Private Lease specifieke velden
      aanhef: data.personalData?.aanhef || '',
      geboortedatum: `${data.personalData?.geboortedag || ''}-${data.personalData?.geboortemaand || ''}-${data.personalData?.geboortejaar || ''}`,
      burgerlijke_staat: data.personalData?.burgerlijkeStaat || '',
      straat: data.contactData?.straat || '',
      huisnummer: data.contactData?.huisnummer || '',
      toevoeging: data.contactData?.toevoeging || '',
      postcode: data.contactData?.postcode || '',
      woonplaats: data.contactData?.woonplaats || '',
      dienstverband: data.financialData?.dienstverband || '',
      beroep: data.financialData?.beroep || '',
      ingangsdatum: data.financialData?.ingang || '',
      einddatum: data.financialData?.einde || '',
      bruto_inkomen: data.financialData?.inkomen || '',
      woonsituatie: data.financialData?.woonsituatie || '',
      maandelijkse_woonlast: data.financialData?.woonlast || '',
      // Voertuiggegevens
      merk: data.merk || '',
      type: data.type || '',
      kenteken: data.kenteken || '',
      verkoopprijs: data.verkoopprijs || 0,
      aanbetaling: data.aanbetaling || 0,
      gewenst_krediet: data.gewenstKrediet || 0,
      // Timestamp voor correcte sortering
      created_at: new Date().toISOString()
    };

    console.log('Final Private Lease submission data:', submissionData);

    try {
      // Simuleer een succesvolle submission (voor demo doeleinden)
      console.log('✅ Private Lease submission successful (demo mode)');
      
      // Als Supabase beschikbaar is, probeer dan ook daar te submitten
      if (isSupabaseAvailable() && supabase) {
        console.log('🔄 Attempting to save Private Lease to Supabase...');
        console.log('Submission data:', submissionData);
        
        try {
          const { data: supabaseData, error } = await supabase
            .from('lease_aanvragen')
            .insert([submissionData])
            .select();

          if (error) {
            console.error('❌ Supabase error:', error.message);
            console.error('❌ Error details:', error);
            alert(`❌ Database fout: ${error.message}`);
          } else {
            console.log('✅ Private Lease data successfully saved to Supabase:', supabaseData);
            console.log('✅ Inserted record ID:', supabaseData?.[0]?.id);
          }
        } catch (supabaseError) {
          console.error('❌ Supabase submission failed:', supabaseError);
          alert(`❌ Database fout: ${supabaseError.message}`);
        }
      } else {
        console.log('⚠️ Supabase not configured - Private Lease data not saved to database');
        alert('⚠️ Supabase niet geconfigureerd - Data wordt niet opgeslagen');
      }

    } catch (error) {
      console.error('❌ Error in Private Lease submission:', error);
    } finally {
      console.log('=== PRIVATE LEASE SUBMISSION END ===');
      
      // Test database connectie
      if (isSupabaseAvailable() && supabase) {
        console.log('🔄 Testing database connection...');
        try {
          const { data: testData, error: testError } = await supabase
            .from('lease_aanvragen')
            .select('count')
            .limit(1);
          
          if (testError) {
            console.error('❌ Database connection test failed:', testError);
          } else {
            console.log('✅ Database connection test successful');
          }
        } catch (testErr) {
          console.error('❌ Database connection test error:', testErr);
        }
      }
      
      // Toon een melding dat de data is opgeslagen
      alert('✅ Private Lease aanvraag succesvol opgeslagen! Check de CRM voor de nieuwe aanvraag.');
    }
  };

  return (
    <div className="app">
      <div className="header" style={{ padding: '1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lease Aanvraagformulier</h1>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>Kies uw lease type en vul het formulier in (v2)</p>
      </div>

      {currentStep < 4 && (
        <div className="progress-container">
          <div className="progress-bar">
            {stepNames.map((stepName, index) => (
              <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
                <div className="progress-icon">
                  {index < currentStep ? (
                    <div style={{ color: '#4CAF50', fontSize: '20px' }}>✓</div>
                  ) : index === currentStep ? (
                    <div className="current-step-indicator">{index + 1}</div>
                  ) : (
                    <div className="progress-step-number">{index + 1}</div>
                  )}
                </div>
                <span className="progress-label">{stepName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 0 && (
        <LeaseForm onComplete={handleLeaseComplete} />
      )}



      {currentStep === 1 && leaseData?.leaseType !== 'private' && (
        <div>
          <div className="step-header">
            <h2>Extra Opties</h2>
            <p>Kies de extra opties die u wenst</p>
          </div>
          <ExtraOptions 
            onComplete={handleExtraOptionsComplete} 
            onBack={handleBack}
            leaseData={leaseData}
          />
        </div>
      )}

      {currentStep === 1 && leaseData?.leaseType === 'private' && (
        <PersonalDetailsExtra 
          onComplete={(data) => {
            setLeaseData(prev => ({ ...prev, personalData: data }));
            setCurrentStep(2);
          }} 
          onBack={handleBack}
        />
      )}

      {currentStep === 2 && leaseData?.leaseType === 'private' && (
        <ContactDetails 
          onComplete={(data) => {
            setLeaseData(prev => ({ ...prev, contactData: data }));
            setCurrentStep(3);
          }} 
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && leaseData?.leaseType === 'private' && (
        <FinancialDetails 
          onComplete={(data) => {
            const finalData = { ...leaseData, financialData: data };
            setLeaseData(finalData);
            setCurrentStep(4);
            // Submit Private Lease data to database
            submitPrivateLeaseData(finalData);
          }} 
          onBack={handleBack}
        />
      )}

      {currentStep === 2 && leaseData?.leaseType !== 'private' && (
        <div>
          <div className="step-header">
            <h2>Persoonlijke Gegevens</h2>
            <p>Vul uw gegevens in om de aanvraag af te ronden</p>
          </div>
          <BusinessInfo 
            onComplete={handleFormComplete} 
            onBack={handleBack}
            leaseData={leaseData}
          />
        </div>
      )}

      {currentStep === (leaseData?.leaseType === 'private' ? 4 : 3) && (
        <div className="success-screen">
          <div className="success-content">
            <div style={{ fontSize: '60px', color: '#4CAF50', marginBottom: '20px' }}>✓</div>
            <h2>Uw {leaseData?.leaseType === 'financial' ? 'Financial' : leaseData?.leaseType === 'operational' ? 'Operational' : 'Private'} Lease Aanvraag is Succesvol Ingediend!</h2>
            <p>We hebben uw aanvraag ontvangen en nemen binnen 24 uur contact met u op.</p>
            
            {leaseData?.leaseType === 'private' ? (
              <div className="summary">
                <h3>Samenvatting van uw Private Lease aanvraag:</h3>
                <div className="summary-grid">
                  <div>
                    <strong>Naam:</strong> {leaseData.personalData?.aanhef} {leaseData.personalData?.voorletters} {leaseData.personalData?.achternaam}
                  </div>
                  <div>
                    <strong>Email:</strong> {leaseData.contactData?.email}
                  </div>
                  <div>
                    <strong>Voertuig:</strong> {leaseData.merk} {leaseData.type}
                  </div>
                  <div>
                    <strong>Kenteken:</strong> {leaseData.kenteken || 'Niet opgegeven'}
                  </div>
                  <div>
                    <strong>Maandbedrag:</strong> €{leaseData.maandbedrag?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Looptijd:</strong> {leaseData.looptijd} maanden
                  </div>
                  <div>
                    <strong>Verkoopprijs:</strong> €{leaseData.verkoopprijs?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Aanbetaling:</strong> €{leaseData.aanbetaling?.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : submittedData && (
              <div className="summary">
                <h3>Samenvatting van uw aanvraag:</h3>
                <div className="summary-grid">
                  <div>
                    <strong>Naam:</strong> {submittedData.voornaam} {submittedData.achternaam}
                  </div>
                  <div>
                    <strong>Email:</strong> {submittedData.email}
                  </div>
                  <div>
                    <strong>Voertuig:</strong> {submittedData.voertuig}
                  </div>
                  <div>
                    <strong>Maandbedrag:</strong> €{submittedData.maandbedrag}
                  </div>
                  <div>
                    <strong>Looptijd:</strong> {submittedData.looptijd} maanden
                  </div>
                  {leaseData?.totaalOpties > 0 && (
                    <div>
                      <strong>Extra opties:</strong> €{leaseData.totaalOpties} per maand
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button onClick={resetForm} className="reset-button">
              Nieuwe Aanvraag
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CRM() {
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [testing, setTesting] = React.useState(false);

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching requests from Supabase...');
      
      if (!isSupabaseAvailable()) {
        console.log('⚠️ Supabase not configured');
        setError('Supabase is niet geconfigureerd. Controleer de .env bestanden.');
        setRequests([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('lease_aanvragen')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching requests:', error);
        setError(`Database fout: ${error.message}`);
      } else {
        console.log('✅ Requests fetched successfully:', data?.length || 0, 'records');
        setRequests(data || []);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(`Fout bij het laden van de data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nieuw': return '#2196F3';
      case 'In behandeling': return '#FF9800';
      case 'Goedgekeurd': return '#4CAF50';
      case 'Afgewezen': return '#F44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="header">
          <h1>CRM Dashboard</h1>
          <p>Beheer alle lease aanvragen</p>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Laden...</h2>
          <p>Data wordt geladen uit de database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="header">
          <h1>CRM Dashboard</h1>
          <p>Beheer alle lease aanvragen</p>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Fout</h2>
          <p>{error}</p>
          <button 
            onClick={fetchRequests}
            style={{ 
              background: '#d846b4', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>CRM Dashboard</h1>
        <p>Beheer alle lease aanvragen</p>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <strong>🔧 Debug Info:</strong><br/>
          Supabase configured: {isSupabaseAvailable() ? '✅ Ja' : '❌ Nee'}<br/>
          Supabase client: {supabase ? '✅ Created' : '❌ Not created'}<br/>
          Total requests: {requests.length}<br/>
          Last fetch: {new Date().toLocaleTimeString()}<br/>
          Testing status: {testing ? '⏳ Testing...' : '✅ Ready'}<br/>
          <button 
            onClick={async () => {
              console.log('🔄 Manual database test...');
              setTesting(true);
              try {
                await fetchRequests();
                console.log('✅ Database test completed');
              } catch (err) {
                console.error('❌ Database test failed:', err);
              } finally {
                setTesting(false);
              }
            }}
            disabled={testing}
            style={{ 
              background: testing ? '#6c757d' : '#d846b4', 
              color: 'white', 
              padding: '8px 12px', 
              border: 'none', 
              borderRadius: '4px',
              cursor: testing ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              marginTop: '5px',
              fontWeight: 'bold'
            }}
          >
            {testing ? '⏳ Testing...' : '🔄 Test Database'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Aanvragen Overzicht ({requests.length} aanvragen)</h2>
          <button 
            onClick={fetchRequests}
            style={{ 
              background: '#d846b4', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Vernieuwen
          </button>
        </div>
        {requests.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '40px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3>Geen aanvragen gevonden</h3>
            <p>Er zijn nog geen lease aanvragen ingediend.</p>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '20px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Naam</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Lease Type</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Voertuig</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Maandbedrag</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Datum</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={request.id || index} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '12px' }}>
                      {request.voornaam || request.aanhef || 'N/A'} {request.achternaam || ''}
                    </td>
                    <td style={{ padding: '12px' }}>{request.email || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: request.lease_type === 'Private Lease' ? '#9c27b0' : 
                                   request.lease_type === 'Financial Lease' ? '#2196f3' : '#ff9800',
                        color: 'white'
                      }}>
                        {request.lease_type || 'Onbekend'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {request.voertuig || request.merk || 'N/A'}
                      {request.type && ` ${request.type}`}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {request.maandbedrag ? `€${request.maandbedrag.toLocaleString()}` : 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: getStatusColor(request.status),
                        color: 'white'
                      }}>
                        {request.status || 'Nieuw'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {request.created_at ? formatDate(request.created_at) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Debug sectie voor ontwikkelaars */}
        <details style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔧 Debug: Ruwe Data (Klik om te tonen)</summary>
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <strong>Eerste 3 records:</strong>
            <pre style={{ 
              background: 'white', 
              padding: '10px', 
              borderRadius: '4px', 
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(requests.slice(0, 3), null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
                  <Route path="/superform" element={<SuperForm />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/" element={<Navigate to="/superform" replace />} />
          <Route path="*" element={<Navigate to="/superform" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
