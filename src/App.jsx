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

  const handleLeaseComplete = (data) => {
    setLeaseData(data);
    if (data.leaseType === 'private') {
      setCurrentStep(1);
    } else {
      setCurrentStep(1);
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
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setLeaseData(null);
    setSubmittedData(null);
    setShowContactForm(false);
    setShowCalculator(false);
  };

  const submitPrivateLeaseData = async (data) => {
    try {
      const timestamp = new Date();
      const pad2 = (n) => (n ? String(n).padStart(2, '0') : '');
      
      const formattedDate = `${timestamp.getFullYear()}-${pad2(timestamp.getMonth() + 1)}-${pad2(timestamp.getDate())} ${pad2(timestamp.getHours())}:${pad2(timestamp.getMinutes())}:${pad2(timestamp.getSeconds())}`;
      
      const submissionData = {
        ...data,
        created_at: formattedDate,
        status: 'Nieuw',
        lease_type: 'private'
      };

      if (isSupabaseAvailable()) {
        const { data: result, error } = await supabase
          .from('lease_aanvragen')
          .insert([submissionData])
          .select();

        if (error) {
          console.error('Error submitting data:', error);
          notificationService.showError('Er is een fout opgetreden bij het opslaan van de gegevens.');
          return false;
        }

        console.log('Data submitted successfully:', result);
        notificationService.showSuccess('Uw aanvraag is succesvol ingediend!');
        
        // Trigger cross-tab notification
        localStorage.setItem('newLeaseNotification', JSON.stringify({
          type: 'new_lease_request',
          data: submissionData,
          timestamp: Date.now()
        }));
        
        return true;
      } else {
        console.log('Supabase not available, simulating submission:', submissionData);
        notificationService.showSuccess('Uw aanvraag is succesvol ingediend! (Demo modus)');
        return true;
      }
    } catch (error) {
      console.error('Error in submitPrivateLeaseData:', error);
      notificationService.showError('Er is een fout opgetreden bij het indienen van de aanvraag.');
      return false;
    }
  };

  const submitFinancialLeaseData = async (data) => {
    try {
      const timestamp = new Date();
      const pad2 = (n) => (n ? String(n).padStart(2, '0') : '');
      
      const formattedDate = `${timestamp.getFullYear()}-${pad2(timestamp.getMonth() + 1)}-${pad2(timestamp.getDate())} ${pad2(timestamp.getHours())}:${pad2(timestamp.getMinutes())}:${pad2(timestamp.getSeconds())}`;
      
      const submissionData = {
        ...data,
        created_at: formattedDate,
        status: 'Nieuw',
        lease_type: 'financial'
      };

      if (isSupabaseAvailable()) {
        const { data: result, error } = await supabase
          .from('lease_aanvragen')
          .insert([submissionData])
          .select();

        if (error) {
          console.error('Error submitting data:', error);
          notificationService.showError('Er is een fout opgetreden bij het opslaan van de gegevens.');
          return false;
        }

        console.log('Data submitted successfully:', result);
        notificationService.showSuccess('Uw aanvraag is succesvol ingediend!');
        
        // Trigger cross-tab notification
        localStorage.setItem('newLeaseNotification', JSON.stringify({
          type: 'new_lease_request',
          data: submissionData,
          timestamp: Date.now()
        }));
        
        return true;
      } else {
        console.log('Supabase not available, simulating submission:', submissionData);
        notificationService.showSuccess('Uw aanvraag is succesvol ingediend! (Demo modus)');
        return true;
      }
    } catch (error) {
      console.error('Error in submitFinancialLeaseData:', error);
      notificationService.showError('Er is een fout opgetreden bij het indienen van de aanvraag.');
      return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LeaseForm
            onComplete={handleLeaseComplete}
            onShowCalculator={() => setShowCalculator(true)}
          />
        );
      case 1:
        if (leaseData?.leaseType === 'private') {
          return (
            <PersonalDetailsExtra
              leaseData={leaseData}
              onComplete={handleFormComplete}
              onSubmit={submitPrivateLeaseData}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <ExtraOptions
              leaseData={leaseData}
              onComplete={handleExtraOptionsComplete}
              onBack={handleBack}
            />
          );
        }
      case 2:
        if (leaseData?.leaseType === 'financial') {
          return (
            <BusinessInfo
              leaseData={leaseData}
              onComplete={handleFormComplete}
              onSubmit={submitFinancialLeaseData}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <FinancialDetails
              leaseData={leaseData}
              onComplete={handleFormComplete}
              onSubmit={submitFinancialLeaseData}
              onBack={handleBack}
            />
          );
        }
      case 3:
        return (
          <div className="step-container">
            <h2>Bedankt voor uw aanvraag!</h2>
            <p>Uw lease aanvraag is succesvol ingediend. We nemen binnen 24 uur contact met u op.</p>
            <div className="button-group">
              <button onClick={resetForm} className="btn btn-primary">
                Nieuwe Aanvraag
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="superform-container">
      {renderStep()}
      
      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          onSubmit={(data) => {
            console.log('Contact form submitted:', data);
            setShowContactForm(false);
          }}
        />
      )}
      
      {showCalculator && (
        <Calculator
          onClose={() => setShowCalculator(false)}
          leaseData={leaseData}
        />
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
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [editingField, setEditingField] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const subscriptionRef = React.useRef(null);

  React.useEffect(() => {
    fetchRequests();
    
    if (!subscriptionRef.current) {
      subscriptionRef.current = setupRealtimeSubscription();
    }
    
    initializeNotifications();
    setupCrossTabNotifications();
    
    return () => {
      if (subscriptionRef.current) {
        console.log('🧹 Cleaning up subscription on unmount...');
        supabase.removeAllChannels();
        subscriptionRef.current = null;
      }
    };
  }, []);

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
            handleNewLeaseRequest(notificationData.data);
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

  const initializeNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        console.log('🔔 Notifications enabled');
      } else {
        console.log('🔕 Notifications not enabled');
      }
    }
  };

  const setupRealtimeSubscription = () => {
    console.log('🔌 Setting up realtime subscription...');
    
    if (!isSupabaseAvailable()) {
      console.log('❌ Supabase not available, skipping subscription');
      return null;
    }

    const channel = supabase
      .channel('lease_aanvragen_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lease_aanvragen'
        },
        (payload) => {
          console.log('📨 New lease request received via realtime:', payload);
          handleNewLeaseRequest(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lease_aanvragen'
        },
        (payload) => {
          console.log('📝 Lease request updated via realtime:', payload);
          handleLeaseRequestUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return channel;
  };

  const handleNewLeaseRequest = (newRequest) => {
    console.log('🆕 Handling new lease request:', newRequest);
    
    setRequests(prev => [newRequest, ...prev]);
    
    if (notificationsEnabled) {
      const notification = new Notification('Nieuwe Lease Aanvraag', {
        body: `${newRequest.voornaam} ${newRequest.achternaam} heeft een nieuwe ${newRequest.lease_type} aanvraag ingediend.`,
        icon: '/favicon.ico',
        tag: 'new-lease-request'
      });
      
      notification.onclick = () => {
        window.focus();
        setSelectedRequest(newRequest);
        setShowDetails(true);
      };
    }
  };

  const handleLeaseRequestUpdate = (updatedRequest) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
  };

  const fetchRequests = async () => {
    if (!isSupabaseAvailable()) {
      console.log('❌ Supabase not available, using mock data');
      setRequests([
        {
          id: 1,
          voornaam: 'Jan',
          achternaam: 'Jansen',
          email: 'jan@example.com',
          telefoon: '0612345678',
          merk: 'BMW',
          model: 'X3',
          lease_type: 'private',
          status: 'Nieuw',
          created_at: '2024-01-15 10:30:00'
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lease_aanvragen')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        setError('Fout bij het ophalen van aanvragen');
        setLoading(false);
        return;
      }

      console.log('📊 Fetched requests:', data);
      setRequests(data || []);
      setError(null);
    } catch (err) {
      console.error('Error in fetchRequests:', err);
      setError('Fout bij het ophalen van aanvragen');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    if (!isSupabaseAvailable()) {
      console.log('❌ Supabase not available, simulating status update');
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('lease_aanvragen')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        notificationService.showError('Fout bij het bijwerken van de status');
        return;
      }

      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      notificationService.showSuccess('Status succesvol bijgewerkt');
    } catch (err) {
      console.error('Error in updateRequestStatus:', err);
      notificationService.showError('Fout bij het bijwerken van de status');
    }
  };

  const updateRequestField = async (requestId, field, value) => {
    if (!isSupabaseAvailable()) {
      console.log('❌ Supabase not available, simulating field update');
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, [field]: value } : req
        )
      );
      setEditingField(null);
      setEditValue('');
      return;
    }

    try {
      const { error } = await supabase
        .from('lease_aanvragen')
        .update({ [field]: value })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating field:', error);
        notificationService.showError('Fout bij het bijwerken van het veld');
        return;
      }

      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, [field]: value } : req
        )
      );
      
      setEditingField(null);
      setEditValue('');
      notificationService.showSuccess('Veld succesvol bijgewerkt');
    } catch (err) {
      console.error('Error in updateRequestField:', err);
      notificationService.showError('Fout bij het bijwerken van het veld');
    }
  };

  const startEditing = (requestId, field, currentValue) => {
    setEditingField({ requestId, field });
    setEditValue(currentValue || '');
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateRequestField(editingField.requestId, editingField.field, editValue);
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setEditValue('');
    }
  };

  const renderRequestRow = (request) => {
    const isEditing = editingField?.requestId === request.id && editingField?.field;
    
    return (
      <tr key={request.id} className="request-row">
        <td>{request.id}</td>
        <td>
          {isEditing && editingField.field === 'voornaam' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'voornaam', editValue)}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'voornaam', request.voornaam)}
              style={{ cursor: 'pointer' }}
            >
              {request.voornaam || '-'}
            </span>
          )}
        </td>
        <td>
          {isEditing && editingField.field === 'achternaam' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'achternaam', editValue)}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'achternaam', request.achternaam)}
              style={{ cursor: 'pointer' }}
            >
              {request.achternaam || '-'}
            </span>
          )}
        </td>
        <td>
          {isEditing && editingField.field === 'email' ? (
            <input
              type="email"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'email', editValue)}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'email', request.email)}
              style={{ cursor: 'pointer' }}
            >
              {request.email || '-'}
            </span>
          )}
        </td>
        <td>
          {isEditing && editingField.field === 'telefoon' ? (
            <input
              type="tel"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'telefoon', editValue)}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'telefoon', request.telefoon)}
              style={{ cursor: 'pointer' }}
            >
              {request.telefoon || '-'}
            </span>
          )}
        </td>
        <td>
          {isEditing && editingField.field === 'merk' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'merk', editValue)}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'merk', request.merk)}
              style={{ cursor: 'pointer' }}
            >
              {request.merk || '-'}
            </span>
          )}
        </td>
        <td>
          {isEditing && editingField.field === 'model' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'model', editValue)}
              autoFocus
            />
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'model', request.model)}
              style={{ cursor: 'pointer' }}
            >
              {request.model || '-'}
            </span>
          )}
        </td>
        <td>
          {isEditing && editingField.field === 'lease_type' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyPress}
              onBlur={() => updateRequestField(request.id, 'lease_type', editValue)}
              autoFocus
            >
              <option value="private">Private Lease</option>
              <option value="financial">Financial Lease</option>
              <option value="operational">Operational Lease</option>
            </select>
          ) : (
            <span 
              onClick={() => startEditing(request.id, 'lease_type', request.lease_type)}
              style={{ cursor: 'pointer' }}
            >
              {request.lease_type || '-'}
            </span>
          )}
        </td>
        <td>
          <select
            value={request.status || 'Nieuw'}
            onChange={(e) => updateRequestStatus(request.id, e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '12px'
            }}
          >
            <option value="Nieuw">Nieuw</option>
            <option value="In behandeling">In behandeling</option>
            <option value="Goedgekeurd">Goedgekeurd</option>
            <option value="Afgewezen">Afgewezen</option>
            <option value="Afgerond">Afgerond</option>
          </select>
        </td>
        <td>{request.created_at || '-'}</td>
        <td>
          <button
            onClick={() => {
              setSelectedRequest(request);
              setShowDetails(true);
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Details
          </button>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="crm-container">
        <Navigation />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crm-container">
        <Navigation />
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>Fout: {error}</p>
          <button onClick={fetchRequests}>Opnieuw proberen</button>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-container">
      <Navigation />
      
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2>Lease Aanvragen CRM</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Zoeken..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                flex: 1,
                maxWidth: '300px'
              }}
            />
            <button
              onClick={fetchRequests}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Vernieuwen
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Voornaam</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Achternaam</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Telefoon</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Merk</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Model</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Lease Type</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Aangemaakt</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(renderRequestRow)}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Geen lease aanvragen gevonden.</p>
          </div>
        )}
      </div>

      {showDetails && selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Details van Aanvraag #{selectedRequest.id}</h3>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>Persoonlijke Gegevens</h4>
              <p><strong>Naam:</strong> {selectedRequest.voornaam} {selectedRequest.achternaam}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Telefoon:</strong> {selectedRequest.telefoon}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>Voertuig</h4>
              <p><strong>Merk:</strong> {selectedRequest.merk}</p>
              <p><strong>Model:</strong> {selectedRequest.model}</p>
              <p><strong>Type:</strong> {selectedRequest.voertuig}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>Lease Details</h4>
              <p><strong>Type:</strong> {selectedRequest.lease_type}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Aangemaakt:</strong> {selectedRequest.created_at}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/superform" replace />} />
          <Route path="/superform" element={<SuperForm />} />
          <Route path="/crm" element={<CRM />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
