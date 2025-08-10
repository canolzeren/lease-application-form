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
import './LeaseOverview.css';

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
    <div className="lease-overview-container">
      {/* Header */}
      <div className="lease-overview-header">
        <h1 className="lease-overview-title">Lease Aanvragen Overzicht</h1>
        <p className="lease-overview-subtitle">
          Beheer alle lease aanvragen en hun status
        </p>
      </div>

      {/* Stats */}
      <div className="lease-overview-stats">
        <div className="stat-card stat-total">
          <h3 className="stat-number">{leaseRequests.length}</h3>
          <p className="stat-label">Totaal Aanvragen</p>
        </div>
        <div className="stat-card stat-new">
          <h3 className="stat-number">
            {leaseRequests.filter(r => r.status === 'Nieuw').length}
          </h3>
          <p className="stat-label">Nieuwe Aanvragen</p>
        </div>
        <div className="stat-card stat-approved">
          <h3 className="stat-number">
            {leaseRequests.filter(r => r.status === 'Goedgekeurd').length}
          </h3>
          <p className="stat-label">Goedgekeurd</p>
        </div>
        <div className="stat-card stat-rejected">
          <h3 className="stat-number">
            {leaseRequests.filter(r => r.status === 'Afgewezen').length}
          </h3>
          <p className="stat-label">Afgewezen</p>
        </div>
      </div>

      {/* Filters */}
      <div className="lease-overview-filters">
        <div className="filter-group">
          <FilterListIcon className="filter-icon" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Alle Status</option>
            <option value="Nieuw">Nieuw</option>
            <option value="In behandeling">In behandeling</option>
            <option value="Goedgekeurd">Goedgekeurd</option>
            <option value="Afgewezen">Afgewezen</option>
          </select>
        </div>
        
        <div className="filter-group">
          <SearchIcon className="filter-icon" />
          <input
            type="text"
            placeholder="Zoek op naam, email of voertuig..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="lease-overview-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Laden...
          </div>
        ) : (
          <div className="lease-overview-table-wrapper">
            <table className="lease-overview-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Email</th>
                  <th>Voertuig</th>
                  <th>Maandbedrag</th>
                  <th>Status</th>
                  <th>Datum</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div>
                        <span className="customer-name">{request.voornaam} {request.achternaam}</span>
                        {request.bedrijfsnaam && (
                          <div className="company-name">
                            {request.bedrijfsnaam}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{request.email}</td>
                    <td>
                      <div>
                        <div className="vehicle-info">{request.voertuig}</div>
                        {getExtraOptions(request).length > 0 && (
                          <div className="extra-options">
                            +{getExtraOptions(request).length} opties
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="monthly-amount">{formatCurrency(request.maandbedrag)}</span>
                        {request.totaal_opties > 0 && (
                          <div className="options-amount">
                            +{formatCurrency(request.totaal_opties)} opties
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusIcon(request.status)}
                        <span className="status-text" style={{ color: getStatusColor(request.status) }}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      {formatDate(request.created_at)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="view-button"
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
        <div className="detail-modal-overlay">
          <div className="detail-modal">
            <div className="modal-header">
              <h2 className="modal-title">Aanvraag Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="close-button"
              >
                ×
              </button>
            </div>

            <div className="modal-content-grid">
              <div className="modal-section">
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

              <div className="modal-section">
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
              <div className="extra-options-section">
                <h3>Extra Opties</h3>
                <ul className="extra-options-list">
                  {getExtraOptions(selectedRequest).map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
                <p><strong>Totaal extra opties:</strong> {formatCurrency(selectedRequest.totaal_opties || 0)}</p>
              </div>
            )}

            <div className="status-summary">
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Aangemaakt:</strong> {formatDate(selectedRequest.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 