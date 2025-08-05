import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  CheckCircleIcon, 
  PendingIcon, 
  ErrorIcon,
  VisibilityIcon,
  EditIcon,
  DeleteIcon,
  FilterListIcon,
  SearchIcon
} from '@mui/icons-material';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function LeaseOverview() {
  const [leaseRequests, setLeaseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaseRequests();
  }, []);

  const fetchLeaseRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lease_aanvragen')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lease requests:', error);
      } else {
        setLeaseRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Nieuw': return <PendingIcon style={{ color: '#2196F3' }} />;
      case 'In behandeling': return <PendingIcon style={{ color: '#FF9800' }} />;
      case 'Goedgekeurd': return <CheckCircleIcon style={{ color: '#4CAF50' }} />;
      case 'Afgewezen': return <ErrorIcon style={{ color: '#F44336' }} />;
      default: return <PendingIcon style={{ color: '#757575' }} />;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredRequests = leaseRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = searchTerm === '' || 
      request.voornaam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.achternaam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.voertuig?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getExtraOptions = (request) => {
    const options = [];
    if (request.laadpaal) options.push('Laadpaal');
    if (request.zonnepanelen) options.push('Zonnepanelen');
    if (request.verzekering) options.push('Verzekering');
    if (request.tankpas) options.push('Tankpas');
    if (request.inrichting_bedrijfsauto) options.push('Inrichting Bedrijfsauto');
    if (request.auto_belettering) options.push('Auto Belettering');
    return options;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #d846b4 0%, #c2185b 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Lease Aanvragen Overzicht</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Beheer alle lease aanvragen en hun status
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: '#E3F2FD', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#1976D2' }}>{leaseRequests.length}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Totaal Aanvragen</p>
        </div>
        <div style={{ background: '#FFF3E0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#F57C00' }}>
            {leaseRequests.filter(r => r.status === 'Nieuw').length}
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Nieuwe Aanvragen</p>
        </div>
        <div style={{ background: '#E8F5E8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#388E3C' }}>
            {leaseRequests.filter(r => r.status === 'Goedgekeurd').length}
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Goedgekeurd</p>
        </div>
        <div style={{ background: '#FFEBEE', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#D32F2F' }}>
            {leaseRequests.filter(r => r.status === 'Afgewezen').length}
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Afgewezen</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FilterListIcon style={{ color: '#666' }} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">Alle Status</option>
            <option value="Nieuw">Nieuw</option>
            <option value="In behandeling">In behandeling</option>
            <option value="Goedgekeurd">Goedgekeurd</option>
            <option value="Afgewezen">Afgewezen</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SearchIcon style={{ color: '#666' }} />
          <input
            type="text"
            placeholder="Zoek op naam, email of voertuig..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              minWidth: '250px'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Laden...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Naam</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Voertuig</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Maandbedrag</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Datum</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <strong>{request.voornaam} {request.achternaam}</strong>
                        {request.bedrijfsnaam && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {request.bedrijfsnaam}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{request.email}</td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div>{request.voertuig}</div>
                        {getExtraOptions(request).length > 0 && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            +{getExtraOptions(request).length} opties
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <strong>{formatCurrency(request.maandbedrag)}</strong>
                        {request.totaal_opties > 0 && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            +{formatCurrency(request.totaal_opties)} opties
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {getStatusIcon(request.status)}
                        <span style={{ color: getStatusColor(request.status) }}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {formatDate(request.created_at)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <VisibilityIcon style={{ fontSize: '16px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Aanvraag Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3>Persoonlijke Gegevens</h3>
                <p><strong>Naam:</strong> {selectedRequest.voornaam} {selectedRequest.achternaam}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Telefoon:</strong> {selectedRequest.telefoon}</p>
                {selectedRequest.bedrijfsnaam && (
                  <p><strong>Bedrijf:</strong> {selectedRequest.bedrijfsnaam}</p>
                )}
                {selectedRequest.kvk_nummer && (
                  <p><strong>KVK:</strong> {selectedRequest.kvk_nummer}</p>
                )}
              </div>

              <div>
                <h3>Lease Gegevens</h3>
                <p><strong>Type:</strong> {selectedRequest.lease_type}</p>
                <p><strong>Voertuig:</strong> {selectedRequest.voertuig}</p>
                <p><strong>Maandbedrag:</strong> {formatCurrency(selectedRequest.maandbedrag)}</p>
                <p><strong>Looptijd:</strong> {selectedRequest.looptijd} maanden</p>
                <p><strong>Aanbetaling:</strong> {formatCurrency(selectedRequest.aanbetaling)}</p>
                <p><strong>Slotsom:</strong> {formatCurrency(selectedRequest.slotsom)}</p>
              </div>
            </div>

            {getExtraOptions(selectedRequest).length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Extra Opties</h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {getExtraOptions(selectedRequest).map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
                <p><strong>Totaal extra opties:</strong> {formatCurrency(selectedRequest.totaal_opties || 0)}</p>
              </div>
            )}

            <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Aangemaakt:</strong> {formatDate(selectedRequest.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 