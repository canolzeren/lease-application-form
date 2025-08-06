import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';

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
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#d846b4' }}>SuperForm</h1>
      <p>Lease aanvraagformulier - Test versie</p>
      <button style={{ 
        padding: '10px 20px', 
        background: '#d846b4', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Test Knop
      </button>
    </div>
  );
}

function CRM() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#d846b4' }}>CRM Dashboard</h1>
      <p>Beheer alle lease aanvragen - Test versie</p>
      <button style={{ 
        padding: '10px 20px', 
        background: '#d846b4', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Test Knop
      </button>
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
