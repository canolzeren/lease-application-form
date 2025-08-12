import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LeaseOverview() {
  console.log('🎯 LeaseOverview component loaded - FULL VERSION');
  
  const [leaseRequests, setLeaseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 useEffect triggered');
    fetchLeaseRequests();
  }, []);

  const fetchLeaseRequests = async () => {
    try {
      console.log('🔄 Fetching lease requests...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lease_aanvragen')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lease requests:', error);
        setError(error.message);
      } else {
        console.log('✅ Fetched data:', data?.length || 0, 'requests');
        setLeaseRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    console.log('🔄 Updating status:', requestId, 'to', newStatus);
    try {
      const { error } = await supabase
        .from('lease_aanvragen')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        alert('Fout bij het bijwerken van de status');
      } else {
        console.log('✅ Status updated successfully');
        setLeaseRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: newStatus } : req
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Fout bij het bijwerken van de status');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🎯 CRM - Lease Overzicht</h1>
        <p>Laden van lease aanvragen...</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => console.log('🎯 Loading button clicked!')}>
            Test Loading Button
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>🎯 CRM - Lease Overzicht</h1>
        <p>Fout bij het laden: {error}</p>
        <button onClick={fetchLeaseRequests}>Opnieuw proberen</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎯 CRM - Lease Overzicht</h1>
      <p>✅ Database connectie succesvol!</p>
      <p>📊 Aantal lease aanvragen: {leaseRequests.length}</p>
      
      {leaseRequests.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>Geen lease aanvragen gevonden</p>
          <button onClick={fetchLeaseRequests}>Vernieuwen</button>
        </div>
      ) : (
        <div>
          <div style={{ padding: '10px', background: '#f0f8ff', marginBottom: '10px', borderRadius: '4px' }}>
            📊 {leaseRequests.length} aanvragen geladen. Status dropdowns zouden zichtbaar moeten zijn.
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Naam</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Datum</th>
              </tr>
            </thead>
            <tbody>
              {leaseRequests.map((request) => {
                console.log('📋 Rendering request:', request.id, 'with status:', request.status);
                return (
                  <tr key={request.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                      <strong>{request.voornaam || 'N/A'} {request.achternaam || 'N/A'}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>{request.email || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={request.status || 'Nieuw'}
                          onChange={(e) => {
                            console.log('🔄 Dropdown changed:', e.target.value);
                            updateStatus(request.id, e.target.value);
                          }}
                          style={{
                            padding: '8px 12px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minWidth: '140px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <option value="Nieuw">Nieuw</option>
                          <option value="In behandeling">In behandeling</option>
                          <option value="Goedgekeurd">Goedgekeurd</option>
                          <option value="Afgewezen">Afgewezen</option>
                        </select>
                        <div style={{ fontSize: '10px', color: '#666' }}>
                          Klik om te wijzigen
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {request.created_at ? new Date(request.created_at).toLocaleDateString('nl-NL') : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 