import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import LeaseForm from './components/LeaseForm.jsx';
import ExtraOptions from './components/ExtraOptions.jsx';
import BusinessInfo from './components/BusinessInfo.jsx';

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
  const [leaseType, setLeaseType] = React.useState(null); // 'financial' of 'private'
  const [leaseData, setLeaseData] = React.useState(null);
  const [submittedData, setSubmittedData] = React.useState(null);

  const stepNames = ['Lease Type', 'Voertuig Selectie', 'Extra Opties', 'Persoonlijke Gegevens'];

  const handleLeaseTypeSelect = (type) => {
    setLeaseType(type);
    setCurrentStep(1);
  };

  const handleLeaseComplete = (data) => {
    setLeaseData(data);
    setCurrentStep(2);
  };

  const handleExtraOptionsComplete = (data) => {
    setLeaseData({ ...leaseData, ...data });
    setCurrentStep(3);
  };

  const handleFormComplete = (data) => {
    setSubmittedData(data);
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setLeaseType(null);
    setLeaseData(null);
    setSubmittedData(null);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Lease Aanvraagformulier</h1>
        <p>Kies uw lease type en vul het formulier in</p>
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Kies uw lease type</h2>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
            <button
              onClick={() => handleLeaseTypeSelect('financial')}
              style={{
                padding: '40px 60px',
                border: '2px solid #d846b4',
                background: 'white',
                color: '#d846b4',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              <h3>Financial Lease</h3>
              <p>Voor zakelijke gebruikers</p>
            </button>
            <button
              onClick={() => handleLeaseTypeSelect('private')}
              style={{
                padding: '40px 60px',
                border: '2px solid #d846b4',
                background: 'white',
                color: '#d846b4',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              <h3>Private Lease</h3>
              <p>Voor particuliere gebruikers</p>
            </button>
          </div>
        </div>
      )}

      {currentStep === 1 && leaseType === 'financial' && (
        <LeaseForm onComplete={handleLeaseComplete} />
      )}

      {currentStep === 1 && leaseType === 'private' && (
        <LeaseForm onComplete={handleLeaseComplete} />
      )}

      {currentStep === 2 && leaseType === 'financial' && (
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

      {currentStep === 2 && leaseType === 'private' && (
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

      {currentStep === 3 && leaseType === 'financial' && (
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

      {currentStep === 4 && (
        <div className="success-screen">
          <div className="success-content">
            <div style={{ fontSize: '60px', color: '#4CAF50', marginBottom: '20px' }}>✓</div>
            <h2>Uw {leaseType === 'financial' ? 'Financial' : 'Private'} Lease Aanvraag is Succesvol Ingediend!</h2>
            <p>We hebben uw aanvraag ontvangen en nemen binnen 24 uur contact met u op.</p>
            
            {submittedData && (
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
  return (
    <div className="app">
      <div className="header">
        <h1>CRM Dashboard</h1>
        <p>Beheer alle lease aanvragen</p>
      </div>
      <div style={{ padding: '20px' }}>
        <h2>Aanvragen Overzicht</h2>
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '40px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Supabase integratie tijdelijk uitgeschakeld</h3>
          <p>De CRM functionaliteit is momenteel in onderhoud. Zodra de Supabase integratie is hersteld, worden hier alle lease aanvragen getoond.</p>
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#f0f8ff', 
            borderRadius: '4px',
            border: '1px solid #d0e7ff'
          }}>
            <strong>Test data:</strong> Er zijn momenteel geen echte aanvragen in de database.
          </div>
        </div>
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
