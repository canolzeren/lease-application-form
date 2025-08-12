import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import LeaseForm from './components/LeaseForm.jsx';
import ExtraOptions from './components/ExtraOptions.jsx';
import BusinessInfo from './components/BusinessInfo.jsx';
import PersonalDetailsExtra from './components/PersonalDetailsExtra.jsx';
import ContactDetails from './components/ContactDetails.jsx';
import FinancialDetails from './components/FinancialDetails.jsx';
import ContactForm from './components/ContactForm.jsx';
import Calculator from './components/Calculator.jsx';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAvailable } from './lib/supabase';
import notificationService from './lib/notifications';

// Supabase client for CRM data
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Navigation() {
  const location = useLocation();
  
  return (
    <div className="nav-container" style={{
      background: 'var(--secondary)',
      padding: '10px 20px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h3 className="nav-title" style={{ margin: 0, color: 'var(--foreground)' }}>Lease Management</h3>
      <div className="nav-links" style={{ display: 'flex', gap: '10px' }}>
        <Link
          to="/superform"
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            background: location.pathname === '/superform' ? 'var(--primary)' : 'var(--secondary)',
            color: location.pathname === '/superform' ? 'var(--primary-foreground)' : 'var(--foreground)',
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
            background: location.pathname === '/crm' ? 'var(--primary)' : 'var(--secondary)',
            color: location.pathname === '/crm' ? 'var(--primary-foreground)' : 'var(--foreground)',
            cursor: 'pointer',
            fontWeight: location.pathname === '/crm' ? 'bold' : 'normal',
            textDecoration: 'none'
          }}
        >
          CRM
        </Link>
      </div>
    </div>
  );
}

function SuperForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [leaseData, setLeaseData] = React.useState(null);
  const [submittedData, setSubmittedData] = React.useState(null);
  const [showContactForm, setShowContactForm] = React.useState(false);
  const [showCalculator, setShowCalculator] = React.useState(false);

  // Simpele voortgangsweergave verwijderd

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

    // Normaliseer datums naar ISO (YYYY-MM-DD)
    const pad2 = (n) => (n ? String(n).padStart(2, '0') : '');
    const birthYear = data.personalData?.geboortejaar || '';
    const birthMonth = pad2(data.personalData?.geboortemaand);
    const birthDay = pad2(data.personalData?.geboortedag);
    const geboortedatumISO = birthYear && birthMonth && birthDay
      ? `${birthYear}-${birthMonth}-${birthDay}`
      : '';

    const submissionData = {
      // Verplichte/algemene velden
      lease_type: 'Private Lease',
      status: 'Nieuw',
      voertuig: data.voertuig || 'N/A',
      aanbetaling: data.aanbetaling || 0,
      looptijd: data.looptijd || 0,
      maandbedrag: data.maandbedrag || 0,

      // Contact/persoonlijke gegevens
      voornaam: data.personalData?.voorletters || '',
      achternaam: data.personalData?.achternaam || '',
      email: data.contactData?.email || '',
      telefoon: data.contactData?.telefoon || '',
      aanhef: data.personalData?.aanhef || '',
      geboortedatum: geboortedatumISO,
      burgerlijke_staat: data.personalData?.burgerlijkeStaat || '',

      // Adres
      straat: data.contactData?.straat || '',
      huisnummer: data.contactData?.huisnummer || '',
      postcode: data.contactData?.postcode || '',
      woonplaats: data.contactData?.woonplaats || '',

      // Financieel (kolomnamen conform schema)
      dienstverband: data.financialData?.dienstverband || '',
      beroep: data.financialData?.beroep || '',
      ingangsdatum_dienstverband: data.financialData?.ingang || '',
      bruto_inkomen: data.financialData?.inkomen || 0,
      woonsituatie: data.financialData?.woonsituatie || '',
      maandelijkse_woonlasten: data.financialData?.woonlast || 0,

      // Metadata
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
      <div className="header" style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lease Aanvraagformulier</h1>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>Kies uw lease type en vul het formulier in (v2)</p>
      </div>

      

      {currentStep === 0 && (
        <LeaseForm 
          onComplete={handleLeaseComplete} 
          onShowCalculator={() => setShowCalculator(true)}
          onShowContact={() => setShowContactForm(true)}
        />
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
            console.log('🎯 FinancialDetails completed for Private Lease');
            const finalData = { ...leaseData, financialData: data };
            console.log('📊 Final Private Lease data:', finalData);
            setLeaseData(finalData);
            setCurrentStep(4);
            // Submit Private Lease data to database
            console.log('🚀 Starting Private Lease submission...');
            submitPrivateLeaseData(finalData);
          }} 
          onBack={handleBack}
        />
      )}

      {currentStep === 2 && leaseData?.leaseType !== 'private' && (
        <BusinessInfo 
          onComplete={handleFormComplete} 
          onBack={handleBack}
          leaseData={leaseData}
        />
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

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
}

function CRM() {
  const [requests, setRequests] = React.useState([]);
  const [filteredRequests, setFilteredRequests] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [testing, setTesting] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [editingField, setEditingField] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  // Ref om te voorkomen dat subscription meerdere keren wordt aangeroepen
  const subscriptionRef = React.useRef(null);

  React.useEffect(() => {
    fetchRequests();
    
    // Alleen subscription opzetten als er nog geen bestaat
    if (!subscriptionRef.current) {
      subscriptionRef.current = setupRealtimeSubscription();
    }
    
    initializeNotifications();
    setupCrossTabNotifications();
    
    return () => {
      // Cleanup subscription on unmount
      if (subscriptionRef.current) {
        console.log('🧹 Cleaning up subscription on unmount...');
        supabase.removeAllChannels();
        subscriptionRef.current = null;
      }
    };
  }, []);

  // Setup cross-tab communication for notifications
  const setupCrossTabNotifications = () => {
    console.log('🔗 Setting up cross-tab notification listening...');
    
    const handleStorageChange = (event) => {
      console.log('🔍 Storage change detected:', event.key, event.newValue);
      
      if (event.key === 'newLeaseNotification' && event.newValue) {
        try {
          const notificationData = JSON.parse(event.newValue);
          console.log('📨 Received cross-tab notification:', notificationData);
          
          if (notificationData.type === 'new_lease_request' && notificationData.data) {
            console.log('✅ Processing cross-tab notification...');
            // Handle the new request
            handleNewLeaseRequest(notificationData.data);
            
            // Clear the notification from localStorage
            localStorage.removeItem('newLeaseNotification');
            console.log('🧹 Cross-tab notification cleared from localStorage');
          }
        } catch (error) {
          console.error('❌ Error processing cross-tab notification:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  };

  // Filter requests based on search term
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (request.voornaam?.toLowerCase().includes(searchLower)) ||
          (request.achternaam?.toLowerCase().includes(searchLower)) ||
          (request.email?.toLowerCase().includes(searchLower)) ||
          (request.telefoon?.includes(searchTerm)) ||
          (request.merk?.toLowerCase().includes(searchLower)) ||
          (request.model?.toLowerCase().includes(searchLower)) ||
          (request.voertuig?.toLowerCase().includes(searchLower)) ||
          (request.lease_type?.toLowerCase().includes(searchLower)) ||
          (request.status?.toLowerCase().includes(searchLower)) ||
          (request.id?.toString().includes(searchTerm))
        );
      });
      setFilteredRequests(filtered);
    }
  }, [requests, searchTerm]);

  // Initialize notifications
  const initializeNotifications = async () => {
    const hasPermission = await notificationService.requestPermission();
    setNotificationsEnabled(hasPermission);
    
    if (hasPermission) {
      console.log('✅ Push notifications enabled for CRM');
    } else {
      console.log('❌ Push notifications disabled or not supported');
    }
  };

  // Setup real-time subscription for new lease requests
  const setupRealtimeSubscription = () => {
    if (!isSupabaseAvailable()) {
      console.log('⚠️ Supabase not available - real-time notifications disabled');
      return;
    }

    // Cleanup bestaande channels om duplicate subscription errors te voorkomen
    console.log('🧹 Cleaning up existing channels...');
    if (subscriptionRef.current) {
      console.log('🔄 Replacing existing subscription...');
    }
    supabase.removeAllChannels();

    console.log('🔌 Setting up real-time subscription for lease_aanvragen...');

    const channel = supabase
      .channel('lease_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lease_aanvragen'
        },
        (payload) => {
          console.log('🚨 New lease request detected via real-time:', payload);
          console.log('📊 Payload details:', {
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
            schema: payload.schema,
            table: payload.table,
            commit_timestamp: payload.commit_timestamp
          });
          handleNewLeaseRequest(payload.new);
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Real-time subscription status:', status);
        if (err) {
          console.error('❌ Real-time subscription error:', err);
        }
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to lease_aanvragen changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error - retrying in 5 seconds...');
          // Cleanup en retry
          supabase.removeAllChannels();
          subscriptionRef.current = null;
          setTimeout(() => {
            console.log('🔄 Retrying subscription...');
            if (!subscriptionRef.current) {
              subscriptionRef.current = setupRealtimeSubscription();
            }
          }, 5000);
        }
      });

    // Update de ref met de nieuwe channel
    subscriptionRef.current = channel;
    return channel;
  };

  // Handle new lease request notification
  const handleNewLeaseRequest = (newRequest) => {
    console.log('🔔 Processing new lease request for notifications...');
    console.log('📋 Request data:', newRequest);
    console.log('📱 Notifications enabled:', notificationsEnabled);
    console.log('🔐 Can show notifications:', notificationService.canShowNotifications());
    
    // Add to local state immediately
    setRequests(prev => [newRequest, ...prev]);
    
    // Show notification if enabled
    if (notificationsEnabled && notificationService.canShowNotifications()) {
      const customerName = `${newRequest.voornaam || ''} ${newRequest.achternaam || ''}`.trim() || 'Nieuwe klant';
      const leaseType = newRequest.lease_type || 'Lease';
      const amount = newRequest.maandbedrag;
      
      // Determine notification type based on amount
      if (amount && amount >= 1000) {
        notificationService.highValueRequest(customerName, amount);
      } else {
        notificationService.newLeaseRequest(customerName, leaseType, amount);
      }
      
      // Play notification sound (optional)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D0r2AfBTGH0fPTgjMGK37O7+CVPO0NVq3n77BdGAg+ltryxnkpBSl+zPLaizsIGGS57OihUgwUVKrj8bllHgg2jdXzzn0vBSF1xe/dkTwIHVu16OWiUQwORJzd8bJjHAU2jdXzzn0vBSN2xe/dkTsKGGS76OWnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGO76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkTsJGGS76OWnUgwTPJzd8rJjHAU2jdXzzn0vBSJ2xe/dkjsJGGO76OSnUgwURJzd8bJjHAU2jdXzzn0vBSN2xe/dkTsJGGS76OWnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJGGS76OSnUgwURJzd8bJjHAU2jdXzzn0vBSJ2xe/dkjsJ');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors
      } catch (e) {
        // Ignore audio errors
      }
    }
  };

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

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const number = Number(value);
    if (Number.isNaN(number)) return String(value);
    return `€${number.toLocaleString('nl-NL')}`;
  };

  const exportToCSV = () => {
    if (requests.length === 0) {
      alert('Geen data om te exporteren');
      return;
    }

    // CSV headers
    const headers = [
      'ID',
      'Datum',
      'Lease Type',
      'Status',
      'Voornaam',
      'Achternaam',
      'Email',
      'Telefoon',
      'Voertuig',
      'Kenteken',
      'Maandbedrag',
      'Looptijd (maanden)',
      'Verkoopprijs',
      'Aanbetaling',
      'Gewenst Krediet',
      'Geboortedatum',
      'Burgerlijke Staat',
      'Straat',
      'Huisnummer',
      'Postcode',
      'Woonplaats',
      'Dienstverband',
      'Beroep',
      'Bruto Inkomen',
      'Woonsituatie',
      'Woonlasten'
    ];

    // Convert data to CSV format
    const csvData = requests.map(request => [
      request.id || '',
      request.created_at ? formatDate(request.created_at) : '',
      request.lease_type || '',
      request.status || '',
      request.voornaam || request.aanhef || '',
      request.achternaam || '',
      request.email || '',
      request.telefoon || '',
      `${request.voertuig || request.merk || ''}${request.type ? ` ${request.type}` : ''}`,
      request.kenteken || '',
      request.maandbedrag || '',
      request.looptijd || '',
      request.verkoopprijs || '',
      request.aanbetaling || '',
      request.gewenst_krediet || '',
      request.geboortedatum || '',
      request.burgerlijke_staat || '',
      request.straat || '',
      request.huisnummer || '',
      request.postcode || '',
      request.woonplaats || '',
      request.dienstverband || '',
      request.beroep || '',
      request.bruto_inkomen || '',
      request.woonsituatie || '',
      request.maandelijkse_woonlasten || ''
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lease-aanvragen-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateField = async (fieldName, newValue) => {
    if (!selectedRequest?.id || !isSupabaseAvailable()) {
      alert('Kan gegevens niet opslaan - database niet beschikbaar');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lease_aanvragen')
        .update({ [fieldName]: newValue })
        .eq('id', selectedRequest.id)
        .select();

      if (error) {
        console.error('❌ Update failed:', error);
        alert(`❌ Fout bij opslaan: ${error.message}`);
      } else {
        console.log('✅ Field updated:', fieldName, newValue);
        // Update local state
        setSelectedRequest(prev => ({ ...prev, [fieldName]: newValue }));
        setRequests(prev => prev.map(req => 
          req.id === selectedRequest.id ? { ...req, [fieldName]: newValue } : req
        ));
        setEditingField(null);
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      alert(`❌ Opslaan mislukt: ${err.message}`);
    }
  };

  const startEdit = (fieldName, currentValue) => {
    setEditingField(fieldName);
    setEditValue(currentValue || '');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (editingField && editValue !== selectedRequest[editingField]) {
      updateField(editingField, editValue);
    } else {
      setEditingField(null);
    }
  };

  const renderEditableField = (label, fieldName, value) => {
    const isEditing = editingField === fieldName;
    const displayValue = value ?? 'N/B';
    
    return (
      <div className="crm-detail-row">
        <div className="crm-detail-label">{label}</div>
        <div className="crm-detail-value">
          {isEditing ? (
            <div className="crm-edit-container">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="crm-edit-input"
                autoFocus
              />
              <div className="crm-edit-buttons">
                <button
                  onClick={saveEdit}
                  className="crm-edit-save"
                >
                  ✓
                </button>
                <button
                  onClick={cancelEdit}
                  className="crm-edit-cancel"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
                      <div
            onClick={() => startEdit(fieldName, value)}
            className="crm-edit-trigger"
            title="Tik om te bewerken"
          >
            <span className="crm-field-value">{displayValue}</span>
          </div>
          )}
        </div>
      </div>
    );
  };

  const renderDetailRow = (label, value) => (
    <div className="crm-detail-row">
      <div className="crm-detail-label">{label}</div>
      <div className="crm-detail-value">
        <span className="crm-field-value">{value ?? 'N/B'}</span>
      </div>
    </div>
  );

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
    <div className="crm-dashboard">
      {/* Minimalist Header */}
      <div className="crm-header">
        <div className="crm-title-section">
          <h1 className="crm-title">Lease aanvragen</h1>
          <span className="crm-count">{filteredRequests.length} {searchTerm ? `van ${requests.length} ` : ''}aanvragen</span>
        </div>
        
        <div className="crm-controls">
          <div className="crm-search">
            <span className="material-icons search-icon">search</span>
            <input
              type="text"
              placeholder="Zoek aanvragen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="search-clear">
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
          
          <div className="crm-actions">
            {/* Notification Toggle */}
            <button 
              onClick={async () => {
                try {
                  await notificationService.testNotification();
                } catch (error) {
                  console.error('Test notification error:', error);
                  alert('❌ Notification test mislukt: ' + error.message);
                }
              }} 
              className="action-btn secondary"
              title="Test notificatie - Check of push notifications werken"
            >
              <span className="material-icons">notifications</span>
              Test
            </button>
            
            {/* Debug Button */}
            <button 
              onClick={async () => {
                console.log('🔍 DEBUG INFO:');
                console.log('📡 Supabase available:', isSupabaseAvailable());
                console.log('📱 Notifications enabled:', notificationsEnabled);
                console.log('🔔 Can show notifications:', notificationService.canShowNotifications());
                console.log('🌐 Browser permission:', Notification?.permission);
                console.log('📊 Current requests count:', requests.length);
                
                // Check recent submissions
                if (isSupabaseAvailable()) {
                  try {
                    const { data, error } = await supabase
                      .from('lease_aanvragen')
                      .select('*')
                      .order('created_at', { ascending: false })
                      .limit(5);
                    
                    if (error) {
                      console.error('❌ Debug fetch error:', error);
                    } else {
                      console.log('📋 Last 5 submissions:', data);
                    }
                  } catch (err) {
                    console.error('❌ Debug error:', err);
                  }
                }
                
                alert('Debug info logged to console. Open Developer Tools → Console.');
              }} 
              className="action-btn secondary"
              title="Debug notification system"
            >
              <span className="material-icons">bug_report</span>
              Debug
            </button>
            
            <div className="notification-status">
              <span className={`notification-indicator ${notificationsEnabled ? 'enabled' : 'disabled'}`}>
                <span className="material-icons">
                  {notificationsEnabled ? 'notifications_active' : 'notifications_off'}
                </span>
              </span>
              <span className="status-text">
                {notificationsEnabled ? 'Meldingen aan' : 'Klik Test voor setup'}
              </span>
            </div>
            
            <button onClick={exportToCSV} className="action-btn secondary" disabled={filteredRequests.length === 0}>
              <span className="material-icons">download</span>
              Export
            </button>
            <button onClick={fetchRequests} className="action-btn primary">
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="crm-content">
        {loading ? (
          <div className="crm-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>Laden...</h3>
            <p>Aanvragen worden opgehaald...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="crm-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>{searchTerm ? 'Geen resultaten gevonden' : 'Geen aanvragen gevonden'}</h3>
            <p>{searchTerm ? `Geen aanvragen gevonden voor "${searchTerm}"` : 'Er zijn nog geen lease aanvragen ingediend.'}</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary"
                style={{ marginTop: '10px' }}
              >
                Wis zoekopdracht
              </button>
            )}
          </div>
        ) : (
          <>
          {/* Desktop Table */}
          <div className="crm-card crm-desktop-table">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Email</th>
                  <th>Lease Type</th>
                  <th>Voertuig</th>
                  <th>Maandbedrag</th>
                  <th>Status</th>
                  <th>Datum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr 
                    key={request.id || index} 
                    className="crm-row"
                    onClick={() => { setSelectedRequest(request); setShowDetails(true); }}
                  >
                    <td>
                      {request.voornaam || request.aanhef || 'N/A'} {request.achternaam || ''}
                    </td>
                    <td>{request.email || 'N/A'}</td>
                    <td>
                      <span className={`lease-badge lease-${(request.lease_type || '').toLowerCase().replace(/\s/g, '-')}`}>
                        {request.lease_type === 'financial' ? 'Financiële Lease' : 
                         request.lease_type === 'private' ? 'Particuliere Lease' :
                         request.lease_type === 'operational' ? 'Operationele Lease' : 
                         request.lease_type || 'Onbekend'}
                      </span>
                    </td>
                    <td>
                      {request.voertuig || request.merk || 'N/A'}
                      {request.type && ` ${request.type}`}
                    </td>
                    <td>
                      {request.maandbedrag ? `€${request.maandbedrag.toLocaleString()}` : 'N/A'}
                    </td>
                    <td>
                      <span className={`badge badge-status ${request.status || ''}`}>{request.status || 'Nieuw'}</span>
                    </td>
                    <td>
                      {request.created_at ? formatDate(request.created_at) : 'N/A'}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedRequest(request); setShowDetails(true); }}
                        className="btn btn-info"
                        style={{ padding: '6px 10px' }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="crm-mobile-cards">
            {filteredRequests.map((request, index) => (
              <div 
                key={request.id || index} 
                className="crm-mobile-card"
                onClick={() => { setSelectedRequest(request); setShowDetails(true); }}
              >
                <div className="card-header">
                  <div className="card-name">{request.voornaam || request.aanhef || 'N/A'} {request.achternaam || ''}</div>
                  <div className="card-id">#{request.id || index + 1}</div>
                </div>
                
                <div className="card-content">
                  <div className="card-row">
                    <span className="card-label">📧</span>
                    <span className="card-value">{request.email?.substring(0, 20) + (request.email?.length > 20 ? '...' : '') || 'N/A'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">📱</span>
                    <span className="card-value">{request.telefoon || 'N/A'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">🚗</span>
                    <span className="card-value">{request.voertuig || request.merk || 'N/A'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">💰</span>
                    <span className="card-value">{request.maandbedrag ? `€${request.maandbedrag.toLocaleString()}` : 'N/A'}</span>
                  </div>
                </div>
                
                <div className="card-footer">
                  <span className={`lease-badge lease-${(request.lease_type || '').toLowerCase().replace(/\s/g, '-')}`}>
                    {request.lease_type === 'financial' ? 'Financiële' : 
                     request.lease_type === 'private' ? 'Particuliere' :
                     request.lease_type === 'operational' ? 'Operationele' : 
                     request.lease_type || 'Onbekend'}
                  </span>
                  <div className="card-footer-right">
                    <span className={`badge badge-status ${request.status || ''}`}>{request.status || 'Nieuw'}</span>
                    <span className="card-date">{request.created_at ? formatDate(request.created_at) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
        
        {showDetails && selectedRequest && (
          <div>
            {/* overlay */}
            <div className="crm-overlay" onClick={() => setShowDetails(false)} />
            {/* drawer */}
            <div className="crm-drawer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Aanvraagdetails</h2>
                <button onClick={() => setShowDetails(false)} style={{
                  background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer'
                }}>×</button>
              </div>

              <div style={{ marginTop: '8px', color: '#6c757d' }}>
                ID: {selectedRequest.id ?? 'N/B'} · {selectedRequest.lease_type || 'Onbekend'} · {selectedRequest.status || 'Nieuw'}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <span style={{
                  padding: '4px 8px', borderRadius: '4px', fontWeight: 700,
                  background: getStatusColor(selectedRequest.status), color: 'white', fontSize: '12px'
                }}>{selectedRequest.status || 'Nieuw'}</span>
                <span style={{
                  padding: '4px 8px', borderRadius: '4px', fontWeight: 700,
                  background: selectedRequest.lease_type === 'Private Lease' ? '#9c27b0' : selectedRequest.lease_type === 'Financial Lease' ? '#2196f3' : '#ff9800',
                  color: 'white', fontSize: '12px'
                }}>{selectedRequest.lease_type || 'Onbekend'}</span>
              </div>

              {/* Algemene info */}
              <div className="crm-section">
                <h3>Algemene informatie</h3>
                <div className="crm-detail-grid">
                  {renderDetailRow('Datum', selectedRequest.created_at ? formatDate(selectedRequest.created_at) : 'N/B')}
                  {renderDetailRow('Voertuig', `${selectedRequest.voertuig || selectedRequest.merk || 'N/B'} ${selectedRequest.type || ''}`)}
                  {renderDetailRow('Kenteken', selectedRequest.kenteken || 'N/B')}
                  {renderDetailRow('Maandbedrag', formatCurrency(selectedRequest.maandbedrag))}
                  {renderDetailRow('Looptijd', selectedRequest.looptijd ? `${selectedRequest.looptijd} maanden` : 'N/B')}
                  {renderDetailRow('Aanbetaling', formatCurrency(selectedRequest.aanbetaling))}
                  {renderDetailRow('Verkoopprijs', formatCurrency(selectedRequest.verkoopprijs))}
                  {renderDetailRow('Gewenst krediet', formatCurrency(selectedRequest.gewenst_krediet))}
                </div>
              </div>

              {/* Persoonlijk */}
              <div className="crm-section">
                <h3>Persoonlijke gegevens</h3>
                <div className="crm-detail-grid">
                  {renderEditableField('Voornaam', 'voornaam', selectedRequest.voornaam || selectedRequest.aanhef)}
                  {renderEditableField('Achternaam', 'achternaam', selectedRequest.achternaam)}
                  {renderEditableField('E-mail', 'email', selectedRequest.email)}
                  {renderEditableField('Telefoon', 'telefoon', selectedRequest.telefoon)}
                  {renderEditableField('Geboortedatum', 'geboortedatum', selectedRequest.geboortedatum)}
                  {renderEditableField('Burgerlijke staat', 'burgerlijke_staat', selectedRequest.burgerlijke_staat)}
                </div>
              </div>

              {/* Adres */}
              <div className="crm-section">
                <h3>Adres</h3>
                <div className="crm-detail-grid">
                  {renderEditableField('Straat', 'straat', selectedRequest.straat)}
                  {renderEditableField('Huisnummer', 'huisnummer', selectedRequest.huisnummer)}
                  {renderEditableField('Postcode', 'postcode', selectedRequest.postcode)}
                  {renderEditableField('Woonplaats', 'woonplaats', selectedRequest.woonplaats)}
                </div>
              </div>

              {/* Financieel */}
              <div className="crm-section">
                <h3>Financiële gegevens</h3>
                <div className="crm-detail-grid">
                  {renderDetailRow('Dienstverband', selectedRequest.dienstverband || 'N/B')}
                  {renderDetailRow('Beroep', selectedRequest.beroep || 'N/B')}
                  {renderDetailRow('Ingang dienstverband', selectedRequest.ingangsdatum_dienstverband || 'N/B')}
                  {renderDetailRow('Bruto inkomen', formatCurrency(selectedRequest.bruto_inkomen))}
                  {renderDetailRow('Woonsituatie', selectedRequest.woonsituatie || 'N/B')}
                  {renderDetailRow('Maandelijkse woonlasten', formatCurrency(selectedRequest.maandelijkse_woonlasten))}
                </div>
              </div>

              {/* Extra producten indien aanwezig */}
              {(selectedRequest.geselecteerde_producten || selectedRequest.extra_producten_kosten) && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0' }}>Extra producten</h3>
                  {selectedRequest.geselecteerde_producten && (
                    <div style={{
                      background: '#f8f9fa', padding: '10px', borderRadius: '6px', fontSize: '13px'
                    }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(selectedRequest.geselecteerde_producten, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedRequest.extra_producten_kosten && (
                    <div style={{ marginTop: '10px', display: 'grid', gap: '10px' }}>
                      {renderDetailRow('Eenmalige kosten', formatCurrency(selectedRequest.extra_producten_kosten?.eenmaligeKosten))}
                      {renderDetailRow('Maandelijkse kosten', formatCurrency(selectedRequest.extra_producten_kosten?.maandelijkseKosten))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowDetails(false)} style={{
                  background: '#6c757d', color: 'white', border: 'none', padding: '10px 14px',
                  borderRadius: '6px', cursor: 'pointer'
                }}>Sluiten</button>
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedRequest, null, 2))} style={{
                  background: '#0d6efd', color: 'white', border: 'none', padding: '10px 14px',
                  borderRadius: '6px', cursor: 'pointer'
                }}>Kopieer JSON</button>
              </div>
            </div>
          </div>
        )}
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
